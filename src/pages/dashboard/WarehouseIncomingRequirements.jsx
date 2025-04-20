import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import Combobox from "@/components/ui/combobox";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import usePaginationSearchParams from "@/hooks/usePaginationSearchParams";
import { REQUIREMENT_STATUS_OPTIONS } from "@/lib/constants"; // Assuming this exists or will be created
import { cn } from "@/lib/utils";
import requirementService from "@/services/requirementService";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";

// Define columns for the data table
const columns = [
  {
    accessorKey: "_id",
    header: "Requirement ID",
    cell: ({ row }) => {
      const requirementId = row.getValue("_id");
      // Link to the detail page (adjust path if needed)
      return (
        <Link to={`/warehouse-requirements/${requirementId}`} className="font-medium text-primary hover:underline">
          {requirementId.slice(-6).toUpperCase()} {/* Show last 6 chars */}
        </Link>
      );
    },
  },
  {
    accessorKey: "institutionId.name", // Assuming the API returns nested institution data
    header: "Institution Name",
  },
  {
    accessorKey: "overallStatus",
    header: "Overall Status",
    cell: ({ row }) => {
      const status = row.getValue("overallStatus");
      switch (status?.toLowerCase()) {
        case "pending":
          return <Badge variant="secondary">Pending</Badge>;
        case "partially approved":
          return <Badge variant="outline">Partially Approved</Badge>;
        case "approved":
          return <Badge variant="default">Approved</Badge>;
        case "rejected":
          return <Badge variant="destructive">Rejected</Badge>;
        case "in progress":
          return <Badge variant="outline">In Progress</Badge>; // Assuming this status might exist
        case "shipped":
          return <Badge variant="default">Shipped</Badge>; // Assuming this status might exist
        case "delivered":
          return <Badge variant="success">Delivered</Badge>; // Assuming this status might exist
        default:
          return <Badge variant="secondary">{status || "N/A"}</Badge>;
      }
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Requested",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formatted = date.toLocaleDateString("en-GB", {
        // Use DD/MM/YYYY format
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const requirement = row.original;
      // Link to the detail page
      return (
        <Link className={cn(buttonVariants({ variant: "default" }))} to={`/warehouse-requirements/${requirement._id}`}>
          View Details
        </Link>
      );
    },
  },
];

const WarehouseIncomingRequirements = () => {
  const { page, setPage, pageSize, setPageSize, search, setSearch, filters, setFilters } = usePaginationSearchParams();
  const [searchQuery, setSearchQuery] = useState(search);

  // Define filter options - adjust statuses as needed based on API/requirements
  const statusFilterOptions = useMemo(() => {
    return REQUIREMENT_STATUS_OPTIONS.filter(
      (opt) => opt.value === "pending" || opt.value === "partially approved"
    ).map((opt) => ({ ...opt, label: opt.label })); // Add "All" option?
  }, []);

  const { data: requirementsData, isLoading } = useQuery({
    // Unique query key including filters
    queryKey: ["warehouseRequirements", page, pageSize, search, filters],
    queryFn: async () => {
      // Prepare filters for the API call
      const apiFilters = { ...filters };
      // Ensure status filter is passed correctly
      if (filters.status) {
        apiFilters.overallStatus = filters.status; // Match backend expected filter key if different
      }
      delete apiFilters.status; // Remove the potentially differently named key

      const { data } = await requirementService.getWarehouseRequirements({
        params: {
          page: page + 1, // API might be 1-indexed
          limit: pageSize,
          search,
          filters: JSON.stringify(apiFilters), // Send filters as a JSON string
        },
      });
      return data?.data; // Adjust based on actual API response structure
    },
    keepPreviousData: true, // Smoother UX during pagination
  });

  // Memoize data and page count
  const requirementDocs = useMemo(() => requirementsData?.docs || [], [requirementsData]);
  const pageCount = useMemo(() => requirementsData?.totalPages ?? 0, [requirementsData]);

  // Handle pagination changes driven by the DataTable component
  const handlePaginationChange = useCallback(
    (updater) => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex: page, pageSize: pageSize });
        setPage(newState.pageIndex);
        setPageSize(newState.pageSize);
      } else {
        // Directly set pageIndex and pageSize if updater is an object
        setPage(updater.pageIndex);
        setPageSize(updater.pageSize);
      }
    },
    [page, pageSize, setPage, setPageSize]
  );

  // Debounce search input
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setPage(0); // Reset to first page on new search
        setSearch(value);
      }, 500),
    [setSearch, setPage]
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (value) => {
    setPage(0); // Reset to first page on filter change
    setFilters({ ...filters, status: value }); // Use 'status' as the key for the filter state
  };

  return (
    <div className="container mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Requirements</h1>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <Input
          type="text"
          placeholder="Search by Institution..." // Update placeholder if needed
          value={searchQuery}
          onChange={handleSearchChange}
          className="max-w-sm" // Use className directly for Shadcn Input
        />
        <Combobox
          options={statusFilterOptions}
          value={filters?.status} // Bind value to the 'status' filter
          onChange={handleFilterChange}
          placeholder="Filter by Status"
          searchPlaceholder="Search status..."
          emptyText="No status found."
          className="w-[250px]" // Apply width styling
        />
      </div>

      {/* Data Table */}
      {isLoading ? (
        <div>Loading...</div> // Replace with a Skeleton loader for better UX
      ) : (
        <DataTable
          columns={columns}
          data={requirementDocs}
          pageCount={pageCount}
          pageIndex={page}
          pageSize={pageSize}
          onPaginationChange={handlePaginationChange}
          // isLoading={isLoading} // Pass loading state if DataTable supports it
        />
      )}
    </div>
  );
};

export default WarehouseIncomingRequirements;
