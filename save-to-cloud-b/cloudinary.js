import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { asyncHandler } from "./asyncHandler.js"
import { configDotenv } from "dotenv";
configDotenv();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,  
  api_key: process.env.API_KEY,  
  api_secret: process.env.API_SECRET  
});

export const uploadFile = asyncHandler(async (req, res,next) => {
  if (!req.file) {
    return res.status(400).send({message : "No file uploaded" , success : false});
  }
  const url = await cloudinary.uploader.upload(req.file.path, { resource_type: "auto" });
  fs.unlink(req.file.path, (err) => {
    if (err) {
      return res.status({message : "Image Uploading Failed" , success : false})
    }
  });
  req.imageUrl = url.secure_url;
  next();
});