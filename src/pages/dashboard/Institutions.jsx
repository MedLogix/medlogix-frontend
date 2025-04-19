import InstituitionDetailsModal from "@/components/Modals/InstituitionDetailsModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import usePaginationSearchParams from "@/hooks/usePaginationSearchParams";
import InstitutionService from "@/services/institutionService";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import { useCallback, useMemo, useState } from "react";

const columns = [
  {
    accessorKey: "institutionCode",
    header: "Institution Code",
  },
  {
    accessorKey: "name",
    header: "Institution Name",
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

const Institutions = () => {
  const { page, setPage, pageSize, setPageSize, search, setSearch } = usePaginationSearchParams();
  const [searchQuery, setSearchQuery] = useState(search);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState(null);

  const { data: institutionsData, isLoading } = useQuery({
    queryKey: ["institutions", page, pageSize, search],
    queryFn: async () => {
      const { data } = await InstitutionService.getInstitutions({
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

  const openDetailsModal = (institution) => {
    setSelectedInstitution(institution);
    setIsModalOpen(true);
  };

  const columnsWithActions = useMemo(
    () => [
      ...columns,
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const institution = row.original;
          return (
            <Button variant="outline" size="sm" onClick={() => openDetailsModal(institution)}>
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

  const institutionDocs = useMemo(() => institutionsData?.docs || [], [institutionsData]);
  const pageCount = useMemo(() => institutionsData?.totalPages ?? 0, [institutionsData]);

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
      <InstituitionDetailsModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} institution={selectedInstitution} />
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Institutions</h1>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <Input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          wrapperClassName="max-w-sm w-full"
        />
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DataTable
          columns={columnsWithActions}
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

export default Institutions;
