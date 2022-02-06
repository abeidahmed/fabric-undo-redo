<template>
  <button type="button" @click="undo" :disabled="isDisabled">Undo</button>
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
    ...mapGetters(['undoHistoryFor']),

    canvas() {
      return this.canvases[this.canvasId]
    },

    isDisabled() {
      let undoHistory = this.undoHistoryFor(this.canvasId)
      return !undoHistory || undoHistory.length <= 0
    },
  },

  methods: {
    ...mapMutations(['updateProcessing']),
    ...mapActions(['undoAction']),

    async undo() {
      this.updateProcessing(true)
      let currentState = await this.undoAction(this.canvasId)
      if (currentState) {
        this.canvas.loadFromJSON(currentState, this.render.bind(this))
      }

      this.updateProcessing(false)
    },

    render() {
      this.canvas.requestRenderAll()
    },
  },
}
</script>
