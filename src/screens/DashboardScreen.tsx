import React from "react";
import {
  Grid,
  Column,
  Tile,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tag,
} from "@carbon/react";
import { LineChart, DonutChart, StackedBarChart } from "@carbon/charts-react";
import { ScaleTypes } from "@carbon/charts";
import {
  dailyTrendData,
  projectHoursData,
  billableData,
  teamData,
} from "../data/mockData";

const kpis = [
  {
    label: "Team compliance",
    value: "78%",
    trend: "↑ 5%",
    trendLabel: "vs last week",
    positive: true,
  },
  {
    label: "Avg hours/day",
    value: "7.8h",
    trend: "→",
    trendLabel: "same as last week",
    positive: null,
  },
  {
    label: "Billable ratio",
    value: "82%",
    trend: "↑ 3%",
    trendLabel: "vs last week",
    positive: true,
  },
  {
    label: "AI accuracy",
    value: "91%",
    trend: "↑ 2%",
    trendLabel: "vs last week",
    positive: true,
  },
];

const DashboardScreen: React.FC = () => {
  return (
    <div>
      {/* PAGE HEADER */}
      <h2 style={{ marginBottom: "1.5rem" }}>Dashboard</h2>

      {/* KPI TILES ROW */}
      <Grid>
        {kpis.map((kpi) => (
          <Column lg={4} md={4} sm={4} key={kpi.label}>
            <Tile style={{ padding: "1.5rem" }}>
              <p style={{ fontSize: "0.875rem", color: "#525252" }}>
                {kpi.label}
              </p>
              <h3 style={{ fontSize: "2rem", margin: "0.5rem 0" }}>
                {kpi.value}
              </h3>
              <span
                style={{
                  color:
                    kpi.positive === true
                      ? "#198038"
                      : kpi.positive === false
                        ? "#da1e28"
                        : "#525252",
                  fontSize: "0.875rem",
                }}
              >
                {kpi.trend} {kpi.trendLabel}
              </span>
            </Tile>
          </Column>
        ))}
      </Grid>

      {/* CHARTS ROW 1 */}
      <Grid style={{ marginTop: "1.5rem" }}>
        <Column lg={8} md={8} sm={4}>
          <Tile style={{ padding: "1rem" }}>
            <LineChart
              data={dailyTrendData}
              options={{
                title: "Daily hours — last 2 weeks",
                axes: {
                  bottom: { mapsTo: "date", scaleType: ScaleTypes.TIME },
                  left: { mapsTo: "value", title: "Hours" },
                },
                height: "320px",
                theme: "g10",
              }}
            />
          </Tile>
        </Column>
        <Column lg={8} md={8} sm={4}>
          <Tile style={{ padding: "1rem" }}>
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
        </Column>
      </Grid>

      {/* CHARTS ROW 2 */}
      <Grid style={{ marginTop: "1.5rem" }}>
        <Column lg={8} md={8} sm={4}>
          <Tile style={{ padding: "1rem" }}>
            <StackedBarChart
              data={billableData}
              options={{
                title: "Billable vs non-billable",
                axes: {
                  left: {
                    mapsTo: "value",
                    title: "Hours",
                    stacked: true,
                  },
                  bottom: { mapsTo: "key", scaleType: ScaleTypes.LABELS },
                },
                height: "320px",
                theme: "g10",
              }}
            />
          </Tile>
        </Column>
        <Column lg={8} md={8} sm={4}>
          <Tile style={{ padding: "1rem" }}>
            <h4 style={{ marginBottom: "1rem" }}>Team compliance</h4>
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
                {teamData.map((member) => (
                  <TableRow
                    key={member.name}
                    style={
                      member.name === "You"
                        ? { backgroundColor: "#e8f0fe" }
                        : {}
                    }
                  >
                    <TableCell
                      style={{
                        fontWeight: member.name === "You" ? 600 : 400,
                      }}
                    >
                      {member.name}
                    </TableCell>
                    <TableCell>{member.hoursThisWeek}</TableCell>
                    <TableCell>
                      <Tag
                        type={
                          member.complianceRate >= 90
                            ? "green"
                            : member.complianceRate >= 70
                              ? "gray"
                              : "red"
                        }
                        size="sm"
                      >
                        {member.complianceRate}%
                      </Tag>
                    </TableCell>
                    <TableCell>{member.avgConfirmTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Tile>
        </Column>
      </Grid>
    </div>
  );
};

export default DashboardScreen;
