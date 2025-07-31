import React, { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  username: string;
  password: string;
}

const CreateAccount: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  });

  const [message, setMessage] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        setFormData({ username: '', password: '' });
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

        <button type="submit">Create Account</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateAccount;
