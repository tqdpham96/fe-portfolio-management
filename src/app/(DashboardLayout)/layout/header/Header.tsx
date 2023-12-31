import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack,
} from "@mui/material";
import PropTypes from "prop-types";
import { Typography } from '@mui/material';
// components
import Profile from "./Profile";

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType) => {
  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: "none",
    background: theme.palette.background.paper,
    justifyContent: "center",
    backdropFilter: "blur(4px)",
    borderRadius: 13,
    [theme.breakpoints.up("lg")]: {
      minHeight: "70px",
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: "100%",
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
      <Profile />
      <Typography>This is a sample page</Typography>
        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
          <Box
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          >
          </Box>
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
