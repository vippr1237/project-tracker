import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import learnItLogo from "../../assets/logo.svg";
import logoutIcon from "../../assets/logout.svg";
import userIcon from "../../assets/user.svg";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";

const NavbarMenu = () => {
  const {
    authState: {
      user: { username },
    },
    logoutUser,
  } = useContext(AuthContext);

  const logout = () => logoutUser();

  return (
    <Navbar expand="lg" bg="primary" variant="dark" className="shadow">
      <Navbar.Brand className="font-weight-bolder text-white">
        <img
          src={learnItLogo}
          alt="learnItLogo"
          width="32"
          height="32"
          className="mr-2"
        />
        DT
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link
            className="font-weight-bolder text-white"
            to="/dashboard"
            as={Link}
          >
            Dự Án
          </Nav.Link>
          <Nav.Link
            className="font-weight-bolder text-white"
            to="/about"
            as={Link}
          >
            Về chúng tôi
          </Nav.Link>
        </Nav>

        <Nav>
          <Nav.Link className="font-weight-bolder text-white" disabled>
            <span className="p-3">Chào</span>
            <img
              src={userIcon}
              alt="userIcon"
              width="28"
              height="28"
              className="mr-2"
            />
            {username}
          </Nav.Link>
          <Button
            variant="secondary"
            className="font-weight-bolder text-white"
            onClick={logout}
          >
            <img
              src={logoutIcon}
              alt="logoutIcon"
              width="24"
              height="24"
              className="mr-2"
            />
            Đăng xuất
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarMenu;
