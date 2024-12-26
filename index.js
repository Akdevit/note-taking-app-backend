const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth")
const notesRoutes = require('./routes/notes')
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// connect mongodb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
