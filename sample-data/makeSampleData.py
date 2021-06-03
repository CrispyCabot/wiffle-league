leagueJSON = """
{
    "_id": {
        "$oid": "id_placeholder"
    },
    "name": "name_placeholder",
    "player_ids": playerIDs_placeholder,
    "player_stats": playerStats_placeholder,
    "max_num_players": maxPlayers_placeholder,
    "league_creator_id": { "$oid": "creator_placeholder" },
    "game_ids": games_placeholder,
    "num_games": numGames_placeholder,
    "games_created": false,
    "team_size": size_placeholder,
    "start_date": {
        "$date": {
            "$numberLong": "start_placeholder"
        }
    },
    "end_date": {
        "$date": {
            "$numberLong": "end_placeholder"
        }
    },
    "deadline_date": {
        "$date": {
            "$numberLong": "deadline_placeholder"
        }
    },
    "about_text": "about_placeholder"
},"""

playerJSON = """
{
    "_id": {
        "$oid": "id_placeholder"
    },
    "email": "email_placeholder",
    "password": "password",
    "firstname": "firstname_placeholder",
    "lastname": "lastname_placeholder",
    "nickname": "nickname_placeholder",
    "phone_number": "phone_placeholder",
    "player_stats": { "$oid": "stats_placeholder" },
    "show_information": false,
    "league_ids": leagues_placeholder
},"""

statsJSON = """
{
    "_id": {
        "$oid": "id_placeholder"
    },
    "player_id": {"$oid": "pid_placeholder" },
    "hits": "hits_placeholder",
    "singles": "singles_placeholder",
    "doubles": "doubles_placeholder",
    "triples": "triples_placeholder",
    "homeruns": "homeruns_placeholder",
    "plate_appearances": "pa_placeholder",
    "at_bats": "ab_placeholder"
},"""

gameJSON = """
{
    "_id": {
        "$oid": "id_placeholder"
    },
    "league_id": { "$oid": "league_placeholder" },
    "team_1_ids": team1_placeholder,
    "team_2_ids": team2_placeholder,
    "game_date": {
        "$date": {
            "$numberLong": "date_placeholder"
        },
    "game_location": "location_placeholder",
    "player_stats": stats_placeholder
},"""

from faker import Faker
from random import randint
import random

amts = { "players": 100, "leagues": 5, "games": 20, "stats": 20 }

letters = ['a', 'b', 'c', 'd', 'e', 'f'] # 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

playerIDs = []
leagueIDs = []
gameIDs = []
statsIDs = []

def makeIDs(lis, amt):
    for i in range(amt):
        id = ""
        fake = Faker()
        for i in range(24):
            if randint(0,1) == 1:
                id += random.choice(digits)
            else:
                id += random.choice(letters)
        lis.append(id)

def showListAsOIDs(list):
    if len(list) == 0:
        return '""'
    thing = "["
    for i in list:
        thing += '{ "$oid": "' + i + '" },'
    thing = thing[0:-1] + ']'
    return thing

makeIDs(playerIDs, amts['players'])
makeIDs(leagueIDs, amts['leagues'])
makeIDs(gameIDs, amts['games'])
makeIDs(statsIDs, amts['stats'])

#fake.date_object()
#fake.words()

def main():
    makeLeagues()
    makePlayers()
    makeStats()
    makeGames()

def makeGames():
    file = open("sample-data/games.json", "w")
    file.write('[')

    fake = Faker()

    for i in gameIDs:
        temp = gameJSON
        temp = temp.replace("id_placeholder", i)
        temp = temp.replace("league_placeholder", random.choice(leagueIDs))
        s = []
        amt = randint(1, 4)
        for _ in range(amt):
            s.append(random.choice(playerIDs))
        temp = temp.replace("team1_placeholder", showListAsOIDs(s))
        s = []
        for _ in range(amt):
            s.append(random.choice(playerIDs))
        temp = temp.replace("team2_placeholder", showListAsOIDs(s))
        date = 16224 #May 30th 8 0s
        temp = temp.replace("date_placeholder", str(date+randint(25,100)) + "00000000")
        temp = temp.replace("location_placeholder", fake.address().replace('\n', ''))
        s = []
        for _ in range(amt*2):
            s.append(random.choice(statsIDs))
        temp = temp.replace("stats_placeholder", showListAsOIDs(s))

        #Cut off last , and add ]
        if i == statsIDs[-1]:
            temp = temp[0:-1] + ']'
        file.write(temp)
    
    file.close()

def makeStats():
    file = open("sample-data/stats.json", "w")
    file.write('[')

    fake = Faker()

    for i in statsIDs:
        temp = statsJSON
        temp = temp.replace("id_placeholder", i)
        temp = temp.replace("pid_placeholder", random.choice(playerIDs))
        temp = temp.replace("hits_placeholder", str(randint(0,100)))
        temp = temp.replace("singles_placeholder", str(randint(0,25)))
        temp = temp.replace("doubles_placeholder", str(randint(0,25)))
        temp = temp.replace("triples_placeholder", str(randint(0,25)))
        temp = temp.replace("homeruns_placeholder", str(randint(0,25)))
        pa = randint(100, 120)
        temp = temp.replace("pa_placeholder", str(pa))
        temp = temp.replace("ab_placeholder", str(pa - randint(0, 30)))

        #Cut off last , and add ]
        if i == statsIDs[-1]:
            temp = temp[0:-1] + ']'
        file.write(temp)
    
    file.close()

def makePlayers():
    file = open("sample-data/players.json", "w")
    file.write('[')

    fake = Faker()

    for i in playerIDs:
        temp = playerJSON
        temp = temp.replace("id_placeholder", i)
        fname = fake.first_name()
        lname = fake.last_name()
        temp = temp.replace("email_placeholder", fname+lname+"@email.com")
        temp = temp.replace("firstname_placeholder", fname)
        temp = temp.replace("lastname_placeholder", lname)
        if randint(0,2) == 1:
            temp = temp.replace("nickname_placeholder", fake.first_name())
        else:
            temp = temp.replace("nickname_placeholder", "")
        if randint(0,2) == 1:
            temp = temp.replace("phone_placeholder", fake.phone_number())
        else:
            temp = temp.replace("phone_placeholder", "")
        temp = temp.replace("stats_placeholder", random.choice(statsIDs))
        s = []
        for _ in range(randint(0, 3)):
            s.append(random.choice(leagueIDs))
            s = list(set(s)) #remove duplicates
        temp = temp.replace("leagues_placeholder", showListAsOIDs(s))

        #Cut off last , and add ]
        if i == playerIDs[-1]:
            temp = temp[0:-1] + ']'
        file.write(temp)
    
    file.close()

def makeLeagues():
    file = open("sample-data/leagues.json", "w")
    file.write('[')

    fake = Faker()

    for i in leagueIDs:
        #Create leagues
        maxPlayers = randint(3, 20)
        numPlayers = randint(3, maxPlayers)
        temp = leagueJSON
        temp = temp.replace("id_placeholder", i)
        s = ''
        for w in fake.words():
            s = s + w + ' '
        temp = temp.replace("name_placeholder", s)
        s = []
        for _ in range(0, numPlayers):
            s.append(random.choice(statsIDs))
            s = list(set(s)) #remove duplicates
        temp = temp.replace("playerStats_placeholder", showListAsOIDs(s))
        s = []
        for _ in range(0, numPlayers):
            s.append(random.choice(playerIDs))
        temp = temp.replace("playerIDs_placeholder", showListAsOIDs(s))
        temp = temp.replace("maxPlayers_placeholder", str(maxPlayers))
        temp = temp.replace("creator_placeholder", random.choice(playerIDs))
        numGames = randint(4, 16)
        s = []
        for _ in range(numGames):
            s.append(random.choice(gameIDs))
        temp = temp.replace("games_placeholder", showListAsOIDs(s))
        temp = temp.replace("numGames_placeholder", str(numGames))
        temp = temp.replace("size_placeholder", str(randint(1,4)))
        temp = temp.replace("about_placeholder", fake.text().replace("\n", " "))
        start = 16224 #May 30th 8 0s
        start += randint(1,100)
        temp = temp.replace("start_placeholder", str(start) + "00000000")
        temp = temp.replace("end_placeholder", str(start + randint(10,40)) + "00000000")
        temp = temp.replace("deadline_placeholder", str(start - randint(1,10)) + "00000000")

        #Cut off last , and add ]
        if i == leagueIDs[-1]:
            temp = temp[0:-1] + ']'
        file.write(temp)

    file.close()

main()