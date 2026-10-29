const FILTERS = [
  { key: 'all', label: 'Todas', icon: '≡' },
  { key: 'pending', label: 'Pendentes', icon: '◔' },
  { key: 'completed', label: 'Concluídas', icon: '✓' },
];

export default function Sidebar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  total,
  completed,
  theme,
  onToggleTheme,
}) {
  const counts = { all: total, pending: total - completed, completed };

  return (
    <aside className="sidebar">
      <div className="sidebar__top">
        <h1 className="sidebar__logo">Menu</h1>
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'}
          title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </div>

      <label className="search">
        <span className="search__icon" aria-hidden="true">⌕</span>
        <input
          type="search"
          placeholder="Buscar tarefas..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>

      <nav className="sidebar__nav" aria-label="Filtros">
        <h2 className="sidebar__heading">Tarefas</h2>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`nav-item ${status === f.key ? 'nav-item--active' : ''}`}
            onClick={() => onStatusChange(f.key)}
          >
            <span className="nav-item__icon" aria-hidden="true">{f.icon}</span>
            <span className="nav-item__label">{f.label}</span>
            <span className="nav-item__count">{counts[f.key]}</span>
          </button>
        ))}
      </nav>

      <button type="button" className="theme-row" onClick={onToggleTheme}>
        <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
        {theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
      </button>
    </aside>
  );
}
