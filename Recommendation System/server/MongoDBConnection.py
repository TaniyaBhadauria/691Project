from pymongo import MongoClient

def query_users_by_name(name):
    # MongoDB URI
    uri = "mongodb://localhost:27017"

    try:
        # Create a new client and connect to the server
        client = MongoClient(uri)
        # Access the RecommendationSystem database
        db = client["RecommendationSystem"]
        # Access the User collection
        collection = db["User"]

        # Find users with the specified name
        query = {"userName": name}
        results = collection.find(query)

        # Return the query results
        return list(results)

    except Exception as e:
        # Handle exceptions
        print("Error:", e)
        return []
    
def query_user_by_credentials(email, password):
    try:
        # MongoDB URI
        uri = "mongodb://localhost:27017"

        # Create a new client and connect to the server
        client = MongoClient(uri)
        # Access the RecommendationSystem database
        db = client["RecommendationSystem"]
        # Access the User collection
        collection = db["User"]

        # Find user with the specified email and password
        query = {"emailId": email, "password": password}
        user = collection.find_one(query)

        # Return the user if found, None otherwise
        return user

    except Exception as e:
        # Handle exceptions
        print("Error:", e)
        return None 

def update_user_by_credentials(userName, password, updated_email, updated_profile_picture, updated_bio, updated_location):
    try:
        # MongoDB URI
        uri = "mongodb://localhost:27017"

        # Create a new client and connect to the server
        client = MongoClient(uri)
        # Access the RecommendationSystem database
        db = client["RecommendationSystem"]
        # Access the User collection
        collection = db["User"]

        # Find user with the specified email and password
        query = {"userName": userName, "password": password}

        # Update user document with the provided data
        update_query = {
            "$set": {
                "emailId": updated_email,
                "profilePicture": updated_profile_picture,
                "bio": updated_bio,
                "location": updated_location
            }
        }
        result = collection.update_one(query, update_query)

        # Check if the update was successful
        if result.modified_count > 0:
            print("Document updated successfully")
            return True
        else:
            print("No document found matching the query")
            return False

    except Exception as e:
        print("Error:", e)
        return False
    
def insert_new_user(user_data):
    try:
        uri = "mongodb://localhost:27017"

        client = MongoClient(uri)
        db = client["RecommendationSystem"]
        collection = db["User"]

        result = collection.insert_one(user_data)

        if result.inserted_id:
            print("New user inserted successfully")
            return True
        else:
            print("Failed to insert new user")
            return False

    except Exception as e:
        print("Error:", e)
        return False
    
def insert_tweet(userName, new_tweet):
    try:
        # Create a new client and connect to the server
        uri = "mongodb://localhost:27017"

        client = MongoClient(uri)
        db = client["RecommendationSystem"]
        collection = db["User"]

        # Find the user by user_id
        query = {"userName": userName}
        user = collection.find_one(query)

        # Insert the new tweet
        if user:
            print(new_tweet)
            # Append the new tweet to the existing ones
            user["tweets"].append(new_tweet)
            # Update the document in the collection
            collection.update_one(query, {"$set": {"tweets": user["tweets"]}})

            return ("Tweet inserted successfully")
        else:
            return ("User not found")

    except Exception as e:
        print("Error:", e)


if __name__ == "__main__":
    # Query users named "Alice Smith"
    alice_users = query_users_by_name("Alice Smith")
    print("Users named Alice Smith:")
    for user in alice_users:
        print(user)