import { useContext, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
// @mui
import { styled } from "@mui/material/styles";
//
import "./styles.css";
import mainContext from "../../context/mainContext";

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled("div")({
  display: "flex",
  minHeight: "100%",
  overflow: "hidden",
  padding: "40px 8%",
});

const Main = styled("div")(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  minHeight: "100%",
  padding: "0px 40px",
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { navigate } = useContext(mainContext);
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");

  const sideMenu = isAdmin
    ? [
        {
          name: "Dashboard",
          path: "/admin/dashboard",
        },
        {
          name: "Mechanic Requests",
          path: "/admin/mechanic-requests",
        },
        {
          name: "Manage Mechanic",
          path: "/admin/manage-mechanic",
        },
        {
          name: "Reported Users",
          path: "/admin/reported-users",
        },
      ]
    : [
        {
          name: "Dashboard",
          path: "/seller/dashboard",
        },
        {
          name: "Order List",
          path: "/seller/order-list",
        },
        {
          name: "Mechanic Profile",
          path: "/seller/mechanic-profile",
        },
      ];

  return (
    <StyledRoot>
      <div className="sidebar-container">
        {sideMenu.map((single) => (
          <div
            className={`button ${
              location.pathname === single.path && "active"
            }`}
            onClick={() => navigate(single.path)}
          >
            {single.name}
          </div>
        ))}
      </div>
      <Main>
        <Outlet />
      </Main>
    </StyledRoot>
  );
}
