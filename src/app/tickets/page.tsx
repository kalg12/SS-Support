import ProtectedRoute from "@/components/ProtectedRoute";
import TicketList from "@/components/TicketList";

export default function TicketListPage() {
  return (
    <ProtectedRoute>
      <div>
        <TicketList />
      </div>
    </ProtectedRoute>
  );
}
