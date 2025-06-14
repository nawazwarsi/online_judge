const Docker = require('dockerode');
const config = require('../config/config');

const docker = new Docker(config.dockerConfig);

const createContainer = async (language, code, input) => {
    // Create a temporary file with the code
    const containerConfig = {
        Image: getImageName(language),
        Cmd: getCommand(language, code, input),
        Tty: false,
        HostConfig: {
            Memory: 512 * 1024 * 1024, // 512MB memory limit
            MemorySwap: -1,
            CpuPeriod: 100000,
            CpuQuota: 50000, // 50% CPU limit
            NetworkMode: 'none',
            ReadonlyRootfs: false, // Allow writing to filesystem
            Binds: ['/tmp:/tmp'] // Mount a writable directory
        }
    };

    try {
        const container = await docker.createContainer(containerConfig);
        await container.start();

        // Wait for container to finish
        const result = await container.wait();
        
        // Get container logs
        const logs = await container.logs({
            follow: false,
            stdout: true,
            stderr: true
        });

        // Remove container
        await container.remove();

        const output = logs.toString().trim();
        console.log('Container input:', input); // Debug log
        console.log('Container output:', output); // Debug log
        console.log('Container exit code:', result.StatusCode); // Debug log

        return {
            exitCode: result.StatusCode,
            output: output,
            error: result.StatusCode !== 0 ? output : null
        };
    } catch (error) {
        throw new Error(`Container execution failed: ${error.message}`);
    }
};

const getImageName = (language) => {
    const images = {
        cpp: 'gcc:latest',
        python: 'python:3.9-slim',
        java: 'openjdk:11-jdk-slim'
    };
    return images[language] || 'python:3.9-slim';
};

const getCommand = (language, code, input) => {
    switch (language) {
        case 'cpp':
            return ['/bin/bash', '-c', `
                cd /tmp
                cat > main.cpp << 'EOL'
${code}
EOL
                g++ -std=c++17 main.cpp -o main
                echo "${input}" | ./main
            `];
        case 'python':
            return ['/bin/bash', '-c', `
                cd /tmp
                cat > main.py << 'EOL'
${code}
EOL
                echo "${input}" | python3 main.py
            `];
        case 'java':
            return ['/bin/bash', '-c', `
                cd /tmp
                cat > Main.java << 'EOL'
${code}
EOL
                javac Main.java
                echo "${input}" | java Main
            `];
        default:
            throw new Error('Unsupported language');
    }
};

module.exports = {
    createContainer
}; 