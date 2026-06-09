import { useState, useEffect } from "react"
import profileicon from "./profileicon.png"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

export default function Sidebar() {
    
    let [ loggedIn , LogIn ] = useState(false);
    let [ details, setDetails ] = useState("Interactive Member")
    let [ name, setName ] = useState("");
    let [ show, setShow ] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        const userDetails = localStorage.getItem("details");
        if (token && username) {
            setName(username);
            setDetails(userDetails || "Interactive Member");
            LogIn(true);
        }
    }, []);

    let handleClick = () => {
        if (loggedIn){
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            localStorage.removeItem("details");
            LogIn(false);
            setName("");
            setDetails("Interactive Member")
        }
        else{
            setShow(true);
        }
    }
    let handleClose = () => setShow(false);
    let getName = () => name || "Guest User";
    let getStatus = () => (loggedIn) ? "Log Out" : "Sign In";
    
    let handleSave = async (event) => {
        event.preventDefault();
        const username = event.currentTarget.elements.username.value;
        const password = event.currentTarget.elements.password.value;
        const userDetails = event.currentTarget.elements.details.value;

        try {
            // Attempt to login first
            let response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                // If login fails (user probably doesn't exist), register them
                response = await fetch("http://localhost:8080/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password, details: userDetails })
                });
            }

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.username);
                localStorage.setItem("details", data.details || userDetails);
                
                setName(data.username);
                setDetails(data.details || userDetails);
                LogIn(true);
                setShow(false);
            } else {
                alert("Invalid credentials or authentication error.");
            }
        } catch (err) {
            console.error("Authentication server communication failed", err);
            alert("Could not connect to backend server. Ensure it is running.");
        }
    }

    return(
    <div className="sidebar-panel text-center">
        <div className="position-relative d-inline-block mb-3">
            <img 
                src={profileicon} 
                alt="User profile avatar" 
                height="90px" 
                className="rounded-circle border border-2 border-purple"
                style={{ 
                    backgroundColor: "rgba(255,255,255,0.1)", 
                    padding: "5px",
                    boxShadow: loggedIn ? "0 0 15px rgba(0, 242, 254, 0.4)" : "none" 
                }}
            />
            {loggedIn && (
                <span 
                    className="position-absolute bottom-0 end-0 bg-success border border-2 border-dark rounded-circle" 
                    style={{ width: "15px", height: "15px" }}
                    title="Online"
                ></span>
            )}
        </div>

        <div className="mb-4">
            <h3 className="fs-4 fw-bold text-light mb-1">{getName()}</h3>
            <p className="fs-6 text-muted mb-0" style={{ letterSpacing: "0.05em" }}>{details}</p>
        </div>

        <button 
            className={`btn w-100 ${loggedIn ? "btn-outline-danger" : "btn-glow"}`} 
            onClick={handleClick}
        >
            {getStatus()}
        </button>

        <Modal show={show} onHide={handleClose} centered contentClassName="glass-panel text-light border-0">
          <Modal.Header closeButton closeVariant="white" className="border-bottom border-secondary">
            <Modal.Title className="fw-bold">Welcome to CareerLink</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form onSubmit={handleSave}>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label className="fw-semibold">Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  autoFocus
                  required
                  className="custom-input"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label className="fw-semibold">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  required
                  className="custom-input"
                />
              </Form.Group>
              <Form.Group className="mb-4" controlId="details">
                <Form.Label className="fw-semibold">Details / Headline</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Software Developer, AI Student"
                  required
                  className="custom-input"
                />
              </Form.Group>
              <div className="text-center">
                <Button className="btn-glow w-100" type="submit">
                  Save & Login
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
    </div>
    )
}


