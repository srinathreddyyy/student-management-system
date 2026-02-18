import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, UserPlus, GraduationCap, CalendarCheck, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const adminNav = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/attendance", icon: CalendarCheck, label: "Attendance" },
  { to: "/add-student", icon: UserPlus, label: "Add Student" },
  { to: "/students", icon: Users, label: "Students" },
];

const teacherNav = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/attendance", icon: CalendarCheck, label: "Attendance" },
  { to: "/add-student", icon: UserPlus, label: "Add Student" },
  { to: "/students", icon: Users, label: "Students" },
];

const studentNav = [
  { to: "/", icon: LayoutDashboard, label: "My Dashboard" },
];

const AppSidebar = () => {
  const location = useLocation();
  const { role, profile, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const navItems = role === "admin" ? adminNav : role === "teacher" ? teacherNav : studentNav;
  const initials = profile ? `${profile.first_name[0] || ""}${profile.last_name[0] || ""}` : "??";

  const sidebar = (
    <aside className={`fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ${
      isMobile && !open ? "-translate-x-full" : "translate-x-0"
    }`}>
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold text-sidebar-primary-foreground tracking-tight">Infoz</h1>
          <p className="text-xs text-sidebar-foreground/60 capitalize">{role || "Portal"}</p>
        </div>
        {isMobile && (
          <button onClick={() => setOpen(false)} className="text-sidebar-foreground/60 hover:text-sidebar-foreground">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              onClick={() => isMobile && setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              {label}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {profile?.first_name} {profile?.last_name}
            </p>
            <p className="text-xs text-sidebar-foreground/50 truncate">{profile?.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {isMobile && (
        <button
          onClick={() => setOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border shadow-card"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
      {isMobile && open && (
        <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setOpen(false)} />
      )}
      {sidebar}
    </>
  );
};

export default AppSidebar;
