import React, { useState } from 'react';
import { Typography, Box, Avatar, Button, Grid, Divider, TextField, Link } from '@mui/material';
import NavigationHeader from './Header';
import backgroundImage from './images/background_images.jpg';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      const response = await fetch(`http://localhost:8000/user-details?email=${email}&password=${password}`);
      if (!response.ok) {
        throw new Error('Invalid email or password');
      }
      const data = await response.json();
      // Store user details in session storage
      sessionStorage.setItem('userDetails', JSON.stringify(data));
      setSuccess(true);
      setTimeout(() => {
        // Redirect to user-profile page after 2 seconds
        window.location.href = '/user-profile';
      }, 2000);
    } catch (error:any) {
      setError('Email/Password does not exist. Please sign up');
    }
  };

  return (
    <div className="container">
      <NavigationHeader />
      <main className="content" style={{ backgroundImage: `url(${backgroundImage})`, padding: 100, marginLeft: 0, marginRight: 0 }}>
        <Box sx={{ p: 4 }}>
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={4} sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h5" gutterBottom>Sign In</Typography>
              {success && <Typography variant="body1" gutterBottom>Sign in successful!</Typography>}
              {error && <Typography variant="body1" gutterBottom style={{ color: 'red' }}>{error}</Typography>}
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  id="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ marginBottom: 2 }}
                  required
                />
                <TextField
                  fullWidth
                  id="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ marginBottom: 2 }}
                  required
                />
                <Button variant="contained" color="primary" type="submit" sx={{ marginBottom: 2 }}>Sign In</Button>
              </form>
              <Typography variant="body1" gutterBottom>Don't have an account? <Link href="/sign-up">Sign up</Link>.</Typography>
            </Grid>
          </Grid>
        </Box>
      </main>
    </div>
  );
}

export default SignIn;
