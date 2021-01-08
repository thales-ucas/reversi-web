import { Mesh, CylinderGeometry, MeshBasicMaterial } from 'three';
import Engine from './engine';
/**
 *	棋子
 */
const Piece = function(param) {
  const _this = this;
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
    if(color == Engine.CHESS.WHITE) {
      _this.rotation.x = Math.PI;
    }
  };
  /**
   * 翻转
   */
  _this.flip = () => {
    _this.rotateX(Math.PI);
  };
	_this.init(param);
};

Piece.RADIUS = 4;
Piece.HEIGHT = 1;
Piece.SEGMENT = 20;

Piece.prototype = Object.create( Mesh.prototype );
Piece.prototype.constructor = Piece;
export default Piece;