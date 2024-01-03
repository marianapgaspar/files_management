import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute, { ProtectedRouteProps } from '../../PrivateRoute';
import Login from '../../pages/login/Login';
import Home from '../../pages/home/Home';
import DocsList from '../../pages/docs/DocsList';
import DocsGuests from '../../pages/docs/DocsGuests';
import DocsListChild from '../../pages/docs/DocsListChild';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

const defaultProtectedRouteProps: Omit<ProtectedRouteProps, 'outlet'> = {
    isAuthenticated: !!localStorage.getItem("Token"),
    authenticationPath: '/Login',
};
function CreatorRoute(){
    return (
    <div>
        <Router>
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
            <Navbar.Brand as={NavLink} to="/">Gestão de arquivos</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                <Nav.Link as={NavLink} to="/Documentos">Documentos</Nav.Link>
                <Nav.Link as={NavLink} to="/Login">Login</Nav.Link>
                </Nav>
            </Navbar.Collapse>
            </Container>
        </Navbar>
        <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Home />} />} />
            <Route path='/documentos' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<DocsList />} />} />
            <Route path='/documentos/permissoes/:id' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<DocsGuests />} />} />
            <Route path='/documentos/filhos/:id' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<DocsListChild />} />} />
        </Routes>
      </Router>
    </div>
    );
}
export default CreatorRoute;
