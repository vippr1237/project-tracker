import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { useState, useEffect } from "react";

const Admin = () => {
  const [statistic, setStatistic] = useState({
    projects: 0,
    tasks: 0,
    users: 0,
  });
  const getStatistic = async () => {
    const response = await axios.get("/api/admin");
    if (response.data.success) {
      setStatistic({
        projects: response.data.projects,
        tasks: response.data.tasks,
        users: response.data.users,
      });
    }
  };
  useEffect(() => getStatistic(), []);
  return (
    <>
      <Row className="mt-5" style={{ marginRight: 0 }}>
        <Col className="">Số dự án được tạo: {statistic.projects}</Col>
      </Row>
      <Row className="mt-5" style={{ marginRight: 0 }}>
        <Col className="">Số công việc được tạo: {statistic.tasks}</Col>
      </Row>
      <Row className="mt-5" style={{ marginRight: 0 }}>
        <Col className="">Số người dùng: {statistic.users}</Col>
      </Row>
    </>
  );
};

export default Admin;
