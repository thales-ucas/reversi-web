import { WebGLRenderer, EventDispatcher, PerspectiveCamera, Scene, Color, Raycaster, Vector2 } from 'three';
import TWEEN from '@tweenjs/tween.js';
import Board from './board';
import Engine from './engine';
import AIPlayer from './ai-player';
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
  GAME_STEP: "gameStep",
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
    _engine = null, // 游戏引擎
    _situation = {}, // 对阵局势
    _operantPlayer = null, //操作者
    _ai = null, // 电脑玩家
    _enable = false; // 激活状态
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
    _engine.addEventListener( Engine.EVENT.START, onChessStart );
    _engine.addEventListener( Engine.EVENT.MOVE, onChessMove );
    __board = new Board();
    __board.pave(_engine.getData());
    __scene.add( __board );
    __camera.lookAt(__board.position);
    animate(0);
  };
  _this.start = () => {
    _ai = new AIPlayer();
    _ai.addEventListener( AIPlayer.EVENT.MOVE, onAIMove );
    _situation[Engine.CHESS.BLACK] = 'player';
    _situation[Engine.CHESS.WHITE] = 'ai';
    _operantPlayer = Engine.CHESS.BLACK;
    _engine.start();
  };
  /**
   * 点击
   * @param {int} x 
   * @param {int} y 
   */
  _this.click = (x, y) => {
    if (!_enable) return;
    const vec = new Vector2();
    vec.x = ( x / WIDTH ) * 2 - 1;
    vec.y = - ( y / HEIGHT ) * 2 + 1;
    _raycaster.setFromCamera( vec, __camera ); // 根据摄像头引射线
    const ret = __board.hit(_raycaster); // 射线触碰决定用户点击的位置
    if (ret) { // 玩家走棋
      const { row, col } = ret.object;
      _engine.move(row, col, _operantPlayer);
    }
  };
  /**
   * 交换操作者
   */
  function switchOperantPlayer() {
    _operantPlayer = _operantPlayer === Engine.CHESS.BLACK ? Engine.CHESS.WHITE : Engine.CHESS.BLACK;
    const arr = _engine.getLegal(_operantPlayer);
    if(arr) {
      if (_situation[_operantPlayer] === "player") {
        _enable = true;
      } else if (_situation[_operantPlayer] === "ai") {
        _ai.think(arr);
      }
    } else {
      switchOperantPlayer();
    }
  }
  /**
   * 游戏开始
   * @param {event} e 
   */
  async function onChessStart(e) {
    const arr = e.data;
    for(const obj of arr) {
      const { row, col, color } = obj;
      await __board.move(row, col, color);
    }
    _enable = true;
  }
  /**
   * 走棋
   * @param {event} e 
   */
  function onChessMove(e) {
    _enable = false;
    const { row, col, color, flips, count } = e.data;
    __board.move( row, col, color ).then(() => {
      __board.flip(flips).then(() => {
        const event = { type: EVENT.GAME_STEP, data: count};
        _this.dispatchEvent(event);
        switchOperantPlayer();
      });
    });
  }
  /**
   * 电脑走棋
   * @param {event} e 
   */
  function onAIMove(e) {
    const { row, col, color } = e.data;
    _engine.move(row, col, color);
  }
  function animate(time) {
    requestAnimationFrame( animate );
    TWEEN.update(time);
    __renderer.render( __scene, __camera );
  }
  _this.init(container);
};

Object.assign( main.prototype, EventDispatcher.prototype);
main.prototype.constructor = main;
export {main, VER, EVENT};