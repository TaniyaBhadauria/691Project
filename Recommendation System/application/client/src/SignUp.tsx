import React, { useState } from 'react';
import { Typography, Box, Button, Grid, TextField, Link } from '@mui/material';
import NavigationHeader from './Header';
import backgroundImage from './images/background_images.jpg';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [screenName, setScreenName] = useState('');
  
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:8000/create-user?email=${email}&password=${password}&location=${location}&bio=${bio}&userName=${username}&screenName=${screenName}&profilePicture=${profilePicture}`);
      const data = await response.json();
      sessionStorage.removeItem('userDetails');
      const user_details = {
        "userId": "105",
        "userName": username,
        "profilePicture": profilePicture,
        "emailId": email,
        "password": password,
        "screenName": screenName,
        "location": location,
        "bio": bio,
        "tweets": [{}]
    }
      sessionStorage.setItem('userDetails', JSON.stringify(user_details));
      setTimeout(() => {
        // Redirect to user-profile page after 2 seconds
        window.location.href = '/user-profile';
      }, 2000);
      // Check if the response contains an error message
      if (response.status !== 200) {
        throw new Error(data.message);
      }

      // Handle successful sign-up
      console.log('Sign-up successful:', data);

      // Optionally, redirect the user to another page
    } catch (error:any) {
      setError(error.message || 'An error occurred during sign-up');
    }
  };

  return (
    <div className="container">
      <NavigationHeader />
      <main className="content" style={{ backgroundImage: `url(${backgroundImage})`, padding: 100, marginLeft: 0, marginRight: 0 }}>
        <Box sx={{ p: 4 }}>
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={4} sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h5" gutterBottom>Sign Up</Typography>
              {error && <Typography variant="body1" gutterBottom style={{ color: 'red' }}>{error}</Typography>}
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  id="username"
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{ marginBottom: 2 }}
                  required
                />
                <TextField
                  fullWidth
                  id="screenName"
                  label="ScreenName"
                  value={screenName}
                  onChange={(e) => setScreenName(e.target.value)}
                  sx={{ marginBottom: 2 }}
                  required
                />
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
                <TextField
                  fullWidth
                  id="bio"
                  label="Bio"
                  type="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  sx={{ marginBottom: 2 }}
                  required
                />
                <TextField
                  fullWidth
                  id="location"
                  label="Location"
                  type="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  sx={{ marginBottom: 2 }}
                  required
                />
                <TextField
                  fullWidth
                  id="profilePicture"
                  label="ProfilePicture"
                  type="profilePicture"
                  value={profilePicture}
                  onChange={(e) => setProfilePicture(e.target.value)}
                  sx={{ marginBottom: 2 }}
                  required
                />
                
                <Button variant="contained" color="primary" type="submit" sx={{ marginBottom: 2 }}>Sign Up</Button>
              </form>
              <Typography variant="body1" gutterBottom>Already have an account? <Link href="/sign-in">Sign in</Link>.</Typography>
            </Grid>
          </Grid>
        </Box>
      </main>
    </div>
  );
}

export default SignUp;
