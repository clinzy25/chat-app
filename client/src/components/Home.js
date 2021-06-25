import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import { Grid, CssBaseline, Button } from "@material-ui/core";
import { SidebarContainer } from "./Sidebar";
import { ActiveChat } from "./ActiveChat";
import { logout, fetchConversations } from "../store/utils/thunkCreators";
import { clearOnLogout } from "../store/index";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles(() => ({
  root: {
    height: "97vh",
  },
}));

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const classes = useStyles();

  const [user, conversations] = useSelector((state) => [
    state.user,
    state.conversations,
  ]);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoggedIn(true);
  }, [user.id]);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logout(user.id));
    await dispatch(clearOnLogout());
  };

  if (!user.id) {
    return <Redirect to="/auth" />;
  }
  return (
    <>
      {/* logout button will eventually be in a dropdown next to username */}
      <Button className={classes.logout} onClick={handleLogout}>
        Logout
      </Button>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <SidebarContainer />
        <ActiveChat />
      </Grid>
    </>
  );
};

export default Home;
