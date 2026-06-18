import '../styles/Dashboard.css';   
const navItems = [
  { icon: 'ti-home', label: 'Dashboard', path: '/dashboard' },
  { icon: 'ti-file-description', label: 'Complaints', path: '/complaints' },
  { icon: 'ti-settings', label: 'Settings', path: '/settings' },
];

function Sidebar({ activePath }) {
  return (
    <nav className="sidebar">
      {navItems.map((item) => (
        <div
          key={item.path}
          className={`sidebar-item ${activePath === item.path ? 'active' : ''}`}
        >
          <i className={`ti ${item.icon}`} aria-hidden="true" />
          {item.label}
        </div>
      ))}
    </nav>
  );
}
export default Sidebar