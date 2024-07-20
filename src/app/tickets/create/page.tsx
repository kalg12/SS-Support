import ProtectedRoute from "@/components/ProtectedRoute";
import CreateTicket from "@/components/CreateTicket";

export default function CreateTicketPage() {
  return (
    <ProtectedRoute>
      <div>
        <CreateTicket />
      </div>
    </ProtectedRoute>
  );
}
