import React from 'react'
import { Box, Button, FormControl, TextField } from '@material-ui/core'

export const Login = ({ classes }) => (
  <Box>
    <Box>
      <FormControl className={classes.formField} margin="normal" required>
        <TextField
          aria-label="Username"
          label="Username"
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
        style={{ fontSize: '1.3rem' }}
        type="submit"
        variant="contained"
        size="large"
      >
        Login
      </Button>
    </Box>
  </Box>
)
