import { ProjectContext } from "../../contexts/ProjectContext";
import { AuthContext } from "../../contexts/AuthContext";
import { useState, useContext, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Toast from "react-bootstrap/Toast";
import projectlogo from "../../assets/projectlogo.svg";
import trashicon from "../../assets/trash.svg";
import UpdateMemberModal from "./UpdateMemberModal";
const ProjectBar = (props) => {
  // Contexts
  const {
    authState: { user },
  } = useContext(AuthContext);

  const userId = user._id;
  const {
    projectState: { project },
    findProject,
    updateProject,
    deleteProject,
    setShowUpdateProjectModal,
    showToast: { show, note, type },
    setShowToast,
  } = useContext(ProjectContext);

  const history = useHistory();

  const inputName = useRef("");

  const [updatedProject, setUpdatedProject] = useState({
    projectId: "",
    projectName: "",
    isEditMode: false,
  });
  useEffect(() => findProject(props.projectId), []);
  const changeEditMode = () => {
    setUpdatedProject({
      isEditMode: !updatedProject.isEditMode,
    });
  };
  const updateNameState = () => {
    setUpdatedProject({
      ...updatedProject,
      projectId: props.projectId,
      projectName: inputName.current.value,
    });
  };
  const updateName = async () => {
    const response = await updateProject(updatedProject);
    if (response.success) {
      changeEditMode();
    }
  };
  const renderEditName = () => {
    if (project)
      return (
        <div>
          <input
            type="text"
            defaultValue={project.projectName}
            ref={inputName}
            onChange={updateNameState}
          />
          <Button variant="primary" onClick={updateName}>
            OK
          </Button>
          <Button variant="secondary" onClick={changeEditMode}>
            Hủy
          </Button>
        </div>
      );
  };
  const renderDefaultName = () => {
    if (project)
      return <h4 onDoubleClick={changeEditMode}>{project.projectName}</h4>;
    else return <h4>Không tìm thấy dự án</h4>;
  };

  const delProject = async () => {
    const response = await deleteProject(props.projectId);
    if (response.success)
      history.push(
        "/dashboard",
        setShowToast({ show: true, note: response.note, type: "success" })
      );
  };

  return (
    <>
      {project !== null && <UpdateMemberModal />}
      <Navbar expand="lg" bg="sencondary" variant="dark" className="shadow">
        <Navbar.Brand className="font-weight-bolder text-black">
          <img
            src={projectlogo}
            alt="projectlogo"
            width="28"
            height="28"
            className="mr-2"
          />
        </Navbar.Brand>
        <Nav className="me-auto">
          {updatedProject.isEditMode ? renderEditName() : renderDefaultName()}
        </Nav>

        {project && (
          <Nav className="me-auto">
            <Button
              variant="primary"
              onClick={setShowUpdateProjectModal.bind(this, true)}
            >
              Thành Viên
            </Button>
          </Nav>
        )}

        {project
          ? project.owner._id === userId && (
              <Nav className="mr-auto">
                <Button
                  variant="danger"
                  className="font-weight-bolder text-white"
                  onClick={delProject}
                >
                  <img
                    src={trashicon}
                    alt="logoutIcon"
                    width="24"
                    height="24"
                    className="mr-2"
                  />
                  Xóa dự án
                </Button>
              </Nav>
            )
          : null}
      </Navbar>
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

export default ProjectBar;
