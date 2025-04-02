require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); 
const upload = require("./routes/upload");
const api = require("./routes/route");
const user = require("./routes/loginAdmin")

const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors(
    origin="https://project-admin-r7ku2y8ko-ayushs-projects-4fa68a76.vercel.app/"
));
app.use('/api', upload);
app.use('/route', api);
app.use('/signup',user)
app.use("/media", express.static(path.join(__dirname, "media")));  

main().catch(err => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
});

async function main() {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);  
    }
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
