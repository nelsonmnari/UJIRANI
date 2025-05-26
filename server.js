const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const FILE = "issues.json";
let issues = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE)) : [];

app.post("/api/issues", (req, res) => {
  const { title, description, location } = req.body;
  const issue = { id: Date.now(), title, description, location };
  issues.push(issue);
  fs.writeFileSync(FILE, JSON.stringify(issues, null, 2));
  res.json({ success: true });
});

app.get("/api/issues", (req, res) => {
  res.json(issues);
});

app.listen(PORT, () => {
  console.log(`Ujirani backend running at http://localhost:${PORT}`);
});
