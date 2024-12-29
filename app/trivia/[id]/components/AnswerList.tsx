"use client";
import React from "react";

// Components
import { Card } from "@/components/ui/card";

// Types
import { TriviaAnswer } from "@/types/trivia";

export const AnswerList = ({ answers }: { answers: TriviaAnswer[] }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Other Answers:</h2>
      <div className="space-y-4">
        {answers.map((answer) => (
          <Card
            key={answer.userId}
            className="p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <p className="text-lg">{answer.answer}</p>
              <p className="text-sm text-gray-500">by {answer.userName}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
