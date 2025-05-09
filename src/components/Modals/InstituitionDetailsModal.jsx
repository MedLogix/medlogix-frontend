import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import InstitutionService from "@/services/institutionService";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const InstituitionDetailsModal = ({ isOpen, setIsOpen, institution }) => {
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

  const { mutate: approveInstitution, isPending: isApproving } = useMutation({
    mutationFn: () => InstitutionService.approveInstitution(institution._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
      toast.success(`${institution.name} approved successfully.`);
      setIsOpen(false);
    },
    onError: (error) => {
      console.error("Error approving institution:", error);
      toast.error("Failed to approve institution.");
    },
  });

  const { mutate: rejectInstitution, isPending: isRejecting } = useMutation({
    mutationFn: () => InstitutionService.rejectInstitution(institution._id, { reason: rejectReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
      toast.success(`${institution.name} rejected successfully.`);
      setRejectReason("");
      setShowRejectReasonDialog(false);
      setIsOpen(false);
    },
    onError: (error) => {
      console.error("Error rejecting institution:", error);
      toast.error("Failed to reject institution.");
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
              {institution?.name}
              {institution?.verificationStatus && (
                <Badge variant={getStatusVariant(institution.verificationStatus)} className="ml-2 capitalize">
                  {institution.verificationStatus}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {institution && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Code</Label>
                <div className="col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  {institution.institutionCode || "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Email</Label>
                <div className="col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  {institution.email || "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Reg. Number</Label>
                <div className="col-span-3 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  {institution.registrationNumber || "N/A"}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="col-span-1 text-right">Location</Label>
                <div className="col-span-3 space-y-1 text-sm text-muted-foreground">
                  <div>{institution.location?.address}</div>
                  <div>{`${institution.location?.city}, ${institution.location?.district}, ${institution.location?.state} - ${institution.location?.pincode}`}</div>
                  {institution.location?.gpsCoordinates?.lat && institution.location?.gpsCoordinates?.lng && (
                    <div>
                      GPS: {institution.location.gpsCoordinates.lat}, {institution.location.gpsCoordinates.lng}
                    </div>
                  )}
                </div>
              </div>
              {institution.incharge?.length > 0 && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="col-span-1 pt-2 text-right align-top">Incharge(s)</Label>
                  <div className="col-span-3 space-y-2">
                    {institution.incharge.map((person, index) => (
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
              {institution.verificationStatus === "rejected" && institution.verificationRejectedReason && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-destructive">Rejection Reason</Label>
                  <Textarea
                    value={institution.verificationRejectedReason}
                    readOnly
                    className="col-span-3 h-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {institution?.verificationStatus === "pending" && (
              <div className="flex w-full justify-end gap-2">
                <Button
                  variant="destructive"
                  onClick={openRejectDialog}
                  isLoading={isRejecting}
                  disabled={isRejecting || isApproving}
                >
                  {isRejecting ? "Rejecting..." : "Reject"}
                </Button>
                <Button onClick={approveInstitution} isLoading={isApproving} disabled={isApproving || isRejecting}>
                  {isApproving ? "Approving..." : "Approve"}
                </Button>
              </div>
            )}
            {institution?.verificationStatus !== "pending" && (
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
              onClick={rejectInstitution}
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

export default InstituitionDetailsModal;
