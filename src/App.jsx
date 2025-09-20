// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TaskManagerLayout from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Home from "./pages/Home";
import Auth from "./pages/AuthPage"
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="add" element={<AddItem />} />
          <Route path="edit/:id" element={<EditItem />} />
        </Route>
        <Route path="/auth/:type" element={<Auth />} />
      </Routes>
      <Toaster position="top-right" reverseOrder={false} />
    </BrowserRouter>
  );
}

export default App;