import CreateMedicineModal from "@/components/Modals/CreateMedicineModal";
import DeleteModal from "@/components/Modals/DeleteModal";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import usePaginationSearchParams from "@/hooks/usePaginationSearchParams";
import MedicineService from "@/services/medicineService";
import { getManufacturers } from "@/store/manufacturer/actions";
import { getSalts } from "@/store/salt/actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { Pencil, Trash } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const columns = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "medicineType",
    header: "Type",
  },
  {
    accessorKey: "manufacturer.name",
    header: "Manufacturer",
  },
  {
    accessorKey: "salts",
    header: "Salts",
    cell: ({ row }) => {
      const salts = row.original.salts.map((salt) => salt.name).join(", ");
      return <div className="font-medium">{salts}</div>;
    },
  },
  // {
  //   accessorKey: "createdAt",
  //   header: "Created At",
  //   cell: ({ row }) => {
  //     const date = new Date(row.getValue("createdAt"));
  //     const formatted = date.toLocaleDateString("en-US", {
  //       year: "numeric",
  //       month: "short",
  //       day: "numeric",
  //     });
  //     return <div className="font-medium">{formatted}</div>;
  //   },
  // },
];

const Medicines = () => {
  const { page, setPage, pageSize, setPageSize, search, setSearch } = usePaginationSearchParams();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState(search);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const getOptions = useCallback(async () => {
    await Promise.all([
      dispatch(
        getManufacturers({
          params: {
            page: 1,
            limit: 100,
          },
        })
      ),
      dispatch(
        getSalts({
          params: {
            page: 1,
            limit: 100,
          },
        })
      ),
    ]);
  }, [dispatch]);

  useEffect(() => {
    getOptions();
  }, [getOptions]);

  const { data: medicinesData, isLoading } = useQuery({
    queryKey: ["medicines", page, pageSize, search],
    queryFn: async () => {
      const { data } = await MedicineService.getMedicines({
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
    mutationFn: (id) => MedicineService.deleteMedicine(id),
    onSuccess: () => {
      toast.success("Medicine deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
    onError: () => {
      toast.error("Failed to delete salt");
    },
  });

  const handleCreate = () => {
    setModalMode("create");
    setSelectedMedicine(null);
    setIsModalOpen(true);
  };

  const handleEdit = (medicine) => {
    setModalMode("edit");
    setSelectedMedicine(medicine);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMedicine(null);
  };

  const handleDelete = useCallback((medicine) => {
    console.log(medicine);
    setSelectedMedicine(medicine);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    await deleteMutation.mutate(selectedMedicine._id);
    setIsDeleteModalOpen(false);
    setSelectedMedicine(null);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setSelectedMedicine(null);
  };

  const columnsWithActions = useMemo(
    () => [
      ...columns,
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const medicine = row.original;
          return (
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => handleEdit(medicine)} title="Edit">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(medicine)} title="Delete">
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

  const medicineDocs = useMemo(() => medicinesData?.docs || [], [medicinesData]);
  const pageCount = useMemo(() => medicinesData?.totalPages ?? 0, [medicinesData]);

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
      <CreateMedicineModal
        isOpen={isModalOpen}
        setIsOpen={handleModalClose}
        mode={modalMode}
        initialValues={selectedMedicine || {}}
      />
      <DeleteModal
        open={isDeleteModalOpen}
        onOpenChange={handleDeleteModalClose}
        title="Delete Medicine"
        description="Are you sure you want to delete this medicine?"
        onConfirm={handleDeleteConfirm}
      />
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Medicines</h1>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          wrapperClassName="max-w-sm w-full"
        />
        <Button onClick={handleCreate}>Create Medicine</Button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DataTable
          columns={columnsWithActions}
          data={medicineDocs}
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

export default Medicines;
