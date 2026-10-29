import TaskItem from './TaskItem.jsx';

export default function TaskSection({ title, tasks, onAdd, onToggle, onEdit, onDelete }) {
  return (
    <section className="card">
      <h2 className="card__title">
        {title}
        <span className="card__count">{tasks.length}</span>
      </h2>

      {onAdd && (
        <button type="button" className="add-bar" onClick={onAdd}>
          <span aria-hidden="true">⊕</span> Adicionar nova tarefa
        </button>
      )}

      {tasks.length > 0 && (
        <ul className="task-list">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </section>
  );
}
