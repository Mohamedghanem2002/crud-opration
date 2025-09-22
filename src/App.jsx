// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
// import Tasks from "./pages/Tasks";
import TaskList from "./pages/TaskList";
import Home from "./pages/Home";
import Auth from "./pages/AuthPage";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import Profile from "./pages/Profile";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicProfile from "./pages/PublicProfile";
import ProjectDetails from "./pages/ProjectDetails";
import Settings from "./pages/Settings";
function App() {

  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />
          <Route path="/projects/:id" element={<ProjectDetails />} />

          <Route
            path="Tasks"
            element={
              <ProtectedRoute>
                <TaskList />
              </ProtectedRoute>
            }
          />
          <Route
            path="add"
            element={
              <ProtectedRoute>
                <AddItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="edit/:id"
            element={
              <ProtectedRoute>
                <EditItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/profile/:userId" element={<PublicProfile />} />

        <Route path="/auth/:type" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
