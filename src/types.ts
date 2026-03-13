export interface Project {
  id: number;
  name: string;
  color: string;
  client: string;
}

export interface TimeEntry {
  id: number;
  start: string;   // "HH:MM"
  end: string;      // "HH:MM"
  project: Project | null;  // null for gaps
  task: string;
  source: "calendar" | "jira" | "pattern" | "manual" | "gap";
  confidence: "high" | "medium" | "low";
  confirmed: boolean;
}

export interface DayData {
  date: string;
  dayLabel: string;
  entries: TimeEntry[];
  status: "empty" | "draft" | "confirmed";
}

export interface TeamMember {
  name: string;
  hoursThisWeek: number;
  complianceRate: number;
  avgConfirmTime: string;
}

export type Screen = "reminder" | "review" | "confirm" | "timesheet" | "dashboard";

// For weekly timesheet grid
export interface WeeklyProjectRow {
  projectId: number;
  projectName: string;
  projectColor: string;
  mon: number | null;
  tue: number | null;
  wed: number | null;
  thu: number | null;
  fri: number | null;
}
