import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, useHistory } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import AlertMessage from "../layout/AlertMessage";

const RegisterForm = () => {
  // Context
  const { registerUser } = useContext(AuthContext);

  //router
  const history = useHistory();

  // Local state
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  const [alert, setAlert] = useState(null);

  const { username, password, confirmPassword, email } = registerForm;

  const onChangeRegisterForm = (event) =>
    setRegisterForm({
      ...registerForm,
      [event.target.name]: event.target.value,
    });

  const register = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setAlert({ type: "danger", message: "Mật Khẩu Không Khớp" });
      setTimeout(() => setAlert(null), 5000);
      return;
    }

    if (password.length < 6 || username.length < 6) {
      setAlert({ type: "danger", message: "Tài khoản và mật khẩu phải tối thiểu 6 ký tự" });
      setTimeout(() => setAlert(null), 3000);
      return;
    }


    try {
      const registerData = await registerUser(registerForm);
      if (registerData.success) {
        history.push(
          "/login",
          setAlert({ type: "success", message: registerData.note })
        );
      } else {
        setAlert({ type: "danger", message: registerData.note });
        setTimeout(() => setAlert(null), 5000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Form className="my-4" onSubmit={register}>
        <AlertMessage info={alert} />

        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Username"
            name="username"
            required
            value={username}
            onChange={onChangeRegisterForm}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            required
            value={password}
            onChange={onChangeRegisterForm}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            required
            value={confirmPassword}
            onChange={onChangeRegisterForm}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            type="email"
            placeholder="Email"
            name="email"
            required
            value={email}
            onChange={onChangeRegisterForm}
          />
        </Form.Group>
        <Button variant="success" type="submit">
          Register
        </Button>
      </Form>
      <p>
        Bạn đã có tài khoản?
        <Link to="/login">
          <Button variant="info" size="sm" className="ml-2">
            Đăng nhập
          </Button>
        </Link>
      </p>
    </>
  );
};

export default RegisterForm;
