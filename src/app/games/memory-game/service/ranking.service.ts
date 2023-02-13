// Contains logic for ranking
// including adding players
// to leaderboard

import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class RankingService {
//  // Get the leaderboard in the correct order
//   getList() {
//     const stringRanking =
//       localStorage.getItem("group-project/ranking") || JSON.stringify([]);
//     const list = JSON.parse(stringRanking);

//     list.sort((a, b) => a.rounds - b.rounds);

//     return list;
//   }
//   // Add new player to the leaderboard
//   addPlayer(player) {
//     const list = this.getList();
//     list.push(player);
//     localStorage.setItem("group-project/ranking", JSON.stringify(list));
//   }
}
