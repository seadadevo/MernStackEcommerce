import api from '@/api/axios'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardSim, Code, Truck } from 'lucide-react'
import React, { useState } from 'react'

const Checkout = () => {
    const [paymentMethod, setPaymentMethod ] =useState("COD");
    const [orderData, setOrderData] = useState({
        
    });
    const createOrder = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const res = await api.post('order/add', {} , {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
        } catch (error) {
            
        }
    }
  return (
    <div className='flex  items-center justify-between gap-3 p-3'>
        <div className='flex-1'>
            <h2 className='text-4xl font-extrabold mb-4 tracking-tight'>CHECKOUT</h2>
            <h3 className='text-gray-900 mb-3 text-xl font-medium '>Payment Method</h3>
            {/* radio buttons  */}
            <div className='flex items-center gap-4 mb-3'>
                <div className={`flex items-center p-4 gap-3 border rounded-xl cursor-pointer transition-all w-1/2 ${paymentMethod === "COD" ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}
                onClick={() => setPaymentMethod('COD')}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center `}>
                            {paymentMethod === "COD" && <div className="w-2.5 h-2.5 bg-pink-500 rounded-full" />}
                        </div>
                     <Code size={20} className="text-gray-600" />   
                    <span className='font-medium'>COD</span>
                </div>
                <div className={`flex items-center p-4 gap-3 border rounded-xl cursor-pointer transition-all w-1/2 ${paymentMethod === "Card" ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}
                onClick={() => setPaymentMethod('Card')}>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center `}>
                            {paymentMethod === "Card" && <div className="w-2.5 h-2.5 bg-pink-500 rounded-full" />}
                        </div>
                     <CardSim size={20} className="text-gray-600" />   
                    <span className='font-medium'>Card</span>
                </div>
            </div>
            {/* Form */}
            <div>
                <Label htmlFor='fullName'>Full Name <span className='text-red-500 text-xl'>*</span></Label>
                <Input type="text" />
            </div>
        </div>  
        <div className='flex-1 bg-red-300'>
            ahmed
        </div>
    </div>
  )
}

export default Checkout