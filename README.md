Here's an updated README file with more detailed prerequisites and deployment steps

This project implements a graph-based recommendation system for a Twitter-like application. 
It recommends hashtags and users to follow based on the tweets a user posts and incorporates real-time sentiment analysis to refine the recommendations.

## Features
- A front-end web application for users to post tweets
- Storage of user profile in MongoDB
- Near real-time sentiment analysis on posted tweets using Apache Kafka and a stream processing engine
- A Neo4j graph database to store entities like users, hashtags, and sentiments
- Querying the graph database to generate recommendations
- Displaying recommendations to the user

## Prerequisites

Before you can run this application, you need to have the following software installed on your system:

### npm
Install Node.js to run the front end application and run the below commands to check the verion-
node -v
npm -v

### Python

- Python 3.x: [Download Python](https://www.python.org/downloads/)

### Databases

- Install MongoDB: https://www.mongodb.com/try/download/community-edition
- Install Neo4j: https://neo4j.com/deployment-center/

### Message Broker

- Apache Kafka: [Install Apache Kafka](https://kafka.apache.org/downloads)
- Kafka connect plugin: https://docs.confluent.io/platform/current/connect/userguide.html

## Deployment

Follow these steps to deploy the application:

1. Clone the repository:

git https://github.com/TaniyaBhadauria/691Project.git
cd Recommendation System

2. Install Python dependencies:

pip install -r requirements.txt

3. Install node modules
 run npm install

4. Load data to neo4J
Follow the instructions of https://github.com/neo4j-graph-examples/twitter-v2?tab=readme-ov-file to load data 
Drop the `twitter-40.dump` file into the `Files` section of a project in Neo4j Desktop
Then choose the `Create new DBMS from dump` option
and start the neo4j database and open Neo4J browser to run/verify queries

5. Load data to Mongo DB
Open Mongo DB compass, create a new Db with name Recommendation System and User Collection 
Create and Load the sample to collection:
   {
   "_id": {
   "$oid": "662dc3a74284f73252a9b184"
   },
   "userId": "103",
   "userName": "Bob Johnson",
   "profilePicture": "https:",
   "emailId": "bob.johnson@example.com",
   "password": "hashedpassword3",
   "screenName": "bob_john",
   "location": "New Jersey, USA",
   "bio": "I am a football freak",
   "tweets": [
   {
   "text": "Just went on a hiking trip to the mountains ⛰️"
   },
   {
   "text": "Coding is my passion! 💻"
   },
   {
   "text": "Excited to start a new coding project!"
   }
   ]
   }

6. Start Kafka environment
# Start the ZooKeeper service
$ bin/zookeeper-server-start.sh config/zookeeper.properties

# Start the Kafka broker service
$ bin/kafka-server-start.sh config/server.properties

bin/connect-distributed.sh config/connect-distributed.properties
# create Kafka topics
bin/kafka-topics.sh --create --topic RAW --bootstrap-server localhost:9092
bin/kafka-topics.sh --create --topic SENTIMENT --bootstrap-server localhost:9092

# create Sink connector
curl -X POST http://localhost:8083/connectors \
-H 'Content-Type:application/json' \
-H 'Accept:application/json' -d '{
"name": "Neo4jSinkConnector",
"config": {
"topics": "sentiment",
"connector.class": "streams.kafka.connect.sink.Neo4jSinkConnector",
"errors.retry.timeout": "-1",
"errors.retry.delay.max.ms": "1000",
"errors.tolerance": "all",
"errors.log.enable": true,
"errors.log.include.messages": true,
"neo4j.server.uri": "bolt://localhost:7687",
"neo4j.authentication.basic.username": "neo4j",
"neo4j.authentication.basic.password": "Taniya@123",
"neo4j.database": "twitter",
"neo4j.encryption.enabled": false,
"neo4j.topic.cypher.sentiment": "MATCH (u:User{screen_name: event.username})-[:POSTS]->(t:Tweet{text: event.tweet}) MERGE (s:Sentiment {value: event.sentiment}) MERGE (t)-[:HAS_SENTIMENT]->(s)"
}}'
7. Configure the application by updating the following environment variables in the project:

MONGO_URI = "mongodb://localhost:27017"
NEO4J_URI = "bolt://localhost:7687"
KAFKA_BOOTSTRAP_SERVERS = ["localhost:9092"]


6. Start the application:

front -end :
cd Recommendation System/application/client
npm start
it will bring the server on host 3000

The application should now be running, and you can access the web interface at `http://localhost:3000`.

back-end
To Start the backend service run the Recommendation.py file

## Testing

Unit tests and integration tests are included in the project. To run the tests, execute:
cd Recommendation System/server
run Test.py
