// src/App.jsx
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

function RoutesWithAnimation() {
  const location = useLocation();

  return (
    // AnimatePresence حول العناصر اللي هتتغير (باستخدام location + key)
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* root layout (Home) — لا تضع PageWrapper هنا إذا ستلف الأطفال كذلك */}
        <Route path="/" element={<Home />}>
          {/* MAIN PAGES — كل صفحة ملفوفة مرة واحدة بواسطة PageWrapper */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <PageWrapper direction="y">
                  <Dashboard />
                </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="projects"
            element={
              <ProtectedRoute>
                <PageWrapper direction="y">
                  <Projects />
                </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="Tasks"
            element={
              <ProtectedRoute>
                <PageWrapper direction="y">
                  <TaskList />
                </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <PageWrapper direction="y">
                  <Settings />
                </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <PageWrapper direction="y">
                  <Profile />
                </PageWrapper>
              </ProtectedRoute>
            }
          />

          {/* Other pages — يمكنك اختيار إنك تلفّهم بـ PageWrapper أو لا */}
          <Route
            path="add"
            element={
              <ProtectedRoute>
                <PageWrapper direction="y">
                  <AddItem />
                </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="edit/:id"
            element={
              <ProtectedRoute>
                <PageWrapper direction="y">
                  <EditItem />
                </PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="projects/:id"
            element={
              <ProtectedRoute>
                <PageWrapper direction="y">
                  <ProjectDetails />
                </PageWrapper>
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Public profile and Auth — تقدر تخلي Auth ييجي من اليمين */}
        <Route
          path="/profile/:userId"
          element={
            <PageWrapper direction="y">
              <PublicProfile />
            </PageWrapper>
          }
        />
        <Route
          path="/auth/:type"
          element={
            <PageWrapper direction="x">
              <Auth />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [showTransition, setShowTransition] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowTransition(false), 1200); // splash 1.2s
    return () => clearTimeout(timer);
  }, []);

  if (showTransition) {
    return <TransitionScreen />; // يظهر مرة واحدة فقط عند الفتح
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <RoutesWithAnimation />
    </BrowserRouter>
  );
}
