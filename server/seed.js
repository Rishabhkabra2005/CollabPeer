require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./models/User");
const Project = require("./models/Project");
const Course = require("./models/Courses");
const Discussion = require("./models/Discussion");
const Post = require("./models/Posts");
const Comments = require("./models/Comments");
const Skills = require("./models/Skills");
const Messages = require("./models/messageModel");
const Chats = require("./models/Chats");
const Groups = require("./models/Groups");

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;

const skillSeed = [
  { name: "React", thumbnail: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Node.js", thumbnail: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "MongoDB", thumbnail: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "Express", thumbnail: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
  { name: "Python", thumbnail: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "TensorFlow", thumbnail: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
  { name: "IoT", thumbnail: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg" },
  { name: "Analytics", thumbnail: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chartjs/chartjs-original.svg" },
];

const userSeed = [
  {
    name: "Rishabh Kabra",
    email: "rishabh.kabra@dev.local",
    rollNo: "2201EC042",
    program: "B.Tech Electronics and Electrical Engineering",
    year: "3",
    branch: "Electronics and Electrical Engineering",
    description:
      "Full-stack developer & analytics enthusiast. Built CollabPeer as a portfolio showcase for peer collaboration, ML moderation, and real-time chat.",
    profilePic: "",
    rating: 4.8,
    views: 128,
  },
  {
    name: "Rohan Sharma",
    email: "rohan.sharma@campus.edu",
    rollNo: "2201CS015",
    program: "B.Tech Computer Science and Engineering",
    year: "3",
    branch: "Computer Science and Engineering",
    description: "MERN stack developer passionate about scalable web apps and hackathons.",
    profilePic: "",
    rating: 4.5,
    views: 94,
  },
  {
    name: "Aarav Mehta",
    email: "aarav.mehta@campus.edu",
    rollNo: "2201DS008",
    program: "B.Tech Data Science and Artificial Intelligence",
    year: "3",
    branch: "Data Science and Artificial Intelligence",
    description: "ML engineer focused on NLP pipelines and computer vision projects.",
    profilePic: "",
    rating: 4.6,
    views: 76,
  },
  {
    name: "Priya Nair",
    email: "priya.nair@campus.edu",
    rollNo: "2201EE021",
    program: "B.Tech Electronics and Electrical Engineering",
    year: "4",
    branch: "Electronics and Electrical Engineering",
    description: "IoT and embedded systems builder. Loves hardware-software integration.",
    profilePic: "",
    rating: 4.4,
    views: 61,
  },
  {
    name: "Sneha Reddy",
    email: "sneha.reddy@campus.edu",
    rollNo: "2201ME033",
    program: "B.Tech Mechanical Engineering",
    year: "2",
    branch: "Mechanical Engineering",
    description: "Product designer and frontend developer exploring UX for campus platforms.",
    profilePic: "",
    rating: 4.3,
    views: 52,
  },
];

const projectSeed = [
  {
    title: "E-Commerce Platform using MERN Stack",
    description:
      "Full-featured online store with JWT auth, Stripe payments, admin dashboard, and inventory analytics.",
    githubLink: "https://github.com/rishabhkabra/mern-ecommerce",
    rating: 4.7,
    mediaArray: ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800"],
    skillNames: ["React", "Node.js", "MongoDB", "Express"],
    creatorIndex: 0,
  },
  {
    title: "IoT-Based Smart Agriculture System",
    description:
      "Sensor network monitoring soil moisture, temperature, and humidity with a React dashboard and MQTT alerts.",
    githubLink: "https://github.com/rishabhkabra/smart-agri-iot",
    rating: 4.5,
    mediaArray: ["https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800"],
    skillNames: ["IoT", "Python", "React", "Analytics"],
    creatorIndex: 3,
  },
  {
    title: "Automated Resume Parser",
    description:
      "NLP pipeline extracting skills, experience, and education from PDF resumes using spaCy and a React review UI.",
    githubLink: "https://github.com/rishabhkabra/resume-parser",
    rating: 4.6,
    mediaArray: ["https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800"],
    skillNames: ["Python", "TensorFlow", "React", "Analytics"],
    creatorIndex: 2,
  },
  {
    title: "CollabPeer — Campus Collaboration Hub",
    description:
      "This platform: peer feed, discussions, course reviews, Socket.IO chat, and Keras-based comment moderation.",
    githubLink: "https://github.com/rishabhkabra/collabpeer",
    rating: 4.9,
    mediaArray: ["https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"],
    skillNames: ["React", "Node.js", "MongoDB", "TensorFlow", "Python"],
    creatorIndex: 0,
  },
  {
    title: "Real-Time Analytics Dashboard",
    description:
      "Live KPI dashboard aggregating event streams with Chart.js, WebSockets, and MongoDB time-series collections.",
    githubLink: "https://github.com/rishabhkabra/analytics-dashboard",
    rating: 4.4,
    mediaArray: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800"],
    skillNames: ["React", "Node.js", "MongoDB", "Analytics"],
    creatorIndex: 1,
  },
  {
    title: "Campus Event Management App",
    description:
      "Mobile-responsive event booking system with QR check-in, RSVP tracking, and admin reporting.",
    githubLink: "https://github.com/rishabhkabra/campus-events",
    rating: 4.2,
    mediaArray: ["https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"],
    skillNames: ["React", "Express", "MongoDB"],
    creatorIndex: 4,
  },
];

const courseSeed = [
  {
    title: "Machine Learning Foundations",
    description:
      "Covers supervised learning, neural networks, and model evaluation. Heavy on Python labs and Kaggle-style projects.",
    courseLink: "https://example.edu/courses/ml-foundations",
    coursePic: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
    skillNames: ["Python", "TensorFlow", "Analytics"],
  },
  {
    title: "Web Application Development",
    description:
      "End-to-end MERN stack course with REST APIs, authentication, deployment, and a capstone group project.",
    courseLink: "https://example.edu/courses/web-dev",
    coursePic: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
    skillNames: ["React", "Node.js", "MongoDB", "Express"],
  },
  {
    title: "Digital Signal Processing",
    description:
      "Fourier transforms, filter design, and MATLAB/Python implementations relevant to EEE students.",
    courseLink: "https://example.edu/courses/dsp",
    coursePic: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800",
    skillNames: ["Python", "Analytics"],
  },
  {
    title: "Internet of Things & Embedded Systems",
    description:
      "Arduino/Raspberry Pi labs, MQTT protocols, and cloud integration for sensor data pipelines.",
    courseLink: "https://example.edu/courses/iot",
    coursePic: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    skillNames: ["IoT", "Python"],
  },
];

const discussionSeed = [
  {
    title: "Best tech stack for a final-year capstone?",
    content:
      "I'm torn between MERN and Django+React for my capstone. What did you use and why? Looking for something deployable within 3 months.",
    posterIndex: 1,
  },
  {
    title: "How to prepare for full-stack interviews?",
    content:
      "Sharing my 8-week plan: DSA daily, 2 system design reads/week, and one mini full-stack project. What would you add?",
    posterIndex: 0,
  },
  {
    title: "ML model deployment on a student budget",
    content:
      "Has anyone deployed TensorFlow models cheaply? Render free tier vs. Railway vs. self-hosted — pros and cons welcome.",
    posterIndex: 2,
  },
  {
    title: "Campus hackathon team formation thread",
    content:
      "Looking for a frontend dev and a data person for HackFest next month. Drop your skills and GitHub!",
    posterIndex: 4,
  },
  {
    title: "IoT project ideas with real-world impact",
    content:
      "Brainstorming smart campus ideas: energy monitoring, queue management, lab equipment booking. Which would you build?",
    posterIndex: 3,
  },
];

const postSeed = [
  {
    caption: "Just shipped the CollabPeer ML moderation pipeline — hate/spam scores in under 2 seconds!",
    creatorIndex: 0,
    skillNames: ["Python", "TensorFlow", "Node.js"],
  },
  {
    caption: "Our MERN e-commerce capstone passed review. Cart, checkout, and admin panel all live.",
    creatorIndex: 1,
    skillNames: ["React", "MongoDB"],
  },
  {
    caption: "Resume parser hit 92% accuracy on skill extraction after fine-tuning tokenizers.",
    creatorIndex: 2,
    skillNames: ["Python", "Analytics"],
  },
];

const chatThreads = [
  {
    fromIndex: 0,
    toIndex: 1,
    messages: [
      { fromIndex: 1, text: "Hey Rishabh! Saw your CollabPeer demo — the ML filter is slick." },
      { fromIndex: 0, text: "Thanks Rohan! Used Keras models with a Python subprocess from Express." },
      { fromIndex: 1, text: "Nice. Want to collab on the analytics dashboard next week?" },
      { fromIndex: 0, text: "Absolutely — let's sync after Thursday's lab." },
    ],
  },
  {
    fromIndex: 0,
    toIndex: 2,
    messages: [
      { fromIndex: 2, text: "Rishabh, your resume parser tokenizer setup — did you use Keras text_to_sequences?" },
      { fromIndex: 0, text: "Yes, with pad_sequences maxlen 2000. Same pattern as the hate/spam models." },
      { fromIndex: 2, text: "Perfect, that helps. I'll adapt it for my NLP assignment." },
    ],
  },
  {
    fromIndex: 1,
    toIndex: 3,
    messages: [
      { fromIndex: 3, text: "Rohan, your MQTT broker config for the agri project — share the repo?" },
      { fromIndex: 1, text: "Sure! It's in the smart-agri-iot repo under /mqtt." },
      { fromIndex: 3, text: "Got it. Adding DHT22 readings to my dashboard tonight." },
    ],
  },
  {
    fromIndex: 2,
    toIndex: 4,
    messages: [
      { fromIndex: 4, text: "Aarav, need UX feedback on my event app RSVP flow." },
      { fromIndex: 2, text: "Happy to help — send a Figma link or localhost URL." },
      { fromIndex: 4, text: "Will DM after class. Thanks!" },
    ],
  },
  {
    fromIndex: 0,
    toIndex: 4,
    messages: [
      { fromIndex: 0, text: "Sneha, loved your landing page mockups for CollabPeer!" },
      { fromIndex: 4, text: "Glad they helped! The purple accent really pops on mobile." },
    ],
  },
];

function skillIdsByNames(skillMap, names) {
  return names.map((name) => skillMap[name]).filter(Boolean);
}

async function clearCollections() {
  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    Course.deleteMany({}),
    Discussion.deleteMany({}),
    Post.deleteMany({}),
    Comments.deleteMany({}),
    Skills.deleteMany({}),
    Messages.deleteMany({}),
    Chats.deleteMany({}),
    Groups.deleteMany({}),
  ]);
  console.log("Cleared existing collections.");
}

async function seed() {
  if (!MONGODB_URI) {
    console.error("ERROR: MONGODB_URI is not set in server/.env");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
  console.log(`Connected to MongoDB (${DB_NAME || "default"})`);

  await clearCollections();

  const skills = await Skills.insertMany(skillSeed);
  const skillMap = Object.fromEntries(skills.map((s) => [s.name, s._id]));
  console.log(`Seeded ${skills.length} tech stacks.`);

  const users = await User.insertMany(
    userSeed.map((u) => ({
      ...u,
      techStacks: skillIdsByNames(skillMap, ["React", "Node.js", "Analytics"]),
    }))
  );
  console.log(`Seeded ${users.length} users.`);

  const connectionPairs = [
    [0, 1], [0, 2], [0, 4], [1, 2], [1, 3], [2, 4], [3, 4],
  ];
  for (const [a, b] of connectionPairs) {
    users[a].connections.push(users[b]._id);
    users[b].connections.push(users[a]._id);
  }
  await Promise.all(users.map((u) => u.save()));
  console.log("Linked user connections for chat contacts.");

  const projects = [];
  for (const p of projectSeed) {
    const creator = users[p.creatorIndex];
    const project = await Project.create({
      title: p.title,
      description: p.description,
      githubLink: p.githubLink,
      rating: p.rating,
      mediaArray: p.mediaArray,
      techStacks: skillIdsByNames(skillMap, p.skillNames),
      creatorId: [creator._id],
      likes: [users[(p.creatorIndex + 1) % users.length]._id],
      views: Math.floor(Math.random() * 80) + 20,
    });
    projects.push(project);
    creator.projects.push({ project: project._id, isSelected: true });
    creator.portfolio.push(project._id);
  }
  await Promise.all(users.map((u) => u.save()));
  console.log(`Seeded ${projects.length} projects.`);

  const courses = [];
  for (let i = 0; i < courseSeed.length; i++) {
    const c = courseSeed[i];
    const course = await Course.create({
      title: c.title,
      description: c.description,
      courseLink: c.courseLink,
      coursePic: c.coursePic,
      techStacks: skillIdsByNames(skillMap, c.skillNames),
      enrolledStudents: [users[i % users.length]._id, users[(i + 1) % users.length]._id],
    });
    courses.push(course);
  }
  console.log(`Seeded ${courses.length} course reviews.`);

  const discussions = [];
  for (let i = 0; i < discussionSeed.length; i++) {
    const d = discussionSeed[i];
    const poster = users[d.posterIndex];
    const comment = await Comments.create({
      content: "Great thread — adding my two cents here!",
      userId: users[(d.posterIndex + 1) % users.length]._id,
      likes: [poster._id],
    });
    const discussion = await Discussion.create({
      title: d.title,
      content: d.content,
      poster: poster._id,
      comments: [comment._id],
      upvotes: [users[(d.posterIndex + 2) % users.length]._id, poster._id],
      views: Math.floor(Math.random() * 120) + 30,
    });
    discussions.push(discussion);
    poster.discussions.push(discussion._id);
  }
  await Promise.all(users.map((u) => u.save()));
  console.log(`Seeded ${discussions.length} discussion threads.`);

  const posts = [];
  for (const p of postSeed) {
    const creator = users[p.creatorIndex];
    const post = await Post.create({
      caption: p.caption,
      creator: creator._id,
      techStacks: skillIdsByNames(skillMap, p.skillNames),
      likes: [users[(p.creatorIndex + 1) % users.length]._id],
      mediaArray: [],
    });
    posts.push(post);
    creator.posts.push(post._id);
  }
  await Promise.all(users.map((u) => u.save()));
  console.log(`Seeded ${posts.length} feed posts.`);

  let messageCount = 0;
  for (const thread of chatThreads) {
    for (const msg of thread.messages) {
      const fromUser = users[msg.fromIndex];
      const toUser = users[msg.fromIndex === thread.fromIndex ? thread.toIndex : thread.fromIndex];
      const partner =
        msg.fromIndex === thread.fromIndex ? users[thread.toIndex] : users[thread.fromIndex];

      await Messages.create({
        message: { text: msg.text },
        users: { from: fromUser._id.toString(), to: partner._id.toString() },
        sender: fromUser._id,
        createdAt: new Date(Date.now() - messageCount * 60000),
      });
      messageCount++;
    }
  }
  console.log(`Seeded ${messageCount} chat messages.`);

  console.log("\n--- Seed complete ---");
  console.log(`Portfolio owner: ${users[0].name} (${users[0]._id})`);
  console.log(`Dev sign-in email: rishabh.kabra@dev.local`);
  console.log(`Use Sign In on localhost to load Rishabh's profile with live chat history.`);
}

seed()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error("Seed failed:", err);
    await mongoose.disconnect();
    process.exit(1);
  });
