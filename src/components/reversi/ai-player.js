import { EventDispatcher } from 'three';
import Engine from './engine';

/**
 *	电脑玩家
 */
const AIPlayer = function() {
  const _this = this;
	/**
	 *	初始化
	 */
	_this.init = () => {
    
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
    const k = parseInt(Math.random() * arr.length);
    //return arr[k];
    const [ col, row ] = arr[k];
    const data = { col, row, color: _this.getColor() };
    setTimeout(() => {
      const e = { type: AIPlayer.EVENT.MOVE, data };
      _this.dispatchEvent(e);        
    }, 1000);
  };
	_this.init();
};

AIPlayer.EVENT = {
  MOVE: "aiPlayerMove"
};


AIPlayer.prototype = Object.create( EventDispatcher.prototype );
AIPlayer.prototype.constructor = AIPlayer;
export default AIPlayer;