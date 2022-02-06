<template>
  <div>
    <undo-button :canvasId="canvasId"></undo-button>
    <redo-button :canvasId="canvasId"></redo-button>
    <canvas id="canvas" width="800" height="600"></canvas>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { uuid } from './helpers/uuid'
import UndoButton from './components/UndoButton.vue'
import RedoButton from './components/RedoButton.vue'

export default {
  components: { UndoButton, RedoButton },

  data() {
    return {
      canvasId: 'whiteboard',
    }
  },

  mounted() {
    let canvas = new fabric.Canvas('canvas', { backgroundColor: '#f5deb3' })
    this.initCanvas({ canvas, canvasId: this.canvasId })

    this.canvas.on('object:added', () => {
      this.saveCanvasState(this.canvasId)
    })

    this.canvas.on('object:modified', () => {
      this.saveCanvasState(this.canvasId)
    })

    this.addRect({ fill: '#f55', top: 10, left: 10 })
    this.addRect({ fill: '#000', top: 10, left: 100 })
    this.addRect({ fill: '#e1e', top: 10, left: 200 })
  },

  computed: {
    ...mapState(['canvases']),

    canvas() {
      return this.canvases[this.canvasId]
    },
  },

  methods: {
    ...mapActions(['initCanvas', 'saveCanvasState']),

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
