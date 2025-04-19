import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import WarehouseStockService from "@/services/warehouseStock";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

const WarehouseStockDetailsModal = ({ isOpen, setIsOpen, warehouseStock }) => {
  // Calculate total quantity
  const totalQuantity = warehouseStock?.stocks?.reduce((sum, stock) => sum + stock.quantity, 0) || 0;

  const queryClient = useQueryClient();

  const { mutate: deleteStock, isLoading: isDeleting } = useMutation({
    mutationFn: async () => {
      await WarehouseStockService.deleteWarehouseStock(warehouseStock._id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse-stocks"] });
      toast.success("Stock deleted successfully");
      setIsOpen(false);
    },
    onError: (error) => {
      console.error("Failed to delete stock:", error);
      toast.error("Failed to delete stock");
    },
  });

  if (!warehouseStock) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) setIsOpen(false);
      }}
    >
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{warehouseStock.medicineId?.name || "Stock Details"}</DialogTitle>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Manufacturer ID:</span> {warehouseStock.medicineId?.manufacturer || "N/A"}
            </div>
            <div>
              <span className="font-medium">Warehouse ID:</span> {warehouseStock.warehouseId || "N/A"}
            </div>
            <div>
              <span className="font-medium">Total Quantity:</span> {totalQuantity}
            </div>
          </div>
        </DialogHeader>

        <h3 className="text-lg font-medium">Batches</h3>
        <ScrollArea className="max-h-[60vh] pr-6">
          <div className="pb-4">
            {warehouseStock.stocks && warehouseStock.stocks.length > 0 ? (
              <div className="space-y-4">
                {warehouseStock.stocks.map((stock, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-2 pt-4">
                      <CardTitle className="text-base font-semibold">{stock.batchName || "N/A"}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 md:grid-cols-3 lg:grid-cols-4">
                        <div>
                          <strong>Qty:</strong> {stock.quantity ?? "N/A"}
                        </div>
                        <div>
                          <strong>Reserved:</strong> {stock.reservedQuantity ?? 0}
                        </div>
                        <div>
                          <strong>Packet Size:</strong>{" "}
                          {stock.packetSize
                            ? `${stock.packetSize.strips || "?"}x${stock.packetSize.tabletsPerStrip || "?"}`
                            : "N/A"}
                        </div>
                        <div>
                          <strong>Mfg. Date:</strong> {formatDate(stock.mfgDate)}
                        </div>
                        <div>
                          <strong>Expiry Date:</strong> {formatDate(stock.expiryDate)}
                        </div>
                        <div>
                          <strong>Received:</strong> {formatDate(stock.receivedDate)}
                        </div>
                        <div>
                          <strong>Purchase Price:</strong> {stock.purchasePrice?.toFixed(2) ?? "N/A"}
                        </div>
                        <div>
                          <strong>Selling Price:</strong> {stock.sellingPrice?.toFixed(2) ?? "N/A"}
                        </div>
                        <div>
                          <strong>MRP:</strong> {stock.mrp?.toFixed(2) ?? "N/A"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No stock batches found for this medicine.</p>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="sm:justify-between">
          <Button variant="destructive" onClick={deleteStock} disabled={isDeleting} isLoading={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Stock"}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={isDeleting}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WarehouseStockDetailsModal;
