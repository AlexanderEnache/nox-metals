const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

console.log(__dirname + " DIRECTORY NAME");

const reactBuild = path.join(__dirname, 'nox-front-end', 'build');
app.use(express.static(reactBuild));

app.get("/api", (req, res) => {
  res.send({message: "This Message"});
});

app.get("/", async(req, res) => {
  res.sendFile(path.join(reactBuild, 'index.html'));
});

app.listen(PORT, () => console.log("server is running on PORT " + PORT));
