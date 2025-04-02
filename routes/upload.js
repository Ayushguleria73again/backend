const express = require("express");
const schema = require("../schema/schema");
const upload = express.Router();
const fileupload = require("../utils/multer")

upload.post("/data", fileupload.single("file"), async (req, res) => {
  try {
    const { title, description, price, brand, category } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a media file."
      });
    }
    const newData = new schema({
      brand: brand,
      category: category,
      description: description,
      price: price,
      title: title,
      media: file.path
    });

    const saveData = await newData.save();
    return res.status(200).json({ message: "Product saved successfully", data: saveData, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

module.exports = upload;
