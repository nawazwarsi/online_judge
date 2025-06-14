const mongoose = require('mongoose');
const Problem = require('./models/Problem');
const User = require('./models/User');
require('dotenv').config();

const problems = [
  {
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
You may assume that each input would have exactly one solution, and you may not use the same element twice.
You can return the answer in any order.`,
    difficulty: "easy",
    tags: ["array", "hash-table"],
    testCases: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        isExample: true
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        isExample: true
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
        isExample: true
      }
    ],
    constraints: {
      timeLimit: 1000,
      memoryLimit: 256
    }
  },
  {
    title: "Reverse Linked List",
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
    difficulty: "easy",
    tags: ["linked-list", "recursion"],
    testCases: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
        isExample: true
      },
      {
        input: "head = [1,2]",
        output: "[2,1]",
        isExample: true
      },
      {
        input: "head = []",
        output: "[]",
        isExample: true
      }
    ],
    constraints: {
      timeLimit: 1000,
      memoryLimit: 256
    }
  },
  {
    title: "Valid Parentheses",
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    difficulty: "easy",
    tags: ["string", "stack"],
    testCases: [
      {
        input: "s = \"()\"",
        output: "true",
        isExample: true
      },
      {
        input: "s = \"()[]{}\"",
        output: "true",
        isExample: true
      },
      {
        input: "s = \"(]\"",
        output: "false",
        isExample: true
      }
    ],
    constraints: {
      timeLimit: 1000,
      memoryLimit: 256
    }
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/online-judge');
    console.log('Connected to MongoDB');

    // Create admin user if it doesn't exist
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      const newAdmin = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });
      await newAdmin.save();
      console.log('Admin user created');
    }

    // Get admin user ID
    const admin = await User.findOne({ email: 'admin@example.com' });

    // Clear existing problems
    await Problem.deleteMany({});
    console.log('Cleared existing problems');

    // Add problems with admin as creator
    const problemsWithCreator = problems.map(problem => ({
      ...problem,
      createdBy: admin._id
    }));

    await Problem.insertMany(problemsWithCreator);
    console.log('Added initial problems');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 