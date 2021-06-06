import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useContext, useState } from "react";
import { ProjectContext } from "../../contexts/ProjectContext";

const AddProjectModal = () => {
  // Contexts
  const {
    showAddProjectModal,
    setShowAddProjectModal,
    addProject,
    setShowToast,
  } = useContext(ProjectContext);

  // State
  const [newProject, setNewProject] = useState({
    projectName: "",
  });

  const { projectName } = newProject;

  const onChangeNewProjectForm = (event) =>
    setNewProject({ ...newProject, [event.target.name]: event.target.value });

  const closeDialog = () => {
    resetAddProjectData();
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const { success, note } = await addProject(newProject);
    resetAddProjectData();
    setShowToast({ show: true, note, type: success ? "success" : "danger" });
  };

  const resetAddProjectData = () => {
    setNewProject({ projectName: "" });
    setShowAddProjectModal(false);
  };

  return (
    <Modal show={showAddProjectModal} onHide={closeDialog}>
      <Modal.Header closeButton>
        <Modal.Title>Nhập tên dự án mới</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Tên dự án"
              name="projectName"
              required
              aria-describedby="title-help"
              value={projectName}
              onChange={onChangeNewProjectForm}
            />
            <Form.Text id="title-help" muted>
              Tên không được để trống
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDialog}>
            Hủy
          </Button>
          <Button variant="primary" type="submit">
            Thêm
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddProjectModal;
