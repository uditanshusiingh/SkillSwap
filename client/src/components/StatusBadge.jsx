export default function StatusBadge({ status }) {
  const cls = status === 'Accepted' ? 'success' : status === 'Declined' ? 'danger' : 'warning text-dark';
  return <span className={`badge bg-${cls}`}>{status}</span>;
}
