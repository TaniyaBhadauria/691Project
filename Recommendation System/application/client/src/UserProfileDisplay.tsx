import React, { useState, useEffect } from 'react';
import { Typography, Box, Avatar, Button, Grid, Divider, TextField } from '@mui/material';
import { BsGeoAlt, BsEnvelope, BsFillPersonFill } from 'react-icons/bs'; // Importing the bio icon

const UserProfileDisplay: React.FC = () => {
  const [userProfileData, setUserProfileData] = useState<any>({});
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch user profile data from session object
    const userProfileFromSession = JSON.parse(sessionStorage.getItem('userDetails') || '{}');
    setUserProfileData(userProfileFromSession);
  }, []);

  const handleEditProfile = () => {
    setEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`http://localhost:8000/update-user?email=${userProfileData.emailId}&password=${userProfileData.password}&location=${userProfileData.location}&bio=${userProfileData.bio}&userName=${userProfileData.userName}&profilePicture=${userProfileData.profilePicture}`);
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const responseData = await response.json();
      if (responseData.message === "User updated successfully") {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 2000);
        sessionStorage.removeItem('userDetails');
        sessionStorage.setItem('userDetails', JSON.stringify(userProfileData));
        setUserProfileData(userProfileData);
      }
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserProfileData({ ...userProfileData, [field]: event.target.value });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4} sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar sx={{ width: 100, height: 100, marginBottom: 2 }} alt={userProfileData.userName} src={userProfileData.profilePicture} />
          <Typography variant="h5" gutterBottom>{userProfileData.userName}</Typography>
          <Typography variant="subtitle1" gutterBottom>@{userProfileData.screenName}</Typography>
          {editing ? (
            <Button variant="contained" color="primary" onClick={handleSaveProfile}>Save Profile</Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleEditProfile}>Edit Profile</Button>
          )}
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography variant="body1" gutterBottom>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <BsFillPersonFill size={24} style={{ marginRight: 8 }} /> {/* Bio icon */}
              {editing ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={userProfileData.bio}
                  onChange={handleChange('bio')}
                />
              ) : (
                userProfileData.bio
              )}
            </Box>
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <BsGeoAlt size={24} style={{ marginRight: 8 }} /> {/* Location icon */}
            <Typography variant="body2">
              {editing ? (
                <TextField
                  fullWidth
                  value={userProfileData.location}
                  onChange={handleChange('location')}
                />
              ) : (
                userProfileData.location
              )}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <BsEnvelope size={24} style={{ marginRight: 8 }} /> {/* Email icon */}
            <Typography variant="body2">
              {editing ? (
                <TextField
                  fullWidth
                  value={userProfileData.emailId}
                  onChange={handleChange('email')}
                />
              ) : (
                userProfileData.emailId
              )}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {editing && (
              <TextField
                fullWidth
                id="profile-picture"
                label="Profile Picture"
                value={userProfileData.profilePicture}
                onChange={handleChange('profilePicture')}
                sx={{ marginBottom: 2 }}
                required
              />
            )}
          </Box>
          {success && <Typography variant="body1" gutterBottom style={{ color: 'green' }}>Profile updated successfully!</Typography>}
          {error && <Typography variant="body1" gutterBottom style={{ color: 'red' }}>{error}</Typography>}
        </Grid>
      </Grid>
    </Box>
  );
}

export default UserProfileDisplay;
