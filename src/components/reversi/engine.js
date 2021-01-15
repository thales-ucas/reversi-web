import { EventDispatcher } from 'three';
/**
 *	引擎
 */
const Engine = function(param) {
  const _this = this;
  let _data = null; // 棋盘数据
  let _current = null; // 行动者
  /**
   *	初始化
   */
  _this.init = function(data) {
    if (data) {
      _data = [];
      for(let m = 0; m < Engine.ROW; m++) {
        const arr = [];
        for(let n = 0; n < Engine.COL; n++) {
          arr.push(data[m][n]);
        }
        _data.push(arr);
      }
    } else {
      _this.reset();
    }
  };
  /**
   * 克隆
   * @returns {Engine} 新的引擎
   */
  _this.clone = () => new Engine(_data);
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
    _current = null;
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
    shiftPlayer();
    const data = {
      moves: arr,
      count: getCount()
    };
    const e = { type: Engine.EVENT.START, data };
    _this.dispatchEvent(e);
  };
  /**
   * 获取数据
   */
  _this.getData = () => {
    return _data;
  };
  /**
   * 换下一个颜色下棋
   */
  function shiftPlayer() {
    if(!_current) {
      _current = Engine.CHESS.BLACK;
    } else {
      _current = _current === Engine.CHESS.BLACK ? Engine.CHESS.WHITE : Engine.CHESS.BLACK;
    }
    const e = { type: Engine.EVENT.SHIFT, data: _current };
    _this.dispatchEvent(e);
    const legal = _this.getLegal(_current);
    if(legal.length === 0) return shiftPlayer();
    return _current;
  }
  /**
   * 获得当前棋手
   */
  _this.getPlayer = () => _current;
  /**
   * 获取结果
   */
  _this.getResult = () => {
    const count = getCount();
    const diff = count.black - count.white;
    let winner = Engine.WINNER.DRAW;
    if(diff > 0) {
      winner = Engine.WINNER.BLACK;
    } else if(diff < 0) {
      winner = Engine.WINNER.WHITE;
    }
    return { count, winner, diff };
  };
  /**
   * 游戏检测
   * @returns {boolean} 是否继续进行
   */
  _this.isGameOver = () => {
    const count = getCount();
    if (count.space === 0 || count.black === 0 || count.white === 0) {
      const event = { type: Engine.EVENT.GAME_OVER, data: count};
      _this.dispatchEvent(event);
      return true;
    } else {
      return false;
    }
  };
  /**
   * 走棋
   * @param {int} row 行
   * @param {int} col 列
   */
  _this.move = (row, col) => {
    const color = _current;
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
    _this.dispatchEvent(e); // 走棋
    if(_this.isGameOver()) return;
    shiftPlayer();
  };
  /**
   * 获得可以翻的棋
   * @param {int} row 行
   * @param {int} col 列
   * @param {int} color 颜色
   */
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
    if(isNaN(color)) color = _current;
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
      white: 0,
      space: 0
    };
    for(const row of _data) {
      for(const col of row) {
        if(col === Engine.CHESS.BLACK) {
          counter.black++;
        } else if(col === Engine.CHESS.WHITE) {
          counter.white++;
        } else {
          counter.space++;
        }
      }
    }
    return counter;
  }
  _this.init(param);
};
Engine.ROW = 8;
Engine.COL = 8;
Engine.CHESS = {
  NONE: 0,
  BLACK: 1,
  WHITE: 2
};
Engine.WINNER = {
  DRAW: 0,
  BLACK: 1,
  WHITE: 2
};
Engine.EVENT = {
  START: "gameStart", // 游戏开始
  GAME_OVER: "gameOver", // 游戏结束
  MOVE: "chessMove", // 走棋
  SHIFT: "playerShift", // 旗手交换
  FLIP: "chessFlip" // 棋子翻转
};

Object.assign( Engine.prototype, EventDispatcher.prototype );
Engine.prototype.constructor = Engine;
export default Engine;