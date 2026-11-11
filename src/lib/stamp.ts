// The camera's date stamp, from a capture date (YYYY-MM-DD): '23 05 01. Its own module so client components can use it
// without bundling the photography catalog.
export function stampText(taken?: string) {
  if (!taken) return "";
  const [year, month, day] = taken.split("-");
  return `'${year.slice(2)} ${month} ${day}`;
}
