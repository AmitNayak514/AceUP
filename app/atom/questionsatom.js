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

export const modalState = atom({
  key: "modalState",
  default: false, // default value (aka initial value)
});

export const postIdState = atom({
  key: "postIdState",
  default: "id", // default value (aka initial value)
});

export const bodyType = atom({
  key: "bodytype",
  default: [],
});
