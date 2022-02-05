import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'

const store = createStore({
  state: {
    canvas: null,
    canvasState: [],
    currentStateIndex: -1,
    undoStatus: false,
    redoStatus: false,
    undoAvailable: true,
    redoAvailable: true,
  },

  mutations: {
    initializeCanvas(state, canvas) {
      state.canvas = canvas
    },

    updateUndoAvailability(state, boolean) {
      state.undoAvailable = boolean
    },

    updateRedoAvailability(state, boolean) {
      state.redoAvailable = boolean
    },

    pushToCanvasState(state, value) {
      state.canvasState.push(value)
    },

    updateRedoStatus(state, boolean) {
      state.redoStatus = boolean
    },

    updateUndoStatus(state, boolean) {
      state.undoStatus = boolean
    },

    updateCanvasState(state, value) {
      state.canvasState = value
    },

    updateCanvasStateAtIndex(state, { index, value }) {
      state.canvasState[index] = value
    },

    updateCurrentStateIndex(state, value) {
      state.currentStateIndex = value
    },
  },

  actions: {
    initializeCanvas({ commit }, canvas) {
      commit('initializeCanvas', canvas)
    },

    undoAction({ state, commit }) {
      if (state.currentStateIndex === -1) {
        commit('updateUndoStatus', false)
      } else if (state.canvasState.length >= 1) {
        if (state.currentStateIndex !== 0) {
          commit('updateUndoStatus', true)
          state.canvas.loadFromJSON(state.canvasState[state.currentStateIndex - 1], function () {
            state.canvas.renderAll()
            commit('updateUndoStatus', false)
            commit('updateCurrentStateIndex', state.currentStateIndex - 1)
            commit('updateUndoAvailability', true)

            if (state.currentStateIndex !== state.canvasState.length - 1) {
              commit('updateRedoAvailability', true)
            }
          })
        } else if (state.currentStateIndex === 0) {
          state.canvas.clear()
          commit('updateUndoAvailability', false)
          commit('updateRedoAvailability', true)
          commit('updateCurrentStateIndex', state.currentStateIndex - 1)
        }
      }
    },

    redoAction({ state, commit }) {
      if (state.currentStateIndex === state.canvasState.length - 1 && state.currentStateIndex !== -1) {
        commit('updateRedoAvailability', false)
      } else if (state.canvasState.length > state.currentStateIndex && state.canvasState.length !== 0) {
        commit('updateRedoStatus', true)
        state.canvas.loadFromJSON(state.canvasState[state.currentStateIndex + 1], function () {
          state.canvas.renderAll()
          commit('updateRedoStatus', false)
          commit('updateCurrentStateIndex', state.currentStateIndex + 1)

          if (state.currentStateIndex !== -1) {
            commit('updateUndoAvailability', true)
          }

          if (state.currentStateIndex === state.canvasState.length - 1 && state.currentStateIndex !== -1) {
            commit('updateRedoAvailability', false)
          }
        })
      }
    },

    updateCanvasState({ state, commit }) {
      if (!state.undoStatus && !state.redoStatus) {
        let jsonData = state.canvas.toJSON()
        let canvasAsJson = JSON.stringify(jsonData)

        if (state.currentStateIndex < state.canvasState.length - 1) {
          let index = state.currentStateIndex + 1
          commit('updateCanvasStateAtIndex', { index, value: canvasAsJson })
          let numberOfElementsToRetain = index + 1
          commit('updateCanvasState', state.canvasState.splice(0, numberOfElementsToRetain))
        } else {
          commit('pushToCanvasState', canvasAsJson)
        }

        commit('updateCurrentStateIndex', state.canvasState.length - 1)

        if (state.currentStateIndex === state.canvasState.length - 1 && state.currentStateIndex !== -1) {
          commit('updateRedoAvailability', false)
        }
      }
    }
  },
})

createApp(App).use(store).mount('#app')
