import { Routes,Route, BrowserRouter } from 'react-router-dom';
import Home from './page/Home/Home';
import ProductDetail from './page/ProductDetail/ProductDetail';
import Login from './page/LoginPage/Login';
import Register from './page/RegisterPage/Register';
import { AuthProvider } from './contexts/AuthContext';
import Profile from './page/Info/Info';
import AdminDashboard from './admin/page/AdminDashboard/AdminDashboard';
import PrivateAdminRoute from './components/PrivateAdminRoute';
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path='/productdetail' element={<ProductDetail/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/product/:id" element={<ProductDetail/>} />
            <Route 
            path="/admin/*" 
            element={
              <PrivateAdminRoute>
                <AdminDashboard />
              </PrivateAdminRoute>
            } 
          />
            
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}