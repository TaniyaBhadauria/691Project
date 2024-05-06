import unittest
from unittest.mock import MagicMock, patch
from Recommendation import app
from MongoDBConnection import query_users_by_name
from MongoDBConnection import query_user_by_credentials
from MongoDBConnection import update_user_by_credentials
from MongoDBConnection import insert_new_user
from MongoDBConnection import  insert_tweet
from Kafka import publish_to_kafka
from flask import request
from flask_cors import CORS
from RawToSentiment import sentiment,analyze_sentiment
from Neo4jMethods import post_tweet, parse_and_recommend_hashtags, recommend_users_to_follow
from pymongo import MongoClient


class TestMyModule(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.mongo_test_data = [
            {
                "_id": 1,
                "userName": "Alice Smith",
                "profilePicture": "https://example.com",
                "emailId": "alice@example.com",
                "password": "password",
                "bio": "I am a software engineer",
                "tweets": [{"text": "This is my first tweet"}, {"text": "This is my second tweet"}]
            },
            {
                "_id": 2,
                "userName": "Bob Johnson",
                "profilePicture": "https://example.com",
                "emailId": "bob@example.com",
                "password": "password",
                "bio": "I love coding",
                "tweets": [{"text": "Just went on a hiking trip to the mountains ⛰️"}]
            }
        ]

    @classmethod
    def setUpClass(cls):
        # MongoDB test data
        cls.mongo_test_data = [
            {
                "userId": "103",
                "userName": "Bob Johnson",
                "profilePicture": "https:",
                "emailId": "bob.johnson@example.com",
                "password": "hashedpassword3",
                "screenName": "bob_john",
                "location": "New Jersey, USA",
                "bio": "I am a football freak",
                "tweets": [
                    {"text": "Just went on a hiking trip to the mountains ⛰️"},
                    {"text": "Coding is my passion! 💻"},
                    {"text": "Excited to start a new coding project!"}
                ]
            },
            {
                
                "userId": "104",
                "userName": "Alice Smith",
                "profilePicture": "https:",
                "emailId": "alice.smith@example.com",
                "password": "hashedpassword4",
                "screenName": "alice_smith",
                "location": "New York, USA",
                "bio": "Tech enthusiast",
                "tweets": [
                    {"text": "Just finished reading a great book! 📚"},
                    {"text": "Heading to a tech conference tomorrow!"},
                    {"text": "New blog post coming soon!"}
                ]
            }
        ]

        # Neo4j test data
        cls.neo4j_test_data = [
            {
                "userName": "bob_john",
                "tweet_text": "Just went on a hiking trip to the mountains ⛰️",
                "hashtags": ["hiking", "mountains"]
            },
            {
                "userName": "bob_john",
                "tweet_text": "Coding is my passion! 💻",
                "hashtags": ["coding", "passion"]
            },
            {
                "userName": "alice_smith",
                "tweet_text": "Just finished reading a great book! 📚",
                "hashtags": ["reading", "book"]
            },
            {
                "userName": "alice_smith",
                "tweet_text": "Heading to a tech conference tomorrow!",
                "hashtags": ["tech", "conference"]
            }
        ]

    @patch("MongoDBConnection.query_users_by_name")
    def test_query_users_by_name(self, mock_mongo_client):
        mock_collection = MagicMock()
        mock_collection.find.return_value = self.mongo_test_data
        mock_mongo_client.return_value.__getitem__.return_value = mock_collection

        result = query_users_by_name("Alice Smith")
        self.assertEqual(result[0]["userName"], self.mongo_test_data[0]["userName"])

    @patch("MongoDBConnection.query_user_by_credentials")
    def test_query_user_by_credentials(self, mock_mongo_client):
        mock_collection = MagicMock()
        mock_collection.find_one.return_value = self.mongo_test_data[0]
        mock_mongo_client.return_value.__getitem__.return_value = mock_collection

        result = query_user_by_credentials("bob.johnson@example.com", "hashedpassword3")
        self.assertEqual(result["userName"], self.mongo_test_data[1]["userName"])


    @patch("MongoDBConnection.insert_tweet")
    def test_insert_tweet(self, mock_mongo_client):
        mock_collection = MagicMock()
        mock_collection.find_one.return_value = self.mongo_test_data[0]
        mock_collection.update_one.return_value = True
        mock_mongo_client.return_value.__getitem__.return_value = mock_collection

        result = insert_tweet("bob_john", {"text": "New tweet!"})
        self.assertEqual(result, "User not found")

    @patch("MongoDBConnection.update_user_by_credentials")
    def test_update_user_by_credentials(self, mock_update_user_by_credentials):
        mock_update_user_by_credentials.return_value = True
        response = self.app.get('/update-user?email=alice@example.com&password=password&location=New York&bio=Updated bio&userName=Alice&profilePicture=https://example.com/profile.jpg')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"message": "Failed to update user"})

    @patch("MongoDBConnection.query_user_by_credentials")
    def test_query_user_by_credentials(self, mock_query_user_by_credentials):
        mock_query_user_by_credentials.return_value = self.mongo_test_data[0]
        response = self.app.get('/user-details?email=alice@example.com&password=password')
        self.assertEqual(response.status_code, 200)

    @patch("textblob.TextBlob")
    def test_analyze_sentiment(self, mock_textblob):
        mock_textblob_instance = MagicMock()
        mock_textblob_instance.sentiment.polarity = 0.5
        mock_textblob.return_value = mock_textblob_instance

        self.assertEqual(analyze_sentiment("This is a positive tweet"), "positive")
        self.assertEqual(analyze_sentiment("This is a negative tweet"), "negative")
        self.assertEqual(analyze_sentiment("This is a neutral tweet"), "neutral")

    @patch("RawToSentiment.Consumer")
    @patch("RawToSentiment.Producer")
    @patch("RawToSentiment.analyze_sentiment")
    def test_sentiment(self, mock_analyze_sentiment, mock_producer, mock_consumer):
        mock_analyze_sentiment.return_value = "positive"

        sentiment()
        mock_consumer.assert_called()
        mock_producer.assert_called()
        

if __name__ == "__main__":
    unittest.main()
