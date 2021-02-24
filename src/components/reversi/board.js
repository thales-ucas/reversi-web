import { Object3D } from 'three';
import Square from './square';
import Piece from './piece';
import { Tween, Easing } from '@tweenjs/tween.js';

/**
 *	棋盘
 */
const Board = function() {
  const _this = this;
  let __bg = null, // 背景层
    __chess = null; // 棋子层
  _this.offset = { // 偏移位置
    row: 0,
    col: 0,
  };
  /**
   *	初始化
    */
  _this.init = () => {
    Object3D.call(_this);
    __bg = new Object3D();
    __chess = new Object3D();
    _this.add(__bg, __chess);
  };
  /**
   * 重置
   */
  _this.reset = () => {
    __chess.clear();
  };
  /**
   * 触碰
   * @param {raycaster} raycaster 射线
   */
  _this.hit = raycaster => {
    const intersects = raycaster.intersectObjects( __bg.children );
    let ret = null;
    if(intersects.length > 0) {
      ret = intersects[0];
    }
    return ret;
  };
  /**
   * 铺棋盘
   * @param {Array} 棋盘二维数组
   */
  _this.pave = (data) => {
    __bg.clear();
    _this.offset.row = data.length / 2 * Square.WIDTH - Square.WIDTH / 2;
    _this.offset.col = _this.offset.row;
    for ( const m in data ) {
      for ( const n in data[m] ) {
        const square = new Square();
        square.row = m;
        square.col = n;
        square.position.x = n * Square.WIDTH;
        square.position.z = m * Square.WIDTH;
        __bg.add(square);
      }
    }
    __bg.position.set(-_this.offset.col, 0, -_this.offset.row);
    __chess.position.set(-_this.offset.col, Square.HEIGHT, -_this.offset.row);
  };
  _this.pave2 = (data) => {
    __bg.clear();
    _this.offset.row = data.length / 2 * Square.WIDTH - Square.WIDTH / 2;
    _this.offset.col = _this.offset.row;
    let d = 1;
    for ( const m in data ) {
      for ( const n in data[m] ) {
        const square = new Square();
        square.row = m;
        square.col = n;
        square.position.x = n * Square.WIDTH;
        square.position.z = m * Square.WIDTH;
        square.visible = false;
        let coord = { y: 100 };
        const t = new Tween(coord).to({y:0}, 500).easing(Easing.Quadratic.In);
        t.onUpdate((e) => {square.position.y = e.y;});
        t.onStart(e => {square.visible = true;});
        t.delay(d * 100);
        t.start();
        __bg.add(square);
        d++;
      }
    }
    __bg.position.set(-_this.offset.col, 0, -_this.offset.row);
  };
  /**
   * 走棋
   * @param {int} row 行
   * @param {int} col 列
   * @param {int} color 颜色
   */
  _this.move = (row, col, color) => {
    const piece = new Piece(color);
    piece.position.x = col * Square.WIDTH;
    piece.position.z = row * Square.WIDTH;
    piece.name = `${row}-${col}`;
    __chess.add(piece);
    return piece.move();
  };
  /**
   * 翻转
   * @param {array} arr 
   */
  _this.flip = (arr) => {
    const list = [];
    if (arr) {
      for(const k in arr) {
        const { row, col } = arr[k];
        const piece = __chess.getObjectByName(`${row}-${col}`);
        list.push(piece.flip(parseInt(k) * 500));
      }
    }
    return Promise.all(list);
  };
	_this.init();
};

Board.prototype = Object.create( Object3D.prototype );
Board.prototype.constructor = Board;
export default Board;