import { Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <Box
      width="1400px"
      bg="orange"
      height="70px"
      display="flex"
      justifyContent="space-around"
      alignContent="center"
    >
      <Box bg="#66FF33" width="200px" height="50px" textAlign="center">
        <Link to="/">Home</Link>
      </Box>
      <Box bg="skyblue" width="200px" height="50px" textAlign="center">
        <Link to="/notes">Notes</Link>
      </Box>
      <Box bg="pink" width="200px" height="50px" textAlign="center">
        <Link to="/study">Study</Link>
      </Box>
      <Box bg="yellow" width="200px" height="50px" textAlign="center">
        <Link to="/schedule">Schedule</Link>
      </Box>
    </Box>
  );
};

export default NavBar;
