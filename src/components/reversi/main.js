import { WebGLRenderer, EventDispatcher, PerspectiveCamera, Scene, Color, Raycaster, Vector2 } from 'three';
import Board from './board';
import Engine from './engine';
/**
 *	版本
 */
const VER = "1.0";
/**
 *	事件
 */
const EVENT = {
  RUNNING:	"running",
  MODEL_LOADED:	"modeLoaded",
  PERSON_FAIL: "personFail",
  GAME_INIT: "gameInit",
  GAME_START:	"gameStart",
  GAME_OVER:	"gameOver"
};
const main = function(container){
  const _this = this;
  
  let WIDTH = 0,
    HEIGHT = 0;
    
  let __camera = null,	//摄像头
    __scene = null,	//场景
    __renderer = null,	//渲染器
    __board = null;	//棋盘
  let _raycaster = null, // 射线
    _engine = null; // 游戏引擎
  var __stats = null;	//fps
  /**
   *	初始化
   */
  _this.init = function(canvas) {
    // console.log(container.attributes);
    WIDTH = 500;
    HEIGHT = 500;
    __scene = new Scene();
    __scene.background = new Color( 'skyblue' );
    __camera = new PerspectiveCamera( 75, WIDTH / HEIGHT, 1, 1000 );
    __camera.position.set(0, 60, 20);
    __renderer = new WebGLRenderer({canvas});
    __renderer.setSize( WIDTH, HEIGHT );
    _raycaster = new Raycaster();
    _engine = new Engine();
    _engine.addEventListener( Engine.EVENT.MOVE, onChessMove );
    __board = new Board();
    __board.pave(_engine.getData());
    __scene.add( __board );
    __camera.lookAt(__board.position);
    animate();
  };
  _this.start = () => {
    _engine.start();
  };
  /**
   * 点击
   * @param {int} x 
   * @param {int} y 
   */
  _this.click = (x, y) => {
    const vec = new Vector2();
    vec.x = ( x / WIDTH ) * 2 - 1;
    vec.y = - ( y / HEIGHT ) * 2 + 1;
    _raycaster.setFromCamera( vec, __camera ); // 根据摄像头引射线
    const ret = __board.hit(_raycaster); // 射线触碰决定用户点击的位置
    if (ret) {
      const { row, col } = ret.object;
      _engine.move(row, col, Engine.CHESS.BLACK);
    }
  };
  /**
   * 走棋
   * @param {event} e 
   */
  function onChessMove(e) {
    const { row, col, color, flips } = e.data;
    __board.move( row, col, color );
    __board.flip(flips);
  }
  function animate() {
    requestAnimationFrame( animate );
    __renderer.render( __scene, __camera );
  }
  _this.init(container);
};

Object.assign( main.prototype, EventDispatcher.prototype);
main.prototype.constructor = main;
export {main, VER, EVENT};