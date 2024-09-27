// src/app/client-org-dashboard/page.jsx

export default function ClientOrgDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white shadow-lg rounded p-4">
        <h2 className="text-xl font-semibold">Manage Enrollees</h2>
        {/* Card for adding/removing enrollees */}
      </div>
      <div className="bg-white shadow-lg rounded p-4">
        <h2 className="text-xl font-semibold">Benefits Overview</h2>
        {/* Benefits management card */}
      </div>
    </div>
  );
}
