import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/home/Home';
import ProtectedRoute, { ProtectedRouteProps } from './PrivateRoute';
import AdmRoute from './components/routes/AdmRoute';
import CreatorRoute from './components/routes/CreatorRoute';
import GuestRoute from './components/routes/GuestRoute';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Login from './pages/login/Login';

const defaultProtectedRouteProps: Omit<ProtectedRouteProps, 'outlet'> = {
    isAuthenticated: localStorage.getItem("Token") !== null,
    authenticationPath: '/login',
};
function App() {
  
  if (localStorage.getItem("Token")){
      if (localStorage.getItem("Permission") == "2"){
        return (
          <div>
            <AdmRoute/>
          </div>
        )
      } else if (localStorage.getItem("Permission") == "1"){
        return (
          <div>
            <CreatorRoute/>
          </div>
        )
      } else {
        return (
          <div>
            <GuestRoute/>
          </div>
        )
      }
  } else {
    return (
      <div>
        <Router>
          <Navbar expand="lg" className="bg-body-tertiary">
              <Container>
              <Navbar.Brand as={NavLink} to="/">Gestão de arquivos</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto">
                  <Nav.Link as={NavLink} to="/Login">Login</Nav.Link>
                  </Nav>
              </Navbar.Collapse>
              </Container>
          </Navbar>
          <Routes>
            <Route path='/' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Home />} />} />
            <Route path='login' element={<Login />} />
          </Routes>
        </Router>
      </div>
    )
  }
}

export default App
