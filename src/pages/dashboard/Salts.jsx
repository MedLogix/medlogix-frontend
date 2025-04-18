import CreateSaltModal from "@/components/Modals/CreateSaltModal";
import DeleteModal from "@/components/Modals/DeleteModal";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import usePaginationSearchParams from "@/hooks/usePaginationSearchParams";
import SaltService from "@/services/saltService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { Pencil, Trash } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

const columns = [
  {
    accessorKey: "name",
    header: "Salt Name",
  },
  {
    accessorKey: "useCase",
    header: "Usecase",
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
  const [selectedSalt, setSelectedSalt] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: saltsData, isLoading } = useQuery({
    queryKey: ["salts", page, pageSize, search],
    queryFn: async () => {
      const { data } = await SaltService.getSalts({
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
    mutationFn: (id) => SaltService.deleteSalt(id),
    onSuccess: () => {
      toast.success("Salt deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["salts"] });
    },
    onError: () => {
      toast.error("Failed to delete salt");
    },
  });

  const handleCreate = () => {
    setModalMode("create");
    setSelectedSalt(null);
    setIsModalOpen(true);
  };

  const handleEdit = (salt) => {
    setModalMode("edit");
    setSelectedSalt(salt);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSalt(null);
  };

  const handleDelete = useCallback((salt) => {
    console.log(salt);
    setSelectedSalt(salt);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    await deleteMutation.mutate(selectedSalt._id);
    setIsDeleteModalOpen(false);
    setSelectedSalt(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setSelectedSalt(null);
  };

  const columnsWithActions = useMemo(
    () => [
      ...columns,
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const salt = row.original;
          return (
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(salt)} title="Edit">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(salt)} title="Delete">
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

  const saltDocs = useMemo(() => saltsData?.docs || [], [saltsData]);
  const pageCount = useMemo(() => saltsData?.totalPages ?? 0, [saltsData]);

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
      <CreateSaltModal
        isOpen={isModalOpen}
        setIsOpen={handleModalClose}
        mode={modalMode}
        initialValues={selectedSalt || {}}
      />
      <DeleteModal
        open={isDeleteModalOpen}
        onOpenChange={handleDeleteModalClose}
        title="Delete Salt"
        description="Are you sure you want to delete this salt?"
        onConfirm={handleDeleteConfirm}
      />
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Salts</h1>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          wrapperClassName="max-w-sm w-full"
        />
        <Button onClick={handleCreate}>Create Salt</Button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DataTable
          columns={columnsWithActions}
          data={saltDocs}
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
