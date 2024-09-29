import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import LoginPage from "./pages/admin/LoginPage";
import Dashboard from "./pages/admin/Dashboard";
import RegisterPage from "./pages/admin/RegisterPage";
import UpdatePostPage from "./pages/admin/updatePostPage";
import CreatePostPage from "./pages/admin/CreatePost";
import SinglePostPage from "./pages/users/SinglePostPage";
import PostsListPage from "./pages/users/PostListPage";
import HomePage from "./pages/users/HomePage";
import Footer from "./pages/users/Footer";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/loginPage" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/update-post/:id" element={<UpdatePostPage />} />
      <Route path="/create-post" element={<CreatePostPage />} /> 
      <Route path="/posts" element={<PostsListPage />} />
      <Route path="/posts/:postId" element={<SinglePostPage />} />
      <Route path='/'element={<HomePage />} />
      </Routes>
      < Footer />
    </Router>
  );
}

export default App;
