import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TaskManagerLayout from "./components/Navbar/Navbar";
import Dashboard from "./pages/Dashboard";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/" element={<TaskManagerLayout />}>
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="add" element={<AddItem />} />
          <Route path="edit/:id" element={<EditItem />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
