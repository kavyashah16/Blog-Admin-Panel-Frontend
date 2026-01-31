import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
// import Videos from "./pages/UiElements/Videos";
// import Images from "./pages/UiElements/Images";
// import Alerts from "./pages/UiElements/Alerts";
// import Badges from "./pages/UiElements/Badges";
// import Avatars from "./pages/UiElements/Avatars";
// import Buttons from "./pages/UiElements/Buttons";
// import LineChart from "./pages/Charts/LineChart";
// import BarChart from "./pages/Charts/BarChart";
// import Calendar from "./pages/Calendar";
// import BasicTables from "./pages/Tables/BasicTables";
// import FormElements from "./pages/Forms/FormElements";
// import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import EditBlog from "./components/blog/AdminBlogEdit";
import Category from "./pages/Category/Category";
import { AuthProvider, useAuth } from "./context/AuthContext";
import About from "./pages/About/About";
import Service from "./pages/Service/Service";
import HomeAdmin from "./pages/Dashboard/Home";
import Home from "./pages/Home/Home";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/footer";
import Contact from "./pages/Contact/Contact";
import AdminBlog from "./pages/AdminBlog/AdminBlog";
import Blog from "./pages/Blog/Blog";
import BlogEdit from "./components/blog/AdminBlogEdit";
import BlogDetail from "./pages/BlogDetail/Blogdetail";
import CreateUser from "./pages/CreateUser/CreateUser";
import UserEdit from "./components/auth/UserEdit";
import PCategoryManager from "./pages/PCategory/PCategory";
import AttributeManager from "./pages/Attribute/Attribute";

function PrivateRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/admin/signin" state={{ from: location }} replace />
  );
}

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/admin" element={<HomeAdmin />} />
              <Route path="/admin/profile" element={<UserProfiles />} />
              <Route path="/admin/blog" element={<AdminBlog />} />
              <Route path="/admin/blogedit/:id" element={<EditBlog />} />
              <Route path="/admin/category" element={<Category />} />
              <Route path="/admin/profile" element={<UserProfiles />} />
              <Route path="/admin/createuser" element={<CreateUser />} />
              <Route path="/admin/edituser/:id" element={<UserEdit />} />
              <Route path="/admin/pcategory" element={<PCategoryManager />} />
              <Route path="/admin/attribute" element={<AttributeManager />} />
            </Route>
          </Route>

          <Route path="/admin/signin" element={<SignIn />} />
          <Route path="/admin/signup" element={<SignUp />} />

          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/service" element={<Service />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
