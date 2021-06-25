import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  TextField,
  FormHelperText,
} from "@material-ui/core";

export const Signup = ({ classes, formErrorMessage }) => {
  return (
    <Box>
      <Box>
        <FormControl className={classes.formField}>
          <TextField
            aria-label="username"
            label="Username"
            name="username"
            type="text"
            required
          />
        </FormControl>
      </Box>
      <Box>
        <FormControl className={classes.formField}>
          <TextField
            label="E-mail address"
            aria-label="e-mail address"
            type="email"
            name="email"
            required
          />
        </FormControl>
      </Box>
      <Box>
        <FormControl
          className={classes.formField}
          error={!!formErrorMessage.confirmPassword}
        >
          <TextField
            aria-label="password"
            label="Password"
            type="password"
            inputProps={{ minLength: 6 }}
            name="password"
            required
          />
          <FormHelperText>{formErrorMessage.confirmPassword}</FormHelperText>
        </FormControl>
      </Box>
      <Box>
        <FormControl
          className={classes.formField}
          error={!!formErrorMessage.confirmPassword}
        >
          <TextField
            label="Confirm Password"
            aria-label="confirm password"
            type="password"
            inputProps={{ minLength: 6 }}
            name="confirmPassword"
            required
          />
          <FormHelperText>{formErrorMessage.confirmPassword}</FormHelperText>
        </FormControl>
      </Box>
      <Box className={classes.submitBtnContainer}>
        <Button
          className={classes.submitBtn}
          style={{ fontSize: "1.3rem" }}
          type="submit"
          variant="contained"
          size="large"
        >
          Create
        </Button>
      </Box>
    </Box>
  );
};
