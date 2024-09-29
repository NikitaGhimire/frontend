import { useState } from 'react';
import axios from 'axios';
import '../styles/RegisterPage.css';
const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER'); // Default role
  

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/register`, {
        username,
        email,
        password,
        role
      });
      console.log('User registered:', response.data);
      // Redirect or show a success message
      window.location.href = '/';
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className="register-form-container">
    <h1>Register</h1>
    <form onSubmit={handleRegister}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="USER">User</option>
        <option value="AUTHOR">Author</option>
      </select>
      <button type="submit">Register</button>
    </form>
  </div>
  
  );
};

export default RegisterPage;
