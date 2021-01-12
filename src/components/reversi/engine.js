import { EventDispatcher } from 'three';
/**
 *	引擎
 */
const Engine = function(){
  const _this = this;
  let _data = null; // 棋盘数据
  let _action = null; // 行动方
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
    const arr = [];
    arr.push({row: 3, col: 4, color: Engine.CHESS.BLACK});
    arr.push({row: 3, col: 3, color: Engine.CHESS.WHITE});
    arr.push({row: 4, col: 3, color: Engine.CHESS.BLACK});
    arr.push({row: 4, col: 4, color: Engine.CHESS.WHITE});
    for(const obj of arr) {
      const { row, col, color } = obj;
      _data[row][col] = color;
    }
    _action = Engine.CHESS.BLACK;
    const e = { type: Engine.EVENT.START, data: arr };
    _this.dispatchEvent(e);
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
   */
  _this.move = (row, col, color) => {
    let flips  = getFilp(row, col, color);
    if(flips) {
      for(const obj of flips) {
        _data[obj.row][obj.col] = color;
      }
    } else {
      return;
    }
    _data[row][col] = color;
    const count = getCount();
    const data = { row, col, color, flips, count };
    const e = { type: Engine.EVENT.MOVE, data };
    _this.dispatchEvent(e);
  };
  function getFilp(row, col, color) {
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
    for(const coord of direction) {
      const [ xdirection, ydirection ] = coord;
      let x = parseInt(col);
      let y = parseInt(row);
      x += xdirection;
      y += ydirection;
      if(isValid(y, x) && _data[y][x] === opColor) {
        do {
          x += xdirection;
          y += ydirection;  
          if(!isValid(y, x)) break;
        } while(_data[y][x] === opColor);
      }
      if(!isValid(y, x)) continue;
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
  }
  /**
   * 获取合法点
   * @param {emun} color 棋色
   */
  _this.getLegal = (color) => {
    const direction = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
    const opColor = color === Engine.CHESS.BLACK ? Engine.CHESS.WHITE : Engine.CHESS.BLACK;
    const nears = [];
    for(const m in _data) {
      for(const n in _data[m]) {
        if(_data[m][n] === opColor) {
          for(const coord of direction) {
            const [ dx, dy ] = coord;
            let x = parseInt(n) + dx;
            let y = parseInt(m) + dy;
            if(isValid(y, x) && _data[y][x]=== Engine.CHESS.NONE
            && nears.findIndex(k => k[0] === x && k[1] === y) === -1) {
              nears.push([x, y]);
            }
          }
        }
      }
    }
    const arr = [];
    for(const coord of nears) {
      if(getFilp(coord[1], coord[0], color)) {
        arr.push(coord);
      }
    }
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
  /**
   * 获取统计
   */
  function getCount() {
    const counter = {
      black: 0,
      white: 0
    };
    for(const row of _data) {
      for(const col of row) {
        if(col === Engine.CHESS.BLACK) {
          counter.black++;
        } else if(col === Engine.CHESS.WHITE) {
          counter.white++;
        }
      }
    }
    return counter;
  }
  _this.init();
};
Engine.ROW = 8;
Engine.COL = 8;
Engine.CHESS = {
  NONE: 0,
  BLACK: 1,
  WHITE: 2
};
Engine.EVENT = {
  START: "gameStart",
  GAME_OVER: "gameOver",
  MOVE: "chessMove",
  FLIP: "chessFlip"
};

Object.assign( Engine.prototype, EventDispatcher.prototype );
Engine.prototype.constructor = Engine;
export default Engine;