<template>
  <button type="button" @click="undo">Undo</button>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState(['canvas']),
  },

  methods: {
    ...mapMutations(['updateProcessing']),
    ...mapActions(['undoAction']),

    async undo() {
      this.updateProcessing(true)
      let currentState = await this.undoAction()
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
