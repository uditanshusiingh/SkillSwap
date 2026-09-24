// Case-insensitive "contains" match on the gig's creator name. Empty filter = everything.
export function filterByCreator(bookings, name) {
  const q = (name || '').trim().toLowerCase();
  if (!q) return bookings;
  return bookings.filter((b) => (b.gigId?.creatorName || '').toLowerCase().includes(q));
}
