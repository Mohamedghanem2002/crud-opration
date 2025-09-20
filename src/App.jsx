// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
// import Tasks from "./pages/Tasks";
import TaskList from "./pages/TaskList";
import Home from "./pages/Home";
import Auth from "./pages/AuthPage";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />}>
          {/* <Route index element={<Dashboard />} /> */}
          <Route path="dashboard" element={<Dashboard />} />
          {/* <Route path="tasks" element={<Tasks />} /> */}
          <Route path="Tasks" element={<TaskList />} />
          <Route path="add" element={<AddItem />} />
          <Route path="edit/:id" element={<EditItem />} />
        </Route>
        <Route path="/auth/:type" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
