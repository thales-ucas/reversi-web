import { EventDispatcher } from 'three';
/**
 *	引擎
 */
const Engine = function(){
  const _this = this;
  let _data = null; // 棋盘数据
  /**
   *	初始化
   */
  _this.init = function() {
    _this.reset();
  };
  /**
   * 复位
   */
  _this.reset = () => {
    _data = [];
    for(let m = 0; m < Engine.ROW; m++) {
      const arr = [];
      for(let n = 0; n < Engine.COL; n++) {
        arr.push(0);
      }
      _data.push(arr);
    }
  };
  /**
   * 开始游戏
   */
  _this.start = () => {
    _this.move(3, 4, Engine.CHESS.BLACK, true);
    _this.move(3, 3, Engine.CHESS.WHITE, true);
    _this.move(4, 3, Engine.CHESS.BLACK, true);
    _this.move(4, 4, Engine.CHESS.WHITE, true);
  };
  /**
   * 获取数据
   */
  _this.getData = () => {
    return _data;
  };
  /**
   * 走棋
   * @param {int} row 行
   * @param {int} col 列
   * @param {int} color 棋子颜色
   * @param {Boolean} force 强行
   */
  _this.move = (row, col, color, force) => {
    let flips = false;
    if ( !force ) {
      flips = _this.getFilp(row, col, color);
      if(flips) {
        for(const obj of flips) {
          _data[obj.row][obj.col] = color;
        }
      } else {
        return;
      }
    }
    _data[row][col] = color;
    const data = { row, col, color, flips };
    const e = { type: Engine.EVENT.MOVE, data };
    _this.dispatchEvent(e);
  };
  _this.getFilp = (row, col, color) => {
    if (_data[row][col] !== 0) {
      return false;
    }
    if (!isValid(col, row)) {
      return false;
    }
    _data[row][col] = color;
    const arr = [];
    const opColor = color === Engine.CHESS.BLACK ? Engine.CHESS.WHITE : Engine.CHESS.BLACK;
    const direction = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]];
    for( const item of direction) {
      const [ xdirection, ydirection ] = item;
      let x = parseInt(col);
      let y = parseInt(row);
      x += xdirection;
      y += ydirection;
      if(isValid(y, x) && _data[y][x] === opColor) {
        do {
          x += xdirection;
          y += ydirection;  
          if(isValid(y, x)) break;
        } while(_data[y][x] === opColor);
      }
      if(_data[y][x] === color) {
        while (isValid(y, x)) {          
          x -= xdirection;
          y -= ydirection;
          if (y == parseInt(row) && x == parseInt(col)) break;
          arr.push({col:x, row:y});
        }
        // for(x -= xdirection, y -= ydirection;x !== parseInt(col) && y !== parseInt(row);x -= xdirection,y -= ydirection) {
        //   arr.push({col:x, row:y});
        // }
      }
    }
    _data[row][col] = 0;
    if(arr.length === 0) return false;
    return arr;
  };
  /**
   * 在棋盘上
   * @param {int} row 行
   * @param {int} col 列
   */
  function isValid( row, col ) {
    return (row >= 0 && row <= Engine.ROW - 1 && col >= 0 && col <= Engine.COL - 1);
  }
  _this.init();
};
Engine.ROW = 8;
Engine.COL = 8;
Engine.CHESS = {
  BLACK: 1,
  WHITE: 2
};
Engine.EVENT = {
  MOVE: "chessMove",
  FLIP: "chessFlip"
};

Object.assign( Engine.prototype, EventDispatcher.prototype);
Engine.prototype.constructor = Engine;
export default Engine;