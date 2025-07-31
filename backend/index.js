import express from "express";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/db.js";
import userRoutes from './routes/user.route.js';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;


// console.log(__dirname + " DIRECTORY NAME");
// dotenv.config();
// console.log(process.env.MONGO_URI);

// const reactBuild = path.join(__dirname, '../nox-front-end', 'build');
// app.use(express.static(reactBuild));

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../nox-front-end/build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../nox-front-end/build/index.html'));
});

// app.use('/api/users', userRoutes);

// app.get("/", async(req, res) => {

// });

// app.get("/api", (req, res) => {
//   res.send({message: "This Message"});
// });

app.use('/api', userRoutes);

// app.use("/api/create-account/", userRoutes);

// app.use("/api/login/", userRoutes);

// app.post('/api/create-account/', async (req, res) => {
//   const { userId, username, password } = req.body;

//   console.log(req.body + " " + userId + " " + username + " " + password);

//   // Basic validation
//   if (!username || !password) {
//     return res.status(400).json({ message: 'All fields are required.' });
//   }

//   try {
//     // Check if user already exists
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(409).json({ message: 'Username already taken.' });
//     }

//     // Hash the password
//     // const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const newUser = new User({
//       userId,
//       username,
//       password: password
//     });

//     await newUser.save();

//     res.status(201).json({ message: 'User created successfully.' });
//   } catch (error) {
//     console.error('Error creating user:', error);
//     res.status(500).json({ message: 'Server error.' });
//   }
// });


app.listen(PORT, () => {
  connectDB();
  console.log("server is running on PORT " + PORT);
});
