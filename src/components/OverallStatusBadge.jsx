import { Badge } from "@/components/ui/badge";

const getBadgeVariant = (status) => {
  switch (status) {
    case "Pending":
      return "outline";
    case "Approved":
      return "secondary";
    case "Rejected":
      return "destructive";
    case "Shipped":
    case "Delivered":
    case "Received":
      return "default";
    default:
      return "outline";
  }
};

const OverallStatusBadge = ({ status }) => {
  if (!status) {
    return null;
  }
  const variant = getBadgeVariant(status);
  return <Badge variant={variant}>{status}</Badge>;
};

export default OverallStatusBadge;
