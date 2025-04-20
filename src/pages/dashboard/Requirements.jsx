import CreateRequirementModal from "@/components/Modals/CreateRequirementModal";
import OverallStatusBadge from "@/components/OverallStatusBadge";
import { Button, buttonVariants } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import usePaginationSearchParams from "@/hooks/usePaginationSearchParams";
import { USER_ROLE } from "@/lib/constants";
import MedicineService from "@/services/medicineService";
import RequirementService from "@/services/requirementService";
import WarehouseService from "@/services/warehouseService";
import { getMedicines } from "@/store/medicine/actions";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { ExternalLink } from "lucide-react";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";

const _columns = [
  {
    accessorKey: "warehouseId.name",
    header: "Warehouse",
  },
  {
    accessorKey: "institutionId.name",
    header: "Institution",
  },
  {
    accessorKey: "medicines",
    header: "Medicines",
    cell: ({ row }) => {
      const medicines = row.original.medicines;
      return medicines.map((medicine) => medicine.medicineId.name).join(", ");
    },
  },
  {
    accessorKey: "requestedQuantity",
    header: "Requested Quantity",
    cell: ({ row }) => {
      const medicines = row.original.medicines;
      const totalRequestedQuantity = medicines.reduce((total, medicine) => total + medicine.requestedQuantity, 0);
      return totalRequestedQuantity;
    },
  },
  {
    accessorKey: "approvedQuantity",
    header: "Approved Quantity",
    cell: ({ row }) => {
      const medicines = row.original.medicines;
      const totalApprovedQuantity = medicines.reduce((total, medicine) => total + medicine.approvedQuantity, 0);
      return totalApprovedQuantity;
    },
  },
  {
    accessorKey: "overallStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.overallStatus;
      return <OverallStatusBadge status={status} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => moment(row.original.createdAt).format("DD/MM/YYYY HH:mm"),
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => {
      const requirement = row.original;
      return (
        <Link className={buttonVariants({ variant: "outline", size: "icon" })} to={`/requirements/${requirement._id}`}>
          <ExternalLink />
        </Link>
      );
    },
  },
];

const Requirements = () => {
  const { page, setPage, pageSize, setPageSize, search, setSearch } = usePaginationSearchParams();
  const { userRole } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState(search);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMedicines());
  }, [dispatch]);

  const { data: requirementsData, isLoading } = useQuery({
    queryKey: ["requirements", page, pageSize, search],
    queryFn: async () => {
      const { data } = await RequirementService.getInstitutionRequirements({
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

  const { data: warehousesData } = useQuery({
    queryKey: ["warehouses"],
    queryFn: async () => {
      const { data } = await WarehouseService.getWarehouses({
        params: {
          page: 1,
          limit: 1000,
        },
      });
      return data?.data?.docs || [];
    },
  });

  const { data: medicinesData } = useQuery({
    queryKey: ["medicines"],
    queryFn: async () => {
      const { data } = await MedicineService.getMedicines({
        params: {
          page: 1,
          limit: 1000,
        },
      });
      return data?.data?.docs || [];
    },
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

  const requirementsDocs = useMemo(() => requirementsData?.docs || [], [requirementsData]);
  const pageCount = useMemo(() => requirementsData?.totalPages ?? 0, [requirementsData]);

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

  const columns = useMemo(() => {
    if (userRole === USER_ROLE.WAREHOUSE) {
      return _columns.filter((column) => column.accessorKey !== "warehouseId.name");
    } else if (userRole === USER_ROLE.INSTITUTION) {
      return _columns.filter((column) => column.accessorKey !== "institutionId.name");
    }
    return _columns;
  }, [userRole]);

  return (
    <div className="container mx-auto">
      <CreateRequirementModal
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        warehouses={warehousesData}
        medicines={medicinesData}
      />
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Requirements</h1>
      </div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          wrapperClassName="max-w-sm w-full"
        />
        <Button onClick={() => setIsCreateModalOpen(true)}>Create Requirement</Button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DataTable
          columns={columns}
          data={requirementsDocs}
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

export default Requirements;
