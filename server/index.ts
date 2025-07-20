import express from "express";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the root directory (where index.html, style.css, app.js are located)
app.use(express.static(path.join(__dirname, '..')));

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Fallback for any other routes - serve index.html (SPA behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

const PORT = parseInt(process.env.PORT!) || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🎮 Rock Paper Scissors game server running on http://0.0.0.0:${PORT}`);
  console.log(`📁 Serving static HTML/CSS/JS files from project root`);
});
