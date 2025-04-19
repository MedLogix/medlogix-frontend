import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import WarehouseService from "@/services/warehouseService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const WarehouseDetailsModal = ({ isOpen, setIsOpen, warehouse }) => {
  const [showRejectReasonDialog, setShowRejectReasonDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const queryClient = useQueryClient();

  const getStatusVariant = (status) => {
    switch (status) {
      case "verified":
        return "default";
      case "rejected":
        return "destructive";
      case "pending":
      default:
        return "secondary";
    }
  };

  const { mutate: approveWarehouse, isPending: isApproving } = useMutation({
    mutationFn: () => WarehouseService.approveWarehouse(warehouse._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      toast.success(`${warehouse.name} approved successfully.`);
      setIsOpen(false);
    },
    onError: (error) => {
      console.error("Error approving warehouse:", error);
      toast.error("Failed to approve warehouse.");
    },
  });

  const { mutate: rejectWarehouse, isPending: isRejecting } = useMutation({
    mutationFn: () => WarehouseService.rejectWarehouse(warehouse._id, { reason: rejectReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      toast.success(`${warehouse.name} rejected successfully.`);
      setRejectReason("");
      setShowRejectReasonDialog(false);
      setIsOpen(false);
    },
    onError: (error) => {
      console.error("Error rejecting warehouse:", error);
      toast.error("Failed to reject warehouse.");
    },
  });

  const openRejectDialog = () => {
    setShowRejectReasonDialog(true);
  };

  const closeRejectDialog = () => {
    setShowRejectReasonDialog(false);
    setRejectReason("");
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) setIsOpen(false);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="mt-5 flex items-center justify-between">
              {warehouse?.name}
              {warehouse?.verificationStatus && (
                <Badge variant={getStatusVariant(warehouse.verificationStatus)} className="ml-2 capitalize">
                  {warehouse.verificationStatus}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {warehouse && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Code</Label>
                <div className="col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  {warehouse.warehouseCode || "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Email</Label>
                <div className="col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  {warehouse.email || "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Reg. Number</Label>
                <div className="col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  {warehouse.registrationNumber || "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="col-span-1 text-right">Location</Label>
                <div className="col-span-3 space-y-1 text-sm text-muted-foreground">
                  <div>{warehouse.location?.address}</div>
                  <div>{`${warehouse.location?.city}, ${warehouse.location?.district}, ${warehouse.location?.state} - ${warehouse.location?.pincode}`}</div>
                  {warehouse.location?.gpsCoordinates?.lat && warehouse.location?.gpsCoordinates?.lng && (
                    <div>
                      GPS: {warehouse.location.gpsCoordinates.lat}, {warehouse.location.gpsCoordinates.lng}
                    </div>
                  )}
                </div>
              </div>
              {warehouse?.managers?.length > 0 && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="col-span-1 pt-2 text-right align-top">Manager(s)</Label>
                  <div className="col-span-3 space-y-2">
                    {warehouse.managers.map((person, index) => (
                      <div key={index} className="rounded border p-2 text-sm">
                        <div>
                          <strong>Name:</strong> {person.name}
                        </div>
                        <div>
                          <strong>Contact:</strong> {person.contact}
                        </div>
                        {person.email && (
                          <div>
                            <strong>Email:</strong> {person.email}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {warehouse.verificationStatus === "rejected" && warehouse.verificationRejectedReason && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-destructive">Rejection Reason</Label>
                  <Textarea
                    value={warehouse.verificationRejectedReason}
                    readOnly
                    className="col-span-3 h-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {warehouse?.verificationStatus === "pending" && (
              <div className="flex w-full justify-end gap-2">
                <Button
                  variant="destructive"
                  onClick={openRejectDialog}
                  isLoading={isRejecting}
                  disabled={isRejecting || isApproving}
                >
                  {isRejecting ? "Rejecting..." : "Reject"}
                </Button>
                <Button onClick={approveWarehouse} isLoading={isApproving} disabled={isApproving || isRejecting}>
                  {isApproving ? "Approving..." : "Approve"}
                </Button>
              </div>
            )}
            {warehouse?.verificationStatus !== "pending" && (
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectReasonDialog} onOpenChange={closeRejectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reason for Rejection</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="rejectReasonInput" className="sr-only">
              Reason
            </Label>
            <Textarea
              id="rejectReasonInput"
              placeholder="Please provide a reason for rejecting this institution..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeRejectDialog}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={rejectWarehouse}
              isLoading={isRejecting}
              disabled={!rejectReason || isRejecting}
              variant="destructive"
            >
              {isRejecting ? "Submitting..." : "Submit Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WarehouseDetailsModal;
