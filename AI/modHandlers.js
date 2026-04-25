import { db_answer }           from "./PROMPTS/dbAnswer/db_answer.js";
import { db_query }            from "./PROMPTS/dbQuery/db_query.js";

export const MOD_HANDLERS = {
  db_query,
  db_answer,
};
