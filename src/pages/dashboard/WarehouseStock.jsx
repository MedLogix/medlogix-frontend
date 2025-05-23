import CreateWarehouseStockModal from "@/components/Modals/CreateWarehouseStockModal";
import { Button, buttonVariants } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import usePaginationSearchParams from "@/hooks/usePaginationSearchParams";
import WarehouseStockService from "@/services/warehouseStock";
import { getMedicines } from "@/store/medicine/actions";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router";

const columns = [
  {
    accessorKey: "medicineId.name",
    header: "Medicine Name",
  },
  {
    accessorKey: "totalQuantity",
    header: "Total Quantity",
    cell: ({ row }) => {
      const stocks = row?.original?.stocks;
      const totalQuantity = stocks.reduce((acc, stock) => acc + stock.quantity, 0);
      return totalQuantity;
    },
  },
  {
    accessorKey: "availableQuantity",
    header: "Available",
    cell: ({ row }) => {
      const stocks = row?.original?.stocks;
      const availableQuantity = stocks.reduce((acc, stock) => acc + stock.quantity - stock.reservedQuantity, 0);
      return availableQuantity;
    },
  },
  {
    accessorKey: "reservedQuantity",
    header: "Reserved",
    cell: ({ row }) => {
      const stocks = row?.original?.stocks;
      const totalQuantity = stocks.reduce((acc, stock) => acc + stock.reservedQuantity, 0);
      return totalQuantity;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt");
      const formatted = moment(date).format("DD/MM/YYYY");
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const warehouseStock = row.original;
      return (
        <Link
          to={`/warehouse-stock/${warehouseStock._id}`}
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          See Details
        </Link>
      );
    },
  },
];

const WarehouseStock = () => {
  const { page, setPage, pageSize, setPageSize, search, setSearch } = usePaginationSearchParams();
  const [searchQuery, setSearchQuery] = useState(search);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMedicines());
  }, [dispatch]);

  const { data: warehouseStockData, isLoading } = useQuery({
    queryKey: ["warehouseStock", page, pageSize, search],
    queryFn: async () => {
      const { data } = await WarehouseStockService.getWarehouseStock({
        params: {
          page: page + 1,
          limit: pageSize,
          search,
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

  const warehouseStockDocs = useMemo(() => warehouseStockData?.docs || [], [warehouseStockData]);
  const pageCount = useMemo(() => warehouseStockData?.totalPages ?? 0, [warehouseStockData]);

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

  return (
    <div className="container mx-auto">
      <CreateWarehouseStockModal isOpen={isCreateModalOpen} setIsOpen={setIsCreateModalOpen} />
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Warehouse Stock</h1>
      </div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          wrapperClassName="max-w-sm w-full"
        />
        <Button onClick={() => setIsCreateModalOpen(true)}>Add Batch</Button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DataTable
          columns={columns}
          data={warehouseStockDocs}
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

export default WarehouseStock;
