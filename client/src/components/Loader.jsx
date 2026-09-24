import { useEffect, useState } from 'react';

// Spinner that explains the delay when the (free-tier) API is waking up.
export default function Loader({ text = 'Loading…', delay = 4000 }) {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSlow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-dark" role="status" aria-hidden="true" />
      <p className="mt-3 mb-1">{text}</p>
      {slow && (
        <p className="text-secondary small mb-0">
          The server is waking up (free hosting) — the first load can take up to a minute. Please wait…
        </p>
      )}
    </div>
  );
}
