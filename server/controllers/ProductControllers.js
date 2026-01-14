import { Product } from "../models/productModel";
import { uploadStream } from "../utils/cloudinaryHelper";

export const addProduct = async (req , res ) => {
    try {
        const { productName, productDesc, productPrice, category, brand, variants } = req.body;
        const userId = req.id;
        const files = req.files;

        if (!productName || !productDesc || !productPrice  || !category || !brand) {
            return res.status(400).json({ 
                success: false,
                message: "All essential fields are required",
            });
        }   

        if (!files || files.length === 0) {
            return res.status(400).json({ message: "please Upload product images" });
        }

        const uploadPromises = files.map(file => uploadStream(file.buffer, "mern_products"));
        const uploadResults = await Promise.all(uploadPromises);

        const productImgData = uploadResults.map(result => ({
            url: result.secure_url,
            public_id: result.public_id
        }));
        
       
        const newProduct = await Product.create({
            userId, 
            productName,
            productDesc,
            productPrice,
            category,
            brand,
            productImgData
        });
    
        res.status(200).json({
            success: true,
            message: "product added Successfully",
            product: newProduct
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

