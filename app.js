const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ Connected to MySQL");
});

// Routes
app.get("/", (req, res) => {
  db.query("SELECT * FROM todos", (err, results) => {
    if (err) throw err;
    res.render("index", { todos: results });
  });
});

app.post("/add", (req, res) => {
  const { task } = req.body;
  if (task.trim() !== "") {
    db.query("INSERT INTO todos (task) VALUES (?)", [task], (err) => {
      if (err) throw err;
      res.redirect("/");
    });
  } else {
    res.redirect("/");
  }
});

app.post("/delete/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM todos WHERE id = ?", [id], (err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
