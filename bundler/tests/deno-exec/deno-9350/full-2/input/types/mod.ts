export interface SOURCE {
  name: string;
  mediaType: string;
}

export interface TRIVIA {
  question: string;
  correctAnswer: string;
  wrongAnswers: [string, string, string];
  source: SOURCE;
}
