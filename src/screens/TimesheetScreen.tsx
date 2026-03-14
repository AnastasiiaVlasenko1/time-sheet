import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tag,
  Button,
} from "@carbon/react";
import ProjectDot from "../components/ProjectDot";
import type { WeeklyProjectRow, Screen } from "../types";

interface TimesheetScreenProps {
  weeklyData: WeeklyProjectRow[];
  fridayConfirmed: boolean;
  onNavigate: (screen: Screen) => void;
}

const days: { key: "mon" | "tue" | "wed" | "thu" | "fri"; label: string }[] = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
];

const TimesheetScreen: React.FC<TimesheetScreenProps> = ({
  weeklyData,
  fridayConfirmed,
  onNavigate,
}) => {
  const dayStatuses = days.map((d) => {
    if (d.key === "fri") {
      return fridayConfirmed ? "confirmed" : "today";
    }
    return "confirmed" as const;
  });

  const grandTotal = weeklyData
    .reduce((s, r) => {
      return (
        s +
        [r.mon, r.tue, r.wed, r.thu, r.fri]
          .filter((d): d is number => d !== null)
          .reduce((a, b) => a + b, 0)
      );
    }, 0)
    .toFixed(1);

  return (
    <div>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h2>Weekly timesheet</h2>
          <p style={{ color: "var(--cds-text-secondary, #525252)" }}>
            March 9–13, 2026
          </p>
        </div>
        <Button kind="ghost" size="sm" disabled title="Coming soon">
          Export CSV
        </Button>
      </div>

      {/* TABLE */}
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Project</TableHeader>
            {days.map((day, i) => (
              <TableHeader key={day.key}>
                {day.label}
                <span
                  aria-label={dayStatuses[i] === "confirmed" ? `${day.label} confirmed` : `${day.label} pending`}
                  title={dayStatuses[i] === "confirmed" ? "Confirmed" : "Pending"}
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor:
                      dayStatuses[i] === "confirmed" ? "#24a148" : "#0f62fe",
                    marginLeft: 6,
                    verticalAlign: "middle",
                  }}
                />
              </TableHeader>
            ))}
            <TableHeader>Total</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {weeklyData.map((row) => {
            const dayValues = [row.mon, row.tue, row.wed, row.thu, row.fri];
            const total = dayValues
              .filter((d): d is number => d !== null)
              .reduce((s, d) => s + d, 0);
            return (
              <TableRow key={row.projectId}>
                <TableCell>
                  <ProjectDot color={row.projectColor} />
                  {row.projectName}
                </TableCell>
                {dayValues.map((val, i) => (
                  <TableCell
                    key={i}
                    style={val === null ? { color: "#a8a8a8" } : {}}
                  >
                    {val !== null ? val.toFixed(1) : "\u2014"}
                  </TableCell>
                ))}
                <TableCell style={{ fontWeight: 600 }}>
                  {total.toFixed(1)}
                </TableCell>
              </TableRow>
            );
          })}
          {/* Footer: Daily totals */}
          <TableRow>
            <TableCell style={{ fontWeight: 700 }}>Daily total</TableCell>
            {days.map((day, i) => {
              const sum = weeklyData.reduce(
                (s, r) => s + ((r[day.key] as number) || 0),
                0
              );
              return (
                <TableCell key={i} style={{ fontWeight: 700 }}>
                  {sum.toFixed(1)}
                </TableCell>
              );
            })}
            <TableCell style={{ fontWeight: 700 }}>{grandTotal}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* BELOW TABLE */}
      <div
        style={{
          marginTop: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <h3>Week total: {grandTotal}h</h3>
        {fridayConfirmed && <Tag type="green">Submitted</Tag>}
      </div>

      {/* NAVIGATION */}
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button kind="ghost" onClick={() => onNavigate("review")}>
          &larr; Back to today
        </Button>
        <Button kind="ghost" onClick={() => onNavigate("dashboard")}>
          View dashboard &rarr;
        </Button>
      </div>
    </div>
  );
};

export default TimesheetScreen;
