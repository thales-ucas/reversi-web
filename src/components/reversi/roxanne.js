/**
 * Roxanne 策略 详见 《Analysis of Monte Carlo Techniques in Othello》 
 * 提出者：Canosa, R. Roxanne canosa homepage. https://www.cs.rit.edu/~rlc/ 
 */
class Roxanne {
  constructor() {
    this._table = [
      [ [0, 0], [0, 7], [7, 0], [7, 7] ],
      [ [2, 2], [2, 5], [5, 2], [5, 5] ],
      [ [3, 2], [3, 5], [4, 2], [4, 5], [2, 3], [2, 4], [5, 3], [5, 4] ],
      [ [2, 0], [2, 7], [5, 0], [5, 7], [0, 2], [0, 5], [7, 2], [7, 5] ],
      [ [3, 0], [3, 7], [4, 0], [4, 7], [0, 3], [0, 4], [7, 3], [7, 4] ],
      [ [2, 1], [2, 6], [5, 1], [5, 6], [1, 2], [1, 5], [6, 2], [6, 5] ],
      [ [3, 1], [3, 6], [4, 1], [4, 6], [1, 3], [1, 4], [6, 3], [6, 4] ],
      [ [1, 1], [1, 6], [6, 1], [6, 6] ],
      [ [1, 0], [1, 7], [6, 0], [6, 7], [0, 1], [0, 6], [7, 1], [7, 6]]
    ];
  }
  select(arr) {
    if (arr && arr.length > 0) {
      for(const moves of this._table) {
        moves.sort(() => 0.5 - Math.random());
        for(const move of moves) {
          if(arr.findIndex(n => n[0] === move[0] && n[1] === move[1]) > -1) {
            return move;
          }
        }
      }
    } else {
      return false;
    }
  }
}
export default Roxanne;