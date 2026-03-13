import type { Project, TimeEntry, WeeklyProjectRow, TeamMember } from '../types';

// ── Projects ──────────────────────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  { id: 1, name: "Project Alpha", color: "#6929C4", client: "Acme Corp" },
  { id: 2, name: "Project Beta", color: "#1192E8", client: "TechFlow" },
  { id: 3, name: "Internal", color: "#005D5D", client: "Internal" },
  { id: 4, name: "Project Gamma", color: "#9F1853", client: "StartupX" },
];

// ── Today's AI-generated entries (Friday) ─────────────────────────────────────

export const MOCK_TODAY_ENTRIES: TimeEntry[] = [
  {
    id: 1,
    start: "09:00",
    end: "10:30",
    project: PROJECTS[0], // Alpha
    task: "Sprint planning meeting",
    source: "calendar",
    confidence: "high",
    confirmed: false,
  },
  {
    id: 2,
    start: "10:30",
    end: "12:00",
    project: PROJECTS[0], // Alpha
    task: "API integration — auth module",
    source: "jira",
    confidence: "high",
    confirmed: false,
  },
  {
    id: 3,
    start: "12:00",
    end: "13:00",
    project: PROJECTS[2], // Internal
    task: "Lunch break",
    source: "pattern",
    confidence: "medium",
    confirmed: false,
  },
  {
    id: 4,
    start: "13:00",
    end: "14:30",
    project: PROJECTS[1], // Beta
    task: "Design review with client",
    source: "calendar",
    confidence: "high",
    confirmed: false,
  },
  {
    id: 5,
    start: "14:30",
    end: "16:00",
    project: null, // GAP
    task: "(empty — gap)",
    source: "gap",
    confidence: "low",
    confirmed: false,
  },
  {
    id: 6,
    start: "16:00",
    end: "17:30",
    project: PROJECTS[0], // Alpha
    task: "Code review & PR fixes",
    source: "jira",
    confidence: "medium",
    confirmed: false,
  },
];

// ── Weekly data (Mon–Thu filled, Fri = null / today) ──────────────────────────

export const MOCK_WEEKLY_DATA: WeeklyProjectRow[] = [
  {
    projectId: 1,
    projectName: "Project Alpha",
    projectColor: "#6929C4",
    mon: 3.0,
    tue: 4.5,
    wed: 5.0,
    thu: 3.5,
    fri: null,
  },
  {
    projectId: 2,
    projectName: "Project Beta",
    projectColor: "#1192E8",
    mon: 2.0,
    tue: 1.5,
    wed: 1.0,
    thu: 2.0,
    fri: null,
  },
  {
    projectId: 3,
    projectName: "Internal",
    projectColor: "#005D5D",
    mon: 1.5,
    tue: 1.0,
    wed: 1.0,
    thu: 1.5,
    fri: null,
  },
  {
    projectId: 4,
    projectName: "Project Gamma",
    projectColor: "#9F1853",
    mon: 1.5,
    tue: 1.0,
    wed: 1.0,
    thu: 1.0,
    fri: null,
  },
];

// ── Dashboard chart data ──────────────────────────────────────────────────────

// Team compliance (for Gauge chart)
export const complianceData = [
  { group: "On time", value: 78 },
  { group: "Remaining", value: 22 },
];

// Hours by project this week (for Donut chart)
export const projectHoursData = [
  { group: "Project Alpha", value: 62 },
  { group: "Project Beta", value: 27 },
  { group: "Internal", value: 19 },
  { group: "Project Gamma", value: 12 },
];

// Daily hours trend, last 2 weeks (for Line chart)
export const dailyTrendData = [
  { group: "Logged", date: "2026-03-02", value: 7.5 },
  { group: "Logged", date: "2026-03-03", value: 8.0 },
  { group: "Logged", date: "2026-03-04", value: 7.0 },
  { group: "Logged", date: "2026-03-05", value: 8.5 },
  { group: "Logged", date: "2026-03-06", value: 6.5 },
  { group: "Target", date: "2026-03-02", value: 8.0 },
  { group: "Target", date: "2026-03-03", value: 8.0 },
  { group: "Target", date: "2026-03-04", value: 8.0 },
  { group: "Target", date: "2026-03-05", value: 8.0 },
  { group: "Target", date: "2026-03-06", value: 8.0 },
  { group: "Logged", date: "2026-03-09", value: 8.0 },
  { group: "Logged", date: "2026-03-10", value: 8.0 },
  { group: "Logged", date: "2026-03-11", value: 7.5 },
  { group: "Logged", date: "2026-03-12", value: 8.0 },
  { group: "Logged", date: "2026-03-13", value: 0 },
  { group: "Target", date: "2026-03-09", value: 8.0 },
  { group: "Target", date: "2026-03-10", value: 8.0 },
  { group: "Target", date: "2026-03-11", value: 8.0 },
  { group: "Target", date: "2026-03-12", value: 8.0 },
  { group: "Target", date: "2026-03-13", value: 8.0 },
];

// Team members (for DataTable)
export const teamData: TeamMember[] = [
  { name: "You", hoursThisWeek: 32.5, complianceRate: 95, avgConfirmTime: "Same day" },
  { name: "Alex Chen", hoursThisWeek: 40.0, complianceRate: 100, avgConfirmTime: "Same day" },
  { name: "Maria Santos", hoursThisWeek: 36.0, complianceRate: 85, avgConfirmTime: "1 day late" },
  { name: "James Wilson", hoursThisWeek: 28.0, complianceRate: 60, avgConfirmTime: "2 days late" },
  { name: "Priya Patel", hoursThisWeek: 38.5, complianceRate: 92, avgConfirmTime: "Same day" },
];

// Billable vs non-billable (for Stacked Bar chart)
export const billableData = [
  { group: "Billable", key: "Mon", value: 6.5 },
  { group: "Non-billable", key: "Mon", value: 1.5 },
  { group: "Billable", key: "Tue", value: 7.0 },
  { group: "Non-billable", key: "Tue", value: 1.0 },
  { group: "Billable", key: "Wed", value: 7.0 },
  { group: "Non-billable", key: "Wed", value: 1.0 },
  { group: "Billable", key: "Thu", value: 6.5 },
  { group: "Non-billable", key: "Thu", value: 1.5 },
  { group: "Billable", key: "Fri", value: 0 },
  { group: "Non-billable", key: "Fri", value: 0 },
];
