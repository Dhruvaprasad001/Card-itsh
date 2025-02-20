require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const flashcardRoutes = require("./routes/flashcardRoutes")


const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI ,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.use("/api/flashcards", flashcardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));