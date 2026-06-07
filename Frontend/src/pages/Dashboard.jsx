import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios.js";
import TaskForm from "../Components/TaskForm";
import TaskCard from "../Components/TaskCard";
import { toast } from 'react-toastify';
import "../styles/Dashboard.css";

const parseJwt = (token) => {
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  const userName = useMemo(() => {
    const token = localStorage.getItem("token");
    const decoded = parseJwt(token);
    return decoded?.user?.name || decoded?.name || "Task Master";
  }, []);

  const stats = useMemo(
    () => ({
      total: tasks.length,
      pending: tasks.filter((task) => task.status === "pending").length,
      completed: tasks.filter((task) => task.status === "completed").length,
    }),
    [tasks]
  );

  const logOutUser = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data.tasks || []);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      toast.error(error.response?.data?.message || "Failed to fetch tasks");
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  const handleAddTask = async (taskData) => {
    try {
      const res = await API.post("/tasks", taskData);
      setTasks((prev) => [...prev, res.data.task]);
      toast.success("Task added successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create task");
      console.error(error.response?.data || error.message);
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      const res = await API.put(`/tasks/${id}`, taskData);
      setTasks((prev) => prev.map((task) => (task._id === id ? res.data.task : task)));
      setEditingTask(null);
      toast.success("Task updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update task");
      console.error(error.response?.data || error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      toast.success("Task deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete task");
      console.error(error.response?.data || error.message);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await API.patch(`/tasks/${id}/status`);
      setTasks((prev) => prev.map((task) => (task._id === id ? res.data.task : task)));
      toast.success("Task status updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update status");
      console.error(error.response?.data || error.message);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || task.status === filter;
    return matchesSearch && matchesFilter;
  });

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  return (
    <div className="dashboard-page">
      <div className="dashboard-hero glass-panel">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Hi, {userName}</h1>
          <p className="hero-copy">Your task pipeline, organized and ready to move.</p>
        </div>

        <button className="btn btn-secondary logout-btn" onClick={logOutUser}>
          Sign out
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-tile">
          <div className="stat-icon">📊</div>
          <span>Total tasks</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="stat-tile">
          <div className="stat-icon">⏳</div>
          <span>Pending</span>
          <strong>{stats.pending}</strong>
        </div>
        <div className="stat-tile">
          <div className="stat-icon">✅</div>
          <span>Completed</span>
          <strong>{stats.completed}</strong>
        </div>
      </div>

      <section className="dashboard-grid">
        <div className="panel-panel glass-panel task-editor-panel">
          <div className="panel-header">
            <p className="eyebrow">Create & update</p>
            <h2>{editingTask ? 'Update task' : 'New task'}</h2>
          </div>

          <TaskForm
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            editingTask={editingTask}
            onCancelEdit={() => setEditingTask(null)}
          />
        </div>

        <div className="panel-panel glass-panel task-list-panel">
          <div className="panel-header">
            <p className="eyebrow">Task list</p>
            <h2>My tasks</h2>
          </div>

          <div className="search-filter-row">
            <input
              type="text"
              placeholder="Search tasks"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
              <option value="all">All tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {loading ? (
            <p className="empty-state">Loading tasks…</p>
          ) : filteredTasks.length === 0 ? (
            <p className="empty-state">No tasks match your filters.</p>
          ) : (
            <>
              <div className="tasks-grid">
                {currentTasks.map((task) => (
                  <TaskCard key={task._id} task={task} onDelete={handleDelete} onToggle={handleToggle} onEdit={setEditingTask} />
                ))}
              </div>

              <div className="pagination-row">
                <button className="btn btn-ghost" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
                  Previous
                </button>
                <span className="pagination-label">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <button className="btn btn-ghost" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage((prev) => prev + 1)}>
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;