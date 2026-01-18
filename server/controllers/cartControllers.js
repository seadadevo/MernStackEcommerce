import { Cart } from "../models/cartModel";
import { Product } from "../models/productModel";

export const getCart = async (req, res) => {
  try {
    const userId = req.id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.status(404).json({
        success: false,
        cart: [],
      });
    }

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity: 1, price: product.productPrice }],
        totalPrice: product.productPrice,
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({
          productId,
          quantity: 1,
          price: product.productPrice,
        });
      }

      cart.totalPrice = cart.items.reduce((total, item) => {
        return total + item.quantity * item.price;
      }, 0);
    }
    await cart.save();

    const populateCart = await Cart.findById(cart._id).populate("items.productId")
    return res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart: populateCart,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
}
};

/**]
 * {
  "productId": "65a123...",
  "type": "increase" // أو "decrease"
}
 */
export const updateQuantity = async(req, res) => {
   try {
       const userId = req.id;
       const {productId, type} = req.body;

       let cart = await Cart.findOne({userId});
       if(!cart) {
           return res.status(404).json({
             success: false, 
             message: "Cart not Found"
            });
        }
        const item = cart.items.find(item => item.productId.toString() === productId);
        if(!item) {
           return res.status(404).json({
             success: false, 
             message: "Item not Found"
            });
       }
       if(type === "increase"){
        item.quantity += 1;
       }
       if(type === "decrease" && item.quantity > 1){
        item.quantity -= 1;
       }

       cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
       await cart.save();
       cart = await cart.populate("items.productId");
       return res.status(200).json({
         success: true, cart
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false, message: error.message
        });
    } 
}

export const deleteFromCart = async(req, res) => {
    try {
        const userId = req.id;
        const {productId} = req.body;
        
        let cart = await Cart.findOne({userId});
        if(!cart) {
            return res.status(404).json({
              success: false,
              message: "Cart not found"
             });
        }
        cart.items = cart.items.filter(item => item.productId.toString() !== productId )
        cart.totalPrice = cart.items.reduce((acc, item) => acc+item.price * item.quantity, 0);
        await cart.save();
        return res.status(200).json({
          success: true,
          cart
         });
    } catch (error) {
        return res.status(500).json({
          success: false, message: error.message
         });
    }
}






