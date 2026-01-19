import FormInput from '@/components/auth/FormInput'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ImagePlus, PackagePlus, X, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '@/api/axios'
import { toast } from 'sonner' 
import { PRODUCT_INPUTS } from '@/constants'
import { useDispatch } from 'react-redux'
import {  addProduct } from "@/redux/productSlice";
export const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()

  const [product, setProduct] = useState({
    productName: "",
    productDesc: "",
    productPrice: "",
    category: "",
    brand: "",
  });


  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...filesArray]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
   
    if (selectedImages.length === 0) {
      return toast.error("Please upload at least one image");
    }

    try {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      
     
      const formData = new FormData();
      formData.append("productName", product.productName);
      formData.append("productDesc", product.productDesc);
      formData.append("productPrice", product.productPrice);
      formData.append("category", product.category);
      formData.append("brand", product.brand);

      
      selectedImages.forEach((file) => {
        formData.append("files", file); 
      });

      const res = await api.post('/product/add', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data", 
        }
      });

      if (res.data.success) {
        toast.success("Product added successfully!");
        dispatch(addProduct(res.data.product));
        navigate('/dashboard/products');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-[80vh] flex items-center justify-center p-4'>
      <div className='bg-white border border-gray-100 shadow-2xl rounded-2xl w-full max-w-2xl overflow-hidden'>
        
        {/* Header */}
        <div className='bg-pink-600 p-6 flex justify-between items-center text-white'>
          <div className='flex items-center gap-3'>
            <PackagePlus size={24} />
            <h2 className='text-xl font-bold uppercase tracking-wide'>Add New Product</h2>
          </div>
          <button onClick={() => navigate(-1)} className='hover:bg-pink-500 p-1 rounded-full transition-colors'>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleAddProduct} className='p-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {PRODUCT_INPUTS.map((item) => (
              <div key={item.id} className="space-y-1">
                <FormInput 
                  label={item.label} 
                  id={item.id} 
                  name={item.name}
                  placeholder={item.placeholder} 
                  type={item.type}
                  value={product[item.name as keyof typeof product]}
                  onChange={handleOnChange}
                  className="focus:border-pink-500 transition-all"
                />
              </div>
            ))}

            <div className='col-span-full space-y-3'>
              <Label className='text-gray-700 font-semibold flex items-center gap-2'>
                <ImagePlus size={18} className='text-pink-600' />
                Product Images ({selectedImages.length})
              </Label>
              
              <div className='relative border-2 border-dashed border-pink-100 rounded-xl p-6 hover:bg-pink-50/50 transition-all text-center'>
                <Input 
                  id="images"
                  type='file' 
                  multiple 
                  accept="image/*"
                  onChange={handleFileChange}
                  className='absolute inset-0 opacity-0 cursor-pointer' 
                />
                <ImagePlus className='text-pink-600 mx-auto mb-2' size={32} />
                <p className='text-sm text-gray-500'>Click to upload product images</p>
              </div>

              {selectedImages.length > 0 && (
                <div className='flex flex-wrap gap-2 mt-4'>
                  {selectedImages.map((file, index) => (
                    <div key={index} className='relative w-20 h-20 group'>
                      <img 
                        src={URL.createObjectURL(file)} 
                        className='w-full h-full object-cover rounded-lg border' 
                        alt="preview" 
                      />
                      <button 
                        type='button'
                        onClick={() => removeImage(index)}
                        className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className='flex items-center gap-4 mt-10'>
            <Button 
              type='button' 
              variant="outline" 
              onClick={() => navigate(-1)}
              className='flex-1 h-12 rounded-xl'
            >
              Cancel
            </Button>
            <Button 
              disabled={loading}
              type='submit' 
              className='flex-[2] bg-pink-600 hover:bg-pink-700 h-12 rounded-xl text-lg font-bold'
            >
              {loading ? "Publishing..." : "Publish Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

