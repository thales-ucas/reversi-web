<template>
  <div class="game">
    <div>Reversi</div>
    <div><canvas ref="game" width="500" height="500" @click="onGameClick"></canvas></div>
    <div>
      <ul>
        <li><span>黑棋:</span><span>{{black}}</span></li>
        <li><span>白棋:</span><span>{{white}}</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
import * as Reversi from "./reversi/main";
export default {
  name: 'Game',
  props: {
    msg: String
  },
  data() {
    return {
      black: 0,
      white: 0
    };
  },
  __reversi: null,
  mounted() {
    this.__reversi = new Reversi.main(this.$refs['game']);
    this.__reversi.addEventListener(Reversi.EVENT.GAME_STEP, this.onGameStep);
    this.__reversi.start();
  },
  methods: {
    onGameClick(e) {
      this.__reversi.click(e.x - this.$refs['game'].offsetLeft, e.y - this.$refs['game'].offsetTop);
    },
    onGameStep(e) {
      this.black = e.data.black;
      this.white = e.data.white;
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
</style>
