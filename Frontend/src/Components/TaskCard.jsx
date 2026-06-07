import '../styles/TaskCard.css';

const TaskCard = ({ task, onDelete, onToggle, onEdit }) => {
  const isCompleted = task.status === 'completed';
  const dueDateText = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : null;

  return (
    <article className={`task-card ${isCompleted ? 'task-completed' : 'task-pending'}`}>
      <div className="task-card-header">
        <div>
          <p className="eyebrow">Status</p>
          <h3 className="task-title">{task.title}</h3>
        </div>
        <span className={`status-badge ${isCompleted ? 'status-completed' : 'status-pending'}`}>
          {task.status}
        </span>
      </div>

      <div className="task-meta">
        <span className={`priority-chip priority-${task.priority || 'medium'}`}>
          {(task.priority || 'medium').toUpperCase()}
        </span>
        {dueDateText && <span className="due-date">Due {dueDateText}</span>}
      </div>

      <p className="task-description">
        {task.description || 'No description added.'}
      </p>

      <div className="task-actions">
        <button className="btn btn-ghost" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn btn-ghost" onClick={() => onToggle(task._id)}>
          {isCompleted ? 'Undo' : 'Complete'}
        </button>
        <button className="btn btn-danger" onClick={() => onDelete(task._id)}>
          Delete
        </button>
      </div>
    </article>
  );
};

export default TaskCard;