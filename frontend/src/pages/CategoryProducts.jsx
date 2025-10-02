import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/productApi';
import Pagination from '../components/ui/Pagination';

const CategoryProducts = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ currentPage: 1, totalPages: 1 });

  useEffect(() => {
    fetchProducts();
  }, [slug, searchParams]);

  const fetchProducts = async () => {
    const params = { page: parseInt(searchParams.get('page')) || 1, limit: 20, category: slug };
    try {
      const data = await getProducts(params);
      setProducts(data.products || []);
      setMeta({ currentPage: data.currentPage, totalPages: data.totalPages });
    } catch (error) {
      console.error('Category products error:', error);
    }
  };

  return (
    <div>
      <h1>Products in {slug.replace(/-/g, ' ')}</h1>
      <div className="row">
        {products.map(product => (
          <div key={product._id} className="col-md-4 mb-3">
            <div className="card">
              <img src={`${import.meta.env.VITE_API_URL}${product.imageUrl}`} className="card-img-top" alt={product.name} onError={(e) => { e.target.src = '/placeholder.jpg'; }} />
              <div className="card-body">
                <h5>{product.name}</h5>
                <p>{product.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination currentPage={meta.currentPage} totalPages={meta.totalPages} onPageChange={(page) => setSearchParams({ page })} />
    </div>
  );
};

export default CategoryProducts;