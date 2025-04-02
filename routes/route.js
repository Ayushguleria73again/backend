const express = require("express")
const route = express.Router()
const Schema = require("../schema/schema")
const fileupload = require("../utils/multer")
const mongoose = require("mongoose")
const fs = require('fs');


route.get("/products" ,async (req,res)=>{
    const data = await Schema.find()
    res.status(200).json({
        success:true,
        message:"Here is your data",
        data:data
    })
}).get("/products/:id", async(req,res)=>{
    const{id} = req.params
    const data = await Schema.findOne({_id:id})
    res.status(200).json({
        success:true,
        message:"Here is your data",
        data:data
    })
}).get("/brand/:brand" ,async(req,res)=>{
  const {brand} = req.params
  const data = await Schema.find({brand:brand})
  res.status(200).json({
    success:true,
    message:"Here is your data",
    data:data
  })
}).get("/cate/:category" ,async(req,res)=>{
    const {category} = req.params
    const data = await Schema.find({category:category})
    res.status(200).json({
      success:true,
      message:"Here is your data",
      data:data
    })
  })
  route.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const data = await Schema.findByIdAndDelete({ _id: id });
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Data not found",
        });
      }
      if(data.media){
        fs.unlink(data.media,(err)=>{
          console.log("error daleting file",err);
        })
      }
      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  })

  route.patch("/update/:id", fileupload.single("file"), async (req, res) => {
    const { id } = req.params;
    const { brand, category, description, price, title } = req.body;

    if (!brand || !category || !description || !price || !title) {
        return res.status(400).json({
            success: false,
            message: "Please fill all the fields"
        });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID format"
        });
    }
    try {
        const data = await Schema.findById(id);
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Item not found"
            });
        }
        if(data.media){
          fs.unlink(data.media,(err)=>{
            console.log(err);
          })
        }
        const updatedData = { brand, category, description, price, title };
        if (req.file) {
            const filePath = `media/${req.file.filename}`;
            updatedData.media = filePath;
        }
        const updatedItem = await Schema.findByIdAndUpdate(id, { $set: updatedData }, { new: true });
        res.status(200).json({
            success: true,
            message: "Data updated successfully",
            data: updatedItem
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});


  module.exports = route