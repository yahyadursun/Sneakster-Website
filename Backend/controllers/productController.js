import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModels.js";

// function for add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      brand,
      price,
      category,
      subCategory,
      color,
      sizes,
      bestseller,
      newSeason,
      stock,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    // Cloudinary üzerinden resimlerin yüklenmesi
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    // Parse sizes and stock, with additional error handling
    let parsedSizes, parsedStock;
    try {
      parsedSizes = JSON.parse(sizes);
      parsedStock = JSON.parse(stock);
    } catch (parseError) {
      return res.json({ 
        success: false, 
        message: "Invalid sizes or stock format" 
      });
    }

    // Validate that parsed data is an array and object respectively
    if (!Array.isArray(parsedSizes) || typeof parsedStock !== 'object') {
      return res.json({ 
        success: false, 
        message: "Sizes must be an array, stock must be an object" 
      });
    }

    // Boyut ve stokların eşleşmesini kontrol edelim
    const stockData = {};
    parsedSizes.forEach((size) => {
      // Ensure size is a string and convert stock to a number
      stockData[size] = Number(parsedStock[size] || 0);
    });

    const productData = {
      name,
      description,
      brand,
      price: Number(price),
      category,
      subCategory,
      color,
      sizes: parsedSizes,
      bestseller: bestseller === "true", // Simplified boolean conversion
      newSeason: newSeason === "true", // Simplified boolean conversion
      image: imagesUrl,
      date: Date.now(),
      stock: stockData,
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.error(error);
    res.json({ 
      success: false, 
      message: "Error adding product", 
      error: error.message 
    });
  }
};




// function for add list product
const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({success:true,products})
    } catch (error) {
        console.log(error);
        res.json({ success: false, error: error.message });
    }
};

// function for  removing product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Product removed successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, error: error.message });
    }
};
 
// function for updating product
const updateProduct = async (req, res) => {
  try {
    const { id, name, description, price, stock, sizes, brand, category, subCategory, color, bestseller, newSeason } = req.body;

    // Parse JSON verileri
    let parsedStock = {};
    let parsedSizes = [];

    try {
      parsedStock = stock ? JSON.parse(stock) : {};
      parsedSizes = sizes ? JSON.parse(sizes) : [];
    } catch (parseError) {
      return res.status(400).json({ success: false, message: "Invalid data format" });
    }

    // Resim yükleme işlemi
    const imageFiles = ["image1", "image2", "image3", "image4"];
    const images = [];

    for (const key of imageFiles) {
      if (req.files[key] && req.files[key][0]) {
        const result = await cloudinary.uploader.upload(req.files[key][0].path, {
          resource_type: "image",
        });
        images.push(result.secure_url);
      }
    }

    // Güncelleme nesnesini oluştur
    const updateData = {
      ...(name && { name }),
      ...(description && { description }),
      ...(price && { price: Number(price) }),
      ...(sizes && { sizes: parsedSizes }),
      ...(stock && { stock: parsedStock }),
      ...(brand && { brand }),
      ...(category && { category }),
      ...(subCategory && { subCategory }),
      ...(color && { color }),
      ...(typeof bestseller !== "undefined" && { bestseller: bestseller === "true" }),
      ...(typeof newSeason !== "undefined" && { newSeason: newSeason=== "true" }),
      ...(images.length && { image: images }),
    };

    const updatedProduct = await productModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};



// function for add single product info
const singleProduct = async (req, res) => {
    try {
        const {productId} = req.body;
        const product = await productModel.findById(productId);
        res.json({success:true,product})
    } catch (error) {  
        console.log(error);
        res.json({ success: false, error: error.message });
    }
};

export { listProduct, removeProduct, singleProduct, addProduct, updateProduct };
