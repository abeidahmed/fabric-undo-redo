<template>
  <div>
    <button type="button" @click="undo" :disabled="!undoAvailable">Undo</button>
    <button type="button" @click="redo" :disabled="!redoAvailable">Redo</button>
    <canvas id="canvas" width="800" height="600"></canvas>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { uuid } from './helpers/uuid'

export default {
  data() {
    return {}
  },

  mounted() {
    let canvas = new fabric.Canvas('canvas', { backgroundColor: '#f5deb3' })
    this.initializeCanvas(canvas)

    this.canvas.on('object:added', () => {
      this.updateCanvasState()
    })

    this.canvas.on('object:modified', () => {
      this.updateCanvasState()
    })

    this.addRect({ fill: '#f55', top: 10, left: 10 });
    this.addRect({ fill: '#000', top: 10, left: 100 });
    this.addRect({ fill: '#e1e', top: 10, left: 200 });
  },

  computed: {
    ...mapState(['canvas', 'undoAvailable', 'redoAvailable']),
  },

  methods: {
    ...mapActions(['initializeCanvas', 'updateCanvasState', 'redoAction', 'undoAction']),

    undo() {
      this.undoAction()
    },

    redo() {
      this.redoAction()
    },

    addRect({ fill, top, left }) {
      this.canvas.add(
        new fabric.Circle({
          radius: 30,
          fill,
          top,
          left,
          id: uuid(),
        })
      )
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
