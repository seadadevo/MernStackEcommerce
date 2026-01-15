import { Product } from "../models/productModel.js";
import APIFeatures from "../utils/apiFeatures.js";
import { uploadStream } from "../utils/cloudinaryHelper.js";

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
        const existingProduct = await Product.findOne({ productName });
        if (existingProduct) {
        return res.status(400).json({ 
            success: false,
            message: `Product with name "${productName}" already exists`
        });
        }
       
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
        const apiFeatures = new APIFeatures(Product.find(), req.query)
            .search()
            .filter()
            .sort()
            .limitFields();

        const totalProductsCount = await Product.countDocuments(apiFeatures.filters);

        apiFeatures.paginate();
        const products = await apiFeatures.query;

        res.status(200).json({
            success: true,
            totalProductsCount,
            results: products.length,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteProduct = async(req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if(product.productImag && product.productImag.length > 0){
            const deletePromises = product.productImag.map((img) => 
                cloudinary.uploader.destroy(img.public_id)
            );
            await Promise.all(deletePromises);
        }

        await Product.findByIdAndDelete(productId);
        res.status(200).json({
            success: true,
            message: "Product and its images deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { productName, productDesc, productPrice, category, brand } = req.body;
        const files = req.files;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        if(files && files.length > 0) {
            const deletePromises = product.productImag.map((img) => 
                cloudinary.uploader.destroy(img.public_id)
            );
            await Promise.all(deletePromises); 
            
            const uploadPromises = files.map(file => uploadStream(file.buffer, "mern_products"));
            const uploadResults = await Promise.all(uploadPromises);

            const productImgData = uploadResults.map(result => ({
                url: result.secure_url,
                public_id: result.public_id
            }));
            product.productImag = productImgData;
        }

        if (productName) product.productName = productName;
        if (productDesc) product.productDesc = productDesc;
        if (productPrice) product.productPrice = productPrice;
        if (category) product.category = category;
        if (brand) product.brand = brand;

        await product.save()

        res.status(200).json({
            success: true,
            message: "Product has been updated successfully",
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


export const getProductById = async(req, res) => {
    try {
        const {productId} = req.params;
        const product = await Product.findById(productId).populate("userId", "firstName lastName");
        if(!product) {
            return res.status(404).json({
                success: false,
                message: "Product deos not exist",
            });
        } 

        return res.status(200).json({
            success: true,
            message: "Product has returned successfully",
            product
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid Product ID format"
            });
        }
        
         return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}