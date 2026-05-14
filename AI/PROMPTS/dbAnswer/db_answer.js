import { systemDbAnswer } from "./systemDbAnswer.js";
import { userDbAnswer }   from "./userDbAnswer.js";

export const db_answer = {
  system:      systemDbAnswer,
  user:        userDbAnswer,
  tokens:      1000,
  temperature: 0.3,
  topP:        0.9,
  webSearch:   false,
};