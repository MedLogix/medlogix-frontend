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

const requirementStatusConfig = {
  Pending: {
    label: "Pending",
    color: "hsl(var(--chart-2))",
  },
  Shipped: {
    label: "Shipped",
    color: "hsl(var(--chart-3))",
  },
  Rejected: {
    label: "Rejected",
    color: "hsl(var(--chart-4))",
  },
  Received: {
    label: "Received",
    color: "hsl(var(--chart-1))",
  },
};

const stockExpiryProfileConfig = {
  "<30d": {
    label: "Less than 30 days",
    color: "hsl(var(--chart-1))",
  },
  "30-60d": {
    label: "30-60 days",
    color: "hsl(var(--chart-2))",
  },
  "60-90d": {
    label: "60-90 days",
    color: "hsl(var(--chart-3))",
  },
  ">90d": {
    label: "More than 90 days",
    color: "hsl(var(--chart-4))",
  },
};

const monthlyUsageConfig = {
  totalQuantityUsed: {
    label: "Quantity Used",
    color: "hsl(var(--chart-1))",
  },
};

const topInventoryItemsConfig = {
  value: {
    label: "Quantity",
    color: "#8884d8", // Or use CSS variable like hsl(var(--chart-5))
  },
};

const InstitutionDashboard = () => {
  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ["institution-kpis"],
    queryFn: async () => {
      const { data } = await AnalyticsService.getInstitutionKpis();
      return data?.data;
    },
  });

  const { data: charts, isLoading: chartsLoading } = useQuery({
    queryKey: ["institution-charts"],
    queryFn: async () => {
      const { data } = await AnalyticsService.getInstitutionCharts();
      return data?.data;
    },
  });

  // Process chart data using useMemo
  const myRequirementStatusData = useMemo(() => {
    return (
      charts?.myRequirementStatus?.map((item) => ({
        name: item._id,
        value: item.count,
      })) || []
    );
  }, [charts]);

  const topInventoryItemsData = useMemo(() => {
    return (
      charts?.topInventoryItems?.map((item) => ({
        name: item.medicineName.length > 20 ? item.medicineName.substring(0, 20) + "..." : item.medicineName,
        value: item.totalQuantity,
      })) || []
    );
  }, [charts]);

  const stockExpiryProfileData = useMemo(() => {
    // Ensure all buckets are present, even if count is 0
    const buckets = ["<30d", "30-60d", "60-90d", ">90d"];
    const dataMap = new Map(charts?.stockExpiryProfile?.map((item) => [item.bucket, item.totalQuantity]));
    return buckets.map((bucket) => ({
      name: bucket,
      value: dataMap.get(bucket) || 0,
    }));
  }, [charts]);

  const monthlyUsageData = useMemo(() => {
    return (
      charts?.monthlyUsage?.map((item) => ({
        name: item.month.substring(5), // Just show the month part (MM)
        month: item.month,
        totalQuantityUsed: item.totalQuantityUsed,
      })) || []
    );
  }, [charts]);

  const isLoading = kpisLoading || chartsLoading;

  if (isLoading) {
    return <div className="p-6">Loading dashboard data...</div>;
  }

  // Helper to format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "INR" }).format(value || 0);
  };

  return (
    <div className="space-y-6">
      {/* Added padding */}
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pending Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis?.pendingRequirements ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Incoming Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis?.incomingShipments ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(kpis?.inventoryValue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Items Near Expiry</CardTitle>
            <CardDescription>&lt; 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis?.nearExpiryItems ?? 0}</div>
          </CardContent>
        </Card>
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* My Requirement Status (Donut Chart) */}
        <Card>
          <CardHeader>
            <CardTitle>My Requirement Status</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={requirementStatusConfig} className="h-[250px]">
              <PieChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
                <Pie
                  data={myRequirementStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={40} // Donut chart
                  labelLine={false}
                  label={false}
                >
                  {myRequirementStatusData.map((entry, index) => (
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

        {/* My Top 5 Inventory Items (Horizontal Bar Chart) */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Inventory Items</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={topInventoryItemsConfig} className="h-[300px]">
              <BarChart
                data={topInventoryItemsData}
                layout="vertical"
                margin={{ top: 20, right: 30, bottom: 20, left: 40 }}
              >
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

        {/* My Stock Expiry Profile (Bar Chart) */}
        <Card>
          <CardHeader>
            <CardTitle>My Stock Expiry Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={stockExpiryProfileConfig} className="h-[280px]">
              <BarChart data={stockExpiryProfileData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" label={{ value: "Expiry Range", position: "insideBottom", offset: -10 }} />
                <YAxis label={{ value: "Total Quantity", angle: -90, position: "insideLeft" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                {/* No legend needed if using colors in bars */}
                <Bar dataKey="value" radius={4}>
                  {stockExpiryProfileData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={stockExpiryProfileConfig[entry.name]?.color} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Monthly Usage Trend (Line Chart) */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Usage Trend</CardTitle>
            <CardDescription>Quantity used per month (last 12 months)</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer config={monthlyUsageConfig} className="h-[300px] w-full">
              <LineChart data={monthlyUsageData} margin={{ top: 20, right: 40, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" label={{ value: "Month", position: "insideBottom", offset: -10 }} />
                <YAxis label={{ value: "Quantity Used", angle: -90, position: "insideLeft" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                {/* <ChartLegend content={<ChartLegendContent />} verticalAlign="bottom" align="center" /> */}
                <Line
                  type="monotone"
                  dataKey="totalQuantityUsed"
                  stroke="hsl(var(--chart-1))"
                  activeDot={{ r: 8 }}
                  name="Quantity Used"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InstitutionDashboard;
