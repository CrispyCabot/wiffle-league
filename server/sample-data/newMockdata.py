import requests

def get(s):
    return requests.get('http://localhost:3000'+s)

def main():
    print(getLeagues()[0]['_id'])
    print(getLeague('c1c63aec5eedd6e567ddffba'))

def getLeagues():
    return get('/leagues').json()

def getLeague(id):
    return get(f'/leagues/{id}').json()

main()