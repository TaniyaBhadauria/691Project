from flask import Flask, jsonify
from neo4j import GraphDatabase
from textblob import TextBlob
import spacy
from MongoDBConnection import query_users_by_name
from MongoDBConnection import query_user_by_credentials
from MongoDBConnection import update_user_by_credentials
from MongoDBConnection import insert_new_user
from MongoDBConnection import  insert_tweet
from Kafka import publish_to_kafka
from flask import request
from flask_cors import CORS
from Neo4jMethods import post_tweet, parse_and_recommend_hashtags, recommend_users_to_follow

app = Flask(__name__)
CORS(app)
nlp = spacy.load("en_core_web_md")

# Neo4j connection
neo4j_uri = "bolt://localhost:7687"
neo4j_user = "neo4j"
neo4j_password = "Taniya@123"

# Function to get hashtags for a user
def get_user_hashtags(screen_name):
    query = (
        "MATCH (u:User)-[:POSTS]->(t:Tweet)-[:TAGS]->(h:Hashtag) "
        "WHERE u.screen_name = $screen_name "
        "RETURN u.screen_name AS User, COLLECT(DISTINCT h.name) AS Hashtags"
    )
    with driver.session() as session:
        result = session.run(query, screen_name=screen_name)
        return [record for record in result]

def create_new_user(screen_name, name, location,profile_image_url ):
    query = "CREATE (:User {screen_name: $screen_name, name: $name, location: $location, profile_image_url: $profile_image_url})"
    with driver.session() as session:
        session.run(query, screen_name=screen_name, name=name, location=location, profile_image_url=profile_image_url)

# Function to get hashtags for a user
def get_user_allposts_hashtags():
    query = (
        "MATCH (u:User)-[:POSTS]->(t:Tweet)-[:TAGS]->(h:Hashtag) RETURN u.screen_name AS User, t.text AS Post, COLLECT(DISTINCT h.name) AS Hashtags ORDER BY u.screen_name, t.text"
    )
    with driver.session() as session:
        result = session.run(query)
        return [record for record in result]
    


@app.route('/user-details', methods=['GET'])
def get_user_details():
    email = request.args.get('email')  
    password = request.args.get('password')  
    
   
    if email and password:
        user = query_user_by_credentials(email, password)
        if user:
            user_details = {
                "_id": str(user["_id"]),
                "userId": user["userId"],
                "userName": user["userName"],
                "profilePicture": user["profilePicture"],
                "emailId": user["emailId"],
                "password": user["password"],
                "screenName": user["screenName"],
                "location": user["location"],
                "bio": user["bio"],
                "tweets": user["tweets"]
            }
            return jsonify(user_details)
        else:
            return jsonify({"message": "User not found or invalid credentials"})
    else:
        return jsonify({"message": "Email and password are required"})

@app.route('/update-user', methods=['GET'])
def update_user_details():
    email = request.args.get('email')  # Get email from request query parameters
    password = request.args.get('password')  # Get password from request query parameters
    location = request.args.get('location')
    bio = request.args.get('bio')
    userName = request.args.get('userName')
    profilePicture = request.args.get('profilePicture')
    # Check if email and password are provided
    if email and password:
        user = update_user_by_credentials(userName, password, email, profilePicture, bio, location)
        if user == True:
            
            return jsonify({"message": "User updated successfully"})
        else:
            return jsonify({"message": "Failed to update user"})
    else:
        return jsonify({"message": "Failed to update user"})


@app.route('/create-user', methods=['GET'])
def create_user():
    email = request.args.get('email')  
    password = request.args.get('password')  
    location = request.args.get('location')
    bio = request.args.get('bio')
    userName = request.args.get('userName')
    screenName = request.args.get('screenName')
    profilePicture = request.args.get('profilePicture')
    user_details = {
                "userId": "105",
                "userName": userName,
                "profilePicture": profilePicture,
                "emailId": email,
                "password": password,
                "screenName": screenName,
                "location": location,
                "bio": bio,
                "tweets": [{}]
            }

    if userName and password:    
        insert_new_user(user_details)
        create_new_user(screenName, userName, location,profilePicture )
        return jsonify({"message": "User added successfully."})
    else:
        return jsonify({"message": "User not added. Please try again"})


@app.route('/insert-tweet', methods=['GET'])
def insert_new_tweet():
    email = request.args.get('email')  
    password = request.args.get('password')  
    userName = request.args.get('userName')
    tweetText = request.args.get('tweetText')
    new_tweet = { "text": tweetText}
    message = insert_tweet(userName, new_tweet)
    post_tweet(userName, tweetText,driver)
    recommended_hashtags=parse_and_recommend_hashtags(tweetText,driver)
    recommended_users = recommend_users_to_follow(tweetText,driver)
    if message == 'Tweet inserted successfully':    
        user = query_user_by_credentials(email, password)
        if user:
            user_details = {
                "_id": str(user["_id"]),
                "userId": user["userId"],
                "userName": user["userName"],
                "profilePicture": user["profilePicture"],
                "emailId": user["emailId"],
                "password": user["password"],
                "screenName": user["screenName"],
                "location": user["location"],
                "bio": user["bio"],
                "tweets": user["tweets"],
                "recommended_hashtags":recommended_hashtags,
                "recommended_users": recommended_users
            }
            print((user_details))
            publish_to_kafka('RAW', user["screenName"],tweetText)
            return jsonify(user_details)
    else:
        return jsonify({"message": "Failed to post tweet. Please try again"})
    

if __name__ == '__main__':
    # Neo4j driver
    driver = GraphDatabase.driver(neo4j_uri, auth=(neo4j_user, neo4j_password), database="twitter", encrypted=False)
    app.run(debug=True, port=8000)
