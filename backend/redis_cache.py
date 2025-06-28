import redis
import json
import os

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)

def get_cache(key: str):
    value = redis_client.get(key)
    if value:
        return json.loads(value)
    return None

def set_cache(key: str, value, ex: int = 60):
    redis_client.set(key, json.dumps(value, default=str), ex=ex)

def delete_cache(key: str):
    redis_client.delete(key)
