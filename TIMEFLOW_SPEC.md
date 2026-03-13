# TimeFlow — AI-Powered Time Tracker Prototype

## Specification for Claude Code Implementation

---

## 1. Product context

### Problem
Employees fill timesheets late or retroactively, distorting financial reporting and client billing. Manual time tracking has low compliance because it requires discipline, interrupts focus, and creates cognitive overhead.

### Solution
A standalone web app that uses AI to pre-fill daily timesheets from calendar events, task activity, and behavioral patterns. The user's job is reduced from "recall and type everything" to "review and confirm." A management dashboard provides real-time analytics on team compliance and project allocation.

### Target users
1. **Employee** — busy IC at a consulting/agency/IT company. Context-switching all day. Finds time tracking tedious.
2. **Manager** — needs visibility into team hours, project allocation, billing accuracy, and compliance trends.

### Core UX insight
The fastest timesheet is one that's already filled. Every second of manual input is friction that reduces compliance. The system should do the heavy lifting and ask for confirmation, not construction.

---

## 2. Tech stack

- **Vite + React + TypeScript**
- **@carbon/react** — IBM Carbon Design System components (buttons, tags, data tables, UI shell, tiles, tabs, modals)
- **@carbon/charts-react** — Carbon Charts for dashboard visualizations
- **sass** — required by Carbon for SCSS compilation
- No backend needed — all data is mocked
- Single-page app with internal state-based routing (useState for current screen)

### Project setup

```bash
npm create vite@latest timeflow -- --template react-ts
cd timeflow
npm install
npm install @carbon/react @carbon/charts-react d3 d3-cloud d3-sankey sass
```

### Vite configuration

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Carbon needs node_modules in include paths
        includePaths: ['node_modules'],
      },
    },
  },
})
```

### Global styles entry point

```scss
// src/index.scss (rename index.css → index.scss, update import in main.tsx)
@use '@carbon/react';
@use '@carbon/charts-react/dist/styles.css';

// Optional: override Carbon theme tokens
:root {
  // Use Carbon's g10 (light) theme by default — it's clean and professional
}
```

In `src/main.tsx`, update the import:
```ts
import './index.scss';
```

### TypeScript config

Add `skipLibCheck: true` to `tsconfig.json` compilerOptions (Carbon types are incomplete).

---

## 3. Design direction

**Aesthetic:** IBM Carbon's g10 (light gray) theme. Enterprise-grade but not cold — Carbon's spacing and typography create a professional, trustworthy feel. The UI Shell (header/sidebar) gives the app structure; Tiles and DataTable provide information density without clutter.

**Color approach:**
- Use Carbon's built-in theme tokens — don't fight the design system
- Accent colors through Carbon Tags for confidence levels and source indicators
- Charts use Carbon Charts' default color palette (which is already accessible and cohesive)
- For project identification, use small colored dots (custom) alongside Carbon components

**Key Carbon tokens to know:**
- `$layer-01` — primary surface (white)
- `$layer-02` — secondary surface (gray-10)
- `$text-primary` — main text color
- `$text-secondary` — muted text
- `$interactive` — primary interactive color (blue-60)
- `$support-success` — green for confirmed states
- `$support-warning` — yellow for medium confidence
- `$support-error` — red for gaps/issues

**Typography:** Carbon handles this — IBM Plex Sans is loaded automatically. Don't import custom fonts.

**Spacing:** Use Carbon's spacing scale: `$spacing-03` (8px), `$spacing-05` (16px), `$spacing-07` (32px), etc. In practice, use Carbon component props and Tile padding — avoid manual pixel values.

---

## 4. Data model (mock data)

```typescript
// src/types.ts

interface Project {
  id: number;
  name: string;
  color: string; // hex for the dot indicator
  client: string;
}

interface TimeEntry {
  id: number;
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
  project: Project | null; // null for gaps
  task: string;
  source: "calendar" | "jira" | "pattern" | "manual" | "gap";
  confidence: "high" | "medium" | "low";
  confirmed: boolean;
}

interface DayData {
  date: string;       // "2026-03-13"
  dayLabel: string;   // "Friday, March 13"
  entries: TimeEntry[];
  status: "empty" | "draft" | "confirmed";
}

// For dashboard charts
interface TeamMember {
  name: string;
  hoursThisWeek: number;
  complianceRate: number; // 0-100%
  avgConfirmTime: string; // e.g. "same day", "1 day late"
}
```

### Mock data

**Projects:**
| id | name | color | client |
|----|------|-------|--------|
| 1 | Project Alpha | #6929C4 | Acme Corp |
| 2 | Project Beta | #1192E8 | TechFlow |
| 3 | Internal | #005D5D | Internal |
| 4 | Project Gamma | #9F1853 | StartupX |

(Colors from Carbon's categorical palette for chart consistency)

**Today's AI-generated entries (Friday):**
| start | end | project | task | source | confidence |
|-------|-----|---------|------|--------|------------|
| 09:00 | 10:30 | Alpha | Sprint planning meeting | calendar | high |
| 10:30 | 12:00 | Alpha | API integration — auth module | jira | high |
| 12:00 | 13:00 | Internal | Lunch break | pattern | medium |
| 13:00 | 14:30 | Beta | Design review with client | calendar | high |
| 14:30 | 16:00 | null | (empty — gap) | gap | low |
| 16:00 | 17:30 | Alpha | Code review & PR fixes | jira | medium |

**Weekly data (Mon–Thu confirmed, Fri = today):**
| Project | Mon | Tue | Wed | Thu | Fri |
|---------|-----|-----|-----|-----|-----|
| Project Alpha | 3.0 | 4.5 | 5.0 | 3.5 | — |
| Project Beta | 2.0 | 1.5 | 1.0 | 2.0 | — |
| Internal | 1.5 | 1.0 | 1.0 | 1.5 | — |
| Project Gamma | 1.5 | 1.0 | 1.0 | 1.0 | — |

**Dashboard mock data:**

Team compliance (for Gauge chart):
```typescript
const complianceData = [
  { group: "On time", value: 78 },
  { group: "Remaining", value: 22 },
];
```

Hours by project this week (for Donut chart):
```typescript
const projectHoursData = [
  { group: "Project Alpha", value: 62 },
  { group: "Project Beta", value: 27 },
  { group: "Internal", value: 19 },
  { group: "Project Gamma", value: 12 },
];
```

Daily hours trend, last 2 weeks (for Line/Area chart):
```typescript
const dailyTrendData = [
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
```

Team members (for DataTable):
```typescript
const teamData: TeamMember[] = [
  { name: "You", hoursThisWeek: 32.5, complianceRate: 95, avgConfirmTime: "Same day" },
  { name: "Alex Chen", hoursThisWeek: 40.0, complianceRate: 100, avgConfirmTime: "Same day" },
  { name: "Maria Santos", hoursThisWeek: 36.0, complianceRate: 85, avgConfirmTime: "1 day late" },
  { name: "James Wilson", hoursThisWeek: 28.0, complianceRate: 60, avgConfirmTime: "2 days late" },
  { name: "Priya Patel", hoursThisWeek: 38.5, complianceRate: 92, avgConfirmTime: "Same day" },
];
```

Billable vs non-billable (for Stacked Bar chart):
```typescript
const billableData = [
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
```

---

## 5. App structure

```
src/
  main.tsx
  App.tsx                 — UI Shell + screen routing
  index.scss              — Carbon global styles
  types.ts
  data/
    mockData.ts           — all mock data
  screens/
    ReminderScreen.tsx    — Screen 1: daily reminder
    ReviewScreen.tsx      — Screen 2+3: AI summary + inline edit
    ConfirmScreen.tsx     — Screen 4: confirm day
    TimesheetScreen.tsx   — Screen 5: weekly timesheet table
    DashboardScreen.tsx   — Screen 6: analytics dashboard with charts
  components/
    ConfidenceBadge.tsx   — Carbon Tag wrapper
    SourceTag.tsx         — Carbon Tag wrapper
    ProgressRing.tsx      — SVG circular progress
    ProjectDot.tsx        — small colored circle
  utils/
    timeHelpers.ts        — calcHours, totalHours, billableHours
```

---

## 6. App shell (App.tsx)

Use Carbon's **UI Shell** for navigation. This gives the app its enterprise feel.

```tsx
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  Content,
  Theme,
} from '@carbon/react';
import { Dashboard, Time, Notebook, Notification } from '@carbon/react/icons';
```

**Layout:**
- `<Theme theme="g10">` wrapping everything (light gray theme)
- `<Header>` with:
  - `<HeaderName prefix="TimeFlow">` (app name)
  - `<HeaderNavigation>` with tabs: "Today", "Timesheet", "Dashboard"
  - `<HeaderGlobalBar>` with notification icon
- `<Content>` renders the active screen below the header

**Routing state:**
```typescript
type Screen = "reminder" | "review" | "confirm" | "timesheet" | "dashboard";
const [screen, setScreen] = useState<Screen>("reminder");
```

The header nav items map to: "Today" → reminder, "Timesheet" → timesheet, "Dashboard" → dashboard. The review and confirm screens are reached through the flow, not direct nav.

---

## 7. Screen specifications

### Screen 1: ReminderScreen

**Purpose:** Daily trigger. Motivates the user to confirm their day in ~30 seconds.

**Carbon components used:** `Button`, `Tile`, `Tag`, `InlineNotification`

**Layout:**
- Centered column, max-width 480px, using a single `<Tile>` card
- Inside the tile: icon, heading, description, action buttons

**Content:**
1. `<Time />` icon (from @carbon/react/icons) in a 64px styled container
2. Subheading: "17:00 — Friday, March 13"
3. Heading (h2): "Time to log your day"
4. Body text: "AI found 2 meetings, 4.5h of task work, and 1 gap. Takes ~30 seconds."
5. If missed days > 0: `<InlineNotification kind="warning" title="2 unfilled days" subtitle="Catch up in one go" />`
6. Button group:
   - `<Button kind="primary">Review now</Button>` → navigate to `review`
   - `<Button kind="tertiary">Snooze 1h</Button>` → no-op for prototype
7. Below tile: three `<Tag type="green">` items: "Calendar synced", "Jira synced", "Patterns loaded"

---

### Screen 2+3: ReviewScreen

**Purpose:** Show AI-generated entries. User reviews, edits inline, fills gaps, confirms.

**Carbon components used:** `StructuredList` or custom cards with `Tile`, `Tag`, `Dropdown`, `TextInput`, `Button`, `IconButton`, `ProgressBar`

**Header section:**
- Left: breadcrumb or plain text "Friday, March 13" + h2 "AI-generated timesheet"
- Right: custom `<ProgressRing>` SVG showing hours / 8h + text "{X}h total, {Y}h billable"

**Entry list:**
Each entry is a `<ClickableTile>` or styled div with:
- **Time column** (left, 90px): "09:00–10:30" bold, "1.5h" secondary
- **Content column** (flex):
  - Row 1: `<ProjectDot>` + project name + `<Tag type="green|warm-gray|red">` for confidence + `<Tag type="cool-gray">` for source
  - Row 2: task description in `$text-secondary`
- **Confirmed state:** green border-left (4px), checkmark icon in corner
- **Click to expand:** reveals edit form

**Gap entry:**
- Use `<Tile>` with yellow/warning styling
- Title: "Unrecognized gap (14:30–16:00)"
- Quick-fill buttons: three `<Button kind="ghost" size="sm">` — "Meeting", "Focus work", "Break"

**Inline edit panel (expanded state):**
- `<Dropdown>` for project selection (items = project list)
- `<TextInput>` for task description
- `<Button kind="primary" size="sm">Confirm</Button>` and `<Button kind="danger--ghost" size="sm">Delete</Button>`

**Bottom:**
- `<Button kind="ghost">+ Add entry</Button>`
- `<Button kind="primary" disabled={!allConfirmed}>Confirm all</Button>` → navigate to `confirm`

---

### Screen 4: ConfirmScreen

**Purpose:** Summary before submission.

**Carbon components used:** `Tile`, `Button`, `StructuredList` or stat tiles

**Layout:** Centered, max-width 480px

**Content:**
1. Success checkmark icon (green, large)
2. Heading: "Friday is ready to submit"
3. Stats in a 2x2 grid of `<Tile>`:
   - "8.5h total" / "6.5h billable" / "4 projects" / "6 entries"
4. Project breakdown: simple list with `<ProjectDot>` + name + hours
5. `<Button kind="primary">Submit timesheet</Button>` → update weekly data, navigate to `timesheet`
6. `<Button kind="tertiary">Back to edit</Button>` → navigate to `review`

---

### Screen 5: TimesheetScreen

**Purpose:** Full weekly view with the classic timesheet grid.

**Carbon components used:** `DataTable`, `Table`, `TableHead`, `TableRow`, `TableCell`, `TableBody`, `Tag`, `Button`

**Table structure:**
- Columns: Project | Mon | Tue | Wed | Thu | Fri | Total
- Rows: one per project, with colored `<ProjectDot>` before name
- Cells: hours as numbers. Null → "—" in tertiary color
- Footer row: "Daily total" with column sums, bold
- Column headers: day name + status dot (green = confirmed, red = empty, purple = today)

**Above table:** "Weekly timesheet" heading + "March 9–13, 2026" + `<Button kind="ghost" size="sm">Export CSV</Button>`

**Below table:** "Week total: 40.0h" in large text + `<Tag type="green">Submitted</Tag>`

**Navigation:** "← Back to today" as `<Button kind="ghost">` + "View dashboard →" link

---

### Screen 6: DashboardScreen (NEW)

**Purpose:** Analytics view for managers. Shows compliance trends, project allocation, billability, and team status.

**Carbon components used:** `Grid`, `Column`, `Tile`, `DataTable`, `Tabs`, `TabList`, `Tab`, `TabPanels`, `TabPanel`

**Carbon Charts used:** `DonutChart`, `LineChart`, `StackedBarChart`, `GaugeChart`

**Layout:** Carbon's responsive `<Grid>` with 16-column system.

**Top row — KPI tiles (4 across):**
Each is a `<Tile>` with:
- Small label (e.g., "Team compliance")
- Large number (e.g., "78%")
- Trend indicator (e.g., "↑ 5% vs last week" in green or "↓ 3%" in red)

KPI tiles:
| Label | Value | Trend |
|-------|-------|-------|
| Team compliance | 78% | ↑ 5% vs last week |
| Avg hours/day | 7.8h | → same as last week |
| Billable ratio | 82% | ↑ 3% vs last week |
| AI accuracy | 91% | ↑ 2% vs last week |

**Middle row — two charts side by side:**

Left (8 columns): **Daily hours trend** — `<LineChart>` showing "Logged" vs "Target" lines over the past 2 weeks.
```tsx
<LineChart
  data={dailyTrendData}
  options={{
    title: "Daily hours — last 2 weeks",
    axes: {
      bottom: { mapsTo: "date", scaleType: "time" },
      left: { mapsTo: "value", title: "Hours" },
    },
    height: "320px",
    theme: "g10",
  }}
/>
```

Right (8 columns): **Project allocation** — `<DonutChart>` showing hours distribution by project.
```tsx
<DonutChart
  data={projectHoursData}
  options={{
    title: "Project allocation — this week",
    resizable: true,
    donut: { center: { label: "Hours" } },
    height: "320px",
    theme: "g10",
  }}
/>
```

**Bottom left (8 columns): Billable vs non-billable** — `<StackedBarChart>` per day of the week.
```tsx
<StackedBarChart
  data={billableData}
  options={{
    title: "Billable vs non-billable",
    axes: {
      left: { mapsTo: "value", title: "Hours", stacked: true },
      bottom: { mapsTo: "key", scaleType: "labels" },
    },
    height: "320px",
    theme: "g10",
  }}
/>
```

**Bottom right (8 columns): Team compliance table** — Carbon `<DataTable>` with sortable columns.

Columns: Name | Hours this week | Compliance | Avg confirm time
- "Compliance" column uses `<Tag>` color-coded: ≥90% green, 70-89% warm-gray, <70% red
- Sortable by any column
- "You" row is highlighted

---

## 8. Component specifications

### ConfidenceBadge
Wraps Carbon's `<Tag>` component.
- Props: `level: "high" | "medium" | "low"`
- Mapping: high → `<Tag type="green" size="sm">High</Tag>`, medium → `<Tag type="warm-gray" size="sm">Medium</Tag>`, low → `<Tag type="red" size="sm">Low</Tag>`

### SourceTag
Wraps Carbon's `<Tag>` component.
- Props: `source: "calendar" | "jira" | "pattern" | "manual" | "gap"`
- Always `<Tag type="cool-gray" size="sm">{label}</Tag>`
- Labels: "Cal", "Jira", "Pattern", "Manual", "Gap"

### ProgressRing
Custom SVG — not a Carbon component.
- Props: `value: number`, `max: number`, `size?: number`
- SVG circle with stroke-dasharray animation
- Color: blue (<80%), yellow (80-99%), green (100%+)

### ProjectDot
- Props: `color: string`
- Renders: `<span>` with 8px circle, inline-block

---

## 9. State management

All state lives in `App.tsx`. No external state library.

```typescript
const [screen, setScreen] = useState<Screen>("reminder");
const [todayEntries, setTodayEntries] = useState<TimeEntry[]>(MOCK_TODAY_ENTRIES);
const [weeklyData, setWeeklyData] = useState(MOCK_WEEKLY_DATA);
const [fridayConfirmed, setFridayConfirmed] = useState(false);
```

When Friday is confirmed:
1. Calculate hours per project from `todayEntries`
2. Fill in Friday column in `weeklyData`
3. Set `fridayConfirmed = true`
4. Navigate to `timesheet`

---

## 10. Interactions

| Action | Screen | Behavior |
|--------|--------|----------|
| Click "Review now" | Reminder | → Review |
| Click entry card | Review | Toggle inline edit |
| Change project dropdown | Review (edit) | Update entry |
| Change task input | Review (edit) | Update entry |
| Click "Confirm" per entry | Review (edit) | Mark confirmed, collapse |
| Click "Delete" per entry | Review (edit) | Remove from list |
| Click gap quick-fill | Review (gap) | Resolve gap → confirmed |
| Click "Add entry" | Review | Append blank entry |
| Click "Confirm all" | Review | → Confirm screen |
| Click "Submit timesheet" | Confirm | Update weekly, → Timesheet |
| Click "Back to edit" | Confirm | → Review |
| Click "Back to today" | Timesheet | → Reminder |
| Click nav "Today" | Header | → Reminder |
| Click nav "Timesheet" | Header | → Timesheet |
| Click nav "Dashboard" | Header | → Dashboard |

---

## 11. Utility functions

```typescript
// src/utils/timeHelpers.ts

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
```

---

## 12. What NOT to build

- No real authentication or user management
- No real API calls or backend
- No real calendar/Jira integration
- No real AI — all "AI suggestions" are hardcoded mock data
- No localStorage persistence
- No mobile-responsive layout (desktop-only is fine)
- No dark mode (stick to Carbon g10 light theme)
- No custom fonts — Carbon loads IBM Plex automatically
- No Tailwind — Carbon handles all styling

---

## 13. Definition of done

The prototype is complete when:
1. All 6 screens render correctly with mock data
2. Carbon UI Shell (Header) provides navigation between Today, Timesheet, Dashboard
3. Full user flow works: Reminder → Review → Edit → Confirm → Timesheet
4. Entries can be edited, confirmed, and deleted in ReviewScreen
5. Gaps can be resolved via quick-fill buttons
6. Weekly timesheet table shows correct totals including confirmed Friday data
7. Dashboard shows 4 KPI tiles + 4 charts (Line, Donut, Stacked Bar, DataTable)
8. Charts render correctly using @carbon/charts-react
9. All Carbon components are properly themed (g10)
10. `npm run dev` starts the app without errors
