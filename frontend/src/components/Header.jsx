import { Email, Login, Logout } from "@mui/icons-material";
import {
  AppBar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Toolbar, Typography
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import MyLetters from "./MyLetters"; // Import the MyLetters component

const Header = () => {
  const [user, setUser] = useState(null);
  const [openLogin, setOpenLogin] = useState(false);
  const [openLetters, setOpenLetters] = useState(false);

  // Backend URL
  const API_URL = "https://lettereditorbackend-8c5b.onrender.com";

  // Check if user is logged in
  useEffect(() => {
    axios.get(`${API_URL}/auth/login/success`, { withCredentials: true })
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // Login
  const handleLogin = () => {
    window.open(`${API_URL}/auth/google`, "_self");
  };

  // Logout
  const handleLogout = () => {
    axios.get(`${API_URL}/auth/logout`, { withCredentials: true })
      .then(() => {
        setUser(null);
        window.location.href = "http://localhost:5173";
      })
      .catch((err) => console.error("Logout Error:", err));
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#e3f2fd", color: "#000", padding: "10px 20px" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
        {/* Logo */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="caption" sx={{ fontSize: "2rem", fontWeight: "bold", mt: 0.5 }}>
            Letter Editor
          </Typography>
        </Box>

        {/* Right Side */}
        <Box sx={{ display: "flex", gap: 4 }}>
          
          {/* My Letters */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <IconButton color="inherit" onClick={() => setOpenLetters(true)} disabled={!user}>
              <Email sx={{ fontSize: 30 }} />
            </IconButton>
            <Typography variant="caption" sx={{ fontSize: "0.8rem", fontWeight: "bold" }}>
              My Letters
            </Typography>
          </Box>

          {/* Login / Logout */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {user ? (
              <IconButton color="inherit" onClick={handleLogout}>
                <Logout sx={{ fontSize: 30 }} />
              </IconButton>
            ) : (
              <IconButton color="inherit" onClick={() => setOpenLogin(true)}>
                <Login sx={{ fontSize: 30 }} />
              </IconButton>
            )}
            <Typography variant="caption" sx={{ fontSize: "0.8rem", fontWeight: "bold" }}>
              {user ? "Logout" : "Login"}
            </Typography>
          </Box>

        </Box>
      </Toolbar>

      {/* Login Dialog */}
      <Dialog open={openLogin} onClose={() => setOpenLogin(false)}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Sign in with Google to continue</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogin} variant="contained" color="primary">Login with Google</Button>
          <Button onClick={() => setOpenLogin(false)} color="secondary">Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* My Letters Dialog */}
      <Dialog open={openLetters} onClose={() => setOpenLetters(false)} maxWidth="md" fullWidth>
        <DialogTitle>My Letters</DialogTitle>
        <DialogContent>
          <MyLetters user={user} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLetters(false)} color="secondary">Close</Button>
        </DialogActions>
      </Dialog>

    </AppBar>
  );
};

export default Header;
