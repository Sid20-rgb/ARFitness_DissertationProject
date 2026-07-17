import { AppBar, Toolbar, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          Setup
        </Button>

        <Button color="inherit" component={Link} to="/workout">
          Workout
        </Button>

        <Button color="inherit" component={Link} to="/dashboard">
          Dashboard
        </Button>

        {!currentUser ? (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        ) : (
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        )}
      </Toolbar>
      {currentUser && (
  <span style={{ marginLeft: "20px" }}>
    {currentUser.displayName}
  </span>
)}
    </AppBar>
  );
}