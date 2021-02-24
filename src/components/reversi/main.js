import { WebGLRenderer, EventDispatcher, PerspectiveCamera, Scene, Color, Raycaster, Vector2, Vector3, Clock } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import TWEEN, { Tween } from '@tweenjs/tween.js';
import Board from './board';
import Engine from './engine';
import AIPlayer from './ai-player';
import Square from './square';
import Piece from './piece';
/**
 *	版本
 */
const VER = "1.0";
/**
 *	事件
 */
const EVENT = {
  RUNNING:	"running",
  GAME_INIT: "gameInit",
  GAME_START:	"gameStart",
  GAME_STEP: "gameStep",
  GAME_OVER:	"gameOver"
};
/**
 * 主函数
 * @param {canvas} container canvas元素
 */
const main = function(container){
  const _this = this;
  
  let X = 0,
    Y = 0,
    WIDTH = 0,
    HEIGHT = 0;
  let _canvas = null;
  
  const CAMERA_FAR = 60; // 摄像头距离
  let __camera = null,	//摄像头
    __scene = null,	//场景
    __renderer = null,	//渲染器
    __board = null;	//棋盘
  let _raycaster = null, // 射线
    _engine = null, // 游戏引擎
    _situation = {}, // 对阵局势
    _ai = null, // 电脑玩家
    _clock = new Clock, // 时钟
    _running = false, // 游戏运行中
    _enable = false; // 激活状态
  /**
   *	初始化
   */
  _this.init = function(canvas) {
    _canvas = canvas;
    onResize();
    __scene = new Scene();
    __scene.background = new Color( 'skyblue' );
    __camera = new PerspectiveCamera( 75, WIDTH / HEIGHT, 1, 1000 );
    __camera.position.set(0, 0, CAMERA_FAR);
    __renderer = new WebGLRenderer({canvas, antialias: true});
    _raycaster = new Raycaster();
    _engine = new Engine();
    _engine.addEventListener( Engine.EVENT.START, onChessStart );
    _engine.addEventListener( Engine.EVENT.GAME_OVER, onGameOver );
    _engine.addEventListener( Engine.EVENT.MOVE, onChessMove );
    __board = new Board();
    __board.pave(_engine.getData());
    __scene.add( __board );
    __camera.lookAt(__board.position);
    window.addEventListener("resize", onResize);
    animate(0);
  };
  /**
   * 尺寸重置
   */
  function onResize() {
    X = _canvas.offsetLeft;
    Y = _canvas.offsetTop;
    WIDTH = _canvas.clientWidth;
    HEIGHT = _canvas.clientHeight;
  }
  /**
   * 重置
   */
  _this.reset = () => {
    _engine.reset();
    __board.reset();
    _enable = false;
    _running = false;
    TWEEN.removeAll();
  };
  /**
   * 游戏开始
   * @param {int} level 电脑等级
   */
  _this.start = (level) => {
    onResize(); // 必须重新定位，否则高度不正确
    let v = new Vector3();
    v.copy(__camera.position);
    const motion = new Vector3();
    const t = new Tween(v).to({x: 0, y: CAMERA_FAR, z: 0}); // 摄像机动画
    t.onUpdate(e => {
      motion.copy(e);
      motion.setLength(CAMERA_FAR);
      __camera.position.copy(motion);
      __camera.lookAt(__board.position);
    });
    t.onComplete(() => {
      if(parseInt(level ) === 10) {
        _situation[Engine.CHESS.WHITE] = 'player';
      }else{
        _ai = new AIPlayer(level);
        _ai.addEventListener( AIPlayer.EVENT.MOVE, onAIMove );  
        _situation[Engine.CHESS.WHITE] = 'ai';
      }
      _situation[Engine.CHESS.BLACK] = 'player';
      _engine.start();
    });
    t.start();
  };
  _this.test = () => {
    __scene.clear();
    const t = new Piece()
    __scene.add( t );
    const controls = new OrbitControls(__camera, __renderer.domElement);
    controls.update();
  }
  /**
   * 点击
   * @param {event} e
   */
  _this.click = (e) => {
    if (!_enable) return; // 允许玩家走时候才能操作
    const vec = new Vector2();
    const x = e.x - X;
    const y = e.y - Y;
    vec.x = ( x / WIDTH ) * 2 - 1;
    vec.y = - ( y / HEIGHT ) * 2 + 1;
    _raycaster.setFromCamera( vec, __camera ); // 根据摄像头引射线
    const ret = __board.hit(_raycaster); // 射线触碰决定用户点击的位置
    if (ret) { // 玩家走棋
      const { row, col } = ret.object;
      _engine.move(row, col);
    }
  };
  /**
   * 交换操作者
   */
  function shiftPlayer() {
    const current = _engine.getPlayer();
    if (_situation[current] === "player") {
      _enable = true;
    } else if (_situation[current] === "ai") {
      _ai.think(_engine);
    }
  }
  /**
   * 游戏开始
   * @param {event} e 
   */
  async function onChessStart(e) {
    const { count, moves } = e.data;
    const start = new Date().getTime();
    for(const obj of moves) {
      const { row, col, color } = obj;
      await __board.move(row, col, color);
    }
    _enable = true;
    _running = true;
    _clock.start();
    count.player = _engine.getPlayer();
    const event = { type: EVENT.GAME_STEP, data: count};
    _this.dispatchEvent(event);
  }
  /**
   * 游戏结束
   * @param {event} e 
   */
  function onGameOver(e) {
    _running = false;
    _clock.stop();
  }
  /**
   * 游戏检测
   * @param {object} count 统计信息
   * @returns {boolean} 是否继续进行
   */
  function gameOver(count) {
    const event = { type: EVENT.GAME_OVER, data: count};
    _this.dispatchEvent(event);
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
        count.player = _engine.getPlayer();
        const event = { type: EVENT.GAME_STEP, data: count};
        _this.dispatchEvent(event);
        if(_running) {
          shiftPlayer(); // 交换棋手
        } else {
          gameOver(count);
        }
      });
    });
  }
  /**
   * 电脑走棋
   * @param {event} e 
   */
  function onAIMove(e) {
    const { row, col } = e.data;
    _engine.move(row, col);
  }
  function animate(time) {
    requestAnimationFrame( animate );
    if(_running) {
      const event = { type: EVENT.RUNNING, data: _clock.getElapsedTime()};
      _this.dispatchEvent(event);
    }
    TWEEN.update(time);
    __renderer.render( __scene, __camera );
  }
  _this.init(container);
};

Object.assign( main.prototype, EventDispatcher.prototype);
main.prototype.constructor = main;
export {main, VER, EVENT};