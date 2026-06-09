import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

export default function About() {
  const features = [
    {
      title: "Our Mission",
      description: "To bridge the gap between talented individuals and career milestones by nurturing meaningful interactions."
    },
    {
      title: "Elevate Networks",
      description: "Establish robust, dynamic links with industry pioneers, software developers, AI researchers, and marketers."
    },
    {
      title: "Interactive Collaboration",
      description: "Connect instantly with peer members, share feedback, and discover mutual growth areas."
    },
    {
      title: "Talent Showcases",
      description: "Broadcast your expertise, portfolio, and credentials to catch the eye of potential recruiters and partners."
    }
  ];

  return (
    <section id="about" style={{ padding: "3rem 0", color: "white" }}>
      <Container>
        <div className="text-center mb-5">
          <h2 className="display-4 fw-bold" style={{ textShadow: "0 4px 12px rgba(0,0,0,0.6)", color: "var(--text-light)" }}>About CareerLink</h2>
          <p className="lead mx-auto text-light opacity-75" style={{ maxWidth: "700px", fontSize: "1.1rem" }}>
            CareerLink is a premier single-page platform designed to connect professionals, students, and recruiters. We empower individuals to build meaningful, interactive networks that pave the way for future opportunities.
          </p>
        </div>
        <Row className="g-4">
          {features.map((feature, idx) => (
            <Col md={6} lg={3} key={idx}>
              <Card 
                style={{ 
                  borderRadius: "1.5rem",
                  height: "100%"
                }}
                className="text-light h-100 shadow-sm p-3 glass-panel"
              >
                <Card.Body className="d-flex flex-column justify-content-between text-start">
                  <div>
                    <Card.Title className="fs-4 fw-bold mb-2" style={{ color: "var(--accent-cyan)" }}>{feature.title}</Card.Title>
                    <Card.Text style={{ opacity: 0.85, fontSize: "0.95rem", lineHeight: "1.6" }}>
                      {feature.description}
                    </Card.Text>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

