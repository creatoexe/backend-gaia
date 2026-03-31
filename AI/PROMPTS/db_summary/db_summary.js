import { systemDbSummary } from "./systemDbSummary.js";
import { userDbSummary }   from "./userDbSummary.js";

export const db_summary = {
  system:      systemDbSummary,
  user:        userDbSummary,
  tokens:      300,
  temperature: 0.3,
  topP:        0.5,
  webSearch:   false,
};