import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateAdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="pt-24 text-center">Đang tải...</div>;
    }

    if (!user || user.role !== 'ADMIN') {
        return <Navigate to="/login" />;
    }

    return children;
};

export default PrivateAdminRoute;