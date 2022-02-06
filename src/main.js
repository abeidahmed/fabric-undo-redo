import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'

const store = createStore({
  state: {
    canvases: {},
    canvasUndoHistories: {},
    canvasRedoHistories: {},
    nextStates: {},
    processing: false,
  },

  mutations: {
    initCanvas(state, { canvasId, canvas }) {
      state.canvases = { ...state.canvases, ...{ [canvasId]: canvas } }
    },

    initNextState(state, { canvasId, nextState }) {
      state.nextStates = { ...state.nextStates, ...{ [canvasId]: nextState } }
    },

    initUndoHistory(state, canvasId) {
      state.canvasUndoHistories = { ...state.canvasUndoHistories, ...{ [canvasId]: [] } }
    },

    initRedoHistory(state, canvasId) {
      state.canvasRedoHistories = { ...state.canvasRedoHistories, ...{ [canvasId]: [] } }
    },

    updateProcessing(state, value) {
      state.processing = value
    },

    updateNextState(state, { canvasId, value }) {
      state.nextStates[canvasId] = value
    },

    updateUndoHistory(state, { canvasId, value }) {
      state.canvasUndoHistories[canvasId] = value
    },

    updateRedoHistory(state, { canvasId, value }) {
      state.canvasRedoHistories[canvasId] = value
    },

    addUndoHistory(state, { canvasId, value }) {
      state.canvasUndoHistories[canvasId].push(value)
    },

    addRedoHistory(state, { canvasId, value }) {
      state.canvasRedoHistories[canvasId].push(value)
    },
  },

  actions: {
    initCanvas({ commit, getters }, { canvasId, canvas }) {
      commit('initCanvas', { canvasId, canvas })
      commit('initUndoHistory', canvasId)
      commit('initRedoHistory', canvasId)
      commit('initNextState', { canvasId, nextState: getters.getNextCanvasHistory(canvasId) })
    },

    updateProcessing({ commit }, value) {
      commit('updateProcessing', value)
    },

    undoAction({ state, commit, getters }, canvasId) {
      let undoHistoryState = [...state.canvasUndoHistories[canvasId]]
      let history = undoHistoryState.pop()

      if (history) {
        commit('updateUndoHistory', { canvasId, value: undoHistoryState })
        commit('addRedoHistory', { canvasId, value: getters.getNextCanvasHistory(canvasId) })
        commit('updateNextState', { canvasId, value: history })
        return history
      }
    },

    redoAction({ state, commit, getters }, canvasId) {
      let redoHistoryState = [...state.canvasRedoHistories[canvasId]]
      let history = redoHistoryState.pop()

      if (history) {
        commit('updateRedoHistory', { canvasId, value: redoHistoryState })
        commit('addUndoHistory', { canvasId, value: getters.getNextCanvasHistory(canvasId) })
        commit('updateNextState', { canvasId, value: history })
        return history
      }
    },

    saveCanvasState({ state, commit, getters }, canvasId) {
      if (state.processing) return

      let nextState = state.nextStates[canvasId]
      commit('addUndoHistory', { canvasId, value: nextState })
      commit('updateNextState', { canvasId, value: getters.getNextCanvasHistory(canvasId) })
    },
  },

  getters: {
    getNextCanvasHistory: (state) => (canvasId) => {
      let canvas = state.canvases[canvasId]
      if (!canvas) return

      canvas.includeDefaultValues = false
      return canvas.toJSON()
    },

    undoHistoryFor: (state) => (canvasId) => state.canvasUndoHistories[canvasId],

    redoHistoryFor: (state) => (canvasId) => state.canvasRedoHistories[canvasId],
  },
})

createApp(App).use(store).mount('#app')
