import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';


const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      const role = localStorage.getItem('role'); // Get user role from localStorage
    
    if (!role || role !== 'AUTHOR') {
      window.alert('You are not authorized to access the Dashboard.');
      navigate('/posts');
      return; // Stop further execution
    }
      const fetchPosts = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setPosts(response.data);

          // Fetch comments for each post
        const commentsData = {};
        for (const post of response.data) {
          const commentsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/comments/${post.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          commentsData[post.id] = commentsResponse.data || [];
        }
        setComments(commentsData);
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to fetch posts');
          if (err.response?.status === 401) {
            navigate('/'); // Redirect to login if unauthorized
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
        setComments(prevComments => {
          const newComments = { ...prevComments };
          delete newComments[id];
          return newComments;
        });
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
        localStorage.removeItem('role'); //remove role
        navigate('/'); // Redirect to login page
      };

      const handleViewPost = (id) => {
        navigate(`/posts/${id}`);
      };
    
      const handleDeleteComment = async (postId, commentId) => {
        try {
          await axios.delete(`${process.env.REACT_APP_API_URL}/api/comments/delete/${commentId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
    
          setComments(prevComments => ({
            ...prevComments,
            [postId]: prevComments[postId].filter(comment => comment.id !== commentId),
          }));
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to delete comment');
        }
      };
    
      return (
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>Dashboard</h1>
            <div className='btn'>
              <button className="create-post-btn" onClick={handleCreatePost}>Create Post</button>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>
          
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          
          <ul className="post-list">
            {posts.map(post => (
              <li key={post.id} className="each-post">
                <h2>{post.title}</h2>
                <p>{post.content}</p>
                <p><strong>Author:</strong> {post.author.username}</p>
                <p><strong>Published:</strong> {post.published ? 'Yes' : 'No'}</p>
                
                <button onClick={() => handleUpdate(post.id, { ...post, published: !post.published })}>
                  {post.published ? 'Unpublish' : 'Publish'} / Update
                </button>
                
                <button onClick={() => handleDelete(post.id)}>Delete</button>
                <button onClick={() => handleViewPost(post.id)}>View Post</button>
                
                <div>
                  <h3>Comments:</h3>
                  <ul>
                    {comments[post.id]?.map(comment => (
                      <li key={comment.id}>
                        <p><strong>{comment.username}:</strong> {comment.content}</p>
                        <button onClick={() => handleDeleteComment(post.id, comment.id)}>
                          Delete Comment
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
  };
  
  
  export default Dashboard;
  