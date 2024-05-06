import re
from neo4j import GraphDatabase
import spacy


nlp = spacy.load("en_core_web_md")

# a function to add new tweet to Neo4j Graph database
def post_tweet(userName, tweet_text,driver):
    # Extract hashtags from tweet text
    hashtags = [hashtag[1:] for hashtag in re.findall(r'#\w+', tweet_text)]

    
    # Define the Cypher query
    query = (
        "MATCH (u:User {name: $userName}) "
        "CREATE (u)-[:POSTS]->(t:Tweet {text: $tweet_text}) "
        "FOREACH (hashtag_name IN $hashtags | "
        "   MERGE (h:Hashtag {name: hashtag_name}) "
        "   MERGE (t)-[:TAGS]->(h)"
        ")"
    )
    
    # Execute the query
    with driver.session() as session:
        session.run(query, userName=userName, tweet_text=tweet_text, hashtags=hashtags)
    
    post_tweet_mentioned_user(userName, tweet_text, driver)

    # Close the Neo4j driver
    driver.close()

# A function to add new tweet to Neo4j Graph database
def post_tweet_mentioned_user(userName, tweet_text, driver):
    # Extract mentioned users from tweet text
    mentioned_users = [mention[1:] for mention in re.findall(r'@\w+', tweet_text)]
    if(mentioned_users):
    # Define the Cypher query
        query = (
            "MATCH (u:User {name: $userName}) "
            "MATCH (u)-[:POSTS]->(t:Tweet {text: $tweet_text}) "
            "FOREACH (mentioned_username IN $mentioned_users | "
            "   MERGE (mentioned_user:User {screen_name: mentioned_username}) "
            "   MERGE (t)-[:MENTIONS]->(mentioned_user)"
            ")"
        )
        
        # Execute the query
        with driver.session() as session:
            session.run(query, userName=userName, tweet_text=tweet_text, mentioned_users=mentioned_users)

        driver.close()


def recommend_hashtags(string_to_compare, driver):
    recommendations = set()
    query = (
        "MATCH (h:Hashtag) "
        "RETURN h.name AS Hashtag"
    )
    with driver.session() as session:
        result = session.run(query)
        for record in result:
            hashtag = record["Hashtag"]
            if nlp(string_to_compare.lower()).similarity(nlp(hashtag.lower())) > 0.5:
                recommendations.add(hashtag)
    return list(recommendations)

# Function to parse hashtags from tweet text and recommend similar hashtags
def parse_and_recommend_hashtags(tweet_text, driver):
    hashtags = re.findall(r'#\w+', tweet_text)
    all_recommendations = set()
    for hashtag in hashtags:
        recommendations = recommend_hashtags(hashtag[1:], driver)
        all_recommendations.update(recommendations)
    return list(all_recommendations)



def get_users_posts_hashtags(driver):
    query = (
        "MATCH (u:User)-[:POSTS]->(t:Tweet)-[:TAGS]->(h:Hashtag) "
        "RETURN u.screen_name AS User, t.text AS Post, COLLECT(DISTINCT h.name) AS Hashtags"
    )
    with driver.session() as session:
        result = session.run(query)
        return [record for record in result]

# Function to recommend users to follow based on their tweets
def recommend_users_to_follow(sentence,driver):
    recommended_users = set()
    sentence_doc = nlp(sentence.lower())
    hashtags = re.findall(r'#\w+', sentence)
    users_posts_hashtags = get_users_posts_hashtags(driver)
    for record in users_posts_hashtags:
        user = record["User"]
        post = record["Post"]
        post_doc = nlp(post.lower())
        post_hashtags = record["Hashtags"]
        for hashtag in hashtags:
            if hashtag in post_hashtags or sentence_doc.similarity(post_doc) > 0.5:
              recommended_users.add(user)
    return list(recommended_users)