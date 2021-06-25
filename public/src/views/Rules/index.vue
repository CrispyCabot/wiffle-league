<template>
  <div class="rules-container">
    <h1 class="site-title">Rules</h1>
    <div class="league-rules-card white_card_background">
      <h2>General Rules</h2>
      <ul>
        <li>Locations can be anything. Try not to be illegal n stuff.</li>
        <li>Enter correct stats. The league creator will be prompted to verify them after every game, and it'll just be annoying if you lie.</li>
      </ul>
    </div>
    <div class="game-rules-card white_card_background">
      <h2>League Rules</h2>
      <ul>
        <li><b>Win = 10 Points</b></li>
        <li><b>1B = 1 Point</b></li>
        <li><b>2B = 2 Points</b></li>
        <li><b>3B = 3 Points</b></li>
        <li><b>HR = 4 Points</b></li>
        <li>No defensive points are awarded. That will be reflected in your ability to stop the other team's offense</li>
        <li>Teams are random every game! The league creator does not get to choose teams; they only choose dates and locations</li>
        <li>League Creators: Feel free to set the location of games to "any" in hopes that the players will communicate appropriately and find a location</li>
        <li>In the event of any disagreements, contact the league creator first. If not resolved, <i>then</i> go through the websites contact page</li>
        <li>Leagues can set their own rules in the "About League" section such as number of innings, time limits, or whatever else. These rules are just a base set of rules to try and have a little bit of organization</li>
      </ul>
    </div>
    <div class="game-rules-card white_card_background">
      <h2>Gameplay Rules</h2>
      <ul>
        <li>Use a wiffle ball/bat as depicted below</li>
        <img src="../../assets/wiffleballbat.png">
        <li>6 innings, 3 outs, 3 strikes, 4 balls</li>
        <li>In the event of a walk, a ghost runner advances to 1st base, and the same batter will restart the plate appearance</li>
        <li>'Ghost' runner rules
          <ul>
            <li>Ghost runners on 2nd and 3rd score on any base hit</li>
            <li>Ghost runners on 1st advance the same number of bases as the batter</li>
          </ul>
        </li>
        <li>There are no ties. If tied after 6 innings, go into extra innings starting with a ghost runner on 2nd for each team</li>
        <li>There are no errors! If you end up on 2nd from a pop out because the other team sucks, go ahead and count it as a double</li>
        <li>In case you don't know...
          <ul>
            <li><b>Plate Appearances</b> is how many times you came to the plate, including walks and sacrifices</li>
            <li><b>At Bats</b> is the same, but excluding walks and sacrifices</li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script src="./rules.ts"></script>
<style src="./rules.scss" lang="scss"></style>