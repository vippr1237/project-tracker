import Card from "react-bootstrap/Card";
import { useHistory } from "react-router-dom";

const SingleProject = ({ projectName, id }) => {
  const history = useHistory();
  const detail = () => {
    history.push(`/dashboard/${id}`);
  };

  return (
    <Card
      bg="secondary"
      style={{
        width: "14rem",
        height: "7rem",
        padding: "5px",
        cursor: "pointer",
      }}
      onClick={detail}
    >
      <Card.Title>{projectName}</Card.Title>
    </Card>
  );
};

export default SingleProject;
