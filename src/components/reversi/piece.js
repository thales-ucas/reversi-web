import { Mesh, CylinderGeometry, MeshBasicMaterial } from 'three';
import { Tween, Easing } from '@tweenjs/tween.js';
import Engine from './engine';
/**
 *	棋子
 */
const Piece = function(param) {
  const _this = this;
  let _color = null; // 棋子颜色
  /**
   *	初始化
    */
  _this.init = (color) => {
    const geometry = new CylinderGeometry(Piece.RADIUS, Piece.RADIUS, Piece.WIDTH, Piece.SEGMENT);
    const materials = [
      new MeshBasicMaterial( { color: "red" } ), // 圆柱侧边
      new MeshBasicMaterial( { color: "black" } ), // 圆柱顶
      new MeshBasicMaterial( { color: "white" } ) // 圆柱底
    ];
    Mesh.call(_this, geometry, materials);
    _color = parseInt(color);
    if(_color == Engine.CHESS.WHITE) { // 根据颜色决定初始旋转度
      _this.rotation.x = Math.PI; // 按照x轴旋转180度就是白子
    }
  };
  /**
   * 走棋
   */
  _this.move = () => {
    return new Promise((resolve) => {
      let coord = { y: 10 }; // 落子为y=10位置，到y=0位置的动画
      const t = new Tween(coord).to({y:0}, 500).easing(Easing.Quadratic.In);
      t.onUpdate((e) => {_this.position.y = e.y;});
      t.onComplete(e => {resolve(e);});
      t.start();
    });
  };
  /**
   * 翻转
   * @param {int} delay 延迟
   */
  _this.flip = (delay = 0) => {
    return new Promise((resolve) => {
      let rotation = { x: 0 };
      _color = _color == Engine.CHESS.WHITE ? Engine.CHESS.BLACK : Engine.CHESS.WHITE;
      const initX = _this.rotation.x;
      let coord = { y: 0 };
      const up = new Tween(coord).to({y: 10}, 300).onUpdate((e) => {_this.position.y = e.y;}); // 升起动画
      const down = new Tween(coord).to({y: 0}, 200).onUpdate((e) => {_this.position.y = e.y;}); // 下降动画
      const spin = new Tween(rotation).to({x: Math.PI}, 300).onUpdate((e) => {_this.rotation.x = initX + e.x;}); // 旋转动画
      spin.onComplete(e => {resolve(e);});
      spin.chain(down); // 旋转跟下降链接
      up.chain(spin); // 上升跟旋转链接
      up.delay(delay);
      up.start(); // 最终动画为：升起->旋转->落下
    });
  };
	_this.init(param);
};

Piece.RADIUS = 4; // 棋子半径
Piece.HEIGHT = 1; // 棋子厚度
Piece.SEGMENT = 20; // 棋子横断面，越大越圆

Piece.prototype = Object.create( Mesh.prototype );
Piece.prototype.constructor = Piece;
export default Piece;