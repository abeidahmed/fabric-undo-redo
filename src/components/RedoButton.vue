<template>
  <button type="button" @click="redo">Redo</button>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState(['canvas']),
  },

  methods: {
    ...mapMutations(['updateProcessing']),
    ...mapActions(['redoAction']),

    async redo() {
      this.updateProcessing(true)
      let currentState = await this.redoAction()
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
