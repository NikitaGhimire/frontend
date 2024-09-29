import '../styles/Footer.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} My Blog by Nikita. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
