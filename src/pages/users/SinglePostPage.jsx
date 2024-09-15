import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const SinglePostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);  // Initialize as null, not an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPost(response.data);  // Post should be an object, not an array
        
        const commentsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/comments/${postId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setComments(commentsResponse.data || []);  // Ensure comments are an array
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch post');
        if (err.response?.status === 401) {
          navigate('/loginPage');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, navigate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (!post) {
    return <p>Post not found</p>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {post.author && (  // Check if post.author exists before accessing its properties
        <p><strong>Author:</strong> {post.author.username}</p>
      )}

      <h3>Comments:</h3>
      <ul>
        {comments.map(comment => (
          <li key={comment.id}>
            <p><strong>{comment.username}:</strong> {comment.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SinglePostPage;

