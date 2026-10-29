import { useEffect, useRef, useState } from 'react';

// mode: 'create' | 'edit'
export default function TaskModal({ mode, task, defaultDate = '', onClose, onSubmit }) {
  const isEdit = mode === 'edit';
  const [title, setTitle] = useState(isEdit ? task.title : '');
  const [description, setDescription] = useState(isEdit ? task.description || '' : '');
  const [dueDate, setDueDate] = useState(isEdit ? (task.due_date || '').slice(0, 10) : defaultDate);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError('O nome da tarefa é obrigatório.');
      titleRef.current?.focus();
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit({ title: title.trim(), description: description.trim() || null, dueDate: dueDate || null });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">{isEdit ? 'Editar tarefa' : 'Criar tarefa'}</h2>

        <label className="field">
          <span>Nome da tarefa</span>
          <input
            ref={titleRef}
            type="text"
            maxLength={255}
            placeholder="Ex.: Estudar para a prova"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Descrição <small>(opcional)</small></span>
          <textarea
            rows={3}
            maxLength={2000}
            placeholder="Detalhes da tarefa..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Data limite <small>(opcional)</small></span>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="modal__footer">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Salvando...' : isEdit ? 'Salvar' : 'Criar'}
          </button>
        </div>
      </form>
    </div>
  );
}
