import { Spinner, Container } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';


const AdminRoute = ({ children }) => {
    const { admin,loading } = useAuth();

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return admin ? children : <Navigate to="/login" />;
};

export default AdminRoute;