<template>
  <button type="button" @click="redo" :disabled="isDisabled">Redo</button>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

export default {
  props: {
    canvasId: {
      type: String,
      required: true,
    },
  },

  computed: {
    ...mapState(['canvases']),
    ...mapGetters(['redoHistoryFor']),

    canvas() {
      return this.canvases[this.canvasId]
    },

    isDisabled() {
      let redoHistory = this.redoHistoryFor(this.canvasId)
      return !redoHistory || redoHistory.length <= 0
    },
  },

  methods: {
    ...mapMutations(['updateProcessing']),
    ...mapActions(['redoAction']),

    async redo() {
      this.updateProcessing(true)
      let currentState = await this.redoAction(this.canvasId)
      if (currentState) {
        this.canvas.loadFromJSON(currentState, this.render.bind(this))
      }

      this.updateProcessing(false)
    },

    render() {
      this.canvas.requestRenderAll()
    }
  },
}
</script>
