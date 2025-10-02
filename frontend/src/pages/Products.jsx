import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, updateProduct, deleteProduct } from '../services/productApi';
import { getCategories } from '../services/categoryApi';
import { getBrands } from '../services/brandApi';
import Pagination from '../components/ui/Pagination';
import Modal from '../components/ui/Modal';
import ProductForm from '../components/forms/ProductForm';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ currentPage: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ category: '', subcategory: '', brand: '' });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [editModal, setEditModal] = useState({ open: false, product: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  useEffect(() => {
    fetchProducts();
    fetchDropdowns();
  }, [searchParams]);

  const fetchProducts = async () => {
    const params = { page: parseInt(searchParams.get('page')) || 1, limit: 20, ...filters };
    try {
      const data = await getProducts(params);
      setProducts(data.products || []);
      setMeta({ currentPage: data.currentPage, totalPages: data.totalPages });
    } catch (error) {
      console.error('Products error:', error);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([getCategories(), getBrands()]);
      setCategories(catRes || []);
      setBrands(brandRes || []);
    } catch (error) {
      console.error('Dropdowns error:', error);
    }
  };

  const handleFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const query = { ...Object.fromEntries(searchParams), ...newFilters, page: 1 };
    Object.keys(query).forEach(k => !query[k] && delete query[k]);
    setSearchParams(query);
  };

  const handleEdit = (product) => setEditModal({ open: true, product });
  const handleDelete = (id) => setDeleteModal({ open: true, id });

  const confirmDelete = async () => {
    try {
      await deleteProduct(deleteModal.id);
      fetchProducts();
    } catch (error) {
      console.error('Delete error:', error);
    }
    setDeleteModal({ open: false, id: null });
  };

  const handleUpdate = async (data) => {
    if (editModal.product) {
      try {
        await updateProduct(editModal.product._id, data);
        fetchProducts();
      } catch (error) {
        console.error('Update error:', error);
      }
      setEditModal({ open: false, product: null });
    }
  };

  return (
    <div>
      <h1>Products</h1>
      <div className="row mb-3">
        <div className="col-md-3">
          <select className="form-select" value={filters.category} onChange={(e) => handleFilter('category', e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={filters.brand} onChange={(e) => handleFilter('brand', e.target.value)}>
            <option value="">All Brands</option>
            {brands.map(brand => <option key={brand._id} value={brand._id}>{brand.name}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <input className="form-control" placeholder="Subcategory" value={filters.subcategory} onChange={(e) => handleFilter('subcategory', e.target.value)} />
        </div>
      </div>
      <div className="row">
        {products.map(product => (
          <div key={product._id} className="col-md-4 mb-3">
            <div className="card">
              <img src={`${import.meta.env.VITE_API_URL}${product.imageUrl}`} className="card-img-top" alt={product.name} onError={(e) => { e.target.src = '/placeholder.jpg'; }} />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description?.substring(0, 100)}...</p>
                <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(product)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination currentPage={meta.currentPage} totalPages={meta.totalPages} onPageChange={(page) => handleFilter('page', page)} />
      <Modal isOpen={editModal.open} onClose={() => setEditModal({ open: false, product: null })} title="Edit Product">
        <ProductForm onSubmit={handleUpdate} defaultValues={editModal.product} isEdit />
      </Modal>
      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: null })} title="Confirm Delete">
        <p>Are you sure you want to delete this product?</p>
        <div className="d-flex justify-content-end">
          <button className="btn btn-secondary me-2" onClick={() => setDeleteModal({ open: false, id: null })}>Cancel</button>
          <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
        </div>
      </Modal>
    </div>
  );
};

export default Products;