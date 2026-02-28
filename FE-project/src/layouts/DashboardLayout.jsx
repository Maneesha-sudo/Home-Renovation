import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  LayoutDashboard,
  LayoutList,
  DollarSign,
  CheckSquare,
  Users,
  LogOut,
  Menu,
  FileText,
  Box,
  Calendar,
  Image,
  Settings,
} from "lucide-react";

const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  // Update screen size dynamically
  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add all your features here
  const menuItems = [
    { icon: LayoutDashboard, label: "Home", path: "/dashboard" },
    { icon: LayoutList, label: "Projects", path: "/dashboard/projects" },
    { icon: DollarSign, label: "Budget", path: "/dashboard/budget" },
    { icon: CheckSquare, label: "Tasks", path: "/dashboard/tasks" },
    { icon: Users, label: "Contractors", path: "/dashboard/contractors" },
    { icon: Box, label: "Inventory", path: "/dashboard/inventory" },
    { icon: Calendar, label: "Maintenance", path: "/dashboard/maintenance" },
    { icon: Image, label: "Progress Photos", path: "/dashboard/progress-photos" },
    { icon: FileText, label: "Reports", path: "/dashboard/reports" },
    { icon: Settings, label: "Project Templates", path: "/dashboard/templates" },
  ];

  return (
    <>
      {/* HEADER */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "64px",
          background: "white",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {!isLargeScreen && (
            <button
              onClick={() => setMobileOpen(true)}
              style={{
                padding: "8px",
                background: "#f3f4f6",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer"
              }}
            >
              <Menu size={24} />
            </button>
          )}
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#059669", margin: 0 }}>
            RenovationTracker
          </h1>
        </div>

        {/* RIGHT SIDE (PROFILE + LOGOUT) */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            title={user?.name}
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "#059669",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "18px",
              textTransform: "uppercase",
              cursor: "pointer"
            }}
          >
            {user?.name ? user.name.charAt(0) : "U"}
          </div>

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              background: "#fef2f2",
              color: "#dc2626",
              border: "none",
              borderRadius: "8px",
              fontWeight: "500",
              cursor: "pointer"
            }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* SIDEBAR */}
      {isLargeScreen && (
        <div
          style={{
            position: "fixed",
            left: 0,
            top: "64px",
            width: "280px",
            height: "calc(100vh - 64px)",
            background: "white",
            boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
            borderRight: "1px solid #e5e7eb",
            overflowY: "auto",
            zIndex: 999
          }}
        >
          <div style={{ padding: "32px 24px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#059669", marginBottom: "32px" }}>
              Menu
            </h2>
            <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {menuItems.map((item, index) => {
                const isActive = location.pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={index}
                    to={item.path}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "16px",
                      background: isActive ? "#059669" : "transparent",
                      color: isActive ? "white" : "#374151",
                      textDecoration: "none",
                      borderRadius: "12px",
                      fontWeight: "600",
                      fontSize: "16px",
                      gap: "16px",
                      transition: "all 0.2s"
                    }}
                  >
                    <Icon size={24} style={{ opacity: isActive ? 1 : 0.8 }} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* MOBILE MENU */}
      {!isLargeScreen && mobileOpen && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 1001
            }}
            onClick={() => setMobileOpen(false)}
          />
          <div
            style={{
              position: "fixed",
              top: "64px",
              left: 0,
              width: "280px",
              height: "calc(100vh - 64px)",
              background: "white",
              boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
              zIndex: 1002
            }}
          >
            <div style={{ padding: "32px 24px" }}>
              <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "16px",
                      color: "#374151",
                      textDecoration: "none",
                      borderRadius: "12px",
                      fontWeight: "600",
                      fontSize: "16px",
                      gap: "16px"
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    <item.icon size={24} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}

      {/* MAIN CONTENT */}
      <main
        style={{
          marginTop: "64px",
          marginLeft: isLargeScreen ? "280px" : "0px",
          padding: "32px",
          minHeight: "calc(100vh - 64px)",
          background: "#f9fafb"
        }}
      >
        <Outlet />
      </main>
    </>
  );
};

export default DashboardLayout;