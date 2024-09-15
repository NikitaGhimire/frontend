import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setPosts(response.data);
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to fetch posts');
          if (err.response?.status === 401) {
            navigate('/loginPage'); // Redirect to login if unauthorized
          }
        } finally {
          setLoading(false);
        }
      };
  
      fetchPosts();
    }, [navigate]);
  
    const handleDelete = async (id) => {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/posts/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPosts(posts.filter(post => post.id !== id));
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete post');
      }
    };
  
    const handleUpdate = (id) => {
      navigate(`/update-post/${id}`);
    };

    const handleCreatePost = () => {
        navigate('/create-post');
      };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/loginPage'); // Redirect to login page
      };
  
    return (
      <div>
        <h1>Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
        <button onClick={handleCreatePost}>Create Post</button>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <p><strong>Author:</strong> {post.author.username}</p>
              <p><strong>Published:</strong> {post.published ? 'Yes' : 'No'}</p>
              <button onClick={() => handleUpdate(post.id, { ...post, published: !post.published })}>
              {post.published ? 'Unpublish' : 'Publish'} / Update</button>
              <button onClick={() => handleDelete(post.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  
  export default Dashboard;
  