import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import OverallStatusBadge from "./OverallStatusBadge";
import { Badge } from "./ui/badge";
import { Circle } from "lucide-react";
import moment from "moment"; // Import moment

const formatTimestamp = (timestamp) => {
  if (!timestamp) return null; // Return null if no timestamp
  // Format using moment.js
  return moment(timestamp).format("DD MMM YYYY hh:mm A");
};

// Represents a single step in the timeline
const TimelineStep = ({ title, timestamp, isLast }) => {
  const formattedTime = formatTimestamp(timestamp);
  if (!formattedTime) return null; // Don't render if no valid time

  return (
    <div className="flex items-start space-x-3">
      <div className="flex flex-col items-center">
        <Circle size={16} className="mt-1 fill-current text-primary" />
        {!isLast && <div className="h-full min-h-[2rem] w-px flex-grow bg-muted-foreground/50"></div>}
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{formattedTime}</p>
      </div>
    </div>
  );
};

const ShipmentTrackingCard = ({ logisticDetails, createdAt }) => {
  if (!logisticDetails) {
    return null;
  }

  const { shipmentId, vehicles, status, receivedStatus } = logisticDetails;
  const firstVehicle = vehicles?.[0];
  const firstVehicleTimestamps = firstVehicle?.timestamps || {};

  // Define timeline steps based on available data
  const timelineSteps = [
    { title: "Requirement Placed", timestamp: createdAt },
    { title: "Loaded", timestamp: firstVehicleTimestamps.loadedAt },
    { title: "Departed", timestamp: firstVehicleTimestamps.departedAt },
    { title: "Delivered", timestamp: firstVehicleTimestamps.arrivedAt },
    { title: "Unloaded / Received", timestamp: firstVehicleTimestamps.unloadedAt },
  ].filter((step) => formatTimestamp(step.timestamp)); // Filter out steps without valid timestamps

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Card 1: Shipment Status Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Shipment Status</CardTitle>
              <CardDescription>ID: {shipmentId || "N/A"}</CardDescription>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <OverallStatusBadge status={status} />
              <Badge variant={receivedStatus === "Received" ? "success" : "secondary"}>
                {receivedStatus || "Pending Receipt"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {timelineSteps.map((step, index) => (
            <TimelineStep key={step.title} {...step} isLast={index === timelineSteps.length - 1} />
          ))}
          {timelineSteps.length === 0 && (
            <p className="text-sm text-muted-foreground">No tracking updates available yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Card 2: Vehicle Details Table */}
      {vehicles && vehicles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Details</CardTitle>
            <CardDescription>Information about the vehicle(s) used for this shipment.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {vehicles.length > 1 && <TableHead>Vehicle</TableHead>}
                  <TableHead>Vehicle No.</TableHead>
                  <TableHead>Driver Name</TableHead>
                  <TableHead>Driver Contact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((vehicle, index) => (
                  <TableRow key={vehicle._id || index}>
                    {vehicles.length > 1 && <TableCell className="font-medium">{index + 1}</TableCell>}
                    <TableCell>{vehicle.vehicleNumber || "N/A"}</TableCell>
                    <TableCell>{vehicle.driverName || "N/A"}</TableCell>
                    <TableCell>{vehicle.driverContact || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShipmentTrackingCard;
