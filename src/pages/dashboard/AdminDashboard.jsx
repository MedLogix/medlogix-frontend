import AnalyticsService from "@/services/analyticsService";
import { useQuery } from "@tanstack/react-query";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, Line, LineChart, Pie, PieChart, CartesianGrid, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { useMemo } from "react";

// Format data for charts
const verificationStatusConfig = {
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-2))", // Use CSS variable
  },
  verified: {
    label: "Verified",
    color: "hsl(var(--chart-1))", // Use CSS variable
  },
  rejected: {
    label: "Rejected",
    color: "hsl(var(--chart-3))", // Use CSS variable
  },
};

const requirementStatusConfig = {
  Pending: {
    label: "Pending",
    color: "hsl(var(--chart-2))", // Use CSS variable
  },
  Shipped: {
    label: "Shipped",
    color: "hsl(var(--chart-3))", // Use CSS variable
  },
  Rejected: {
    label: "Rejected",
    color: "hsl(var(--chart-4))", // Use CSS variable
  },
  Received: {
    label: "Received",
    color: "hsl(var(--chart-1))", // Use CSS variable
  },
};

const logisticsStatusConfig = {
  "In Transit": {
    label: "In Transit",
    color: "hsl(var(--chart-3))", // Use CSS variable
  },
  Delivered: {
    label: "Delivered",
    color: "hsl(var(--chart-1))", // Use CSS variable
  },
};

const stockNearExpiryConfig = {
  "<30d": {
    label: "Less than 30 days",
    color: "hsl(var(--chart-1))", // Use CSS variable
  },
  "30-60d": {
    label: "30-60 days",
    color: "hsl(var(--chart-2))", // Use CSS variable
  },
  "60-90d": {
    label: "60-90 days",
    color: "hsl(var(--chart-3))", // Use CSS variable
  },
};

const monthlyActivityConfig = {
  newRequirements: {
    label: "New Requirements",
    color: "hsl(var(--chart-3))", // Use CSS variable
  },
  deliveredLogistics: {
    label: "Delivered Logistics",
    color: "hsl(var(--chart-1))", // Use CSS variable
  },
};

const topMedicinesConfig = {
  value: {
    label: "Quantity",
    color: "#8884d8",
  },
};

const AdminDashboard = () => {
  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ["admin-kpis"],
    queryFn: async () => {
      const { data } = await AnalyticsService.getAdminKpis();
      return data?.data;
    },
  });

  const { data: charts, isLoading: chartsLoading } = useQuery({
    queryKey: ["admin-charts"],
    queryFn: async () => {
      const { data } = await AnalyticsService.getAdminCharts();
      return data?.data;
    },
  });

  const institutionsData = useMemo(() => {
    return (
      charts?.verificationStatus?.institutions?.map((item) => ({
        name: item._id,
        value: item.count,
      })) || []
    );
  }, [charts]);

  const warehousesData = useMemo(() => {
    return (
      charts?.verificationStatus?.warehouses?.map((item) => ({
        name: item._id,
        value: item.count,
      })) || []
    );
  }, [charts]);

  const requirementStatusData = useMemo(() => {
    return (
      charts?.requirementStatus?.map((item) => ({
        name: item._id,
        value: item.count,
      })) || []
    );
  }, [charts]);

  const logisticsStatusData = useMemo(() => {
    return (
      charts?.logisticsStatus?.map((item) => ({
        name: item._id,
        value: item.count,
      })) || []
    );
  }, [charts]);

  const topMedicinesData = useMemo(() => {
    return (
      charts?.topStockedMedicines?.map((item) => ({
        name: item.medicineName.length > 20 ? item.medicineName.substring(0, 20) + "..." : item.medicineName,
        value: item.totalQuantity,
      })) || []
    );
  }, [charts]);

  const stockNearExpiryData = useMemo(() => {
    return (
      charts?.stockNearExpiry?.map((item) => ({
        name: item.bucket,
        value: item.totalQuantity,
      })) || []
    );
  }, [charts]);

  const monthlyActivityData = useMemo(() => {
    return (
      charts?.monthlyActivity?.map((item) => ({
        name: item.month.substring(5), // Just show the month part (MM)
        month: item.month,
        newRequirements: item.newRequirements,
        deliveredLogistics: item.deliveredLogistics,
      })) || []
    );
  }, [charts]);

  const isLoading = kpisLoading || chartsLoading;

  if (isLoading) {
    return <div className="p-6">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Verified Institutions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis?.verifiedInstitutions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Verified Warehouses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis?.verifiedWarehouses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pending Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis?.pendingVerifications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Medicines</CardTitle>
            <CardDescription>Total medicines in system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis?.activeMedicines}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Verification Status Charts */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Institution Verification</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ChartContainer config={verificationStatusConfig} className="h-[250px]">
                <PieChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
                  <Pie
                    data={institutionsData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    labelLine={false}
                    label={false}
                  >
                    {institutionsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={verificationStatusConfig[entry.name]?.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend
                    content={<ChartLegendContent />}
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Warehouse Verification</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ChartContainer config={verificationStatusConfig} className="h-[250px]">
                <PieChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
                  <Pie
                    data={warehousesData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    labelLine={false}
                    label={false}
                  >
                    {warehousesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={verificationStatusConfig[entry.name]?.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend
                    content={<ChartLegendContent />}
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* System Requirement Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Requirement Status</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={requirementStatusConfig} className="h-[250px]">
              <PieChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
                <Pie
                  data={requirementStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={40}
                  labelLine={false}
                  label={false}
                >
                  {requirementStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={requirementStatusConfig[entry.name]?.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend
                  content={<ChartLegendContent />}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* System Logistics Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Logistics Status</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={logisticsStatusConfig} className="h-[280px]">
              <BarChart data={logisticsStatusData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" label={{ value: "Status", position: "insideBottom", offset: -10 }} />
                <YAxis label={{ value: "Count", angle: -90, position: "insideLeft" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} verticalAlign="bottom" align="center" />
                <Bar dataKey="value" radius={4}>
                  {logisticsStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={logisticsStatusConfig[entry.name]?.color} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top 5 Stocked Medicines */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Stocked Medicines</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={topMedicinesConfig} className="h-[300px]">
              <BarChart data={topMedicinesData} layout="vertical" margin={{ top: 20, right: 30, bottom: 20, left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" label={{ value: "Total Quantity", position: "insideBottom", offset: -10 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: "Medicine Name", angle: -90, position: "insideLeft", offset: -25 }}
                />
                <Tooltip formatter={(value) => new Intl.NumberFormat().format(value)} />
                <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Stock Nearing Expiry */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Nearing Expiry</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={stockNearExpiryConfig} className="h-[280px]">
              <BarChart data={stockNearExpiryData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" label={{ value: "Expiry Range", position: "insideBottom", offset: -10 }} />
                <YAxis label={{ value: "Total Quantity", angle: -90, position: "insideLeft" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} verticalAlign="bottom" align="center" />
                <Bar dataKey="value" radius={4}>
                  {stockNearExpiryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={stockNearExpiryConfig[entry.name]?.color} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Monthly Activity */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={monthlyActivityConfig} className="h-[300px] w-full">
              <LineChart data={monthlyActivityData} margin={{ top: 20, right: 40, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" label={{ value: "Month", position: "insideBottom", offset: -10 }} />
                <YAxis label={{ value: "Count", angle: -90, position: "insideLeft" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} verticalAlign="bottom" align="center" />
                <Line type="monotone" dataKey="newRequirements" stroke="hsl(var(--chart-3))" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="deliveredLogistics" stroke="hsl(var(--chart-1))" />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
