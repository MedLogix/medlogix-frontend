import { Badge } from "@/components/ui/badge";
import Combobox from "@/components/ui/combobox";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import usePaginationSearchParams from "@/hooks/usePaginationSearchParams";
import { INSTITUTION_LOG_TYPE_OPTIONS } from "@/lib/constants";
import LogService from "@/services/logService";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import moment from "moment";
import { useCallback, useMemo, useState } from "react";

const columns = [
  {
    accessorKey: "institutionId.name",
    header: "Institution Name",
  },
  {
    accessorKey: "medicineId.name",
    header: "Medicine Name",
  },
  {
    accessorKey: "batchName",
    header: "Batch Name",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type");
      return (
        <Badge variant="outline" className="capitalize">
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return moment(date).format("DD/MM/YYYY HH:mm");
    },
  },
];

const InstitutionLogs = () => {
  const { page, setPage, pageSize, setPageSize, search, setSearch, filters, setFilters } = usePaginationSearchParams();
  const [searchQuery, setSearchQuery] = useState(search);

  const { data: institutionData, isLoading } = useQuery({
    queryKey: ["institution-logs", page, pageSize, search, filters],
    queryFn: async () => {
      const { data } = await LogService.getInstitutionLogs({
        params: {
          page: page + 1,
          limit: pageSize,
          search,
          filters: JSON.stringify(filters),
        },
      });
      return data?.data;
    },
    keepPreviousData: true,
  });

  const handlePaginationChange = useCallback(
    (updater) => {
      if (typeof updater === "function") {
        const newState = updater({ pageIndex: page, pageSize: pageSize });
        setPage(newState.pageIndex);
        setPageSize(newState.pageSize);
      } else {
        setPage(updater.pageIndex);
        setPageSize(updater.pageSize);
      }
    },
    [page, pageSize, setPage, setPageSize]
  );

  const institutionDocs = useMemo(() => institutionData?.docs || [], [institutionData]);
  const pageCount = useMemo(() => institutionData?.totalPages ?? 0, [institutionData]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearch(value);
      }, 500),
    [setSearch]
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleFilterChange = (value) => {
    setFilters({ ...filters, type: value });
  };

  return (
    <div className="container mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Institution Logs</h1>
      </div>
      <div className="mb-4 flex items-center gap-4">
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          wrapperClassName="max-w-sm w-full"
        />

        <Combobox
          options={INSTITUTION_LOG_TYPE_OPTIONS}
          value={filters?.type}
          onChange={handleFilterChange}
          placeholder="Select type"
          searchPlaceholder="Search type..."
          emptyText="No type found."
          className="w-[300px]"
        />
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DataTable
          columns={columns}
          data={institutionDocs}
          pageCount={pageCount}
          pageIndex={page}
          pageSize={pageSize}
          onPaginationChange={handlePaginationChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default InstitutionLogs;
