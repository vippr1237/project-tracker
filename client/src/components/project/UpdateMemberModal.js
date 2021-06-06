import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useContext, useState, useEffect } from "react";
import { ProjectContext } from "../../contexts/ProjectContext";

const UpdatePostModal = () => {
  // Contexts
  const {
    projectState: { project },
    showUpdateProjectModal,
    setShowUpdateProjectModal,
    updateMembers,
    setShowToast,
  } = useContext(ProjectContext);
  // State
  const [updatedProject, setUpdatedProject] = useState({
    ...project,
    members: project.members,
  });

  useEffect(
    () => setUpdatedProject({ ...project, members: project.members }),
    [project]
  );
  const [input, setInput] = useState("");

  const { members } = updatedProject;

  const onInputChange = (event) => {
    setInput(event.target.value);
  };
  const addMemberState = (event) => {
    event.preventDefault();
    setUpdatedProject({
      ...updatedProject,
      members: [...members, { username: input }],
    });
    setInput("");
  };
  const deleteMemberState = (event) => {
    setUpdatedProject({
      ...updatedProject,
      members: updatedProject.members.filter(
        (member) => member.username !== event.target.name
      ),
    });
  };
  const closeDialog = () => {
    setUpdatedProject(project);
    setShowUpdateProjectModal(false);
  };

  const onSave = async (event) => {
    event.preventDefault();
    let newComment = {
      _id: updatedProject._id,
      members: updatedProject.members.map((member) => member.username),
    };
    const { success, note } = await updateMembers(newComment);
    setShowUpdateProjectModal(false);
    setShowToast({ show: true, note, type: success ? "success" : "danger" });
  };

  return (
    <Modal show={showUpdateProjectModal} onHide={closeDialog}>
      <Modal.Header closeButton>
        <Modal.Title>Quản Lý Thành Viên</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={addMemberState}>
          <Form.Group>
            <input
              type="text"
              placeholder="Thêm thành viên mới"
              name="memberName"
              value={input}
              required
              aria-describedby="title-help"
              onChange={onInputChange}
            />
            <Button variant="primary" type="submit">
              Thêm
            </Button>
          </Form.Group>
        </Form>
        Thành Viên
        {updatedProject.members.length > 0 ? (
          updatedProject.members.map((member) => (
            <li className="list-group-item">
              {member.username}
              <Button
                variant="danger"
                name={member.username}
                onClick={deleteMemberState}
              >
                X
              </Button>
            </li>
          ))
        ) : (
          <h5>Không có thành viên</h5>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeDialog}>
          Hủy
        </Button>
        <Button variant="primary" onClick={onSave}>
          Lưu
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdatePostModal;
