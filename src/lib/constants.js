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

export const REQUIREMENT_STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
};

export const INSTITUTION_LOG_TYPE_OPTIONS = [
  { label: "All", value: "" },
  { label: "Usage", value: "usage" },
  { label: "Addition", value: "addition" },
];

export const WAREHOUSE_LOG_TYPE_OPTIONS = [
  { label: "All", value: "" },
  { label: "Purchase", value: "purchase" },
  { label: "Sale", value: "sale" },
];
