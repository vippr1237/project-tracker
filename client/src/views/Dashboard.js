import { ProjectContext } from "../contexts/ProjectContext";
import { AuthContext } from "../contexts/AuthContext";
import { useContext, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Toast from "react-bootstrap/Toast";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Col from "react-bootstrap/Col";
import SingleProject from "../components/project/SingleProject";
import AddProjectModal from "../components/project/AddProjectModal";
import addIcon from "../assets/plus-circle-fill.svg";

const Dashboard = () => {
  // Contexts
  const {
    authState: {
      user: { username },
    },
  } = useContext(AuthContext);

  const {
    projectState: { ownprojects, guessprojects, projectsLoading },
    getOwnProjects,
    getGuessProjects,
    setShowAddProjectModal,
    showToast: { show, note, type },
    setShowToast,
  } = useContext(ProjectContext);

  // Start: Get all posts
  useEffect(() => getOwnProjects(), []);
  useEffect(() => getGuessProjects(), []);

  let body = null;

  if (projectsLoading) {
    body = (
      <div className="spinner-container">
        <Spinner animation="border" variant="info" />
      </div>
    );
  } else if (ownprojects.length === 0) {
    body = (
      <>
        <Card className="text-center mx-5 my-5">
          <Card.Header as="h1">Chào {username}</Card.Header>
          <Card.Body>
            <Card.Title>Chào mừng tới DoT</Card.Title>
            <Card.Text>Nhấn nút phía dưới để bắt đầu tạo dự án</Card.Text>
            <Button
              variant="primary"
              onClick={setShowAddProjectModal.bind(this, true)}
            >
              Thêm dự án mới
            </Button>
          </Card.Body>
        </Card>
        <h1>Dự án khách</h1>
        <Row className="row-cols-1 row-cols-md-6 g-4 mx-auto mt-3">
          {guessprojects.length > 0 &&
            guessprojects.map((project) => (
              <Col key={project._id} className="my-2">
                <SingleProject
                  projectName={project.projectName}
                  id={project._id}
                />
              </Col>
            ))}
          {guessprojects.length === 0 && (
            <Col className="my-2">Không có dự án khách</Col>
          )}
        </Row>
      </>
    );
  } else {
    body = (
      <>
        <h1>Dự án của bạn</h1>
        <Row className="row-cols-1 row-cols-md-6 g-4 mx-auto mt-3">
          {ownprojects.map((project) => (
            <Col key={project._id} className="my-2">
              <SingleProject
                projectName={project.projectName}
                id={project._id}
              />
            </Col>
          ))}
        </Row>

        <h1>Dự án khách</h1>
        <Row className="row-cols-1 row-cols-md-6 g-4 mx-auto mt-3">
          {guessprojects.length > 0 &&
            guessprojects.map((project) => (
              <Col key={project._id} className="my-2">
                <SingleProject
                  projectName={project.projectName}
                  id={project._id}
                />
              </Col>
            ))}
          {guessprojects.length === 0 && (
            <Col className="my-2">Không có dự án khách</Col>
          )}
        </Row>

        {/* Open Add Post Modal */}
        <OverlayTrigger
          placement="left"
          overlay={<Tooltip>Thêm dự án mới</Tooltip>}
        >
          <Button
            className="btn-floating"
            onClick={setShowAddProjectModal.bind(this, true)}
          >
            <img src={addIcon} alt="add-post" width="60" height="60" />
          </Button>
        </OverlayTrigger>
      </>
    );
  }

  return (
    <>
      {body}
      <AddProjectModal />
      <Toast
        show={show}
        style={{ position: "fixed", top: "20%", right: "10px" }}
        className={`bg-${type} text-white`}
        onClose={setShowToast.bind(this, {
          show: false,
          note: "",
          type: null,
        })}
        delay={3000}
        autohide
      >
        <Toast.Body>
          <strong>{note}</strong>
        </Toast.Body>
      </Toast>
    </>
  );
};

export default Dashboard;
