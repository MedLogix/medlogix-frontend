import { Building2, MapPin, User, MailIcon, Phone, FileText, Hash, MapPinned } from "lucide-react";

export default function ReviewStep({ form }) {
  const values = form.getValues();

  return (
    <div className="space-y-3">
      {/* Institution Details */}
      <div className="overflow-hidden rounded border border-muted-foreground/20 shadow-sm">
        <div className="flex items-center gap-2 border-b bg-primary/10 p-2">
          <Building2 className="h-4 w-4 text-primary" />
          <h3 className="font-medium">Institution Details</h3>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-3 text-sm">
          <div className="flex items-center gap-1.5">
            <Hash className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">Code:</span>
            <span className="ml-1 font-medium">{values.institutionCode}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">Name:</span>
            <span className="ml-1 font-medium">{values.name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">Reg No:</span>
            <span className="ml-1 font-medium">{values.registrationNumber}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MailIcon className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">Email:</span>
            <span className="ml-1 font-medium">{values.email}</span>
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div className="overflow-hidden rounded border border-muted-foreground/20 shadow-sm">
        <div className="flex items-center gap-2 border-b bg-primary/10 p-2">
          <MapPin className="h-4 w-4 text-primary" />
          <h3 className="font-medium">Location Details</h3>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-3 text-sm">
          <div className="flex items-center gap-1.5">
            <MapPinned className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">Address:</span>
            <span className="ml-1 font-medium">{values.location?.address}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">City:</span>
            <span className="ml-1 font-medium">{values.location?.city}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">District:</span>
            <span className="ml-1 font-medium">{values.location?.district}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">State:</span>
            <span className="ml-1 font-medium">{values.location?.state}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">Pincode:</span>
            <span className="ml-1 font-medium">{values.location?.pincode}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">GPS:</span>
            <span className="ml-1 font-medium">
              {values.location?.gpsCoordinates?.lat}, {values.location?.gpsCoordinates?.lng}
            </span>
          </div>
        </div>
      </div>

      {/* Incharge Details */}
      <div className="overflow-hidden rounded border border-muted-foreground/20 shadow-sm">
        <div className="flex items-center gap-2 border-b bg-primary/10 p-2">
          <User className="h-4 w-4 text-primary" />
          <h3 className="font-medium">Incharge Details</h3>
        </div>
        <div className="p-3">
          {values.incharge?.map((inc, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-x-4 gap-y-1 text-sm">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">Name:</span>
                <span className="ml-1 font-medium">{inc.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">Contact:</span>
                <span className="ml-1 font-medium">{inc.contact}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MailIcon className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
                <span className="ml-1 font-medium">{inc.email || "—"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
