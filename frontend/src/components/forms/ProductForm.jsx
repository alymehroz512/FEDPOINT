import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { generateSlug } from '../../utils/slugify';
import { getCategories } from '../../services/categoryApi';
import { getBrands } from '../../services/brandApi';

const ProductForm = ({ onSubmit, defaultValues = {}, isEdit = false }) => {
  const { register, handleSubmit, watch, setValue } = useForm({ defaultValues });
  const [slugPreview, setSlugPreview] = useState(generateSlug(defaultValues.name || ''));
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [imagePreview, setImagePreview] = useState(defaultValues.imageUrl || '');

  const name = watch('name');

  // Slug preview
  useEffect(() => {
    if (name) setSlugPreview(generateSlug(name));
  }, [name]);

  // Load dropdowns
  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([getCategories(), getBrands()]);
        setCategories(catRes);
        setBrands(brandRes);
      } catch (error) {
        console.error('Error loading dropdowns:', error);
      }
    };
    loadDropdowns();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('image', file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input className="form-control" {...register('name', { required: true })} />
        <small className="text-muted">Slug: {slugPreview}</small>
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea className="form-control" {...register('description', { required: true })} />
      </div>
      <div className="mb-3">
        <label className="form-label">Category</label>
        <select className="form-select" {...register('category', { required: true })}>
          <option value="">Select</option>
          {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Subcategory</label>
        <input className="form-control" {...register('subcategory', { required: true })} />
      </div>
      <div className="mb-3">
        <label className="form-label">Brand</label>
        <select className="form-select" {...register('brand', { required: true })}>
          <option value="">Select</option>
          {brands.map(brand => <option key={brand._id} value={brand._id}>{brand.name}</option>)}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Image</label>
        <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
        {imagePreview && <img src={imagePreview} alt="Preview" className="img-thumbnail mt-2" style={{ width: '100px' }} />}
      </div>
      <button type="submit" className="btn btn-primary">{isEdit ? 'Update' : 'Add'} Product</button>
    </form>
  );
};

export default ProductForm;