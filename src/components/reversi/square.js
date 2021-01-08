import { Mesh, BoxGeometry, MeshBasicMaterial, TextureLoader } from 'three';
import image from './textures/square.jpg';
/**
 *	方块
 */
const Square = function() {
  const _this = this;
  _this.row = NaN;
  _this.col = NaN;
	/**
	 *	初始化
	 */
	_this.init = () => {
    const g = new BoxGeometry(Square.WIDTH, Square.HEIGHT, Square.WIDTH);
    const t = new TextureLoader().load(image);
    const m = new MeshBasicMaterial( { color: 0xffaa00, map: t } );
    Mesh.call(_this, g, m);
  };
  _this.blink = () => {
    _this.position.y += 5;
  };
	_this.init();
};

Square.WIDTH = 10;
Square.HEIGHT = 2;

Square.prototype = Object.create( Mesh.prototype );
Square.prototype.constructor = Square;
export default Square;