const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

const User = require('./models/User');
const Post = require('./models/Post');

const seedData = async () => {
    try {
        console.log('Starting seed process...');

        // Clear existing data
        await User.deleteMany({});
        await Post.deleteMany({});
        console.log('Cleared existing data');

        // Create sample users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const users = await User.insertMany([
            {
                fullName: 'Rahul Sharma',
                rollNumber: 'am.sc.u4cse20001',
                email: 'rahul@example.com',
                password: hashedPassword,
                socialLinks: {
                    github: 'https://github.com/rahulsharma',
                    linkedin: 'https://linkedin.com/in/rahulsharma',
                    leetcode: 'https://leetcode.com/rahulsharma'
                }
            },
            {
                fullName: 'Priya Patel',
                rollNumber: 'am.sc.u4cse20002',
                email: 'priya@example.com',
                password: hashedPassword,
                socialLinks: {
                    github: 'https://github.com/priyapatel',
                    linkedin: 'https://linkedin.com/in/priyapatel'
                }
            },
            {
                fullName: 'Arjun Reddy',
                rollNumber: 'am.sc.u4cse20003',
                email: 'arjun@example.com',
                password: hashedPassword,
                socialLinks: {
                    linkedin: 'https://linkedin.com/in/arjunreddy',
                    portfolio: 'https://arjunreddy.dev'
                }
            },
            {
                fullName: 'Sneha Gupta',
                rollNumber: 'am.sc.u4cse20004',
                email: 'sneha@example.com',
                password: hashedPassword
            },
            {
                fullName: 'Vikram Singh',
                rollNumber: 'am.sc.u4cse20005',
                email: 'vikram@example.com',
                password: hashedPassword
            }
        ]);

        console.log(`Created ${users.length} users`);

        // Create sample posts
        const posts = await Post.insertMany([
            {
                companyName: 'Google',
                experience: `Interview Duration: 3 hours
Rounds: 4 - Online Test, 2 Technical, HR

Round 1 - Online Assessment:
• Questions/Topics: DSA problems, SQL queries, OS concepts
• Difficulty: Medium to Hard
• Duration: 90 minutes

Round 2 - Technical Interview 1:
• Questions asked:
  1. Implement LRU Cache with O(1) operations
  2. Design a distributed rate limiter
  3. Discuss previous project architecture
• Topics: Data Structures, System Design, Project Discussion
• Duration: 60 minutes

Round 3 - Technical Interview 2:
• Questions asked:
  1. Binary tree traversal problems
  2. Dynamic programming - Longest common subsequence
  3. Database optimization techniques
• Duration: 45 minutes

Round 4 - HR:
• Questions: Why Google? Team preferences? Relocation flexibility?
• Duration: 20 minutes

Preparation Tips:
- Practice medium-hard problems on LeetCode daily
- Study Grokking the System Design Interview
- Be ready to explain projects in depth
- Review DBMS and OS fundamentals

Overall Experience:
Very professional and respectful interviewers. They focused on problem-solving approach rather than just the solution. Got the offer! 🎉`,
                postType: 'Interview',
                authorRoll: users[0].rollNumber,
                authorName: users[0].fullName,
                interviewDate: new Date('2024-01-15')
            },
            {
                companyName: 'Microsoft',
                experience: `Interview Duration: 2.5 hours
Rounds: 3 - Online Test, Technical, Managerial

Round 1 - Online Coding:
• Questions/Topics: 2 DSA problems, debugging code
• Difficulty: Medium
• Duration: 75 minutes

Round 2 - Technical:
• Questions asked:
  1. Design URL shortener
  2. Implement thread-safe singleton
  3. SQL query optimization
• Topics: System Design, OOP, DBMS
• Duration: 60 minutes

Round 3 - Managerial:
• Questions: Past experiences, conflict resolution, leadership examples
• Duration: 30 minutes

Preparation Tips:
- Focus on clean code and edge cases
- Practice explaining thought process clearly
- Review behavioral questions

Overall Experience:
Great experience overall. Interviewers were friendly and gave helpful hints. Selected for SDE role!`,
                postType: 'Interview',
                authorRoll: users[1].rollNumber,
                authorName: users[1].fullName,
                interviewDate: new Date('2024-01-20')
            },
            {
                companyName: 'Amazon',
                experience: `Interview Duration: 4 hours
Rounds: 4 - Online Assessment, 3 Technical Rounds

Round 1 - Online Test:
• Questions/Topics: Coding problems, work simulation
• Difficulty: Medium
• Duration: 105 minutes

Round 2 - Technical Round 1:
• Questions asked:
  1. Design Amazon's recommendation system
  2. Implement trie data structure
  3. Leadership principles discussion
• Duration: 60 minutes

Round 3 - Technical Round 2:
• Questions: Graph algorithms, debugging production issue scenario
• Duration: 60 minutes

Round 4 - Bar Raiser:
• Deep dive into past experiences and Amazon's leadership principles
• Duration: 45 minutes

Preparation Tips:
- Study Amazon's 14 leadership principles thoroughly
- Practice STAR format for behavioral questions
- Focus on scalability in system design

Overall Experience:
Intense but fair. They really test your problem-solving and leadership qualities. Got selected!`,
                postType: 'Interview',
                authorRoll: users[2].rollNumber,
                authorName: users[2].fullName,
                interviewDate: new Date('2024-02-01')
            },
            {
                companyName: 'General Discussion',
                experience: 'What are the best resources for learning System Design? I have my interviews coming up in 2 weeks and need to prepare quickly!',
                postType: 'Discussion',
                authorRoll: users[3].rollNumber,
                authorName: users[3].fullName
            },
            {
                companyName: 'Meta',
                experience: `Interview Duration: 3.5 hours
Rounds: 2 Technical, 1 Behavioral

Round 1 - Technical:
• Questions asked:
  1. Design Instagram's feed
  2. Implement graph traversal
• Duration: 90 minutes

Round 2 - Technical:
• Questions: React component optimization, API design
• Duration: 90 minutes

Round 3 - Behavioral:
• Questions: Cross-functional collaboration, handling ambiguity
• Duration: 30 minutes

Preparation Tips:
- Practice product design questions
- Review React and frontend optimization
- Prepare examples showing impact

Overall Experience:
Challenging but rewarding. Focus on user impact and scalability.`,
                postType: 'Interview',
                authorRoll: users[4].rollNumber,
                authorName: users[4].fullName,
                interviewDate: new Date('2024-02-10')
            }
        ]);

        console.log(`Created ${posts.length} posts`);
        console.log('✅ Seed data created successfully!');
        console.log('\nLogin credentials for all users:');
        console.log('Password: password123');
        console.log('\nSample users:');
        users.forEach(user => {
            console.log(`- ${user.fullName} (${user.rollNumber})`);
        });

        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedData();
