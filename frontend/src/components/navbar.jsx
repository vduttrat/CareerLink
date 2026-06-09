import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

export default function CareerlinkNavbar() {
    document.body.style.background="linear-gradient(to right,#040320,#030943 50%,#040320)";
    document.body.style.scrollBehavior="smooth";
    document.body.style.scrollbarWidth="none";
  return (
    <Navbar style={{height:"7vh"}} expand="lg" className="bg-body-tertiary fixed-top" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand href="#home">
            <img
              alt="CareerLink Brand Logo"
              src="https://i.postimg.cc/T1tPJSTZ/Smaller-Logo-Transparent.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
            {' '}
            CareerLink
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
        <Navbar.Collapse className="justify-content-end" id="responsive-navbar-nav">
            <Nav>
              <Navbar.Text>
                <a className="m-2 text-decoration-none" style={{fontSize:"0.85rem"}} href="#home">Home</a>
              </Navbar.Text>
              <Navbar.Text>
                <a className="m-2 text-decoration-none" style={{fontSize:"0.85rem"}} href="#about">About</a>
              </Navbar.Text>
              <Navbar.Text>
                <a className="m-2 text-decoration-none" style={{fontSize:"0.85rem"}} href="#profiles">Profiles</a>
              </Navbar.Text>
              <Navbar.Text>
                <a className="m-2 text-decoration-none" style={{fontSize:"0.85rem"}} href="#following">Following</a>
              </Navbar.Text>
              <Navbar.Text>
                <a className="m-2 text-decoration-none" style={{fontSize:"0.85rem"}} href="#contact">Contact Us</a>
              </Navbar.Text>
            </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

