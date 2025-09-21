import { Card, CardContent } from "../components/Card";
import { CheckSquare, ListTodo, Calendar, BarChart2 } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { db } from "../../firebaseconfig"; 
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

// const taskCompletionData = [
//   { month: "Jan", completed: 30, pending: 20 },
//   { month: "Feb", completed: 45, pending: 15 },
//   { month: "Mar", completed: 50, pending: 10 },
//   { month: "Apr", completed: 70, pending: 5 },
//   { month: "May", completed: 60, pending: 20 },
// ];

export default function Dashboard() {
  const [tasks , setTasks] = useState([]);
  const [stats , setStats] = useState({
    completed: 0,
    pending: 0,
    dueToday: 0,
  });
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    const fetchTasks = async () => {
      const snapshot = await getDocs(collection(db, "tasks"));
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);

      // 🔹 Process stats
      const today = new Date().toISOString().split("T")[0];
      const completed = tasksData.filter((t) => t.status === "completed").length;
      const pending = tasksData.filter((t) => t.status !== "completed").length;
      const dueToday = tasksData.filter(
        (t) => t.dueDate && t.dueDate.split("T")[0] === today
      ).length;

      setStats({ completed, pending, dueToday });

      // 🔹 Build chart data by month
      const grouped = {};
      tasksData.forEach((t) => {
        const month = new Date(t.dueDate || new Date()).toLocaleString("default", {
          month: "short",
        });
        if (!grouped[month]) grouped[month] = { month, completed: 0, pending: 0 };
        if (t.status === "completed") {
          grouped[month].completed++;
        } else {
          grouped[month].pending++;
        }
      });

      setChartData(Object.values(grouped));
    };

    fetchTasks();
  }, []);
  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-gray-600">Overview of your tasks and progress</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl shadow p-4 bg-white flex items-center gap-4">
          <CheckSquare className="text-blue-500" size={30} />
          <CardContent>
            <h2 className="text-lg font-semibold text-gray-800">Completed</h2>
            <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow p-4 bg-white flex items-center gap-4">
          <ListTodo className="text-yellow-500" size={30} />
          <CardContent>
            <h2 className="text-lg font-semibold text-gray-800">Pending</h2>
            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow p-4 bg-white flex items-center gap-4">
          <Calendar className="text-green-500" size={30} />
          <CardContent>
            <h2 className="text-lg font-semibold text-gray-800">Due Today</h2>
            <p className="text-2xl font-bold text-gray-900">{stats.dueToday}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line Chart */}
        <Card className="rounded-2xl shadow p-4 bg-white">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart2 className="text-blue-500" size={20} />
            Task Completion Trend
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="completed" stroke="#3b82f6" />
              <Line type="monotone" dataKey="pending" stroke="#facc15" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Bar Chart */}
        <Card className="rounded-2xl shadow p-4 bg-white">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart2 className="text-green-500" size={20} />
            Monthly Tasks
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#3b82f6" />
              <Bar dataKey="pending" fill="#facc15" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
