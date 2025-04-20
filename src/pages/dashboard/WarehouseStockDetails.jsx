import { DataTable } from "@/components/ui/data-table";
import WarehouseStockService from "@/services/warehouseStock";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useMemo } from "react";
import { useParams } from "react-router";

const columns = [
  {
    accessorKey: "batchName",
    header: "Batch Name",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "availableQuantity",
    header: "Available Quantity",
    cell: ({ row }) => {
      const availableQuantity = row.original.quantity - row.original.reservedQuantity;
      return <div>{availableQuantity}</div>;
    },
  },
  {
    accessorKey: "reservedQuantity",
    header: "Reserved Quantity",
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
    cell: ({ row }) => {
      const expiryDate = row.original.expiryDate;
      return <div>{moment(expiryDate).format("DD/MM/YYYY")}</div>;
    },
  },
  {
    accessorKey: "purchasePrice",
    header: "Purchase Price",
  },
  {
    accessorKey: "sellingPrice",
    header: "Selling Price",
  },
  {
    accessorKey: "mrp",
    header: "MRP",
  },
  {
    accessorKey: "mfgDate",
    header: "MFG Date",
    cell: ({ row }) => {
      const mfgDate = row.original.mfgDate;
      return <div>{moment(mfgDate).format("DD/MM/YYYY")}</div>;
    },
  },
  {
    accessorKey: "receivedDate",
    header: "Received Date",
    cell: ({ row }) => {
      const receivedDate = row.original.receivedDate;
      return <div>{moment(receivedDate).format("DD/MM/YYYY")}</div>;
    },
  },
  {
    accessorKey: "packetSize.strips",
    header: "Strips (per packet)",
  },
  {
    accessorKey: "packetSize.tabletsPerStrip",
    header: "Tablets (per strip)",
  },
];

const WarehouseStockDetails = () => {
  const { id } = useParams();

  const { data: warehouseStock, isLoading } = useQuery({
    queryKey: ["warehouse-stock", id],
    queryFn: async () => {
      const { data } = await WarehouseStockService.getWarehouseStockById(id);
      return data?.data;
    },
  });

  const batches = useMemo(() => warehouseStock?.stocks || [], [warehouseStock]);

  return (
    <div className="container mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Warehouse Stock Details</h1>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">{warehouseStock?.medicineId?.name}</h1>
      </div>
      {/* <div className="mb-4 flex items-center justify-between gap-4">
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          wrapperClassName="max-w-sm w-full"
        />
        <Button onClick={() => setIsCreateModalOpen(true)}>Add Batch</Button>
      </div> */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DataTable
          columns={columns}
          data={batches}
          pageCount={batches.length}
          pageIndex={0}
          pageSize={batches.length}
          onPaginationChange={() => {}}
          isLoading={isLoading}
          showPagination={false}
        />
      )}
    </div>
  );
};

export default WarehouseStockDetails;
