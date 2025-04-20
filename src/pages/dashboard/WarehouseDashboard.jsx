import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import AnalyticsService from "@/services/analyticsService";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// --- Chart Configurations ---

const requirementStatusConfig = {
  Pending: { label: "Pending", color: "hsl(var(--chart-2))" },
  Shipped: { label: "Shipped", color: "hsl(var(--chart-3))" },
  Received: { label: "Received", color: "hsl(var(--chart-1))" },
  Rejected: { label: "Rejected", color: "hsl(var(--chart-4))" },
};

const topInventoryConfig = {
  availableQuantity: { label: "Available", color: "hsl(var(--chart-1))" },
  reservedQuantity: { label: "Reserved", color: "hsl(var(--chart-2))" },
};

const stockExpiryProfileConfig = {
  "<30d": { label: "< 30 days", color: "hsl(var(--chart-4))" }, // Red for immediate expiry
  "30-60d": { label: "30-60 days", color: "hsl(var(--chart-2))" }, // Orange
  "60-90d": { label: "60-90 days", color: "hsl(var(--chart-3))" }, // Yellow
  ">90d": { label: "> 90 days", color: "hsl(var(--chart-1))" }, // Green
};

const outgoingShipmentsStatusConfig = {
  "In Transit": { label: "In Transit", color: "hsl(var(--chart-3))" },
  Delivered: { label: "Delivered", color: "hsl(var(--chart-1))" },
};

const monthlyFulfillmentConfig = {
  requirementsShipped: { label: "Shipped", color: "hsl(var(--chart-1))" },
};

const WarehouseDashboard = () => {
  const { data: kpis, isLoading: kpisLoading } = useQuery({
    queryKey: ["warehouse-kpis"],
    queryFn: async () => {
      const { data } = await AnalyticsService.getWarehouseKpis();
      return data?.data;
    },
  });

  const { data: charts, isLoading: chartsLoading } = useQuery({
    queryKey: ["warehouse-charts"],
    queryFn: async () => {
      const { data } = await AnalyticsService.getWarehouseCharts();
      // Fix key for top inventory items if backend sends 'topInventoryItemsReserved'
      if (data?.data?.topInventoryItemsReserved && !data?.data?.topInventoryItems) {
        data.data.topInventoryItems = data.data.topInventoryItemsReserved;
        delete data.data.topInventoryItemsReserved; // Clean up if needed
      }
      return data?.data;
    },
  });

  // Helper to format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "INR" }).format(value || 0);
  };
  // --- Memoized Chart Data ---

  const incomingRequirementStatusData = useMemo(() => {
    return (
      charts?.incomingRequirementStatus?.map((item) => ({
        name: item._id,
        value: item.count,
      })) || []
    );
  }, [charts]);

  const topInventoryItemsData = useMemo(() => {
    return (
      charts?.topInventoryItems?.map((item) => ({
        name: item.medicineName.length > 20 ? item.medicineName.substring(0, 20) + "..." : item.medicineName,
        availableQuantity: item.availableQuantity,
        reservedQuantity: item.reservedQuantity,
        // total: item.availableQuantity + item.reservedQuantity, // Needed for stacked bar
      })) || []
    );
  }, [charts]);

  const stockExpiryProfileData = useMemo(() => {
    // Ensure consistent order: <30, 30-60, 60-90, >90
    const order = ["<30d", "30-60d", "60-90d", ">90d"];
    const dataMap = new Map(charts?.stockExpiryProfile?.map((item) => [item.bucket, item.totalQuantity]));
    return order.map((bucket) => ({
      name: stockExpiryProfileConfig[bucket]?.label || bucket,
      value: dataMap.get(bucket) || 0,
      bucket: bucket, // Keep original bucket for color mapping
    }));
  }, [charts]);

  const outgoingShipmentsStatusData = useMemo(() => {
    return (
      charts?.outgoingShipmentsStatus?.map((item) => ({
        name: item._id,
        value: item.count,
      })) || []
    );
  }, [charts]);

  const monthlyFulfillmentData = useMemo(() => {
    return (
      charts?.monthlyFulfillment
        ?.map((item) => ({
          name: item.month.substring(5), // Just show MM
          month: item.month, // Keep full month for potential tooltip use
          requirementsShipped: item.requirementsShipped,
        }))
        .sort((a, b) => a.month.localeCompare(b.month)) || [] // Ensure chronological order
    );
  }, [charts]);

  const isLoading = kpisLoading || chartsLoading;

  if (isLoading) {
    return <div className="p-6">Loading warehouse dashboard data...</div>;
  }

  return (
    <div className="space-y-6">
      {" "}
      {/* Added padding */}
      <h1 className="text-2xl font-bold">Warehouse Dashboard</h1>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Pending Requirements</CardTitle>
            <CardDescription>Incoming requirements needing action</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis?.pendingRequirements ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Inventory Value</CardTitle>
            <CardDescription>Total estimated value of stock</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(kpis?.inventoryValue ?? 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Items Near Expiry</CardTitle>
            <CardDescription>Items expiring within 90 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis?.nearExpiryItems ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Shipments</CardTitle>
            <CardDescription>Outgoing shipments currently in transit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis?.activeOutgoingShipments ?? 0}</div>
          </CardContent>
        </Card>
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Incoming Requirement Status (Donut) */}
        <Card>
          <CardHeader>
            <CardTitle>Incoming Requirement Status</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {incomingRequirementStatusData.length > 0 ? (
              <ChartContainer config={requirementStatusConfig} className="mx-auto aspect-square max-h-[300px]">
                <PieChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
                  <ChartTooltip content={<ChartTooltipContent nameKey="value" hideLabel />} />
                  <Pie
                    data={incomingRequirementStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60} // Donut chart
                    labelLine={false}
                    label={() => {
                      return null; // Decided against labels on segments for cleaner look
                    }}
                  >
                    {incomingRequirementStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={requirementStatusConfig[entry.name]?.color || "#cccccc"} />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="py-10 text-center text-gray-500">No requirement data available.</div>
            )}
          </CardContent>
        </Card>

        {/* Top 5 Inventory Items (Stacked Bar) */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Inventory Items</CardTitle>
            <CardDescription>Available vs. Reserved Quantity</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {topInventoryItemsData.length > 0 ? (
              <ChartContainer config={topInventoryConfig} className="h-[300px] w-full">
                {/* ResponsiveContainer ensures chart adapts */}
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={topInventoryItemsData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    stackOffset="none" // Ensure bars start from 0
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={100} // Adjust width as needed
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip cursor={{ fill: "hsl(var(--muted))" }} content={<ChartTooltipContent hideLabel />} />
                    <Legend verticalAlign="top" align="center" />
                    <Bar
                      dataKey="availableQuantity"
                      stackId="a"
                      fill={topInventoryConfig.availableQuantity.color}
                      radius={[0, 4, 4, 0]}
                    />
                    <Bar
                      dataKey="reservedQuantity"
                      stackId="a"
                      fill={topInventoryConfig.reservedQuantity.color}
                      radius={[4, 0, 0, 4]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="py-10 text-center text-gray-500">No inventory data available.</div>
            )}
          </CardContent>
        </Card>

        {/* My Stock Expiry Profile (Bar Chart) */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Expiry Profile</CardTitle>
            <CardDescription>Quantity of stock by expiry date range</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {stockExpiryProfileData.some((d) => d.value > 0) ? ( // Check if any data exists
              <ChartContainer config={stockExpiryProfileConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stockExpiryProfileData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" hideLabel />} />
                    <Bar dataKey="value" radius={4}>
                      {stockExpiryProfileData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={stockExpiryProfileConfig[entry.bucket]?.color || "#cccccc"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="py-10 text-center text-gray-500">No expiry data available.</div>
            )}
          </CardContent>
        </Card>

        {/* Outgoing Shipments Status (Pie Chart) */}
        <Card>
          <CardHeader>
            <CardTitle>Outgoing Shipments Status</CardTitle>
            <CardDescription>Status of shipments initiated from this warehouse</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {outgoingShipmentsStatusData.length > 0 ? (
              <ChartContainer config={outgoingShipmentsStatusConfig} className="mx-auto aspect-square max-h-[300px]">
                <PieChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
                  <ChartTooltip content={<ChartTooltipContent nameKey="value" hideLabel />} />
                  <Pie
                    data={outgoingShipmentsStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    labelLine={false}
                    label={false} // Keep pie clean
                  >
                    {outgoingShipmentsStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={outgoingShipmentsStatusConfig[entry.name]?.color || "#cccccc"}
                      />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="py-10 text-center text-gray-500">No outgoing shipment data available.</div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Fulfillment Trend (Line Chart) */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Fulfillment Trend</CardTitle>
            <CardDescription>Number of requirements shipped per month</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {monthlyFulfillmentData.length > 0 ? (
              <ChartContainer config={monthlyFulfillmentConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyFulfillmentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent hideLabel />} />
                    <Legend verticalAlign="top" align="center" />
                    <Line
                      type="monotone"
                      dataKey="requirementsShipped"
                      stroke={monthlyFulfillmentConfig.requirementsShipped.color}
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="py-10 text-center text-gray-500">No monthly fulfillment data available.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WarehouseDashboard;
