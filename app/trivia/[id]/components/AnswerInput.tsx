import React from "react";

// Libs
import PartySocket from "partysocket";

// Component
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

// Types
import { TriviaAnswer } from "@/types/trivia";

// Hooks
import { useUser } from "@clerk/nextjs";

interface Props {
  answers: TriviaAnswer[];
  socket: PartySocket;
}

export const AnswerInput = ({ answers, socket }: Props) => {
  const user = useUser();
  const [userAnswer, setUserAnswer] = React.useState<string>("");

  // if (answers.some((answer) => answer.userId === user.user?.id)) {
  //   return <div>You have already answered</div>;
  // }

  const submittedAnswer = answers.find(
    (answer) => answer.userId === user.user?.id
  )?.answer;

  const handleSubmitUserAnswer = () => {
    socket.send(
      JSON.stringify({
        type: "answer",
        data: {
          answer: userAnswer,
          userId: user.user?.id,
          userName: user.user?.firstName,
        },
      })
    );
  };

  return (
    <>
      {!submittedAnswer && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitUserAnswer();
          }}
          className="mb-8"
        >
          <div className="flex gap-2">
            <Input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="flex-grow"
            />
            <Button type="submit">Submit Answer</Button>
          </div>
        </form>
      )}

      {submittedAnswer && (
        <Card className="p-4 mb-8 bg-blue-50">
          <h2 className="text-lg font-semibold mb-2">Your Answer:</h2>
          <p>{submittedAnswer}</p>
        </Card>
      )}
    </>
  );
};
