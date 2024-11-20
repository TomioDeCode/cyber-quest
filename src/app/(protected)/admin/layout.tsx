import { AuthGuard } from "@/components/core/AuthGuard";
import { AppSidebar } from "@/components/fragments/AppSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={["admin"]}>
      <main className="flex h-screen">
        <AppSidebar />
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </main>
    </AuthGuard>
  );
}