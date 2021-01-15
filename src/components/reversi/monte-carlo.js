import Engine from "./engine";
import Roxanne from "./roxanne";

/**
 * 模拟器
 */
class Simulator {
  /**
   * 构造
   * @param {Player} black 黑棋模拟选手
   * @param {Player} white 白棋模拟选手
   * @param {Engine} engine 引擎
   * @param {int} current 现在棋手
   */
  constructor(black, white, engine, current) {
    this.black = black;
    this.white = white;
    this.current = current;
    this.engine = engine;
  }
  run() {
    let winner = null;
    let diff = -1;
    const legal = this.engine.getLegal(this.current.color);
  }
  /**
   * 交换玩家
   */
  shift() {
    if(!this.current) {
      this.current = this.black;
    } else {
      this.current = this.current === this.black ? this.white : this.black;
    }
    return this.current;
  }
}
/**
 * 模拟玩家
 * @param {int} color 颜色
 */
class SimulatePlayer {
  constructor(color) {
    this.color = color;
  }
}
/**
 * 梦特卡洛树
 */
class TreeNode {
  constructor(parent, color) {
    this.parent = parent;
    this.w = 0;
    this.n = 0;
    this.row = NaN;
    this.col = NaN;
    this.color = color;
    this.children = [];
  }
  /**
   * 设置走棋步骤
   * @param {array} move [col, row]
   */
  setMove(move) {
    this.row = move[1];
    this.col = move[0];
  }
  /**
   * 添加节点，去重
   * @param {TreeNode} node 蒙特卡洛树节点
   */
  add(node) {
    if(this.children.findIndex(p => p.row === node.row && p.col === node.col) === -1) {
      this.children.push(node);
    }
  }
}
/**
 * 梦特卡洛算法
 * @param {int} color 颜色
 * @param {int} expire 限时
 */
class MonteCarlo {
  constructor(color, expire = 2000) {
    this.color = color;
    this.expire = expire;
    this.tick = 0;
    this.black = new SimulatePlayer(Engine.CHESS.BLACK);
    this.white = new SimulatePlayer(Engine.CHESS.WHITE);
  }
  /**
   * 运行
   * @param {Engine} engine 引擎
   */
  mcts(engine) {
    const root = new TreeNode(null, this.color);
    while(new Date().getTime() - this.tick < this.expire - 1) {
      const simulateEngine = engine.clone();
      const choice = this.select(root, simulateEngine);
      this.expand(choice, simulateEngine);
      const res = this.simulate(choice, simulateEngine);
      let backScore = [1, 0, 0.5][res.winner];
      if (choice.color === Engine.CHESS.BLACK) {
        backScore = 1 - backScore;
      }
      this.backProp(choice, backScore);
    }
    let bestN = -1;
    let bestMove = null;
    for(const k in root.children) {
      if(root.children[k].n > bestN) {
        bestN = root.children[k].n;
        bestMove = k;
      }
    }
    return bestMove;
  }
  /**
   * 蒙特卡洛树搜索，节点选择
   * @param {TreeNode} node 节点
   * @param {Engine} engine 引擎
   * @returns 搜索树向下递归选择子节点
   */
  select(node, engine) {
    if (node.children.length === 0) {
      return node;
    } else {
      let bestScore = -1;
      let bestMove = null;
      for (const k in node.children) {
        if (node.children[k].n === 0) {
          bestMove = k;
          break;
        } else {
          let N = node.n;
          let n = node.children[k].n;
          let w = node.children[k].w;
          const score = w / n + Math.sqrt(2 * Math.log(N) / n);
          if (score > bestScore) {
            bestScore = score;
            bestMove = k;
          }
        }
      }
      return this.select(node.children[bestMove], engine);
    }
  }
  /**
   * 蒙特卡洛树搜索，节点扩展
   * @param {TreeNode} node 节点
   * @param {Engine} engine 引擎
   * @returns 搜索树向下递归选择子节点
   */
  expand(node, engine) {
    for (const move of engine.getLegal(node.color)) {
      const child = new TreeNode(node, node.color);
      child.setMove(move);
      node.add(child);
    }
  }
  /**
   * 蒙特卡洛树搜索，采用Roxanne策略代替随机策略搜索，模拟扩展搜索树
   * @param {TreeNode} node 节点
   * @param {Engine} engine 引擎
   */
  simulate(node, engine) {
    const current = node.color === Engine.CHESS.WHITE ? Engine.CHESS.BLACK : Engine.CHESS.WHITE;
    const simulator = new Simulator(this.black, this.white, engine, current);
    return simulator.run();
  }
  /**
   * 蒙特卡洛树搜索，反向传播，回溯更新模拟路径中的节点奖励
   * @param {TreeNode} node 节点
   * @param {int} score 计分
   */
  backProp(node, score) {
    node.n += 1;
    node.w += score;
    if (node.parent) {
      this.back_prop(node.parent, 1 - score);
    } 
  }
  /**
   * 蒙特卡洛树搜索
   * @param {Engine} engine 引擎
   * @returns 采取最佳拓展落子策略
   */
  getMove(engine) {
    this.tick = new Date().getTime();
    const action = this.mcts(engine.clone());
    return action;
  }
}
export default MonteCarlo;