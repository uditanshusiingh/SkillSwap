export default function StatusBadge({ status }) {
  const cls = status === 'Accepted' ? 'success' : status === 'Declined' ? 'danger' : status === 'Cancelled' ? 'secondary' : 'warning text-dark';
  return <span className={`badge bg-${cls}`}>{status}</span>;
}
