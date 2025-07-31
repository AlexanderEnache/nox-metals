import React, { useState, ChangeEvent, FormEvent } from 'react';

interface ProductFormData {
  name: string;
  price: string; // Using string for easier input handling, will convert to number on submit
  description: string;
  imageUrl: string;
}

const AddProduct: React.FC = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
  });

  const [message, setMessage] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate price is a number
    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum < 0) {
      setMessage('Please enter a valid positive price.');
      return;
    }

    try {
      const response = await fetch('/api/add-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: priceNum,
        }),
      });

      if (response.ok) {
        setMessage('Product added successfully!');
        setFormData({ name: '', price: '', description: '', imageUrl: '' });
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Failed to add product.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      setMessage('An error occurred while adding the product.');
    }
  };

  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label><br />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Price:</label><br />
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Description:</label><br />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div>
          <label>Image URL:</label><br />
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Add Product</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default AddProduct;
