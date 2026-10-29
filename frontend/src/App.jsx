import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createTask, deleteTask, fetchTasks, updateTask } from './api.js';
import useDebounce from './hooks/useDebounce.js';
import useTheme from './hooks/useTheme.js';
import { SECTIONS, groupTasks } from './utils/dates.js';
import Sidebar from './components/Sidebar.jsx';
import TaskSection from './components/TaskSection.jsx';
import TaskModal from './components/TaskModal.jsx';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const debouncedSearch = useDebounce(search, 400);

  // modal: null | { mode: 'create', defaultDate } | { mode: 'edit', task }
  const [modal, setModal] = useState(null);

  // Evita que uma resposta antiga sobrescreva uma mais nova
  const requestId = useRef(0);

  const loadTasks = useCallback(async () => {
    const id = ++requestId.current;
    try {
      const data = await fetchTasks({ search: debouncedSearch.trim(), status });
      if (id !== requestId.current) return;
      setTasks(data.tasks);
      setTotal(data.total);
      setCompleted(data.completed);
      setError('');
    } catch (err) {
      if (id !== requestId.current) return;
      setError(err.message);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [debouncedSearch, status]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  async function handleToggle(task) {
    try {
      await updateTask(task.id, { completed: !task.completed });
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(task) {
    if (!window.confirm(`Excluir a tarefa "${task.title}"?`)) return;
    try {
      await deleteTask(task.id);
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSubmit(values) {
    if (modal.mode === 'edit') {
      await updateTask(modal.task.id, values);
    } else {
      await createTask(values);
    }
    setModal(null);
    await loadTasks();
  }

  const closeModal = useCallback(() => setModal(null), []);
  const grouped = useMemo(() => groupTasks(tasks), [tasks]);
  const openCreate = (defaultDate = '') => setModal({ mode: 'create', defaultDate });

  const isSearching = debouncedSearch.trim() !== '';

  return (
    <div className="layout">
      <Sidebar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        total={total}
        completed={completed}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="main">
        <header className="main__header">
          <h1 className="logo">
            to<span>do.</span>
          </h1>
          <div className="counters">
            <span className="pill">
              Total <strong>{total}</strong>
            </span>
            <span className="pill pill--done">
              Concluídas <strong>{completed}</strong>
            </span>
          </div>
        </header>

        {error && (
          <div className="alert" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => setError('')} aria-label="Fechar aviso">
              ✕
            </button>
          </div>
        )}

        {loading ? (
          <p className="muted">Carregando tarefas...</p>
        ) : tasks.length === 0 ? (
          <div className="empty">
            <div className="empty__icon" aria-hidden="true">✓</div>
            <p>
              {isSearching
                ? 'Nenhuma tarefa encontrada para a busca.'
                : status === 'completed'
                  ? 'Você ainda não concluiu nenhuma tarefa.'
                  : 'Você não tem tarefas pendentes.'}
            </p>
          </div>
        ) : (
          <div className="grid">
            {SECTIONS.map((section) => {
              const items = grouped[section.key];
              if (items.length === 0 && !section.alwaysShow) return null;
              const canAdd = section.alwaysShow;
              return (
                <TaskSection
                  key={section.key}
                  title={section.title}
                  tasks={items}
                  onAdd={canAdd ? () => openCreate(section.defaultDate?.() || '') : null}
                  onToggle={handleToggle}
                  onEdit={(task) => setModal({ mode: 'edit', task })}
                  onDelete={handleDelete}
                />
              );
            })}
          </div>
        )}
      </main>

      <button type="button" className="fab" onClick={() => openCreate()} aria-label="Criar tarefa" title="Criar tarefa">
        +
      </button>

      {modal && (
        <TaskModal
          mode={modal.mode}
          task={modal.task}
          defaultDate={modal.defaultDate}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
