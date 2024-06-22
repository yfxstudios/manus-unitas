import { configureStore } from "@reduxjs/toolkit";

import analyticsPeriod from "../lib/store/analyticsStore";

export const store = configureStore({
  reducer: {
    analyticsPeriod,
  }
});