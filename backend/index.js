import express from "express";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/db.js";
import userRoutes from './routes/user.route.js';
import productRoutes from './routes/product.route.js';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

// app.use(cors());
app.use(express.json());

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

app.use('/api', userRoutes);

app.use('/api', productRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log("server is running on PORT " + PORT);
});
