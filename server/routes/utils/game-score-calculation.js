module.exports = (game) => {
  const team1Scores = {}
  const team2Scores = {}

  game.player_stats.forEach(player => {
    if (!player.team_1_score || !player.team_2_score) return

    if (team1Scores[player.team_1_score]) team1Scores[player.team_1_score] += 1
    else team1Scores[player.team_1_score] = 1

    if (team2Scores[player.team_2_score]) team2Scores[player.team_2_score] += 1
    else team2Scores[player.team_2_score] = 1
  })
  const team_1_score = Object.entries(team1Scores).sort((prev, next) =>  next[1]- prev[1])
  const team_2_score = Object.entries(team2Scores).sort((prev, next) => next[1]- prev[1])
  return { team_1_score: team_1_score[0][0], team_2_score: team_2_score[0][0] }
}