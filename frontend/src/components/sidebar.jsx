import { useState, useEffect, useRef } from "react"
import profileicon from "./profileicon.png"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

export default function Sidebar({ onAuthChange }) {
    
    let [ loggedIn , LogIn ] = useState(false);
    let [ details, setDetails ] = useState("Interactive Member")
    let [ name, setName ] = useState("");
    let [ show, setShow ] = useState(false);
    let [ showResumeModal, setShowResumeModal ] = useState(false);
    let [ uploading, setUploading ] = useState(false);
    const resumeFileRef = useRef(null);
 
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
            if (onAuthChange) onAuthChange();
        }
        else{
            setShow(true);
        }
    }
    let handleClose = () => setShow(false);
    let handleResumeClose = () => setShowResumeModal(false);
    let getName = () => name || "Guest User";
    let getStatus = () => (loggedIn) ? "Log Out" : "Sign In";
    
    let handleSave = async (event) => {
        event.preventDefault();
        const username = event.currentTarget.elements.username.value;
        const password = event.currentTarget.elements.password.value;
        const userDetails = event.currentTarget.elements.details.value;
 
        try {
            let response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
 
            if (!response.ok) {
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
                if (onAuthChange) onAuthChange();
                setShowResumeModal(true);
            } else {
                alert("Invalid credentials or authentication error.");
            }
        } catch (err) {
            console.error("Authentication server communication failed", err);
            alert("Could not connect to backend server. Ensure it is running.");
        }
    }

    const handleResumeUpload = async () => {
        const file = resumeFileRef.current?.files[0];
        if (!file) {
            alert("Please select a PDF file to upload.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Authentication error. Please log in again.");
            setShowResumeModal(false);
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("http://localhost:8080/api/profiles/resume", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                setShowResumeModal(false);
                alert("Resume uploaded successfully! Your connections can now download it.");
            } else {
                const errData = await response.json();
                alert(errData.error || "Failed to upload resume. Make sure you have a profile created first.");
            }
        } catch (err) {
            console.error("Resume upload error", err);
            alert("Could not upload resume. Please try again.");
        } finally {
            setUploading(false);
        }
    };

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

        <Modal show={showResumeModal} onHide={handleResumeClose} centered contentClassName="glass-panel text-light border-0">
          <Modal.Header closeButton closeVariant="white" className="border-bottom border-secondary">
            <Modal.Title className="fw-bold">Upload Your Resume</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <p className="text-muted mb-3" style={{ fontSize: "0.9rem" }}>
              Upload your resume so that your connections can download it. This is optional - you can always upload later.
            </p>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Select PDF Resume</Form.Label>
              <Form.Control
                type="file"
                accept=".pdf"
                ref={resumeFileRef}
                className="custom-input"
              />
              <Form.Text className="text-muted" style={{ fontSize: "0.8rem" }}>
                Maximum file size: 10MB. PDF format only.
              </Form.Text>
            </Form.Group>
            <div className="d-flex gap-2">
              <Button 
                className="btn-glow flex-grow-1" 
                onClick={handleResumeUpload}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload Resume"}
              </Button>
              <Button 
                variant="outline-secondary" 
                className="flex-grow-1"
                onClick={handleResumeClose}
                disabled={uploading}
              >
                Skip for Now
              </Button>
            </div>
          </Modal.Body>
        </Modal>
    </div>
    )
}



