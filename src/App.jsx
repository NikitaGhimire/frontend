import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/admin/LoginPage";
import Dashboard from "./pages/admin/Dashboard";
import RegisterPage from "./pages/admin/RegisterPage";
import UpdatePostPage from "./pages/admin/updatePostPage";
import CreatePostPage from "./pages/admin/CreatePost";
import SinglePostPage from "./pages/users/SinglePostPage";
import PostsListPage from "./pages/users/PostListPage";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/loginPage" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/update-post/:id" element={<UpdatePostPage />} />
      <Route path="/create-post" element={<CreatePostPage />} /> 
      <Route path="/" element={<PostsListPage />} />
      <Route path="/posts/:postId" element={<SinglePostPage />} />
      </Routes>
        
    </Router>
  );
}

export default App;
