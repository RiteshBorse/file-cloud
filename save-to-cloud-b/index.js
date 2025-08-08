import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { upload } from "./multer.js";
import { uploadFile } from "./cloudinary.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.post('/imageUpload' , upload , uploadFile , (req , res) => {
    return res.send({
        message : "Uploaded",
        image : req.imageUrl,
        success : true
    })
})

app.listen(process.env.PORT , () => {
    console.log(`Server running on ${process.env.PORT} `);
})