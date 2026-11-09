import MainLayout from "../components/layout/MainLayout";
export default function AdminPage() {
  return (
    <MainLayout>
      <div className="bg-stone-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-extrabold mb-6">Admin Dashboard</h1>
          <p className="text-stone-600">Admin links: Dashboard | Products | Categories | Banners | Orders | Reviews | Customers | Settings | Media</p>
        </div>
      </div>
    </MainLayout>
  );
}
