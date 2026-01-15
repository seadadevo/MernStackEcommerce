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

// /products?keyword=iphone&category=electronics&price[gt]=1000
export const getAllProducts = async (req, res) => {
    try {
       const keyword = req.query.keyword ? 
       {
        productName: {
            $regex: req.query.keyword,
            $options: 'i'
        }
       } : {};

       const queryCopy = {...req.query};

       const excludeFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
       excludeFields.forEach(el => delete queryCopy[el]);
       
        const queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

        const finalQueryObj = JSON.parse(queryStr);

        const query = Product.find({
            ...keyword,
            ...finalQueryObj    
        })

        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt')
        }
        
        if(req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
             query = query.select('-__v')
        }

        const numofTotalProducts = await Product.countDocuments({
            ...keyword,
            ...finalQueryObj    
        });

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = ( page - 1 ) * limit;

        query = query.skip(skip).limit(limit);

        if(req.query.page) {
            if(skip >= numofTotalProducts ) {
                return res.status(404).json({
                    success: false,
                    message: "This page not found",
                });
            }
        }

        const products  = await query;


        return res.status(200).json({
                success: true,
                numofTotalProducts,
                results: products.length,
                message: "All products returned successfully",
                products,
        });
    } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
    }
};