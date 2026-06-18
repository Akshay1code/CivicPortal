import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

function RightPanel() {
  return (
    <div className="right-panel">
      <Link to="/complaint-portal" className="fab" aria-label="Add complaint" style={{textDecoration: 'none'}}>
        <i className="ti ti-plus" />
      </Link>
    </div>
  );
}
export default RightPanel