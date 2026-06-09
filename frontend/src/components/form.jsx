import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';

function CareerlinkForm(prop) {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    setValidated(true);
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    else {
        event.preventDefault();
        let userName    = event.currentTarget[0].value; 
        let proffession = event.currentTarget[2].value; 
        let details     = event.currentTarget[3].value; 
        prop.addRowData([userName, proffession, details]);
        form.reset();
        setValidated(false);
    }
  };

  return (
    <Container className="text-light">
      <div className="glass-panel p-4 mb-4" style={{ textAlign: "left" }}>
        <h3 className="mb-4 text-center fw-bold" style={{ color: "var(--accent-cyan)", letterSpacing: "0.05em" }}>Add Your Profile</h3>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" id="username">
            <Form.Label className="fw-semibold">Name</Form.Label>
            <Form.Control type="text" placeholder="Enter name" required className="custom-input" />
          </Form.Group>

          <Form.Group className="mb-3" id="email">
            <Form.Label className="fw-semibold">Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" required className="custom-input" />
          </Form.Group>

          <Form.Group className="mb-3" id="profession">
            <Form.Label className="fw-semibold">Profession</Form.Label>
            <Form.Select required className="custom-select">
                <option value="" disabled>Select Profession</option>
                <option value="AI Engineer">AI Engineer</option>
                <option value="Student">Student</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Teacher">Teacher</option>
                <option value="Software Developer">Software Developer</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" id="details">
            <Form.Label className="fw-semibold">Other details</Form.Label>
            <Form.Control type="text" placeholder="Details (e.g. LIT2025016)" required className="custom-input" />
          </Form.Group>

          <Form.Group className="mb-4" id="termsandconds">
            <Form.Check type="checkbox" label="Agree to terms and conditions" required className="fs-6" />
          </Form.Group>
          <div className="text-center">
            <Button type="submit" className="btn-glow">
              Register Profile
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
}

export default CareerlinkForm;

