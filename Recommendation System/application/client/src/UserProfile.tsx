import React from 'react';
import NavigationHeader from './Header';
import backgroundImage from './images/background_images.jpg';
import UserProfileDisplay from './UserProfileDisplay';
import TweetForm from './Tweetform';

const UserProfile: React.FC = () => {
  return (
    <div className="container">
      <NavigationHeader />
      <main className="content" style={{ backgroundImage: `url(${backgroundImage})`, padding: 100, marginLeft: 0, marginRight: 0 }}>

        <UserProfileDisplay />
        <TweetForm />
      </main>
    </div>
  );
}

export default UserProfile;
