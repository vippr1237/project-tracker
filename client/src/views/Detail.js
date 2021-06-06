import { AuthContext } from "../contexts/AuthContext";
import { TaskContext } from "../contexts/TaskContext";
import { useContext, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Toast from "react-bootstrap/Toast";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Col from "react-bootstrap/Col";
import SingleTask from "../components/task/SingleTask";
import AddTaskModal from "../components/task/AddTaskModal";
import UpdateTaskModal from "../components/task/UpdateTaskModal";
import ProjectBar from "../components/project/ProjectBar";
import addIcon from "../assets/plus-circle-fill.svg";

const Detail = (props) => {
  // Contexts
  const {
    authState: {
      user: { username },
    },
  } = useContext(AuthContext);

  const {
    taskState: { task, tasks, taskLoading },
    getTasks,
    setShowAddTaskModal,
    showToastTask: { showTask, noteTask, typeTask },
    setShowToastTask,
  } = useContext(TaskContext);

  useEffect(() => getTasks(props.match.params.projectId), []);

  let body = null;

  if (taskLoading) {
    body = (
      <div className="spinner-container">
        <Spinner animation="border" variant="info" />
        Vui lòng đợi...
      </div>
    );
  } else if (tasks.length === 0) {
    body = (
      <>
        <h4>Các công việc</h4>
        <Card className="text-center mx-5 my-5">
          <Card.Body>
            <Card.Text>Nhấn nút phía dưới để bắt đầu tạo công việc</Card.Text>
            <Button
              variant="primary"
              onClick={setShowAddTaskModal.bind(this, true)}
            >
              Thêm công việc
            </Button>
          </Card.Body>
        </Card>
      </>
    );
  } else {
    body = (
      <>
        <h4>Các công việc</h4>
        <Row className="row-cols-1 row-cols-md-4 g-4 mx-auto mt-4">
          {tasks.map((task) => (
            <Col key={task._id} className="my-2">
              <SingleTask task={task} />
            </Col>
          ))}
        </Row>

        {/* Open Add Post Modal */}
        <OverlayTrigger
          placement="left"
          overlay={<Tooltip>Thêm công việc mới</Tooltip>}
        >
          <Button
            className="btn-floating"
            onClick={setShowAddTaskModal.bind(this, true)}
          >
            <img src={addIcon} alt="add-post" width="60" height="60" />
          </Button>
        </OverlayTrigger>
      </>
    );
  }
  return (
    <>
      <ProjectBar projectId={props.match.params.projectId} />
      <AddTaskModal projectId={props.match.params.projectId} />
      {task !== null && <UpdateTaskModal />}
      {body}
      <Toast
        show={showTask}
        style={{ position: "fixed", top: "20%", right: "10px" }}
        className={`bg-${typeTask} text-white`}
        onClose={setShowToastTask.bind(this, {
          showTask: false,
          noteTask: "",
          typeTask: null,
        })}
        delay={3000}
        autohide
      >
        <Toast.Body>
          <strong>{noteTask}</strong>
        </Toast.Body>
      </Toast>
    </>
  );
};

export default Detail;
