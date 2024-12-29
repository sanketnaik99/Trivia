export type Trivia = {
  question: string;
  userId: string;
  userName: string;
  createdAt: string;
  answers: TriviaAnswer[];
};

export type TriviaAnswer = {
  answer: string;
  userId: string;
  userName: string;
  createdAt: string;
};
