import RequirementService from "@/services/requirementService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import OverallStatusBadge from "@/components/OverallStatusBadge";
import { useMemo } from "react";
import { USER_ROLE } from "@/lib/constants";

const RequirementDetails = () => {
  const { id: requirementId } = useParams();
  const { userRole } = useSelector((state) => state.user);

  const { data: requirement, isLoading } = useQuery({
    queryKey: ["requirement", requirementId],
    queryFn: async () => {
      const response = await RequirementService.getRequirementById(requirementId);
      return response?.data?.data;
    },
    enabled: !!requirementId,
  });

  const title = useMemo(() => {
    if (userRole === USER_ROLE.INSTITUTION) {
      return requirement?.warehouseId?.name || "Warehouse";
    } else if (userRole === USER_ROLE.WAREHOUSE) {
      return requirement?.institutionId?.name || "Institution";
    }
    return "Requirement Details";
  }, [userRole, requirement]);

  const subtitle = useMemo(() => {
    if (userRole === USER_ROLE.WAREHOUSE) {
      return requirement?.institutionId?.email || "";
    }
    return "";
  }, [userRole, requirement]);

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!requirement) {
    return <div className="p-4">Requirement not found or failed to load.</div>;
  }

  return (
    <div className="container mx-auto space-y-6 p-4">
      <h1 className="text-2xl font-semibold">Requirement Details</h1>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {subtitle && <CardDescription>{subtitle}</CardDescription>}
            <CardDescription className="pt-1">
              Requested on: {new Date(requirement.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
          <OverallStatusBadge status={requirement.overallStatus} />
        </CardHeader>
        <CardContent>
          <h3 className="mb-4 text-lg font-medium">Medicines Requested</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medicine Name</TableHead>
                <TableHead className="text-right">Requested Quantity</TableHead>
                <TableHead className="text-right">Approved Quantity</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requirement.medicines?.map((medicineItem) => (
                <TableRow key={medicineItem.medicineId?._id || Math.random()}>
                  <TableCell>{medicineItem.medicineId?.name || "N/A"}</TableCell>
                  <TableCell className="text-right">{medicineItem.requestedQuantity}</TableCell>
                  <TableCell className="text-right">{medicineItem.approvedQuantity}</TableCell>
                  <TableCell className="text-right">
                    <OverallStatusBadge status={medicineItem.status} />
                  </TableCell>
                </TableRow>
              ))}
              {(!requirement.medicines || requirement.medicines.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No medicines listed in this requirement.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {userRole === "warehouse" && requirement.institutionId?.location && (
            <div className="mt-6">
              <h3 className="mb-2 text-lg font-medium">Delivery Address</h3>
              <p className="text-sm text-muted-foreground">
                {requirement.institutionId.name} <br />
                {requirement.institutionId.location.address} <br />
                {requirement.institutionId.location.city}, {requirement.institutionId.location.state} -{" "}
                {requirement.institutionId.location.pincode} <br />
                District: {requirement.institutionId.location.district}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RequirementDetails;
