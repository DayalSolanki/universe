export function formatMemoryDate(date: string) {
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}

export function yearsTogether(startDate: string, now = new Date()) {
  const start = new Date(`${startDate}T00:00:00`);
  let years = now.getFullYear() - start.getFullYear();
  const anniversary = new Date(now.getFullYear(), start.getMonth(), start.getDate());
  if (now < anniversary) years -= 1;
  return Math.max(0, years);
}
