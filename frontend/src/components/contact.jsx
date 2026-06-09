import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

export default function Contact() {
  const [validated, setValidated] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      const fullName = localStorage.getItem("username") || "Anonymous";
      const subject = "Contact Form Submission";
      const message = form.elements[0].value;

      try {
        const response = await fetch("http://localhost:8080/api/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fullName, subject, message })
        });

        if (response.ok) {
          setSuccess(true);
          setValidated(false);
          form.reset();
          setTimeout(() => setSuccess(false), 5000);
        } else {
          alert("Failed to submit message. Please try again.");
        }
      } catch (err) {
        console.error("Error submitting contact message", err);
        alert("Unable to communicate with the contact service.");
      }
    }
  };

  return (
    <section id="contact" style={{ padding: "4rem 0", color: "white" }}>
      <Container>
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold mb-3">Contact Us</h2>
          <p className="lead mx-auto text-light opacity-75" style={{ maxWidth: "600px" }}>
            Have questions, feedback, or ideas? We'd love to hear from you.
          </p>
        </div>

        <Row className="justify-content-center">
          <Col lg={8} xl={7}>
            <div className="glass-panel text-start p-4 p-md-5">
              {success && (
                <Alert variant="success" className="border-0 text-center mb-4" style={{ backgroundColor: "rgba(46, 213, 115, 0.2)", color: "#2ed573" }}>
                  Thank you! Your message has been sent successfully.
                </Alert>
              )}

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-4" id="contact-message">
                  <Form.Label className="fw-semibold">Message</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={6} 
                    placeholder="Type your message here..." 
                    required 
                    className="custom-input"
                  />
                </Form.Group>

                <div className="text-center">
                  <Button 
                    type="submit" 
                    className="btn-glow px-5 py-2 fw-bold text-uppercase tracking-wider w-100-mobile"
                  >
                    Send Message
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

