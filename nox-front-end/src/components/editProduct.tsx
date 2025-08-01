import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

interface Props {
  getEditProfileId: () => number | null;
}

const EditProduct: React.FC<Props> = ({getEditProfileId}) => {
  const { id } = useParams(); // product ID from route
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log(`/api/get-product/${getEditProfileId()}`);
        const res = await fetch(`/api/get-product/${getEditProfileId()}`);
        if (!res.ok) throw new Error('Failed to fetch product.');
        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!product) return;
    const { name, value } = e.target;
    setProduct({ ...product, [name]: name === 'price' ? parseFloat(value) : value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/edit-products/${getEditProfileId()}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!res.ok) throw new Error('Failed to update product.');
      alert('Product updated successfully!');
      navigate('/list-products'); // or wherever your list page is
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div>
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        <label>
          Name:
          <input type="text" name="name" value={product.name} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Price:
          <input type="number" name="price" step="0.01" value={product.price} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Description:
          <textarea name="description" value={product.description} onChange={handleChange} />
        </label>
        <br />
        <label>
          Image URL:
          <input type="text" name="imageUrl" value={product.imageUrl} onChange={handleChange} />
        </label>
        <br />
        <button type="submit" style={{ marginTop: '1rem' }}>Update Product</button>
      </form>
    </div>
  );
};

export default EditProduct;
