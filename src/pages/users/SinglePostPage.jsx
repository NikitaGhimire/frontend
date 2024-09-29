import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/singlePostPage.css';

const SinglePostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState(''); // State for comment input
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setPost(response.data);

        const commentsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/comments/${postId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setComments(commentsResponse.data || []);
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

  const handleCommentChange = (e) => {
    setCommentContent(e.target.value);
  };

  const handleAddComment = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/comments/${postId}`,
        { content: commentContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setComments([...comments, { content: commentContent, username: localStorage.getItem('username') }]); // Update comments state
      setCommentContent(''); // Clear comment input
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add comment');
    }
  };

  const handleBackToPosts = () => {
    navigate('/posts'); // Navigate back to the posts list
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (!post) {
    return <p>Post not found</p>;
  }

  return (
    <div className="single-post">
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      {post.author && (
        <p><strong>Author:</strong> {post.author.username}</p>
      )}

      <h3>Add a Comment:</h3>
      <div className="comment-input">
        <input
          type="text"
          value={commentContent}
          onChange={handleCommentChange}
          placeholder="Add a comment"
        />
        <button onClick={handleAddComment} disabled={!commentContent.trim()}>
          Add Comment
        </button>
      </div>

      <h3>Comments:</h3>
      <ul className="comments-list">
        {comments.map(comment => (
          <li key={comment.id}>
            <p><strong>{comment.username}:</strong> {comment.content}</p>
          </li>
        ))}
      </ul>
      {/* Back to Posts button */}
      <button className="back-to-posts" onClick={handleBackToPosts}>
        Back to Posts
      </button>
    </div>
  );
};

export default SinglePostPage;


