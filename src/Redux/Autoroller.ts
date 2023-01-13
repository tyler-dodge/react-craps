import { createSlice, Slice, PayloadAction } from "@reduxjs/toolkit";

export interface AutorollerState {
  name: string
  autoroll: boolean
  autorollGroupSize: number
  passlineBet?: number
  comeBet?: number
  maxComeBets: number
  passLineOdds?: number
  comeOdds?: number
  dontPassLineBet?: number
  dontPassLineOddsBet?: number
  dontComeBet?: number
  dontComeOddsBet?: number
  autorollInterval: number
}
export interface LoadableAutorollerState {
  state: AutorollerState
  savedNames: string[]
}

const initialState: LoadableAutorollerState = {
  state: {
    autoroll: false,
    autorollGroupSize: 5,
    passlineBet: undefined,
    comeBet: undefined,
    passLineOdds: undefined,
    comeOdds: undefined,
    autorollInterval: 10,
    maxComeBets: 7,
    name: ""
  },
  savedNames: JSON.parse(localStorage.getItem("strategies") || "[]")
}
export const AutorollerSlice: Slice<LoadableAutorollerState> = createSlice({
  name: 'autoroller',
  initialState: initialState,
  reducers: {
    save(state: LoadableAutorollerState, action: PayloadAction<string>) {
      state.state.name = action.payload
    },
    setName(state: LoadableAutorollerState, action: PayloadAction<string>) {
      state.state.name = action.payload
    },
    setAutoRoll(state: LoadableAutorollerState, action: PayloadAction<boolean>) {
      state.state.autoroll = action.payload
    },
    setPassLine(state: LoadableAutorollerState, action: PayloadAction<number | undefined>) {
      state.state.passlineBet = action.payload
    },
    setComeBet(state: LoadableAutorollerState, action: PayloadAction<number | undefined>) {
      state.state.comeBet = action.payload
    },
    setPassLineOdds(state: LoadableAutorollerState, action: PayloadAction<number | undefined>) {
      state.state.passLineOdds = action.payload
    },
    setComeOdds(state: LoadableAutorollerState, action: PayloadAction<number | undefined>) {
      state.state.comeOdds = action.payload
    },
    setMaxComeBets(state: LoadableAutorollerState, action: PayloadAction<number>) {
      state.state.maxComeBets = action.payload
    },
    setAutoInterval(state: LoadableAutorollerState, action: PayloadAction<number>) {
      state.state.autorollInterval = action.payload
    },
    setAutoGroupSize(state: LoadableAutorollerState, action: PayloadAction<number>) {
      state.state.autorollGroupSize = action.payload
    },
    setDontPassLine(state: LoadableAutorollerState, action: PayloadAction<number | undefined>) {
      state.state.dontPassLineBet = action.payload
    },
    setDontComeBet(state: LoadableAutorollerState, action: PayloadAction<number | undefined>) {
      state.state.dontComeBet = action.payload
    },
    setDontPassLineOdds(state: LoadableAutorollerState, action: PayloadAction<number | undefined>) {
      state.state.dontPassLineOddsBet = action.payload
    },
    setDontComeOdds(state: LoadableAutorollerState, action: PayloadAction<number | undefined>) {
      state.state.dontComeOddsBet = action.payload
    },
    saveStrategy(state: LoadableAutorollerState) {
      if (!state.savedNames.includes(state.state.name)) {
        state.savedNames.push(state.state.name)
        localStorage.setItem("strategies", JSON.stringify(state.savedNames))
      }
      localStorage.setItem("strategy:" + state.state.name, JSON.stringify({
        ...state.state,
        autoroll: false
      }))
    },
    loadStrategy(state: LoadableAutorollerState, action: PayloadAction<string>) {
      state.state = JSON.parse(localStorage.getItem("strategy:" + action.payload))
    },
    deleteStrategy(state: LoadableAutorollerState) {
      state.savedNames = state.savedNames.filter((name) => name !== state.state.name)
      localStorage.removeItem("strategy:" + state.state.name)
    }
  }
});

export const AutorollerActions = AutorollerSlice.actions;
