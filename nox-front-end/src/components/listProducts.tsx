import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  _id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

interface Props {
  getIsAdmin: (value: void) => boolean;
  setEditProfileId: (id: number) => void;
}

const PRODUCTS_PER_PAGE = 5;

const ListProducts: React.FC<Props> = ({ getIsAdmin, setEditProfileId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<'name' | 'price'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products.');
      const data = await res.json();

      if (Array.isArray(data.products)) {
        console.log(data);
        setProducts(data.products);
      } else {
        console.error('Expected "products" array but got:', data);
        setProducts([]);
      }

      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    console.log("HANDLE DELETE " + id);
    try {
      const res = await fetch(`/api/delete-product/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete product.');

      // Update local state after successful deletion
      setProducts(prev => prev.filter(product => product._id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortFieldChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortField(e.target.value as 'name' | 'price');
  };

  const handleSortOrderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as 'asc' | 'desc');
  };

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = sortField === 'name' ? a.name.toLowerCase() : a.price;
      const bVal = sortField === 'name' ? b.name.toLowerCase() : b.price;

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Product List</h2>

      <input
        type="text"
        placeholder="Search by product name..."
        value={searchTerm}
        onChange={handleSearch}
        style={{ padding: '0.5rem', marginBottom: '1rem', width: '100%' }}
      />

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <label>
          Sort by:&nbsp;
          <select value={sortField} onChange={handleSortFieldChange}>
            <option value="name">Name</option>
            <option value="price">Price</option>
          </select>
        </label>

        <label>
          Order:&nbsp;
          <select value={sortOrder} onChange={handleSortOrderChange}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>

          {getIsAdmin() && (
            <button
              onClick={() => navigate('/add-product')}
              style={{ marginTop: '0.5rem', backgroundColor: '#d9534f', color: '#fff', padding: '0.5rem', border: 'none', cursor: 'pointer' }}
            >
              Add Product
            </button>
          )}

          <button
              onClick={() => navigate('/')}
              style={{ marginTop: '0.5rem', backgroundColor: '#1463b3', color: '#fff', padding: '0.5rem', border: 'none', cursor: 'pointer' }}
            >
              Logout
          </button>
      </div>

      {currentProducts.map((product) => (
        <div key={product._id} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
          <h3>{product.name}</h3>
          <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
          <p><strong>Description:</strong> {product.description}</p>
          {product.imageUrl && (
            <img src={product.imageUrl} alt={product.name} style={{ maxWidth: '200px' }} />
          )}

          {getIsAdmin() && (
            <button
              onClick={() => {
                setEditProfileId(product._id);
                navigate("/edit-profile");
              }}
              style={{ marginTop: '0.5rem', backgroundColor: '#1463b3', color: '#fff', padding: '0.5rem', border: 'none', cursor: 'pointer' }}
            >
              Edit
            </button>
          )}
          {getIsAdmin() && (
            <button
              onClick={() => handleDelete(product._id)}
              style={{ marginTop: '0.5rem', backgroundColor: '#d9534f', color: '#fff', padding: '0.5rem', border: 'none', cursor: 'pointer' }}
            >
              Delete
            </button>
          )}
        </div>
      ))}

      {filteredProducts.length > PRODUCTS_PER_PAGE && (
        <div style={{ marginTop: '1rem' }}>
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            &lt; Prev
          </button>
          <span style={{ margin: '0 1rem' }}>Page {currentPage} of {totalPages}</span>
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Next &gt;
          </button>
        </div>
      )}

      {filteredProducts.length === 0 && <p>No products match your search.</p>}
    </div>
  );
};

export default ListProducts;
