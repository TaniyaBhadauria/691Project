import React from 'react';
import { Link } from 'react-router-dom';
import './style/Home.css'; // Import CSS file for styling
import NavigationHeader from './Header';
import backgroundImage from './images/background_images.jpg';

const Homepage: React.FC = () => {
  return (
    <div className="container">
      <NavigationHeader/>
      <main className="content" style={{ backgroundImage: `url(${backgroundImage})`, padding: 100,marginLeft:0,marginRight:0}}>
      <header>
      <br>
            </br>
        <h1>Welcome to  Recommendation System</h1>
        <p>-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</p>
        <br>
            </br>
        <p>Recommendation System is an innovative project that leverages the power of graph databases, real-time streaming, 
          and natural language processing (NLP) to provide users with personalized tweet recommendations and sentiment analysis.</p>
          <br>
            </br>
          <p>Our platform allows users to post tweets, receive personalized hashtag recommendations, 
            and analyze the sentiment of their tweets in real-time. Powered by Neo4j, Kafka, and advanced NLP techniques, 
            Recommendation System offers a seamless and intuitive user experience.</p>
              <br>
            </br>
            <p>Explore the Recommendation System!</p>
            <br>
            </br>
      </header>
      </main>
    </div>
  );
}

export default Homepage;
