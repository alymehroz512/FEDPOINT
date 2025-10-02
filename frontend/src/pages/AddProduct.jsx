import { useState } from 'react';
import ProductForm from '../components/forms/ProductForm';
import { addProduct } from '../services/productApi';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await addProduct(data);
      navigate('/products');
    } catch (error) {
      console.error('Add error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add Product</h1>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddProduct;