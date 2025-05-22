import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

export default function Layout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) {
  return (
    <div className="flex flex-col h-screen">
      <Topbar user={user} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-[#171717] p-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
