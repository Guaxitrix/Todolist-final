const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. O backend está rodando?');
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Ocorreu um erro inesperado.');
  }
  return data;
}

// GET /api/tasks?search=&status=all|pending|completed
// Resposta: { tasks: [...], total, completed }
export function fetchTasks({ search = '', status = 'all' } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (status !== 'all') params.set('status', status);
  const query = params.toString();
  return request(`/api/tasks${query ? `?${query}` : ''}`);
}

export function createTask({ title, dueDate }) {
  return request('/api/tasks', {
    method: 'POST',
    body: JSON.stringify({ title, dueDate: dueDate || null }),
  });
}

export function updateTask(id, changes) {
  return request(`/api/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  });
}

export function deleteTask(id) {
  return request(`/api/tasks/${id}`, { method: 'DELETE' });
}
