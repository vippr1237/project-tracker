import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import trash from "../../assets/trash.svg";
import userIcon from "../../assets/user.svg";
import { useContext, useState, useEffect } from "react";
import { TaskContext } from "../../contexts/TaskContext";
import { ProjectContext } from "../../contexts/ProjectContext";
import { CommentContext } from "../../contexts/CommentContext";
import { DataContext } from "../../GlobalState";
import moment from "moment";
import Spinner from "react-bootstrap/Spinner";

const UpdateTaskModal = (props) => {
  // Contexts
  const {
    taskState: { task },
    deleteTask,
    updateTask,
    showUpdateTaskModal,
    setShowUpdateTaskModal,
    setShowToastTask,
    getTasks,
  } = useContext(TaskContext);
  const {
    projectState: { project },
  } = useContext(ProjectContext);
  const {
    commentState: { comments, commentsLoading },
    getComments,
    addComment,
    deleteComment,
  } = useContext(CommentContext);
  const state = useContext(DataContext);
  // State
  const [updatedTask, setUpdatedTask] = useState({
    _id: task._id,
    taskName: task.taskName,
    dateDue: task.dateDue,
    assignTo: task.assignTo,
    status: task.status,
  });
  const [input, setInput] = useState("");
  const socket = state.socket;
  useEffect(
    () =>
      setUpdatedTask({
        _id: task._id,
        taskName: task.taskName,
        dateDue: task.dateDue,
        assignTo: task.assignTo,
        status: task.status,
      }),
    [task]
  );
  //joinrooom
  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", task._id);
    }
  }, [socket, task._id]);

  useEffect(() => {
    if (socket) {
      socket.on("sendCommentToClient", (taskId) => {
        getComments(taskId);
      });

      return () => socket.off("sendCommentToClient");
    }
  }, [getComments, socket]);

  const { taskName, dateDue, assignTo, status } = updatedTask;

  const onChangeUpdateTaskForm = (event) =>
    setUpdatedTask({
      ...updatedTask,
      [event.target.name]: event.target.value,
    });

  const closeDialog = () => {
    setUpdatedTask({
      _id: task._id,
      taskName: task.taskName,
      dateDue: task.dateDue,
      assignTo: task.assignTo,
      status: task.status,
    });
    setShowUpdateTaskModal(false);
  };
  const delTask = async (event) => {
    event.preventDefault();
    const { success, note } = await deleteTask(task._id);
    setShowUpdateTaskModal(false);
    setShowToastTask({
      showTask: true,
      noteTask: note,
      typeTask: success ? "success" : "danger",
    });
    getTasks(task.project);
  };
  const onInputChange = (event) => {
    setInput(event.target.value);
  };
  const submitComment = async (event) => {
    event.preventDefault();
    if (input.includes("China")) return;
    let body = {
      body: input,
      taskId: task._id,
    };
    const response = await addComment(body);
    if (response.success) {
      setInput("");
      socket.emit("createComment", task._id);
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    let body = {
      _id: updatedTask._id,
      taskName: updatedTask.taskName,
      dateDue: updatedTask.dateDue,
      assignTo: Array.isArray(updatedTask.assignTo)
        ? updatedTask.assignTo.map((member) => member.username)
        : [updatedTask.assignTo],
      status: updatedTask.status,
    };

    const { success, note } = await updateTask(body);
    setShowUpdateTaskModal(false);
    setShowToastTask({
      showTask: true,
      noteTask: note,
      typeTask: success ? "success" : "danger",
    });
    getTasks(task.project);
  };

  let commentsBody = null;
  if (commentsLoading) {
    commentsBody = (
      <div className="spinner-container">
        <Spinner animation="border" variant="info" />
        Vui lòng đợi...
      </div>
    );
  } else if (comments.length === 0) {
    commentsBody = <h5>Không có bình luận</h5>;
  } else {
    commentsBody = (
      <div className="overflow-auto" style={{ height: "160px" }}>
        {comments.map((comment) => (
          <li className="list-group-item">
            <div>
              <img
                src={userIcon}
                alt="userIcon"
                width="14"
                height="14"
                className="mr-2"
              />
              {comment.user.username}
              <Form.Text className="float-end">
                {moment(comment.createAt).format("h:mm a, DD-MM-YYYY")}
              </Form.Text>
            </div>
            {comment.body}
          </li>
        ))}
      </div>
    );
  }
  return (
    <Modal show={showUpdateTaskModal} onHide={closeDialog}>
      <Modal.Header closeButton>
        <Modal.Title>
          {task.taskName}
          <div
            className={task.status ? "bg-success rounded" : "bg-danger rounded"}
          >
            {task.status ? "Hoàn thành" : "Chưa hoàn thành"}
          </div>
        </Modal.Title>
        <Button className="float-end" variant="danger" onClick={delTask}>
          <img src={trash} alt="deleteTask" width="18" height="18" />
          Xóa
        </Button>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Text>Trạng thái</Form.Text>
            <Form.Control
              as="select"
              value={status}
              name="status"
              onChange={onChangeUpdateTaskForm}
            >
              <option value={false}>Chưa hoàn thành</option>
              <option value={true}>Hoàn thành</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Text>Tên</Form.Text>
            <Form.Control
              type="text"
              placeholder="Tên công việc"
              name="taskName"
              required
              aria-describedby="title-help"
              value={taskName}
              onChange={onChangeUpdateTaskForm}
            />
            <Form.Text id="title-help" muted>
              Tên công việc không được để trống
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Text id="title-help" muted>
              Ngày hết hạn
            </Form.Text>
            <Form.Control
              type="date"
              name="dateDue"
              value={moment(dateDue).format("YYYY-MM-DD")}
              onChange={onChangeUpdateTaskForm}
            />
          </Form.Group>
          <Form.Group>
            <Form.Text>Giao Cho</Form.Text>
            <Form.Control
              as="select"
              value={
                Array.isArray(assignTo)
                  ? assignTo.map((member) => member.username)
                  : assignTo
              }
              name="assignTo"
              onChange={onChangeUpdateTaskForm}
            >
              <option value={new Array(0)}>Không</option>
              {project && (
                <option value={project.owner.username}>
                  {project.owner.username}
                </option>
              )}
              {project &&
                project.members.map((member) => (
                  <option value={member.username}>{member.username}</option>
                ))}
            </Form.Control>
          </Form.Group>
          <Form.Text>Bình luận</Form.Text>
          <Form.Group>
            <input
              type="text"
              placeholder="Thêm bình luận"
              name="comment"
              value={input}
              required
              aria-describedby="title-help"
              onChange={onInputChange}
            />
            <Button variant="primary" onClick={submitComment}>
              Bình luận
            </Button>
          </Form.Group>
          {commentsBody}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeDialog}>
            Hủy
          </Button>
          <Button variant="primary" type="submit">
            Lưu
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UpdateTaskModal;
