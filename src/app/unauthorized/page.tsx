export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">Acceso Denegado</h2>
        <p>No tienes permisos para acceder a esta página.</p>
      </div>
    </div>
  );
}
