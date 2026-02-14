/**
 * 🏆 IPL Season Points Table
 *
 * IPL ka season chal raha hai aur tujhe points table banana hai!
 * Tujhe match results ka array milega, aur tujhe har team ke points
 * calculate karke sorted table return karna hai.
 *
 * Match result types:
 *   - "win": Winning team gets 2 points, losing team gets 0
 *   - "tie": Both teams get 1 point each
 *   - "no_result": Both teams get 1 point each (rain/bad light)
 *
 * Each match object: { team1: "CSK", team2: "MI", result: "win", winner: "CSK" }
 *   - For "tie" and "no_result", the winner field is absent or ignored
 *
 * Rules (use for loop with object accumulator):
 *   - Loop through matches array
 *   - Build an object accumulator: { "CSK": { team, played, won, lost, tied, noResult, points }, ... }
 *   - After processing all matches, convert to array and sort:
 *     1. By points DESCENDING
 *     2. If points are equal, by team name ASCENDING (alphabetical)
 *
 * Validation:
 *   - Agar matches array nahi hai ya empty hai, return []
 *
 * @param {Array<{team1: string, team2: string, result: string, winner?: string}>} matches
 * @returns {Array<{team: string, played: number, won: number, lost: number, tied: number, noResult: number, points: number}>}
 *
 * @example
 *   iplPointsTable([
 *     { team1: "CSK", team2: "MI", result: "win", winner: "CSK" },
 *     { team1: "RCB", team2: "CSK", result: "tie" },
 *   ])
 *   // CSK: played=2, won=1, tied=1, points=3
 *   // MI: played=1, won=0, lost=1, points=0
 *   // RCB: played=1, tied=1, points=1
 *   // Sorted: CSK(3), RCB(1), MI(0)
 */
export function iplPointsTable(matches) {
  // Your code here

  // Validation
  if (!Array.isArray(matches) || matches.length === 0) {
    return []
  }

  const matchResults = {};

  for (const match of matches) {

    // Check if the match is tie or no_result
    const isTie = match.result === "tie";
    const noResult = match.result === "no_result";


    /**
     * Check if Team1 Exist:
     *    in matchResults object, if yes
     *    then create new key with default
     *    value depending on the current 
     *    status of the match
     * else:
     *    Update the value of the team1 based
     *    on the current match and previous
     *    match status 
     */
    if(!Object.keys(matchResults).includes(match.team1)) {
      const isTeam1Won = match.result === "win" ? match.winner === match.team1 ? true: false: false;

      matchResults[match.team1] = {
        team: match.team1,
        played: 1,
        won: isTeam1Won ? 1: 0,
        lost: !isTeam1Won && !isTie && !noResult ? 1: 0,
        tied: isTie ? 1: 0,
        noResult: noResult ? 1: 0
      }
    } else {
      const isTeam1Won = match.result === "win" ? match.winner === match.team1 ? true: false: false;
      const team1 = matchResults[match.team1];

      matchResults[match.team1] = {
        played: team1.played + 1,
        won: isTeam1Won ? team1.won + 1: team1.won,
        lost: !isTeam1Won && !isTie && !noResult ? team1.lost + 1: team1.lost,
        tied: isTie ? team1.tied + 1: team1.tied,
        noResult: noResult ? team1.noResult + 1: team1.noResult
      }
    }

    /**
     * Check if Team2 Exist:
     *    in matchResults object, if yes
     *    then create new key with default
     *    value depending on the current 
     *    status of the match
     * else:
     *    Update the value of the team2 based
     *    on the current match and previous
     *    match status 
     */
    if(!Object.keys(matchResults).includes(match.team2)) {
      const isTeam2Won = match.result === "win" ? match.winner === match.team2 ? true: false: false;
      
      
      matchResults[match.team2] = {
        team: match.team2,
        played: 1,
        won: isTeam2Won ? 1: 0,
        lost: !isTeam2Won && !isTie && !noResult ? 1: 0,
        tied: isTie ? 1: 0,
        noResult: noResult ? 1: 0
      }
    } else {
      const isTeam2Won = match.result === "win" ? match.winner === match.team2 ? true: false: false;
      const team2 = matchResults[match.team2];

      matchResults[match.team2] = {
        played: team2.played + 1,
        won: isTeam2Won ? team2.won + 1: team2.won,
        lost: !isTeam2Won && !isTie && !noResult ? team2.lost + 1: team2.lost,
        tied: isTie ? team2.tied + 1: team2.tied,
        noResult: noResult ? team2.noResult + 1: team2.noResult
      }
    }
  }


  const finalMatchResults = [];

  // Converting the matchResults object into array.
  Object.keys(matchResults).forEach(team => {
    const teamDetail = matchResults[team];
    finalMatchResults.push({
      ...teamDetail,
      team,
      points: teamDetail.won * 2 + teamDetail.tied + teamDetail.noResult
    })  
  });

  // Sorting based on the points and by team name in case of
  // same point.
  const fullNFinallMatchResult = finalMatchResults.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points
    }
    return a.team.localeCompare(b.team)
  })
  return fullNFinallMatchResult;
}
