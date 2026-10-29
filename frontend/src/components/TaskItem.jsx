import { formatDueLabel, isOverdue } from '../utils/dates.js';

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const overdue = isOverdue(task);
  const dueLabel = formatDueLabel(task);

  return (
    <li className={`task ${task.completed ? 'task--done' : ''}`}>
      <label className="task__check">
        <input
          type="checkbox"
          checked={!!task.completed}
          onChange={() => onToggle(task)}
          aria-label={`Marcar "${task.title}" como ${task.completed ? 'pendente' : 'concluída'}`}
        />
        <span className="checkbox" aria-hidden="true" />
      </label>

      <div className="task__body">
        <span className={`task__title ${overdue ? 'task__title--overdue' : ''}`}>{task.title}</span>
        {task.description && <span className="task__desc">{task.description}</span>}
        {dueLabel && (
          <span className={`task__due ${overdue ? 'task__due--overdue' : ''}`}>{dueLabel}</span>
        )}
      </div>

      {overdue && <span className="badge">Em atraso</span>}

      <div className="task__actions">
        <button type="button" className="icon-btn" onClick={() => onEdit(task)} aria-label="Editar tarefa" title="Editar">
          ✎
        </button>
        <button
          type="button"
          className="icon-btn icon-btn--danger"
          onClick={() => onDelete(task)}
          aria-label="Excluir tarefa"
          title="Excluir"
        >
          🗑
        </button>
      </div>
    </li>
  );
}
