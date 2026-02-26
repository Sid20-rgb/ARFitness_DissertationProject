import { AppBar, Toolbar, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Navbar() {
return ( <AppBar position="static"> <Toolbar> <Button color="inherit" component={Link} to="/">
Workout </Button> <Button color="inherit" component={Link} to="/dashboard">
Dashboard </Button> </Toolbar> </AppBar>
);
}
