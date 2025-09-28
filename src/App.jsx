// App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
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
import TransitionScreen from "./components/TransitionScreen";
import PageWrapper from "./components/PageWrapper";

function AppContent() {
  const location = useLocation();
  const [showTransition, setShowTransition] = useState(true);

  useEffect(() => {
    setShowTransition(true);
    const timer = setTimeout(() => setShowTransition(false), 1500); // 1.5 seconds
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <AnimatePresence mode="wait">
        {showTransition ? (
          <TransitionScreen key="transition" />
        ) : (
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageWrapper>
                  <Home />
                </PageWrapper>
              }
            >
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <PageWrapper>
                      <Dashboard />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="projects"
                element={
                  <ProtectedRoute>
                    <PageWrapper>
                      <Projects />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="Tasks"
                element={
                  <ProtectedRoute>
                    <PageWrapper>
                      <TaskList />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="add"
                element={
                  <ProtectedRoute>
                    <PageWrapper>
                      <AddItem />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <PageWrapper>
                      <Profile />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="edit/:id"
                element={
                  <ProtectedRoute>
                    <PageWrapper>
                      <EditItem />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="settings"
                element={
                  <ProtectedRoute>
                    <PageWrapper>
                      <Settings />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="projects/:id"
                element={
                  <ProtectedRoute>
                    <PageWrapper>
                      <ProjectDetails />
                    </PageWrapper>
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Public profile */}
            <Route
              path="/profile/:userId"
              element={
                <PageWrapper>
                  <PublicProfile />
                </PageWrapper>
              }
            />

            {/* Auth */}
            <Route
              path="/auth/:type"
              element={
                <PageWrapper>
                  <Auth />
                </PageWrapper>
              }
            />
          </Routes>
        )}
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
