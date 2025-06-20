import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModels.js";


const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address ,paymentMethod} = req.body;

        for (const item of items) {
            const product = await productModel.findById(item._id);

            if (!product) {
                return res.status(404).json({ success: false, message: `Ürün bulunamadı: ${item._id}` });
            }

            const currentStock = product.stock[item.size];
            if (currentStock === undefined || currentStock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Yeterli stok yok: ${product.name} (${item.size})`,
                });
            }

            // Stok güncellemesi
            product.stock[item.size] -= item.quantity;
            product.markModified('stock');
            await product.save();

        }

        // Siparişi oluştur
        const newOrder = new orderModel({
            userId,
            items,
            address,
            amount,
            paymentMethod,
            payment: true,
            date: Date.now(),
        });

        await newOrder.save();

        // Kullanıcının sepetini sıfırla
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Sipariş başarıyla oluşturuldu" });
    } catch (error) {
        console.error("Hata:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const placeOrderStripe = async (req,res) =>{
    
}

const placeOrderRazorpay = async (req,res) =>{
    
}

const allOrders = async (req,res) =>{
    try {
        
        const orders = await orderModel.find({})
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

const userOrders = async (req,res) =>{
    try {
        const {userId} = req.body

        const orders = await orderModel.find({ userId })
        res.json({success:true,orders})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

const updateStatus = async (req,res) =>{
    try {
        const {orderId,status}= req.body

        await orderModel.findByIdAndUpdate(orderId,{status})
        res.json({success:true,message:'Status Updated'})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

export {placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus}