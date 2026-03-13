import type { TimeEntry } from '../types';

export function calcHours(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return Number(((eh + em / 60) - (sh + sm / 60)).toFixed(1));
}

export function totalHours(entries: TimeEntry[]): number {
  return Number(entries.reduce((sum, e) => sum + calcHours(e.start, e.end), 0).toFixed(1));
}

export function billableHours(entries: TimeEntry[]): number {
  return Number(
    entries
      .filter(e => e.project && e.project.client !== "Internal")
      .reduce((sum, e) => sum + calcHours(e.start, e.end), 0)
      .toFixed(1)
  );
}
