import { AuthContext } from "../../contexts/AuthContext";
import { TaskContext } from "../../contexts/TaskContext";
import { CommentContext } from "../../contexts/CommentContext";
import { useContext } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import moment from "moment";
import pin from "../../assets/pin.svg";
const SinglePost = ({
  task: { _id, status, taskName, assignBy, assignTo, dateDue, createAt },
}) => {
  const {
    authState: {
      user: { username },
    },
  } = useContext(AuthContext);

  const { findTask, setShowUpdateTaskModal } = useContext(TaskContext);
  const {
    commentState: { comments, commentsLoading },
    getComments,
  } = useContext(CommentContext);

  const chooseTask = (taskId) => {
    findTask(taskId);
    getComments(taskId);
    setShowUpdateTaskModal(true);
  };
  return (
    <Card
      className="shadow"
      border={status ? "success" : "danger"}
      style={{ cursor: "pointer" }}
      onClick={chooseTask.bind(this, _id)}
    >
      <Card.Body>
        <Card.Title>
          <Row>
            <Col>
              <img src={pin} alt="add-post" width="20" height="20" />
              <p className="post-title">{taskName}</p>
              <div
                className={status ? "bg-success rounded" : "bg-danger rounded"}
              >
                {status ? "Hoàn thành" : "Chưa hoàn thành"}
              </div>
            </Col>
          </Row>
        </Card.Title>
        <Card.Text>
          {assignTo.length ? (
            <div
              className={
                assignTo.every((member) => member.username === username)
                  ? "bg-warning rounded"
                  : ""
              }
            >
              Giao cho {assignTo.map((member) => member.username)}
            </div>
          ) : (
            "Chưa được giao"
          )}
        </Card.Text>
        <Card.Text>
          Tạo lúc {moment(createAt).format("h:mm:ss a, DD-MM-YYYY")}
        </Card.Text>
        <Card.Text>
          {dateDue ? (
            <div>
              Ngày hết hạn {moment(dateDue).format("h:mm:ss a, DD-MM-YYYY")}
            </div>
          ) : (
            "Không có hạn"
          )}
        </Card.Text>
        <Card.Text>Giao bởi {assignBy.username}</Card.Text>
      </Card.Body>
    </Card>
  );
};
export default SinglePost;
