leagueJSON = """
{
  "_id": {
        "$oid": "id_placeholder"
    },
    "name": "name_placeholder",
    "player_ids": playerIDs_placeholder,
    "player_stats": stats_placeholder,
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
    "gender": "gender_placeholder",
    "nickname": "nickname_placeholder",
    "phone_number": "phone_placeholder",
    "player_stats": stats_placeholder,
    "show_information": false,
    "league_ids": leagues_placeholder,
    "token_version": 0,
    "selected_league_schedules": ["All"],
    "notifications": []
},"""


statThings = ['hits', 'singles', 'doubles', 'triples', 'homeruns', 'plate_appearances', 'at_bats', 'games', 'wins', 'losses', 'points']
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
        }
    },
    "game_location": "location_placeholder",
    "player_stats": stats_placeholder
},"""

from faker import Faker
from random import randint
import random

amts = { "players": 30, "leagues": 8, "games": 50, "stats": 100 }

letters = ['a', 'b', 'c', 'd', 'e', 'f'] # 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

playerIDs = []
leagueIDs = []
gameIDs = []
statsIDs = []

leaguePlayerIDS = {} #will contain key player id with value [league id]

def makeIDs(lis, amt, typ):
    file = open('server/sample-data/'+typ+".txt", "w")
    for i in range(amt):
        id = ""
        fake = Faker()
        for i in range(24):
            if randint(0,1) == 1:
                id += random.choice(digits)
            else:
                id += random.choice(letters)
        lis.append(id)
    file.write(str(lis))
    file.close()

def showListAsOIDs(list):
    if len(list) == 0:
        return '""'
    thing = "["
    for i in list:
        thing += '{ "$oid": "' + i + '" },'
    thing = thing[0:-1] + ']'
    return thing

makeIDs(playerIDs, amts['players'], 'playerIDs')
makeIDs(leagueIDs, amts['leagues'], 'leagueIDs')
makeIDs(gameIDs, amts['games'], 'gameIDs')

#fake.date_object()
#fake.words()

def main():
    makeLeagues()
    makePlayers()
    makeGames()

def makeGames():
    file = open("server/sample-data/games.json", "w")
    file.write('[')

    fake = Faker()

    for i in gameIDs:
        players = []
        teamSize = randint(1, 4)
        for _ in range(teamSize*2):
            players.append(random.choice(playerIDs))
        temp = gameJSON
        temp = temp.replace("id_placeholder", i)
        temp = temp.replace("league_placeholder", random.choice(leagueIDs))
        s = []
        for x in range(0, int(len(players)/2)):
            s.append(players[x])
        temp = temp.replace("team1_placeholder", showListAsOIDs(s))
        s = []
        for x in range(int(len(players)/2), len(players)):
            s.append(players[x])
        temp = temp.replace("team2_placeholder", showListAsOIDs(s))
        date = 16224 #May 30th 8 0s
        temp = temp.replace("date_placeholder", str(date+randint(25,100)) + "00000000")
        temp = temp.replace("location_placeholder", fake.address().replace('\n', ''))
        
        s = '['
        for p in players:
            s += '{ "player_id": { "$oid": "' + p + '" },'
            s += '"stats": {'
            for x in statThings:
                val = randint(0,3)
                if x in ['wins', 'losses']:
                    val = -1
                if x == 'points':
                    val = randint(0,10)
                s += '"'+x+'": '+str(val)+','
            s = s[0:-1] + '} },'
        s = s[0:-1] + ']'
        temp = temp.replace("stats_placeholder", s)

        #Cut off last , and add ]
        if i == gameIDs[-1]:
            temp = temp[0:-1] + ']'
        file.write(temp)
    
    file.close()

def makePlayers():
    file = open("server/sample-data/players.json", "w")
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
        val = randint(0, 7)
        g = "Other"
        if val < 4:
            g = "Male"
        elif val < 7:
            g = "Female"
        temp = temp.replace("gender_placeholder", g)
        if randint(0,2) == 1:
            temp = temp.replace("nickname_placeholder", fake.first_name())
        else:
            temp = temp.replace("nickname_placeholder", "")
        if randint(0,2) == 1:
            temp = temp.replace("phone_placeholder", fake.phone_number())
        else:
            temp = temp.replace("phone_placeholder", "")

        s = ' {'
        for x in statThings:
            s += '"'+x+'": '+str(randint(0,100))+','
        s = s[0:-1] + '}'
        temp = temp.replace("stats_placeholder", s)
        if i in leaguePlayerIDS:
            playerLeagues = leaguePlayerIDS[i]
            temp = temp.replace("leagues_placeholder", showListAsOIDs(playerLeagues))
        else:
            temp = temp.replace("leagues_placeholder", "[]")

        #Cut off last , and add ]
        if i == playerIDs[-1]:
            temp = temp[0:-1] + ']'
        file.write(temp)
    
    file.close()

def makeLeagues():
    file = open("server/sample-data/leagues.json", "w")
    file.write('[')

    fake = Faker()

    for i in leagueIDs:
        #Create leagues
        maxPlayers = randint(3, 20)
        numPlayers = randint(3, maxPlayers)
        players = []
        for x in range(numPlayers):
            p = random.choice(playerIDs)
            players.append(p)
            if p in leaguePlayerIDS:
                leaguePlayerIDS[p].append(i)
            else:
                leaguePlayerIDS[p] = [i]
        leaguePlayerIDS[i] = players
        temp = leagueJSON
        temp = temp.replace("id_placeholder", i)
        temp = temp.replace("name_placeholder", fake.job())
        
        s = '['
        for p in players:
            s += '{ "player_id": { "$oid": "' + p + '" },'
            s += '"stats": {'
            for x in statThings:
                s += '"'+x+'": '+str(randint(0,50))+','
            s = s[0:-1] + '} },'
        s = s[0:-1] + ']'
        temp = temp.replace("stats_placeholder", s)
        temp = temp.replace("playerIDs_placeholder", showListAsOIDs(players))
        temp = temp.replace("maxPlayers_placeholder", str(maxPlayers))
        temp = temp.replace("creator_placeholder", random.choice(players))
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