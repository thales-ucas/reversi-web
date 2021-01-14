import { Mesh, CylinderGeometry, MeshBasicMaterial } from 'three';
import { Tween, Easing } from '@tweenjs/tween.js';
import Engine from './engine';
/**
 *	棋子
 */
const Piece = function(param) {
  const _this = this;
  let _color = null;
	/**
	 *	初始化
	 */
	_this.init = (color) => {
    const geometry = new CylinderGeometry(Piece.RADIUS, Piece.RADIUS, Piece.WIDTH, Piece.SEGMENT);
    const materials = [
      new MeshBasicMaterial( { color: "red" } ),
      new MeshBasicMaterial( { color: "black" } ),
      new MeshBasicMaterial( { color: "white" } )
    ];
    Mesh.call(_this, geometry, materials);
    _color = parseInt(color);
    if(_color == Engine.CHESS.WHITE) {
      _this.rotation.x = Math.PI;
    }
  };
  /**
   * 走棋
   */
  _this.move = () => {
    return new Promise((resolve) => {
      let coord = { y: 10 };
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
      const up = new Tween(coord).to({y: 10}, 300).onUpdate((e) => {_this.position.y = e.y;});
      const down = new Tween(coord).to({y: 0}, 200).onUpdate((e) => {_this.position.y = e.y;});
      const spin = new Tween(rotation).to({x: Math.PI}, 300).onUpdate((e) => {_this.rotation.x = initX + e.x;});
      spin.onComplete(e => {resolve(e);});
      spin.chain(down);
      up.chain(spin);
      up.delay(delay);
      up.start();
    });
  };
	_this.init(param);
};

Piece.RADIUS = 4;
Piece.HEIGHT = 1;
Piece.SEGMENT = 20;

Piece.prototype = Object.create( Mesh.prototype );
Piece.prototype.constructor = Piece;
export default Piece;