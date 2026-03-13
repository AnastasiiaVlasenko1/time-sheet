# TimeFlow — Agent Team Implementation Plan

## Project Overview
Build TimeFlow, an AI-powered time tracker prototype. Vite + React + TypeScript SPA using IBM Carbon Design System (`@carbon/react`, `@carbon/charts-react`, `sass`). 6 screens, all data mocked, no backend.

**Project directory:** `/Users/anastasiiavlasenko/Desktop/time-sheet`
**Spec file:** `/Users/anastasiiavlasenko/Desktop/time-sheet/TIMEFLOW_SPEC.md`
**Current state:** Empty directory (only TIMEFLOW_SPEC.md exists)

---

## Phase 1: Project Scaffolding & Configuration

**Goal:** Scaffold the Vite project, install all dependencies, configure build tools, set up Carbon styles. Verify `npm run dev` runs with no errors.

### Agent Prompt

```
You are building the TimeFlow app from scratch in /Users/anastasiiavlasenko/Desktop/time-sheet.

STEP 1 — Scaffold Vite project:
Run from the project directory:
  npm create vite@latest . -- --template react-ts
  npm install
  npm install @carbon/react @carbon/charts-react sass
Do NOT install d3, d3-cloud, or d3-sankey separately — Carbon Charts bundles them.
If you see a peer warning about react-is, also run: npm install react-is

STEP 2 — Delete unnecessary scaffold files:
  - src/App.css
  - src/index.css
  - src/assets/react.svg
  - public/vite.svg

STEP 3 — Configure vite.config.ts:
Replace with:
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'

  export default defineConfig({
    plugins: [react()],
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: ['node_modules'],
        },
      },
    },
  })

STEP 4 — Update tsconfig.app.json:
Add "skipLibCheck": true to the compilerOptions object. This is required because Carbon's TypeScript definitions are incomplete.

STEP 5 — Update index.html:
Change <title> to "TimeFlow".

STEP 6 — Create src/index.scss (new file):
  @use '@carbon/react';

  body {
    margin: 0;
    padding: 0;
  }

  .cds--content {
    padding: 2rem;
  }

STEP 7 — Update src/main.tsx:
  import React from 'react'
  import ReactDOM from 'react-dom/client'
  import App from './App.tsx'
  import '@carbon/charts-react/dist/styles.css'
  import './index.scss'

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )

IMPORTANT: Import Carbon Charts CSS as a JS import in main.tsx (not via SCSS @use) — it's a CSS file and may fail in SCSS resolution.

STEP 8 — Create a minimal src/App.tsx placeholder:
  import { Theme, Header, HeaderName, Content } from '@carbon/react'

  function App() {
    return (
      <Theme theme="g10">
        <Header aria-label="TimeFlow">
          <HeaderName href="#" prefix="">TimeFlow</HeaderName>
        </Header>
        <Content>
          <h1>TimeFlow</h1>
          <p>App shell ready.</p>
        </Content>
      </Theme>
    )
  }

  export default App

STEP 9 — Verify:
Run `npm run dev`. The app should compile SCSS without errors and show "TimeFlow" header with "App shell ready" text on a light gray Carbon g10 background. Check for no console errors.
Then run `npm run build` to verify production build also succeeds.

KNOWN PITFALLS:
- If SCSS import fails with "Can't find stylesheet to import", double-check includePaths in vite.config.ts
- If Sass deprecation warnings appear about "/" division, they are cosmetic — ignore them
- If you get "Cannot find module '@carbon/react'" in TS, make sure skipLibCheck is true
```

### Files Created/Modified
- `package.json` (generated + dependencies added)
- `vite.config.ts` (replaced)
- `tsconfig.app.json` (edited)
- `index.html` (title changed)
- `src/index.scss` (new)
- `src/main.tsx` (rewritten)
- `src/App.tsx` (minimal placeholder)

### Verification
- `npm run dev` starts without errors
- Browser shows Carbon-styled header "TimeFlow" on g10 background
- `npm run build` succeeds

---

## Phase 2: Types, Utilities & Mock Data

**Goal:** Create the data foundation — types, utility functions, and all mock data. These have zero React dependencies and every screen imports from them.

### Agent Prompt

```
Working in /Users/anastasiiavlasenko/Desktop/time-sheet. Phase 1 (scaffold + config) is already complete. Now create the foundation files.

Read the full spec at /Users/anastasiiavlasenko/Desktop/time-sheet/TIMEFLOW_SPEC.md for all data model details and mock data values.

FILE 1 — src/types.ts:

export interface Project {
  id: number;
  name: string;
  color: string;
  client: string;
}

export interface TimeEntry {
  id: number;
  start: string;   // "HH:MM"
  end: string;     // "HH:MM"
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


FILE 2 — src/utils/timeHelpers.ts:

Create the directory src/utils/ and the file. Implement exactly as shown in spec Section 11:

import { TimeEntry } from '../types';

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


FILE 3 — src/data/mockData.ts:

Create the directory src/data/ and the file. Use ALL the mock data from the spec (Section 4). Import types from '../types'.

PROJECTS (4 projects):
  { id: 1, name: "Project Alpha", color: "#6929C4", client: "Acme Corp" },
  { id: 2, name: "Project Beta", color: "#1192E8", client: "TechFlow" },
  { id: 3, name: "Internal", color: "#005D5D", client: "Internal" },
  { id: 4, name: "Project Gamma", color: "#9F1853", client: "StartupX" },

MOCK_TODAY_ENTRIES (6 entries for Friday — reference the projects by their objects, not IDs):
  Entry 1: 09:00-10:30, Alpha, "Sprint planning meeting", calendar, high, not confirmed
  Entry 2: 10:30-12:00, Alpha, "API integration — auth module", jira, high, not confirmed
  Entry 3: 12:00-13:00, Internal, "Lunch break", pattern, medium, not confirmed
  Entry 4: 13:00-14:30, Beta, "Design review with client", calendar, high, not confirmed
  Entry 5: 14:30-16:00, null (GAP), "(empty — gap)", gap, low, not confirmed
  Entry 6: 16:00-17:30, Alpha, "Code review & PR fixes", jira, medium, not confirmed

MOCK_WEEKLY_DATA (WeeklyProjectRow[] — 4 rows, Mon-Thu filled, Fri = null):
  Alpha:  3.0, 4.5, 5.0, 3.5, null
  Beta:   2.0, 1.5, 1.0, 2.0, null
  Internal: 1.5, 1.0, 1.0, 1.5, null
  Gamma:  1.5, 1.0, 1.0, 1.0, null

Dashboard chart data — export all of these as named exports. Copy exactly from spec Section 4:
  - complianceData (for gauge)
  - projectHoursData (for donut)
  - dailyTrendData (for line chart — 20 data points)
  - teamData: TeamMember[] (5 members)
  - billableData (for stacked bar — 10 data points)

VERIFY: Run `npm run build` after creating all three files — should compile with zero TypeScript errors.
```

### Files Created
- `src/types.ts`
- `src/utils/timeHelpers.ts`
- `src/data/mockData.ts`

### Verification
- `npm run build` — zero TS errors

---

## Phase 3: Reusable Components

**Goal:** Create the 4 small shared components used across multiple screens.

### Agent Prompt

```
Working in /Users/anastasiiavlasenko/Desktop/time-sheet. Phases 1-2 are complete (scaffold, config, types, utils, mock data).

Create the directory src/components/ and build these 4 components. Read types from src/types.ts if needed.

COMPONENT 1 — src/components/ProjectDot.tsx:
Props: { color: string }
Renders: <span> styled as an 8px circle:
  display: inline-block, width: 8px, height: 8px, borderRadius: '50%',
  backgroundColor: color, marginRight: 8px, flexShrink: 0

COMPONENT 2 — src/components/ConfidenceBadge.tsx:
Props: { level: "high" | "medium" | "low" }
Import { Tag } from '@carbon/react'
Mapping:
  - high  → <Tag type="green" size="sm">High</Tag>
  - medium → <Tag type="warm-gray" size="sm">Medium</Tag>
  - low   → <Tag type="red" size="sm">Low</Tag>

If TypeScript complains about type="warm-gray", try type="gray" instead — Carbon type names vary by version.

COMPONENT 3 — src/components/SourceTag.tsx:
Props: { source: "calendar" | "jira" | "pattern" | "manual" | "gap" }
Import { Tag } from '@carbon/react'
Label map: { calendar: "Cal", jira: "Jira", pattern: "Pattern", manual: "Manual", gap: "Gap" }
Always renders: <Tag type="cool-gray" size="sm">{label}</Tag>

If TypeScript complains about type="cool-gray", try type="gray" instead.

COMPONENT 4 — src/components/ProgressRing.tsx:
Props: { value: number, max: number, size?: number }
Custom SVG component (no Carbon dependency).
Implementation:
  - Default size = 80
  - radius = (size - 8) / 2
  - circumference = 2 * Math.PI * radius
  - progress = Math.min(value / max, 1)
  - offset = circumference * (1 - progress)
  - Color logic: (value/max) < 0.8 → "#0f62fe" (blue), < 1 → "#f1c21b" (yellow), >= 1 → "#198038" (green)
  - SVG with viewBox="0 0 {size} {size}"
  - Background circle: cx/cy = size/2, r = radius, stroke="#e0e0e0", strokeWidth=4, fill="none"
  - Foreground circle: same dimensions, stroke=color, strokeWidth=4, fill="none",
    strokeDasharray={circumference}, strokeDashoffset={offset},
    strokeLinecap="round", transform="rotate(-90 {size/2} {size/2})"
  - Center text: value + "h" at the center of the SVG

VERIFY: Run `npm run build` — should compile with zero errors.
```

### Files Created
- `src/components/ProjectDot.tsx`
- `src/components/ConfidenceBadge.tsx`
- `src/components/SourceTag.tsx`
- `src/components/ProgressRing.tsx`

### Verification
- `npm run build` — zero TS errors

---

## Phase 4: ReminderScreen + ConfirmScreen

**Goal:** Build the two simpler screens (centered card layouts). These are self-contained and don't depend on each other.

### Agent Prompt

```
Working in /Users/anastasiiavlasenko/Desktop/time-sheet. Phases 1-3 are complete.

Create the directory src/screens/ and build these 2 screens. Read the full spec at TIMEFLOW_SPEC.md sections 7 (Screen 1 and Screen 4) for exact content.

SCREEN 1 — src/screens/ReminderScreen.tsx:

Props: { onReview: () => void }

Carbon imports: Button, Tile, Tag, InlineNotification from '@carbon/react'
Icon: Time from '@carbon/react/icons'

Layout: Outer container centered (display: flex, justifyContent: center, alignItems: center, minHeight: calc(100vh - 48px)). Inner <Tile> with max-width 480px, padding 2rem, text-align center.

Content inside the Tile:
1. <Time size={32} /> in a 64px container (div with width/height 64px, borderRadius 50%, background #e0e0e0, display flex, align/justify center, margin 0 auto 1.5rem)
2. <p style secondary text> "17:00 — Friday, March 13"
3. <h2> "Time to log your day"
4. <p> "AI found 2 meetings, 4.5h of task work, and 1 gap. Takes ~30 seconds."
5. <InlineNotification kind="warning" title="2 unfilled days" subtitle="Catch up in one go" lowContrast hideCloseButton style={{ marginBottom: '1.5rem' }} />
6. <div> with gap between buttons:
   - <Button kind="primary" onClick={onReview}>Review now</Button>
   - <Button kind="tertiary">Snooze 1h</Button> (no-op)
7. Below the Tile (outside): <div> with three <Tag type="green" size="sm">: "Calendar synced", "Jira synced", "Patterns loaded" — centered, with gap spacing

SCREEN 4 — src/screens/ConfirmScreen.tsx:

Props: {
  entries: TimeEntry[];
  onSubmit: () => void;
  onBack: () => void;
}

Import types, calcHours, totalHours, billableHours from utils, ProjectDot from components.
Carbon imports: Tile, Button from '@carbon/react'
Icon: Checkmark from '@carbon/react/icons'

Layout: Same centered pattern as ReminderScreen (flex center, max-width 480px Tile).

Content:
1. Green checkmark: <Checkmark size={32} /> in a 64px circle container with backgroundColor "#198038", color white
2. <h2> "Friday is ready to submit"
3. Stats in 2×2 CSS grid (display: grid, gridTemplateColumns: 1fr 1fr, gap: 1rem):
   - Tile: totalHours(entries) + "h total"
   - Tile: billableHours(entries) + "h billable"
   - Tile: unique project count + " projects" (count unique non-null project IDs)
   - Tile: entries.length + " entries"
   Each stat Tile: large number as h3, label as small text below
4. Project breakdown: For each unique project in entries, show <ProjectDot color={project.color} /> + project name + calculated hours for that project. Use a simple list/div.
5. <Button kind="primary" onClick={onSubmit}>Submit timesheet</Button>
6. <Button kind="tertiary" onClick={onBack}>Back to edit</Button>

VERIFY: Run `npm run build`. These screens won't be visible yet (App.tsx still has placeholder) but TS compilation should succeed.
```

### Files Created
- `src/screens/ReminderScreen.tsx`
- `src/screens/ConfirmScreen.tsx`

### Verification
- `npm run build` — zero TS errors

---

## Phase 5: ReviewScreen (most complex)

**Goal:** Build the interactive review screen with entry list, inline editing, gap handling, and progress tracking.

### Agent Prompt

```
Working in /Users/anastasiiavlasenko/Desktop/time-sheet. Phases 1-4 complete.

Read TIMEFLOW_SPEC.md sections 7 (Screen 2+3) and 10 (Interactions) carefully.

Create src/screens/ReviewScreen.tsx:

Props:
{
  entries: TimeEntry[];
  onUpdateEntry: (id: number, updates: Partial<TimeEntry>) => void;
  onDeleteEntry: (id: number) => void;
  onAddEntry: () => void;
  onConfirmAll: () => void;
}

Imports:
- { useState } from 'react'
- { Tile, Button, Dropdown, TextInput } from '@carbon/react'
- { Checkmark, TrashCan, Add } from '@carbon/react/icons'
- ProjectDot, ConfidenceBadge, SourceTag, ProgressRing from '../components/'
- { calcHours, totalHours, billableHours } from '../utils/timeHelpers'
- { PROJECTS } from '../data/mockData'
- { TimeEntry, Project } from '../types'

Local state:
const [expandedId, setExpandedId] = useState<number | null>(null);

LAYOUT:

1. HEADER SECTION — flex row, space-between:
   Left: <p>"Friday, March 13"</p> + <h2>"AI-generated timesheet"</h2>
   Right: <ProgressRing value={totalHours(entries)} max={8} /> + <div>"{totalHours}h total" / "{billableHours}h billable"</div>

2. ENTRY LIST — map over entries, render each as a styled div (NOT ClickableTile):

   For each entry:
   - Outer div: cursor pointer, padding 1rem, marginBottom 0.5rem, background white, border 1px solid #e0e0e0, borderRadius 4px
   - If entry.confirmed: borderLeft "4px solid #198038" (green)
   - If entry.source === "gap": borderLeft "4px solid #f1c21b" (yellow/warning)
   - onClick: toggle expandedId (but use e.stopPropagation on nested interactive elements)

   NORMAL ENTRY content (source !== "gap"):
   - Flex row
   - Time column (width 90px, flexShrink 0):
     - Bold: "{entry.start}–{entry.end}"
     - Secondary text: "{calcHours(entry.start, entry.end)}h"
   - Content column (flex 1):
     - Row 1 (flex row, alignItems center, gap 0.5rem):
       <ProjectDot color={entry.project?.color || '#ccc'} />
       <span style bold>{entry.project?.name || 'Unassigned'}</span>
       <ConfidenceBadge level={entry.confidence} />
       <SourceTag source={entry.source} />
       {entry.confirmed && <Checkmark size={16} style={{ color: '#198038' }} />}
     - Row 2: <p style secondary>{entry.task}</p>

   GAP ENTRY content (source === "gap"):
   - Title: "Unrecognized gap ({entry.start}–{entry.end})"
   - Three quick-fill buttons (flex row, gap):
     <Button kind="ghost" size="sm" onClick={(e) => { e.stopPropagation(); fill as meeting }}>Meeting</Button>
     <Button kind="ghost" size="sm" onClick={(e) => { e.stopPropagation(); fill as focus }}>Focus work</Button>
     <Button kind="ghost" size="sm" onClick={(e) => { e.stopPropagation(); fill as break }}>Break</Button>
   - Quick-fill logic:
     "Meeting" → onUpdateEntry(id, { project: PROJECTS[1] (Beta), task: "Client meeting", source: "manual", confidence: "high", confirmed: true })
     "Focus work" → onUpdateEntry(id, { project: PROJECTS[0] (Alpha), task: "Focus work", source: "manual", confidence: "medium", confirmed: true })
     "Break" → onUpdateEntry(id, { project: PROJECTS[2] (Internal), task: "Break", source: "manual", confidence: "high", confirmed: true })

   EXPANDED EDIT FORM (when expandedId === entry.id):
   Show below the entry content. Wrap in a div with padding-top, border-top, onClick stopPropagation.
   - <Dropdown
       id={`project-select-${entry.id}`}
       titleText="Project"
       label="Select project"
       items={PROJECTS}
       itemToString={(p: Project) => p ? p.name : ''}
       selectedItem={entry.project}
       onChange={({ selectedItem }) => { if (selectedItem) onUpdateEntry(entry.id, { project: selectedItem }) }}
     />
   - <TextInput
       id={`task-input-${entry.id}`}
       labelText="Task"
       value={entry.task}
       onChange={(e) => onUpdateEntry(entry.id, { task: e.target.value })}
       style={{ marginTop: '0.5rem' }}
     />
   - <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
       <Button kind="primary" size="sm" onClick={(e) => {
         e.stopPropagation();
         onUpdateEntry(entry.id, { confirmed: true });
         setExpandedId(null);
       }}>Confirm</Button>
       <Button kind="danger--ghost" size="sm" onClick={(e) => {
         e.stopPropagation();
         onDeleteEntry(entry.id);
       }}>Delete</Button>
     </div>

3. BOTTOM SECTION:
   <div style flex, gap, justifyContent space-between, marginTop 1.5rem>
     <Button kind="ghost" renderIcon={Add} onClick={onAddEntry}>Add entry</Button>
     <Button kind="primary" disabled={!entries.every(e => e.confirmed)} onClick={onConfirmAll}>
       Confirm all
     </Button>
   </div>

IMPORTANT NOTES:
- Use e.stopPropagation() on ALL nested buttons, dropdowns, and inputs to prevent tile click from toggling expand
- The Dropdown component from @carbon/react uses { selectedItem } in onChange callback
- Keep gap entries clickable too — clicking should expand the edit form (an alternative to quick-fill)

VERIFY: Run `npm run build` — should succeed with no TS errors.
```

### Files Created
- `src/screens/ReviewScreen.tsx`

### Verification
- `npm run build` — zero TS errors

---

## Phase 6: TimesheetScreen

**Goal:** Build the weekly timesheet grid with Carbon Table components.

### Agent Prompt

```
Working in /Users/anastasiiavlasenko/Desktop/time-sheet. Phases 1-5 complete.

Read TIMEFLOW_SPEC.md section 7 (Screen 5: TimesheetScreen).

Create src/screens/TimesheetScreen.tsx:

Props:
{
  weeklyData: WeeklyProjectRow[];
  fridayConfirmed: boolean;
  onNavigate: (screen: Screen) => void;
}

Imports:
- { Table, TableHead, TableRow, TableHeader, TableBody, TableCell, Tag, Button } from '@carbon/react'
- ProjectDot from '../components/ProjectDot'
- { WeeklyProjectRow, Screen } from '../types'

NO Carbon DataTable render-prop — use raw Table components (no sorting needed).

LAYOUT:

1. HEADER (flex row, space-between, marginBottom 1.5rem):
   Left: <h2>"Weekly timesheet"</h2> + <p style secondary>"March 9–13, 2026"</p>
   Right: <Button kind="ghost" size="sm">Export CSV</Button> (no-op)

2. TABLE:
   Define days array: ['mon', 'tue', 'wed', 'thu', 'fri'] with labels ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
   Define status for each day: Mon-Thu = "confirmed", Fri = fridayConfirmed ? "confirmed" : "today"

   <Table>
     <TableHead>
       <TableRow>
         <TableHeader>Project</TableHeader>
         {days.map(day =>
           <TableHeader key={day.key}>
             {day.label}
             <span style={dot indicator}>
               — green dot (8px circle) for "confirmed"
               — blue dot for "today"
             </span>
           </TableHeader>
         )}
         <TableHeader>Total</TableHeader>
       </TableRow>
     </TableHead>
     <TableBody>
       {weeklyData.map(row => {
         const days = [row.mon, row.tue, row.wed, row.thu, row.fri];
         const total = days.filter(d => d !== null).reduce((s, d) => s + d!, 0);
         return (
           <TableRow key={row.projectId}>
             <TableCell>
               <ProjectDot color={row.projectColor} />
               {row.projectName}
             </TableCell>
             {days.map((val, i) =>
               <TableCell key={i} style={val === null ? { color: '#a8a8a8' } : {}}>
                 {val !== null ? val.toFixed(1) : '—'}
               </TableCell>
             )}
             <TableCell style={{ fontWeight: 600 }}>{total.toFixed(1)}</TableCell>
           </TableRow>
         );
       })}
       {/* Footer: Daily totals */}
       <TableRow>
         <TableCell style={{ fontWeight: 700 }}>Daily total</TableCell>
         {['mon', 'tue', 'wed', 'thu', 'fri'].map((dayKey, i) => {
           const sum = weeklyData.reduce((s, r) => s + (r[dayKey as keyof WeeklyProjectRow] as number || 0), 0);
           return <TableCell key={i} style={{ fontWeight: 700 }}>{sum.toFixed(1)}</TableCell>;
         })}
         <TableCell style={{ fontWeight: 700 }}>
           {weeklyData.reduce((s, r) => {
             return s + [r.mon, r.tue, r.wed, r.thu, r.fri].filter(d => d !== null).reduce((a, b) => a + b!, 0);
           }, 0).toFixed(1)}
         </TableCell>
       </TableRow>
     </TableBody>
   </Table>

3. BELOW TABLE (marginTop 1.5rem):
   <div style flex, alignItems center, gap>
     <h3>Week total: {grandTotal}h</h3>
     {fridayConfirmed && <Tag type="green">Submitted</Tag>}
   </div>

4. NAVIGATION (marginTop 1rem, flex, justifyContent space-between):
   <Button kind="ghost" onClick={() => onNavigate("reminder")}>← Back to today</Button>
   <Button kind="ghost" onClick={() => onNavigate("dashboard")}>View dashboard →</Button>

VERIFY: npm run build — zero TS errors.
```

### Files Created
- `src/screens/TimesheetScreen.tsx`

### Verification
- `npm run build` — zero TS errors

---

## Phase 7: DashboardScreen

**Goal:** Build the analytics dashboard with KPI tiles, 3 Carbon Charts, and a team compliance table.

### Agent Prompt

```
Working in /Users/anastasiiavlasenko/Desktop/time-sheet. Phases 1-6 complete.

Read TIMEFLOW_SPEC.md section 7 (Screen 6: DashboardScreen) for exact chart options and layout.

Create src/screens/DashboardScreen.tsx:

Props: {} (no props needed — all data from mock)

Imports:
- { Grid, Column, Tile, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, Tag } from '@carbon/react'
- { LineChart, DonutChart, StackedBarChart } from '@carbon/charts-react'
- { dailyTrendData, projectHoursData, billableData, teamData } from '../data/mockData'

LAYOUT using Carbon Grid (16-column system):

1. PAGE HEADER:
   <h2 style={{ marginBottom: '1.5rem' }}>Dashboard</h2>

2. KPI TILES ROW — <Grid> with 4 <Column lg={4} md={4} sm={4}>:
   Define a local array:
   const kpis = [
     { label: "Team compliance", value: "78%", trend: "↑ 5%", trendLabel: "vs last week", positive: true },
     { label: "Avg hours/day", value: "7.8h", trend: "→", trendLabel: "same as last week", positive: null },
     { label: "Billable ratio", value: "82%", trend: "↑ 3%", trendLabel: "vs last week", positive: true },
     { label: "AI accuracy", value: "91%", trend: "↑ 2%", trendLabel: "vs last week", positive: true },
   ];

   Each renders as:
   <Tile style={{ padding: '1.5rem' }}>
     <p style={{ fontSize: '0.875rem', color: '#525252' }}>{kpi.label}</p>
     <h3 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>{kpi.value}</h3>
     <span style={{ color: positive ? '#198038' : positive === false ? '#da1e28' : '#525252', fontSize: '0.875rem' }}>
       {kpi.trend} {kpi.trendLabel}
     </span>
   </Tile>

3. CHARTS ROW 1 — <Grid style={{ marginTop: '1.5rem' }}> with 2 <Column lg={8} md={8} sm={4}>:

   Left: <Tile style={{ padding: '1rem' }}>
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
   </Tile>

   Right: <Tile style={{ padding: '1rem' }}>
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
   </Tile>

4. CHARTS ROW 2 — <Grid style={{ marginTop: '1.5rem' }}> with 2 <Column lg={8} md={8} sm={4}>:

   Left: <Tile style={{ padding: '1rem' }}>
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
   </Tile>

   Right: <Tile style={{ padding: '1rem' }}>
     <h4 style={{ marginBottom: '1rem' }}>Team compliance</h4>
     <Table>
       <TableHead>
         <TableRow>
           <TableHeader>Name</TableHeader>
           <TableHeader>Hours this week</TableHeader>
           <TableHeader>Compliance</TableHeader>
           <TableHeader>Avg confirm time</TableHeader>
         </TableRow>
       </TableHead>
       <TableBody>
         {teamData.map(member => (
           <TableRow key={member.name} style={member.name === "You" ? { backgroundColor: '#e8f0fe' } : {}}>
             <TableCell style={{ fontWeight: member.name === "You" ? 600 : 400 }}>{member.name}</TableCell>
             <TableCell>{member.hoursThisWeek}</TableCell>
             <TableCell>
               <Tag type={member.complianceRate >= 90 ? "green" : member.complianceRate >= 70 ? "warm-gray" : "red"} size="sm">
                 {member.complianceRate}%
               </Tag>
             </TableCell>
             <TableCell>{member.avgConfirmTime}</TableCell>
           </TableRow>
         ))}
       </TableBody>
     </Table>
   </Tile>

KNOWN PITFALLS:
- If Tag type="warm-gray" causes a TS error, use type="gray" instead
- Charts need their parent to have explicit width — wrapping in <Tile> with padding handles this
- Charts may flicker on first render in dev mode — this is normal
- Use theme: "g10" on all chart options to match the app theme

VERIFY: npm run build — zero TS errors.
```

### Files Created
- `src/screens/DashboardScreen.tsx`

### Verification
- `npm run build` — zero TS errors

---

## Phase 8: App Shell — Wire Everything Together

**Goal:** Replace the placeholder App.tsx with the full implementation: Carbon UI Shell header, state management, screen routing, and all handler functions.

### Agent Prompt

```
Working in /Users/anastasiiavlasenko/Desktop/time-sheet. Phases 1-7 complete — all screens and components exist.

Read the existing files first to understand what's available:
- src/types.ts (all types including Screen, TimeEntry, WeeklyProjectRow)
- src/data/mockData.ts (PROJECTS, MOCK_TODAY_ENTRIES, MOCK_WEEKLY_DATA)
- src/utils/timeHelpers.ts (calcHours)
- src/screens/*.tsx (all 5 screens)

Now REPLACE src/App.tsx with the full implementation:

Imports:
- { useState } from 'react'
- { Header, HeaderName, HeaderNavigation, HeaderMenuItem, HeaderGlobalBar, HeaderGlobalAction, Content, Theme } from '@carbon/react'
- { Notification } from '@carbon/react/icons'
- All 5 screens from '../screens/*'
- { Screen, TimeEntry, WeeklyProjectRow } from '../types'
- { MOCK_TODAY_ENTRIES, MOCK_WEEKLY_DATA, PROJECTS } from '../data/mockData'
- { calcHours } from '../utils/timeHelpers'

STATE:
const [screen, setScreen] = useState<Screen>("reminder");
const [todayEntries, setTodayEntries] = useState<TimeEntry[]>(MOCK_TODAY_ENTRIES);
const [weeklyData, setWeeklyData] = useState<WeeklyProjectRow[]>(MOCK_WEEKLY_DATA);
const [fridayConfirmed, setFridayConfirmed] = useState(false);

HANDLER FUNCTIONS:

handleUpdateEntry = (id: number, updates: Partial<TimeEntry>) => {
  setTodayEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
};

handleDeleteEntry = (id: number) => {
  setTodayEntries(prev => prev.filter(e => e.id !== id));
};

handleAddEntry = () => {
  const lastEntry = todayEntries[todayEntries.length - 1];
  const newStart = lastEntry ? lastEntry.end : "17:30";
  const [h, m] = newStart.split(":").map(Number);
  const newEnd = `${String(h + 1).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  const newEntry: TimeEntry = {
    id: Date.now(),
    start: newStart,
    end: newEnd,
    project: null,
    task: "",
    source: "manual",
    confidence: "low",
    confirmed: false,
  };
  setTodayEntries(prev => [...prev, newEntry]);
};

handleConfirmAll = () => {
  setScreen("confirm");
};

handleSubmit = () => {
  // Calculate Friday hours per project from todayEntries
  const fridayHours: Record<number, number> = {};
  todayEntries.forEach(entry => {
    if (entry.project) {
      const hours = calcHours(entry.start, entry.end);
      fridayHours[entry.project.id] = (fridayHours[entry.project.id] || 0) + hours;
    }
  });

  // Update weeklyData with Friday values
  setWeeklyData(prev => prev.map(row => ({
    ...row,
    fri: fridayHours[row.projectId] || 0,
  })));

  setFridayConfirmed(true);
  setScreen("timesheet");
};

RENDER:
<Theme theme="g10">
  <Header aria-label="TimeFlow">
    <HeaderName href="#" prefix="" onClick={(e) => { e.preventDefault(); setScreen("reminder"); }}>
      TimeFlow
    </HeaderName>
    <HeaderNavigation aria-label="Main navigation">
      <HeaderMenuItem
        isCurrentPage={screen === "reminder" || screen === "review" || screen === "confirm"}
        onClick={() => setScreen("reminder")}
      >
        Today
      </HeaderMenuItem>
      <HeaderMenuItem
        isCurrentPage={screen === "timesheet"}
        onClick={() => setScreen("timesheet")}
      >
        Timesheet
      </HeaderMenuItem>
      <HeaderMenuItem
        isCurrentPage={screen === "dashboard"}
        onClick={() => setScreen("dashboard")}
      >
        Dashboard
      </HeaderMenuItem>
    </HeaderNavigation>
    <HeaderGlobalBar>
      <HeaderGlobalAction aria-label="Notifications" tooltipAlignment="end">
        <Notification size={20} />
      </HeaderGlobalAction>
    </HeaderGlobalBar>
  </Header>
  <Content>
    {screen === "reminder" && (
      <ReminderScreen onReview={() => setScreen("review")} />
    )}
    {screen === "review" && (
      <ReviewScreen
        entries={todayEntries}
        onUpdateEntry={handleUpdateEntry}
        onDeleteEntry={handleDeleteEntry}
        onAddEntry={handleAddEntry}
        onConfirmAll={handleConfirmAll}
      />
    )}
    {screen === "confirm" && (
      <ConfirmScreen
        entries={todayEntries}
        onSubmit={handleSubmit}
        onBack={() => setScreen("review")}
      />
    )}
    {screen === "timesheet" && (
      <TimesheetScreen
        weeklyData={weeklyData}
        fridayConfirmed={fridayConfirmed}
        onNavigate={setScreen}
      />
    )}
    {screen === "dashboard" && (
      <DashboardScreen />
    )}
  </Content>
</Theme>

NOTE on HeaderMenuItem: If isCurrentPage prop doesn't exist in the installed Carbon version, use aria-current={isActive ? "page" : undefined} instead, or simply omit the active state indicator.

VERIFY:
1. npm run dev — app starts, shows Reminder screen
2. Click "Review now" — see entries with edit/confirm functionality
3. Confirm all entries, click "Confirm all" — see summary
4. Click "Submit timesheet" — see weekly table with Friday filled
5. Navigate via header: Today, Timesheet, Dashboard all work
6. Dashboard shows 4 KPI tiles + 3 charts + team table
7. npm run build — production build succeeds
```

### Files Modified
- `src/App.tsx` (full rewrite)

### Verification
- `npm run dev` — full app works end-to-end
- Complete user flow: Reminder → Review → Confirm → Timesheet
- Header navigation works for all 3 tabs
- Dashboard charts render correctly
- `npm run build` — production build succeeds

---

## Summary: Phase Execution Order

| Phase | What | Depends On | Key Files |
|-------|------|-----------|-----------|
| 1 | Scaffold + Config | Nothing | vite.config.ts, index.scss, main.tsx |
| 2 | Types + Utils + Mock Data | Phase 1 | types.ts, timeHelpers.ts, mockData.ts |
| 3 | Small Components | Phase 2 | ProjectDot, ConfidenceBadge, SourceTag, ProgressRing |
| 4 | Reminder + Confirm Screens | Phase 3 | ReminderScreen.tsx, ConfirmScreen.tsx |
| 5 | Review Screen | Phase 3 | ReviewScreen.tsx |
| 6 | Timesheet Screen | Phase 3 | TimesheetScreen.tsx |
| 7 | Dashboard Screen | Phase 2 | DashboardScreen.tsx |
| 8 | App Shell (wire all) | Phases 4-7 | App.tsx |

**Phases 4, 5, 6, 7 can run in parallel** (they are independent screens). Phase 8 must run last.
