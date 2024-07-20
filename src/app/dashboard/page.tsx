import ProtectedRoute from "@/components/ProtectedRoute";

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <div>
        <h1>Dashboard</h1>
        <p>Welcome to the dashboard!</p>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
