import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Landing from "./components/layout/Landing";
import Auth from "./views/Auth";
import AuthContextProvider from "./contexts/AuthContext";
import Dashboard from "./views/Dashboard";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import About from "./views/About";
import ProjectContextProvider from "./contexts/ProjectContext";
import TaskContextProvider from "./contexts/TaskContext";
import CommentContextProvider from "./contexts/CommentContext";
import Detail from "./views/Detail";

function App() {
  return (
    <AuthContextProvider>
      <ProjectContextProvider>
        <TaskContextProvider>
          <CommentContextProvider>
            <Router>
              <Switch>
                <Route exact path="/" component={Landing} />
                <Route
                  exact
                  path="/login"
                  render={(props) => <Auth {...props} authRoute="login" />}
                />
                <Route
                  exact
                  path="/register"
                  render={(props) => <Auth {...props} authRoute="register" />}
                />
                <ProtectedRoute exact path="/dashboard" component={Dashboard} />
                <ProtectedRoute exact path="/about" component={About} />
                <ProtectedRoute
                  exact
                  path="/dashboard/:projectId"
                  component={Detail}
                />
              </Switch>
            </Router>
          </CommentContextProvider>
        </TaskContextProvider>
      </ProjectContextProvider>
    </AuthContextProvider>
  );
}

export default App;
