import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const About = () => {
  return (
    <>
      <Row className="mt-5" style={{ marginRight: 0 }}>
        <Col className="text-center">
          <Button variant="info" href="https://github.com/vippr1237" size="lg">
            Github của tôi &#128049;
          </Button>
        </Col>
      </Row>
      <Row className="mt-5" style={{ marginRight: 0 }}>
        <Col className="text-center">
          <Button variant="info" href="https://github.com/vippr1237" size="lg">
            Source Code
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default About;
