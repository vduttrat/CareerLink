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
    let [ hasResume, setHasResume ] = useState(false);
    const resumeFileRef = useRef(null);
 
    const checkResumeStatus = async (token, username) => {
        try {
            const response = await fetch("http://localhost:8080/api/profiles", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const profiles = await response.json();
                const myProfile = profiles.find(p => p.name.toLowerCase() === username.toLowerCase());
                setHasResume(myProfile?.hasResume || false);
            }
        } catch (err) {
            console.error("Failed to check resume status", err);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("name");
        const userDetails = localStorage.getItem("details");
        if (token && username) {
            setName(username);
            setDetails(userDetails || "Interactive Member");
            LogIn(true);
            checkResumeStatus(token, username);
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
            setHasResume(false);
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
        const email = event.currentTarget.elements.email.value;
        const password = event.currentTarget.elements.password.value;
        const userDetails = event.currentTarget.elements.details.value;
 
        try {
            let response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });
 
            if (!response.ok) {
                response = await fetch("http://localhost:8080/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password, details: userDetails })
                });
            }
 
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.username);
                localStorage.setItem("details", data.details || userDetails);
                localStorage.setItem("name",username);
                
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
                setHasResume(true);
                alert("Resume uploaded successfully! Your followers can now download it.");
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
            <p className="fs-6 text-light mb-0" style={{ letterSpacing: "0.05em" }}>{details}</p>
        </div>

        {loggedIn && !hasResume && (
            <button
                className="btn w-100 mb-3"
                onClick={() => setShowResumeModal(true)}
                style={{
                    background: "linear-gradient(135deg, rgba(0,242,254,0.12), rgba(79,172,254,0.12))",
                    color: "var(--accent-cyan)",
                    border: "1px solid rgba(0,242,254,0.3)",
                    borderRadius: "2rem",
                    padding: "0.65rem 1.5rem",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    letterSpacing: "0.03em",
                    transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                    e.target.style.background = "linear-gradient(135deg, rgba(0,242,254,0.25), rgba(79,172,254,0.25))";
                    e.target.style.boxShadow = "0 0 15px rgba(0,242,254,0.2)";
                }}
                onMouseLeave={(e) => {
                    e.target.style.background = "linear-gradient(135deg, rgba(0,242,254,0.12), rgba(79,172,254,0.12))";
                    e.target.style.boxShadow = "none";
                }}
            >
                📄 Upload Resume
            </button>
        )}

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
                  placeholder="Enter your username"
                  autoFocus
                  required
                  className="custom-input"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label className="fw-semibold">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
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
              Upload your resume so that your followers can download it. This is optional - you can always upload later.
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



