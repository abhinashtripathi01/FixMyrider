import * as React from "react";
import { Avatar, Divider } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import "./styles.css";
import {
  Grid,
  Button,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { Stack } from "@mui/system";
import { getUserName } from "../../Utils";
import UserProfile from "../UserProfile";
import { MessagingIcon } from "../../assets/icons";
import mainContext from "../../context/mainContext";

export default function Header() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { userData, setUserData } = React.useContext(mainContext);

  const [hamMenu, setHamMenu] = React.useState(false);
  const handleCloseHam = () => {
    setHamMenu(null);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigate = useNavigate();

  const [cartCount, setCartCount] = React.useState(0);
  const role = localStorage.getItem("role");

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ background: "#FFFFFF" }}>
        <div className="navbar-container">
          <div>
            <Link to="/" class="icon">
              FixMyRider
            </Link>
          </div>

          <div className="nav-links">
            <Link to="/" class="link">
              Home
            </Link>
            <Link to="/find-mechanic" class="link">
              Find Mechanic
            </Link>
            {role && (
              <Link to="/my-orders" class="link">
                My Orders
              </Link>
            )}
            <Link to="/about-us" class="link">
              About Us
            </Link>
          </div>

          <div className="ham-links">
            <Box>
              <Tooltip title="Open settings">
                <IconButton
                  onClick={(e) => setHamMenu(e.currentTarget)}
                  sx={{ p: 0 }}
                >
                  <MenuIcon />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={hamMenu}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(hamMenu)}
                onClose={handleCloseHam}
              >
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    handleCloseHam();
                  }}
                >
                  <Typography textAlign="center">Home</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    handleCloseHam();
                  }}
                >
                  <Typography textAlign="center">Find Mechanic</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    handleCloseHam();
                  }}
                >
                  <Typography textAlign="center">About Us</Typography>
                </MenuItem>
                {role && (
                  <MenuItem
                    onClick={() => {
                      navigate("/my-orders");
                      handleCloseHam();
                    }}
                  >
                    <Typography textAlign="center">My Orders</Typography>
                  </MenuItem>
                )}
                <Divider />
                <MenuItem
                  onClick={() => {
                    navigate("/login");
                    handleCloseHam();
                  }}
                >
                  <Typography textAlign="center">Login</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    handleCloseHam();
                  }}
                  style={{ background: "#242424", color: "#ffffff" }}
                >
                  <Typography textAlign="center">Get Started</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </div>
          <div className="right-side-actions">
            {localStorage.getItem("token") ? (
              <Grid item xs="2">
                <Stack direction="row" justifyContent="flex-end" spacing={4}>
                  <Box>
                    {role && (
                      <Button
                        style={{
                          textTransform: "none",
                          color: "#43C182",
                          marginRight: "10px",
                        }}
                        startIcon={<MessagingIcon size="20px" />}
                        onClick={() => navigate("/chat")}
                      >
                        Messages
                      </Button>
                    )}
                    <Tooltip title="Open settings">
                      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <UserProfile
                          name={userData?.username}
                          url={userData?.image}
                        />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      sx={{ mt: "45px" }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                    >
                      <MenuItem
                        onClick={() => {
                          navigate("/profile");
                          handleCloseUserMenu();
                        }}
                      >
                        <Typography textAlign="center">Profile</Typography>
                      </MenuItem>

                      {role === "customer" && (
                        <MenuItem>
                          <Typography
                            textAlign="center"
                            onClick={() => {
                              navigate("/register-mechanic");
                              handleCloseUserMenu();
                            }}
                          >
                            Register as Mechanic
                          </Typography>
                        </MenuItem>
                      )}
                      {role === "seller" && (
                        <MenuItem>
                          <Typography
                            textAlign="center"
                            onClick={() => {
                              navigate("/seller/dashboard");
                              handleCloseUserMenu();
                            }}
                          >
                            Go to Mechanic Portal
                          </Typography>
                        </MenuItem>
                      )}

                      {role === "admin" && (
                        <MenuItem>
                          <Typography
                            textAlign="center"
                            onClick={() => {
                              navigate("/admin/dashboard");
                              handleCloseUserMenu();
                            }}
                          >
                            Go to Admin Dashboard
                          </Typography>
                        </MenuItem>
                      )}
                      <MenuItem
                        onClick={() => {
                          localStorage.removeItem("token");
                          localStorage.removeItem("username");
                          localStorage.removeItem("userId");
                          localStorage.removeItem("role");
                          navigate("/login");
                          handleCloseUserMenu();
                          setUserData(undefined);
                        }}
                      >
                        <Typography textAlign="center">Logout</Typography>
                      </MenuItem>
                    </Menu>
                  </Box>
                </Stack>
              </Grid>
            ) : (
              <Box display="flex" justifyContent="space-around">
                <Button
                  size="small"
                  onClick={() => navigate("/login")}
                  style={{
                    color: "#242424",
                    fontSize: "1rem",
                    textTransform: "none",
                  }}
                >
                  Login
                </Button>
                <Button
                  sx={{ mx: 1 }}
                  size="small"
                  onClick={() => navigate("/signup")}
                  style={{
                    background: "#242424",
                    fontSize: "1rem",
                    textTransform: "none",
                    color: "#fff",
                    padding: "12px 22px",
                    borderRadius: "12px",
                  }}
                >
                  Get Started
                </Button>
              </Box>
            )}
          </div>
        </div>

        <Box sx={{ flexGrow: 1 }} />
      </AppBar>
    </Box>
  );
}
