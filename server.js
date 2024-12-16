const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const os = require('os'); // For getting the local IP address

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Allowing CORS from any origin
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Add sample courses after successful connection
    addSampleCourses();
  })
  .catch(err => {
    console.error('Could not connect to MongoDB', err);
    process.exit(1);  // Exit the process if unable to connect to MongoDB
  });

// Routes
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
app.use('/api', userRoutes);
app.use('/api/courses', courseRoutes);

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server and display server URL
app.listen(PORT, getLocalIP(), () => {
  const host = getLocalIP(); // Automatically fetch local IP address
  console.log(`Server is running at http://${host}:${PORT}`);
});

// Function to get local IP address
function getLocalIP() {
  const networkInterfaces = os.networkInterfaces();
  let localIP = 'localhost';

  for (const interfaceName in networkInterfaces) {
    for (const net of networkInterfaces[interfaceName]) {
      if (net.family === 'IPv4' && !net.internal) {
        localIP = net.address;
        break;
      }
    }
  }
  return localIP;
}

// Function to add sample courses
async function addSampleCourses() {
  const Course = require('./models/Course');
  const sampleCourses = [
    {
      title: 'Introduction to JavaScript',
      description: 'Learn the basics of JavaScript programming',
      instructor: 'John Doe',
      lessons: [
        { title: 'Variables and Data Types', content: 'Learn about variables and data types in JavaScript' },
        { title: 'Functions', content: 'Understand how to create and use functions in JavaScript' }
      ]
    },
    {
      title: 'Advanced React Techniques',
      description: 'Master advanced concepts in React development',
      instructor: 'Jane Smith',
      lessons: [
        { title: 'Hooks in Depth', content: 'Dive deep into React Hooks and their use cases' },
        { title: 'State Management with Redux', content: 'Learn how to manage complex state with Redux' }
      ]
    },
    {
      title: 'Node.js for Beginners',
      description: 'Get started with Node.js for building scalable backends',
      instructor: 'Sarah Lee',
      lessons: [
        { title: 'Setting up Node.js', content: 'Learn how to set up a Node.js environment' },
        { title: 'Building APIs with Express', content: 'Learn how to create APIs using Express.js' }
      ]
    },
    {
      title: 'Python for Data Science',
      description: 'Master Python programming for data science applications',
      instructor: 'Michael Johnson',
      lessons: [
        { title: 'Introduction to Python', content: 'Learn the basics of Python programming' },
        { title: 'Data Analysis with Pandas', content: 'Learn how to use Pandas for data manipulation' }
      ]
    },
    {
      title: 'Full Stack Development with MERN',
      description: 'Learn full stack development using MongoDB, Express, React, and Node.js',
      instructor: 'Emily Davis',
      lessons: [
        { title: 'Introduction to MERN Stack', content: 'Learn the components of the MERN stack' },
        { title: 'Building a Full Stack Application', content: 'Learn how to create a full stack app with MERN' }
      ]
    },
    {
      title: 'Machine Learning Basics',
      description: 'Understand the fundamentals of machine learning',
      instructor: 'Chris Taylor',
      lessons: [
        { title: 'Supervised Learning', content: 'Learn about supervised learning algorithms' },
        { title: 'Unsupervised Learning', content: 'Understand unsupervised learning techniques' }
      ]
    },
    {
      title: 'Web Development with HTML, CSS, and JavaScript',
      description: 'Learn how to build modern web applications',
      instructor: 'Sophia Miller',
      lessons: [
        { title: 'HTML Fundamentals', content: 'Learn the basics of HTML structure' },
        { title: 'Styling with CSS', content: 'Understand how to use CSS to style web pages' }
      ]
    },
    {
      title: 'Cloud Computing with AWS',
      description: 'Get hands-on experience with Amazon Web Services (AWS)',
      instructor: 'David Martinez',
      lessons: [
        { title: 'AWS Overview', content: 'Learn about the basics of AWS and cloud computing' },
        { title: 'Building a Web App on AWS', content: 'Learn how to deploy a simple app using AWS' }
      ]
    },
    {
      title: 'Data Structures and Algorithms',
      description: 'Learn about common data structures and algorithms for coding interviews',
      instructor: 'Olivia Wilson',
      lessons: [
        { title: 'Arrays and Linked Lists', content: 'Learn about arrays and linked lists' },
        { title: 'Sorting Algorithms', content: 'Understand different sorting algorithms' }
      ]
    },
    {
      title: 'Digital Marketing Essentials',
      description: 'Learn the fundamentals of digital marketing and social media strategies',
      instructor: 'Lucas Brown',
      lessons: [
        { title: 'Introduction to Digital Marketing', content: 'Learn about digital marketing channels' },
        { title: 'Social Media Marketing', content: 'Understand the importance of social media in marketing' }
      ]
    }
  ];

  try {
    for (let course of sampleCourses) {
      const existingCourse = await Course.findOne({ title: course.title });
      if (!existingCourse) {
        await Course.create(course);
        console.log(`Added sample course: ${course.title}`);
      }
    }
  } catch (error) {
    console.error('Error adding sample courses:', error);
  }
}
