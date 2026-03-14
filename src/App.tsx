import { useState } from "react";
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
  Content,
  Theme,
} from "@carbon/react";
import { Notification } from "@carbon/react/icons";
import ReviewScreen from "./screens/ReviewScreen";
import ConfirmScreen from "./screens/ConfirmScreen";
import TimesheetScreen from "./screens/TimesheetScreen";
import DashboardScreen from "./screens/DashboardScreen";
import type { Screen, TimeEntry, WeeklyProjectRow } from "./types";
import { MOCK_TODAY_ENTRIES, MOCK_WEEKLY_DATA } from "./data/mockData";
import { calcHours } from "./utils/timeHelpers";

function App() {
  const [screen, setScreen] = useState<Screen>("review");
  const [todayEntries, setTodayEntries] =
    useState<TimeEntry[]>(MOCK_TODAY_ENTRIES);
  const [weeklyData, setWeeklyData] =
    useState<WeeklyProjectRow[]>(MOCK_WEEKLY_DATA);
  const [fridayConfirmed, setFridayConfirmed] = useState(false);

  const handleUpdateEntry = (id: number, updates: Partial<TimeEntry>) => {
    setTodayEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const handleDeleteEntry = (id: number) => {
    setTodayEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleAddEntry = () => {
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
    setTodayEntries((prev) => [...prev, newEntry]);
  };

  const handleConfirmAll = () => {
    setScreen("confirm");
  };

  const handleSubmit = () => {
    // Calculate Friday hours per project from todayEntries
    const fridayHours: Record<number, number> = {};
    todayEntries.forEach((entry) => {
      if (entry.project) {
        const hours = calcHours(entry.start, entry.end);
        fridayHours[entry.project.id] =
          (fridayHours[entry.project.id] || 0) + hours;
      }
    });

    // Update weeklyData with Friday values
    setWeeklyData((prev) =>
      prev.map((row) => ({
        ...row,
        fri: fridayHours[row.projectId] || 0,
      }))
    );

    setFridayConfirmed(true);
    setScreen("timesheet");
  };

  return (
    <Theme theme="g10">
      <Header aria-label="TimeFlow">
        <HeaderName
          href="#"
          prefix=""
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            setScreen("review");
          }}
        >
          TimeFlow
        </HeaderName>
        <HeaderNavigation aria-label="Main navigation">
          <HeaderMenuItem
            isCurrentPage={
              screen === "review" ||
              screen === "confirm"
            }
            onClick={() => setScreen("review")}
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
          <HeaderGlobalAction
            aria-label="Notifications"
            tooltipAlignment="end"
          >
            <Notification size={20} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>
      <Content>
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
        {screen === "dashboard" && <DashboardScreen />}
      </Content>
    </Theme>
  );
}

export default App;
