import { Route } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Spinner from "react-bootstrap/Spinner";
import NavbarMenu from "../layout/NavbarMenu";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const {
    authState: { authLoading, isAuthenticated, user },
  } = useContext(AuthContext);

  if (authLoading)
    return (
      <div className="spinner-container">
        <Spinner animation="border" variant="info" />
      </div>
    );

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated && user._id == "60be4a7f134e73425cc70117" ? (
          <>
            <NavbarMenu />
            <Component {...rest} {...props} />
          </>
        ) : (
          <>
            <NavbarMenu />
            <h1>Bạn không được truy cập trang này</h1>
          </>
        )
      }
    />
  );
};

export default PrivateRoute;
