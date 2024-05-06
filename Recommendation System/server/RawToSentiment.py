import json
from textblob import TextBlob
from confluent_kafka import Consumer, Producer, KafkaError

def analyze_sentiment(tweet):
    analysis = TextBlob(tweet)
    if analysis.sentiment.polarity > 0:
        return "positive"
    elif analysis.sentiment.polarity < 0:
        return "negative"
    else:
        return "neutral"

def sentiment():
    consumer_conf = {
        'bootstrap.servers': 'localhost:9092',
        'group.id': 'sentiment-analysis-group',
        'auto.offset.reset': 'earliest'  
    }

    consumer = Consumer(consumer_conf)
    consumer.subscribe(['RAW'])

    producer_conf = {'bootstrap.servers': 'localhost:9092'}
    producer = Producer(producer_conf)

    msg = None
    while True:
        new_msg = consumer.poll(1.0)
        if new_msg is None:
            break
        if new_msg.error():
            if new_msg.error().code() == KafkaError._PARTITION_EOF:
                continue
            else:
                print(new_msg.error())
                break

        msg = new_msg

    if msg:
        tweet = json.loads(msg.value())
        sentiment = analyze_sentiment(tweet["tweet"])
        tweet["sentiment"] = sentiment
        producer.produce('SENTIMENT', key=None, value=json.dumps(tweet))
        producer.flush()

    consumer.close()
    producer.flush()


