import { Mesh, BoxGeometry, MeshBasicMaterial, TextureLoader } from 'three';
import image from './textures/square.jpg';
/**
 *	方块
 */
const Square = function() {
  const _this = this;
  _this.row = NaN; // 方块行，也就是y坐标
  _this.col = NaN; // 方块列，也就是x坐标
	/**
	 *	初始化
	 */
	_this.init = () => {
    const g = new BoxGeometry(Square.WIDTH, Square.HEIGHT, Square.WIDTH); // 创建立方体
    const t = new TextureLoader().load(image); // 读取纹理图片
    const m = new MeshBasicMaterial( { color: 0xffaa00, map: t } ); // 设置材质颜色为橙色，并添加纹理
    Mesh.call(_this, g, m); // 超类
  };
  _this.blink = () => {
    _this.position.y += 5;
  };
	_this.init();
};

Square.WIDTH = 10; // 棋盘方块边长
Square.HEIGHT = 2; // 棋盘方块高

Square.prototype = Object.create( Mesh.prototype );
Square.prototype.constructor = Square;
export default Square;