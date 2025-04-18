import CreateManufacturerModal from "@/components/Modals/CreateManufacturerModal";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import ManufacturerService from "@/services/manufacturerService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import usePaginationSearchParams from "@/hooks/usePaginationSearchParams";
import debounce from "lodash.debounce";
import { Input } from "@/components/ui/input";
import { Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import DeleteModal from "@/components/Modals/DeleteModal";

const columns = [
  {
    accessorKey: "name",
    header: "Manufacturer Name",
  },
  {
    accessorKey: "medicalRepresentator.name",
    header: "Representative Name",
  },
  {
    accessorKey: "medicalRepresentator.contact",
    header: "Representative Contact",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formatted = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      return <div className="font-medium">{formatted}</div>;
    },
  },
];

const Manufacturers = () => {
  const { page, setPage, pageSize, setPageSize, search, setSearch } = usePaginationSearchParams();
  const [searchQuery, setSearchQuery] = useState(search);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: manufacturersData, isLoading } = useQuery({
    queryKey: ["manufacturers", page, pageSize, search],
    queryFn: async () => {
      const { data } = await ManufacturerService.getManufacturers({
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

  const deleteMutation = useMutation({
    mutationFn: (id) => ManufacturerService.deleteManufacturer(id),
    onSuccess: () => {
      toast.success("Manufacturer deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["manufacturers"] });
    },
    onError: () => {
      toast.error("Failed to delete manufacturer");
    },
  });

  const handleCreate = () => {
    setModalMode("create");
    setSelectedManufacturer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (manufacturer) => {
    setModalMode("edit");
    setSelectedManufacturer(manufacturer);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedManufacturer(null);
  };

  const handleDelete = useCallback((manufacturer) => {
    setSelectedManufacturer(manufacturer);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    await deleteMutation.mutate(selectedManufacturer._id);
    setIsDeleteModalOpen(false);
    setSelectedManufacturer(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setSelectedManufacturer(null);
  };

  const columnsWithActions = useMemo(
    () => [
      ...columns,
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const manufacturer = row.original;
          return (
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(manufacturer)} title="Edit">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(manufacturer)} title="Delete">
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          );
        },
      },
    ],
    [handleDelete]
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

  const manufacturerDocs = useMemo(() => manufacturersData?.docs || [], [manufacturersData]);
  const pageCount = useMemo(() => manufacturersData?.totalPages ?? 0, [manufacturersData]);

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
      <CreateManufacturerModal
        isOpen={isModalOpen}
        setIsOpen={handleModalClose}
        mode={modalMode}
        initialValues={selectedManufacturer || {}}
        onSubmit={handleModalClose}
      />
      <DeleteModal
        open={isDeleteModalOpen}
        onOpenChange={handleDeleteModalClose}
        title="Delete Manufacturer"
        description="Are you sure you want to delete this manufacturer?"
        onConfirm={handleDeleteConfirm}
      />
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manufacturers</h1>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          wrapperClassName="max-w-sm w-full"
        />
        <Button onClick={handleCreate}>Create Manufacturer</Button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DataTable
          columns={columnsWithActions}
          data={manufacturerDocs}
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

export default Manufacturers;
