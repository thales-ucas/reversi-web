<template>
  <div class="game">
    <div>Reversi</div>
    <div><canvas ref="game" width="500" height="500" @click="onGameClick"></canvas></div>
  </div>
</template>

<script>
import * as Reversi from "./reversi/main";
export default {
  name: 'Game',
  props: {
    msg: String
  },
  __reversi: null,
  mounted() {
    this.__reversi = new Reversi.main(this.$refs['game']);
    this.__reversi.start();
  },
  methods: {
    onGameClick(e) {
      this.__reversi.click(e.x - this.$refs['game'].offsetLeft, e.y - this.$refs['game'].offsetTop);
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
