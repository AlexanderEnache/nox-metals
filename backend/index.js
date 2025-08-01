import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/user.route.js";
import productRoutes from "./routes/product.route.js";
import { connectDB } from "./config/db.js";

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/api', userRoutes);
app.use('/api', productRoutes);

// Serve React static files
app.use(express.static(path.join(__dirname, '../nox-front-end/build')));

// Catch all other routes and return React app
app.get('/{*any}', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../nox-front-end/build/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log("server is running on PORT " + PORT);
});
