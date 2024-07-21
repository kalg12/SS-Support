import TicketList from "@/components/TicketList";
import DashboardLayout from "@/components/DashboardLayout";

const TicketsPage = () => {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-2">Tickets de soporte</h1>
      <p>
        En esta sección podrás ver los tickets de soporte que han solicitado los
        estudiantes
      </p>
      <TicketList />
    </DashboardLayout>
  );
};

export default TicketsPage;
