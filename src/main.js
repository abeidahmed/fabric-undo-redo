import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'

const store = createStore({
  state: {
    canvas: null,
    canvases: {},
    canvasUndoHistories: {},
    canvasRedoHistories: {},
    undoHistory: [],
    redoHistory: [],
    nextState: null,
    processing: false,
  },

  mutations: {
    initializeCanvas(state, canvas) {
      state.canvas = canvas
    },

    initCanvas(state, { canvasId, canvas }) {
      state.canvases = { ...state.canvases, ...{ [canvasId]: canvas } }
    },

    initUndoHistories(state, canvasId) {
      state.canvasUndoHistories = { ...state.canvasUndoHistories, ...{ [canvasId]: [] } }
    },

    initRedoHistories(state, canvasId) {
      state.canvasRedoHistories = { ...state.canvasRedoHistories, ...{ [canvasId]: [] } }
    },

    updateNextState(state, value) {
      state.nextState = value
    },

    updateProcessing(state, boolean) {
      state.processing = boolean
    },

    updateUndoHistory(state, value) {
      state.undoHistory = value
    },

    updateRedoHistory(state, value) {
      state.redoHistory = value
    },

    addUndoHistory(state, value) {
      state.undoHistory.push(value)
    },

    addRedoHistory(state, value) {
      state.redoHistory.push(value)
    },
  },

  actions: {
    initializeCanvas({ commit }, canvas) {
      commit('initializeCanvas', canvas)
    },

    initializeCanvasState({ commit, getters }) {
      commit('updateNextState', getters.getNextCanvasHistory())
    },

    updateProcessing({ commit }, value) {
      commit('updateProcessing', value)
    },

    undoAction({ state, commit, getters }) {
      let undoHistoryState = [...state.undoHistory]
      let history = undoHistoryState.pop()

      if (history) {
        commit('updateUndoHistory', undoHistoryState)
        commit('addRedoHistory', getters.getNextCanvasHistory())
        commit('updateNextState', history)
        return history
      }
    },

    redoAction({ state, commit, getters }) {
      let redoHistoryState = [...state.redoHistory]
      let history = redoHistoryState.pop()

      if (history) {
        commit('updateRedoHistory', redoHistoryState)
        commit('addUndoHistory', getters.getNextCanvasHistory())
        commit('updateNextState', history)
        return history
      }
    },

    saveCanvasState({ state, commit, getters }) {
      if (state.processing) return

      commit('addUndoHistory', state.nextState)
      commit('updateNextState', getters.getNextCanvasHistory())
    }
  },

  getters: {
    getNextCanvasHistory: (state) => () => {
      let canvas = state.canvas
      if (!canvas) return

      canvas.includeDefaultValues = false
      return canvas.toJSON()
    }
  },
})

createApp(App).use(store).mount('#app')
