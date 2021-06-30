import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useContext, useState, useEffect } from "react";
import { TaskContext } from "../../contexts/TaskContext";
import { ProjectContext } from "../../contexts/ProjectContext";

const AddTaskModal = (props) => {
  // Contexts
  const {
    showAddTaskModal,
    setShowAddTaskModal,
    addTask,
    setShowToastTask,
    getTasks,
  } = useContext(TaskContext);
  const {
    projectState: { project },
    findProject,
  } = useContext(ProjectContext);
  // State
  const [newTask, setNewTask] = useState({
    taskName: "",
    projectId: props.projectId,
    dateDue: "",
    assignTo: [],
  });

  useEffect(() => findProject(props.projectId), []);

  const { taskName, dateDue, assignTo } = newTask;

  const onChangeNewTaskForm = (event) =>
    setNewTask({
      ...newTask,
      [event.target.name]: event.target.value,
    });

  const closeDialog = () => {
    resetAddPostData();
  };

  const onSubmit = async (event) => {
    let body = {
      taskName: newTask.taskName,
      projectId: newTask.projectId,
      dateDue: newTask.dateDue,
      assignTo: Array.isArray(newTask.assignTo)
        ? newTask.assignTo
        : [newTask.assignTo],
    };
    event.preventDefault();
    const { success, note } = await addTask(body);
    resetAddPostData();
    setShowToastTask({
      showTask: true,
      noteTask: note,
      typeTask: success ? "success" : "danger",
    });
    getTasks(newTask.projectId);
  };

  const resetAddPostData = () => {
    setNewTask({
      projectId: props.projectId,
      taskName: "",
      dateDue: "",
      assignTo: [],
    });
    setShowAddTaskModal(false);
  };

  return (
    <Modal show={showAddTaskModal} onHide={closeDialog}>
      <Modal.Header closeButton>
        <Modal.Title>Công việc mới</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Text>Tên </Form.Text>
            <Form.Control
              type="text"
              placeholder="Tên công việc"
              name="taskName"
              required
              aria-describedby="title-help"
              value={taskName}
              onChange={onChangeNewTaskForm}
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
              value={dateDue}
              onChange={onChangeNewTaskForm}
            />
          </Form.Group>
          <Form.Group>
            <Form.Text>Giao Cho</Form.Text>
            <Form.Control
              className="border-red"
              as="select"
              value={assignTo}
              name="assignTo"
              onChange={onChangeNewTaskForm}
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
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeDialog}>
            Hủy
          </Button>
          <Button variant="primary" type="submit">
            Tạo Công Việc
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddTaskModal;
