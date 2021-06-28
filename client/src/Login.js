import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
  makeStyles,
} from "@material-ui/core";
import { login } from "./store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
  },
  bg: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage:
      "linear-gradient(to top, rgba(134, 185, 255, 85%), rgba(58, 141, 255, 85%)), url(./assets/images/bg-img-compressed.png)",
    backgroundSize: "cover",
    height: "100vh",
    width: "40%",
    color: "white",
    textAlign: "center",
  },
  converse: {
    margin: "50px 100px 100px 100px",
  },
  speechBubble: {
    height: "100px",
  },
  formContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  loginOrRegister: {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    right: "0%",
    margin: "30px",
  },
  prompt: {
    color: "#BFBEBE",
  },
  promptBtn: {
    padding: "20px 50px",
    borderRadius: "5px",
    marginLeft: "30px",
    boxShadow: "0 0 10px #CFCECE",
    color: "#3A8DFF",
  },
  form: {
    width: "60%",
  },
  formField: {
    width: "100%",
    marginTop: "50px",
  },
  submitBtn: {
    backgroundColor: "#3A8DFF",
    color: "white",
    padding: "20px 75px",
  },
  submitBtnContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "75px",
  },
}));

const Login = (props) => {
  const history = useHistory();
  const { user, login } = props;
  const classes = useStyles();

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    await login({ username, password });
  };

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <Box className={classes.root} container justify="center">
      <div className={classes.bg}>
        <img
          className={classes.speechBubble}
          src="./assets/icons/bubble.svg"
          alt=""
        />
        <Typography className={classes.converse} style={{ fontSize: "2.5rem" }}>
          Converse with anyone in any language
        </Typography>
      </div>
      <Box className={classes.loginOrRegister}>
        <Typography style={{ fontSize: "1.3rem" }} className={classes.prompt}>
          Don't have an account?
        </Typography>
        <Button
          style={{ fontSize: "1.3rem" }}
          className={classes.promptBtn}
          onClick={() => history.push("/register")}
        >
          Create Account
        </Button>
      </Box>
      <Box className={classes.formContainer}>
        <form className={classes.form} onSubmit={handleLogin}>
          <Typography style={{ fontSize: "2.5rem", fontWeight: "700" }}>
            Welcome Back!
          </Typography>
          <Box>
            <Box>
              <FormControl
                className={classes.formField}
                margin="normal"
                required
              >
                <TextField
                  aria-label="e-mail address"
                  label="E-mail address"
                  name="username"
                  type="text"
                />
              </FormControl>
            </Box>
            <FormControl className={classes.formField} margin="normal" required>
              <TextField
                label="Password"
                aria-label="password"
                type="password"
                name="password"
              />
            </FormControl>
            <Box className={classes.submitBtnContainer}>
              <Button
                className={classes.submitBtn}
                style={{ fontSize: "1.3rem" }}
                type="submit"
                variant="contained"
                size="large"
              >
                Login
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (credentials) => {
      dispatch(login(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
