import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const AppLayout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className={`${isMobile ? "ml-0 pt-16" : "ml-64"} p-4 sm:p-6 lg:p-8`}>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
