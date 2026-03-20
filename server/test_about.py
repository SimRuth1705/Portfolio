import requests

try:
    res = requests.get("http://127.0.0.1:5006/api/about/skills")
    print(f"Status: {res.status_code}")
    print(f"Response: {res.text}")
except Exception as e:
    print(f"Error: {e}")
