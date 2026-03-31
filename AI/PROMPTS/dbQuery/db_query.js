import { systemDbQuery } from "./systemDbQuery.js";
import { userDbQuery }   from "./userDbQuery.js";

export const db_query = {
  system:      systemDbQuery,
  user:        userDbQuery,
  tokens:      3000,
  temperature: 0.0,
  topP:        0.05,
  webSearch:   false,
};