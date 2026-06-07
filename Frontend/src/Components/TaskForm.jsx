import { useState, useEffect } from "react";
import "../styles/TaskForm.css";

const TaskForm = ({ onAddTask, onUpdateTask, editingTask, onCancelEdit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setDescription(editingTask.description || "");
      setPriority(editingTask.priority || "medium");
      setDueDate(editingTask.dueDate ? editingTask.dueDate.slice(0, 10) : "");
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
    }
  }, [editingTask]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      priority,
      dueDate: dueDate || undefined,
    };

    if (editingTask) {
      onUpdateTask(editingTask._id, payload);
    } else {
      onAddTask(payload);
    }

    resetForm();
  };

  return (
    <div className="task-form-panel glass-panel">
      <div className="task-form-header">
        <div>
          <p className="eyebrow">{editingTask ? 'Edit task' : 'New task'}</p>
          <h2>{editingTask ? 'Update task details' : 'Create a new task'}</h2>
        </div>
        {editingTask && (
          <button className="btn btn-ghost cancel-edit" type="button" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>

      <form className="task-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Task title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Finish quarterly report"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more context for this task"
            rows={4}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Due date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </div>

        <button className="btn btn-primary" type="submit">
          {editingTask ? 'Save changes' : 'Add task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;