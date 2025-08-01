import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

interface FormData {
  username: string;
  password: string;
  isAdmin: boolean;
}

const CreateAccount: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    isAdmin: false,  // default to false
  });

  const navigate = useNavigate();
  const [message, setMessage] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'radio') {
      setFormData({
        ...formData,
        isAdmin: value === 'true',
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/create-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Account created successfully!');
        setFormData({ username: '', password: '', isAdmin: false });
        navigate('/');
      } else {
        const err = await response.json();
        setMessage(`Error: ${err.message || 'Failed to create account.'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred.');
    }
  };

  return (
    <div>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label><br />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Password:</label><br />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Are you an admin?</label><br />
          <label>
            <input
              type="radio"
              name="isAdmin"
              value="true"
              checked={formData.isAdmin === true}
              onChange={handleChange}
            />
            Yes
          </label>
          <label style={{ marginLeft: '1em' }}>
            <input
              type="radio"
              name="isAdmin"
              value="false"
              checked={formData.isAdmin === false}
              onChange={handleChange}
            />
            No
          </label>
        </div>

        <button type="submit">Create Account</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateAccount;
