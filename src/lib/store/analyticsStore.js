import { createSlice } from "@reduxjs/toolkit";

const analyticsPeriod = createSlice({
  name: "analyticsDataPeriod",
  initialState: {
    // startDate is one week ago
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(),
    length: 7
  },
  reducers: {
    setPeriod(state, action) {
      const { days } = action.payload;

      if (days === 'YTD') {
        state.startDate = new Date(new Date().getFullYear(), 0, 1);
        state.endDate = new Date();
        state.length = days
        return;
      }

      state.startDate = new Date(new Date().setDate(new Date().getDate() - days));
      state.endDate = new Date();
      state.length = days
    }
  }
})

export const { setPeriod } = analyticsPeriod.actions;

export default analyticsPeriod.reducer;