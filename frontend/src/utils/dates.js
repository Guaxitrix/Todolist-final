const DAY_MS = 24 * 60 * 60 * 1000;

// Converte 'YYYY-MM-DD' (ou ISO) em Date local à meia-noite, sem sofrer com fuso horário.
function toLocalDate(value) {
  const [y, m, d] = String(value).slice(0, 10).split('-').map(Number);
  return new Date(y, m - 1, d);
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

// Date -> 'YYYY-MM-DD' no horário local (formato aceito pelo backend e por <input type="date">)
export function toInputDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayInput() {
  return toInputDate(startOfToday());
}

export function tomorrowInput() {
  return toInputDate(new Date(startOfToday().getTime() + DAY_MS + 3600 * 1000));
}

// Dias entre hoje e a data limite (negativo = já passou)
export function daysUntil(dueDate) {
  return Math.round((toLocalDate(dueDate) - startOfToday()) / DAY_MS);
}

export function isOverdue(task) {
  return !task.completed && !!task.due_date && daysUntil(task.due_date) < 0;
}

export function formatShortDate(dueDate) {
  return toLocalDate(dueDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
}

function plural(n, singular, pluralForm) {
  return `${n} ${n === 1 ? singular : pluralForm}`;
}

// "expira em 2 dias", "expira hoje", "venceu há 3 dias"...
export function formatDueLabel(task) {
  if (!task.due_date) return '';
  const diff = daysUntil(task.due_date);
  const short = formatShortDate(task.due_date);

  if (task.completed) return `Prazo: ${short}`;
  if (diff < 0) return `Venceu há ${plural(-diff, 'dia', 'dias')} · ${short}`;
  if (diff === 0) return `Expira hoje · ${short}`;
  if (diff === 1) return `Expira amanhã · ${short}`;
  return `Expira em ${plural(diff, 'dia', 'dias')} · ${short}`;
}

export const SECTIONS = [
  { key: 'overdue', title: 'Em atraso', alwaysShow: false },
  { key: 'today', title: 'Hoje', alwaysShow: true, defaultDate: () => todayInput() },
  { key: 'tomorrow', title: 'Amanhã', alwaysShow: true, defaultDate: () => tomorrowInput() },
  { key: 'week', title: 'Esta semana', alwaysShow: true, defaultDate: () => '' },
  { key: 'later', title: 'Mais tarde', alwaysShow: false },
  { key: 'none', title: 'Sem data', alwaysShow: false },
  { key: 'past', title: 'Concluídas anteriores', alwaysShow: false },
];

export function sectionKeyFor(task) {
  if (!task.due_date) return 'none';
  const diff = daysUntil(task.due_date);
  if (diff < 0) return task.completed ? 'past' : 'overdue';
  if (diff === 0) return 'today';
  if (diff === 1) return 'tomorrow';
  if (diff <= 7) return 'week';
  return 'later';
}

// Agrupa as tarefas por seção, mantendo a ordem em que o backend entregou (data mais próxima primeiro)
export function groupTasks(tasks) {
  const groups = Object.fromEntries(SECTIONS.map((s) => [s.key, []]));
  for (const task of tasks) groups[sectionKeyFor(task)].push(task);
  return groups;
}
