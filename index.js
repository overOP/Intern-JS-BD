const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 3000;
require("dotenv").config();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true}));
app.use('/storage', express.static(path.join(__dirname, './storage')));
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);

app.listen(port, () => {
  console.log("✅ Server is running on port 3000");
});