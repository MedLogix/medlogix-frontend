export const USER_ROLE = {
  ADMIN: "admin",
  INSTITUTION: "institution",
  WAREHOUSE: "warehouse",
};

export const VERIFICATION_STATUS = {
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
};

export const VERIFICATION_STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Pending", value: VERIFICATION_STATUS.PENDING },
  { label: "Verified", value: VERIFICATION_STATUS.VERIFIED },
  { label: "Rejected", value: VERIFICATION_STATUS.REJECTED },
];

export const REQUIREMENT_STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Partially Approved", value: "partially approved" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "In Progress", value: "in progress" }, // Status used when shipment is created
  { label: "Shipped", value: "shipped" }, // Status potentially updated via shipment
  { label: "Delivered", value: "delivered" }, // Status potentially updated via shipment
];
