import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostsListPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentContent, setCommentContent] = useState({});
  const [comments, setComments] = useState({});
  const [visibleComments, setVisibleComments] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const userRole = localStorage.getItem('role');
        const filteredPosts = userRole === 'ADMIN' ? response.data : response.data.filter(post => post.published);
        setPosts(filteredPosts);

        const commentsData = {};
        for (const post of filteredPosts) {
          const commentsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/${post.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          commentsData[post.id] = commentsResponse.data ||  [];
        }
        setComments(commentsData);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch posts');
        if (err.response?.status === 401) {
          navigate('/loginPage');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [navigate]);

  const handleAddComment = async (postId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/comments/add`, {
        content: commentContent[postId],
        postId,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setCommentContent(prevContent => ({
        ...prevContent,
        [postId]: '',
      }));

      const commentsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/comments/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setComments(prevComments => ({
        ...prevComments,
        [postId]: commentsResponse.data,
      }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add comment');
    }
  };

  const handleCommentChange = (postId, e) => {
    setCommentContent(prevContent => ({
      ...prevContent,
      [postId]: e.target.value,
    }));
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

  const toggleCommentsVisibility = (postId) => {
    setVisibleComments(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <div>
      <h1>Posts</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p><strong>Author:</strong> {post.author.username}</p>

            <div>
              <input
                type="text"
                value={commentContent[post.id] || ''}
                onChange={(e) => handleCommentChange(post.id, e)}
                placeholder="Add a comment"
              />
              <button
                onClick={() => handleAddComment(post.id)}
                disabled={!commentContent[post.id]?.trim()}
              >
                Add Comment
              </button>
              <button 
                onClick={() => toggleCommentsVisibility(post.id)}
              >
                {visibleComments[post.id] ? 'Hide Comments' : 'View Comments'}
              </button>
            </div>

            {visibleComments[post.id] && (
              <div>
                <h3>Comments:</h3>
                <ul>
                {Array.isArray(comments[post.id]) && comments[post.id].map(comment => (
                    <li key={comment.id}>
                      <p><strong>{comment.username}:</strong> {comment.content}</p>
                      <button onClick={() => handleDeleteComment(post.id, comment.id)}>
                        Delete Comment
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button onClick={() => navigate(`/posts/${post.id}`)}>View Post</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsListPage;

