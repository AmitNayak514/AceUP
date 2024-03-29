import { atom } from "recoil";

export const questionsState = atom({
  key: "questions",
  default: [],
});

export const userAnswerState = atom({
  key: "userAnswer",
  default: {},
});
export const insightsState = atom({
  key: "insights",
  default: {},
});
