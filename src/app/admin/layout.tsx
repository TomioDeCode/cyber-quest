import { AuthGuard } from "@/components/core/auth-guard";
import { AppSidebar } from "@/components/fragments/app-sidebar";

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
