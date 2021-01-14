import { EventDispatcher } from 'three';
import Engine from './engine';
import Roxanne from './roxanne';

/**
 *	电脑玩家
 */
const AIPlayer = function(level) {
  const _this = this;
  let _roxnane = null;
  let _level = 0; // 游戏等级
	/**
	 *	初始化
	 */
	_this.init = (lv) => {
    _roxnane = new Roxanne();
    _level = parseInt(lv);
  };
  /**
   * 获取棋色
   */
  _this.getColor = () => {
    return Engine.CHESS.WHITE;
  };
  /**
   * 思考
   * @param {Array} arr 可走的步骤
   */
  _this.think = (arr) => {
    let col, row;
    if(_level === 1 || _level === 2) {
      [ col, row ] = _roxnane.select(arr);
    } else {
      [ col, row ] = arr[parseInt(Math.random() * arr.length)];
    }
    const data = { col, row, color: _this.getColor() };
    setTimeout(() => {
      const e = { type: AIPlayer.EVENT.MOVE, data };
      _this.dispatchEvent(e);        
    }, 1000);
  };
	_this.init(level);
};

AIPlayer.EVENT = {
  MOVE: "aiPlayerMove"
};


AIPlayer.prototype = Object.create( EventDispatcher.prototype );
AIPlayer.prototype.constructor = AIPlayer;
export default AIPlayer;