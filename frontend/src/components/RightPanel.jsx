import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

function RightPanel() {
  return (
    <div className="fab-wrapper">
      <div className="fab-ring" />
      <Link to="/complaint-portal" className="fab" aria-label="Add complaint" style={{textDecoration: 'none'}}>
      <i className="ti ti-plus" aria-hidden="true" />
      </Link>
      <div className="fab-tooltip">Add complaint</div>
    </div>
  );
}
export default RightPanel