<template>
  <div class="game">
    <div>
      <p>苹果棋</p>
      <p>Reversi</p>
    </div>
    <div><canvas ref="game" width="500" height="500" class="container" @click="onGameClick"></canvas></div>
    <div>
      <ul>
        <li><span>黑棋:</span><span>{{black}}</span></li>
        <li><span>白棋:</span><span>{{white}}</span></li>
      </ul>
    </div>
    <div>
      总用时：{{timeGlobal}}
    </div>
    <div>
      <span v-if="player===1">黑棋思考中……</span>
      <span v-else-if="player===2">白棋思考中……</span>
      <span>{{timeLocal}}秒</span>
    </div>
    <div v-if="msg">
      <p>{{msg}}</p>
      <p><button @click="onGameRestart">再玩一次</button></p>
    </div>
    <div v-show="isStartPanelShow" class="start-panel">
      <div class="start-wrap">
        <p>
          <label>
            <input type="radio" name="difficulty" v-model="difficulty" value="0" /> 初级
          </label>
        </p>
        <p>
          <label>
            <input type="radio" name="difficulty" v-model="difficulty" value="1" /> 中级
          </label>
        </p>
        <p>
          <label>
            <input type="radio" name="difficulty" v-model="difficulty" value="2" /> 高级
          </label>
        </p>
        <p>
          <label>
            <input type="radio" name="difficulty" v-model="difficulty" value="10" /> 双人对战
          </label>
        </p>
        <button @click="onGameStart">开始游戏</button>
      </div>
    </div>
  </div>
</template>

<script>
import * as Reversi from "./reversi/main";
export default {
  name: 'Game',
  data() {
    return {
      isStartPanelShow: true,
      difficulty: 0,
      msg: "",
      timeGlobal: 0,
      timeLocal: 0,
      player: 0,
      black: 0,
      white: 0
    };
  },
  _time: 0,
  _count: 0,
  __reversi: null,
  mounted() {
    this.__reversi = new Reversi.main(this.$refs['game']);
    this.__reversi.addEventListener(Reversi.EVENT.GAME_STEP, this.onGameStep);
    this.__reversi.addEventListener(Reversi.EVENT.RUNNING, this.onGameRunning);
    this.__reversi.addEventListener(Reversi.EVENT.GAME_OVER, this.onGameOver);
  },
  methods: {
    onGameClick(e) {
      this.__reversi.click(e);
    },
    onGameStart(e) {
      this.isStartPanelShow = false;
      this.__reversi.start(this.difficulty);
      this._count = this._time || 0;
    },
    onGameRestart(e) {
      this.__reversi.reset();
      this.isStartPanelShow = true;
      this.msg = "";
    },
    onGameOver(e) {
      const { black, white, space } = e.data;
      if (black > white) {
        this.msg = "黑棋胜";
      } else if (white > black) {
        this.msg = "白棋胜";
      } else {
        this.msg = "平局";
      }
    },
    onGameRunning(e) {
      const time = e.data;
      this._time = time;
      const hour = Math.floor(time / (60 * 60));
      const minute = Math.floor((time / 60) % 60);
      const second = Math.floor(time % 60);
      this.timeGlobal = `${hour}小时 ${minute}分 ${second}秒`;
      this.timeLocal = Math.floor(this._time - this._count);
      if(this.timeLocal < 0) this.timeLocal = 0;
    },
    onGameStep(e) {
      this._count = this._time || 0;
      this.black = e.data.black;
      this.white = e.data.white;
      this.player = e.data.player;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.container {
  max-width:500px;
  width:100%
}
.start-panel {
  width: 5rem;
  position: absolute;
  left: 1.25rem;
  top: 1.75rem;
  z-index: 1;
  border-radius: 0.1rem;
  background-color: white;
}
.start-panel .start-wrap {
  margin: 0.3rem 1.5rem 0.7rem;
}
.start-panel .start-wrap p {
  text-align: left;
}
</style>
