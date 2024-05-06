import React from 'react';
import './style/AcademicHarborApp.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import backgroundImage from './images/image.png';

interface HeaderProps {
  isLoggedIn?: boolean;
}  
const Header: React.FC<HeaderProps> = () => {
  const isLoggedInString = sessionStorage.getItem('isUserLoggedIn');
  const isLoggedIn = isLoggedInString ? JSON.parse(isLoggedInString) : false;
  const navigate = useNavigate();
  const handleSignInClick = () => {
    navigate('/sign-in');
  };
  const handleSignUp = () => {
    navigate('/sign-up');
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isUserLoggedIn');
    sessionStorage.removeItem('userData');
    navigate('/');
  };
  const navigateProfile = () => {
      navigate('/user-profile');
    };

  return (
    <div className="container">
      <div className="headerlogo">
        <div className="logo">
          <h3>Recommendation System</h3>
        </div>
        </div>
        <div className="headergap">
        </div>
        <div className="header">
        <nav className="navbar">
          <ul>
            <li><a href="/" >Home</a></li>
            <li><a href="/user-profile">User Profiles</a></li>
            <li>
          <a href="notifications" className="notification-icon"></a>
            </li>
            {isLoggedIn  ? (
                          <li>
                            <div className="user-profile-icon">
                              <button onClick={toggleDropdown}>
                              </button>
                              {isDropdownOpen && (
                                <div className="dropdown-content">
                                  <li><button  onClick={navigateProfile}>Profile</button></li>
                                  <li><button onClick={handleLogout}>Logout</button></li>
                                </div>
                              )}
                            </div>
                          </li>

            ) : (
              <React.Fragment>
                <li><button className="sign-in" onClick={handleSignInClick}>Sign In</button></li>
                <li><button className="sign-up" onClick={handleSignUp}>Sign Up</button></li>
              </React.Fragment>
            )}
          </ul>
        </nav>
      </div>
      </div>
 );
};

export default Header;

