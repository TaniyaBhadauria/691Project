from confluent_kafka import Producer
import json
from RawToSentiment import sentiment

def publish_to_kafka(topic, userName, tweet, bootstrap_servers='localhost:9092'):
    message =  {"username": userName, "tweet": tweet }
    producer = Producer({'bootstrap.servers': bootstrap_servers})

    try:
        message_json = json.dumps(message)

        producer.produce(topic, message_json.encode('utf-8'))
        sentiment()

        producer.flush()
        

        print(f"Message published to {topic}: {message}")
    except Exception as e:
        print(f"Failed to publish message to {topic}: {e}")
    finally:

        producer.flush()
