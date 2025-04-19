import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const InstituitionDetailsModal = ({ isOpen, setIsOpen, institution }) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{institution?.name}</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default InstituitionDetailsModal;
