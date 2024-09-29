import { Link } from 'react-router-dom';
import '../styles/homePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <h1>Welcome to My Blog</h1>
      <p>Please log in or register to continue.</p>
      <div className="home-buttons">
        <Link to="/loginPage">
          <button className="login-button">Login</button>
        </Link>
        <Link to="/register">
          <button className="register-button">Register</button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
