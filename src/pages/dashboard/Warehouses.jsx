import WarehouseDetailsModal from "@/components/Modals/WarehouseDetailsModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/ui/combobox";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import usePaginationSearchParams from "@/hooks/usePaginationSearchParams";
import { VERIFICATION_STATUS_OPTIONS } from "@/lib/constants";
import WarehouseService from "@/services/warehouseService";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { useCallback, useMemo, useState } from "react";

const columns = [
  {
    accessorKey: "warehouseCode",
    header: "Warehouse Code",
  },
  {
    accessorKey: "name",
    header: "Warehouse Name",
  },
  {
    accessorKey: "registrationNumber",
    header: "Registration Number",
  },
  {
    accessorKey: "verificationStatus",
    header: "Verification Status",
    cell: ({ row }) => {
      const institution = row.original;
      const verificationStatus = institution.verificationStatus;
      switch (verificationStatus) {
        case "pending":
          return <Badge variant="outline">Pending</Badge>;
        case "verified":
          return <Badge variant="default">Verified</Badge>;
        case "rejected":
          return <Badge variant="destructive">Rejected</Badge>;
      }
    },
  },
];

const Warehouses = () => {
  const { page, setPage, pageSize, setPageSize, search, setSearch, filters, setFilters } = usePaginationSearchParams();
  const [searchQuery, setSearchQuery] = useState(search);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  const { data: warehousesData, isLoading } = useQuery({
    queryKey: ["warehouses", page, pageSize, search, filters],
    queryFn: async () => {
      const { data } = await WarehouseService.getWarehouses({
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

  const openDetailsModal = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsModalOpen(true);
  };

  const columnsWithActions = useMemo(
    () => [
      ...columns,
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const warehouse = row.original;
          return (
            <Button variant="outline" size="sm" onClick={() => openDetailsModal(warehouse)}>
              See Details
            </Button>
          );
        },
      },
    ],
    []
  );

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

  const warehouseDocs = useMemo(() => warehousesData?.docs || [], [warehousesData]);
  const pageCount = useMemo(() => warehousesData?.totalPages ?? 0, [warehousesData]);

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
    setFilters({ ...filters, verificationStatus: value });
  };

  return (
    <div className="container mx-auto">
      <WarehouseDetailsModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} warehouse={selectedWarehouse} />
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Warehouses</h1>
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
          options={VERIFICATION_STATUS_OPTIONS}
          value={filters?.verificationStatus}
          onChange={handleFilterChange}
          placeholder="Select verification status"
          searchPlaceholder="Search verification status..."
          emptyText="No verification status found."
          className="w-[300px]"
        />
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DataTable
          columns={columnsWithActions}
          data={warehouseDocs}
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

export default Warehouses;
