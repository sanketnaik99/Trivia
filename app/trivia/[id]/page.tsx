"use client";
import React, { useEffect } from "react";

// Libs
import usePartySocket from "partysocket/react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

// Components
import { AnswerList } from "./components/AnswerList";
import { AnswerInput } from "./components/AnswerInput";

// Types
import { TriviaAnswer } from "@/types/trivia";
import { QuestionSkeleton } from "./components/Skeleton";

const TriviaPage = () => {
  const { id } = useParams<{ id: string }>();
  const [answers, setAnswers] = React.useState<TriviaAnswer[]>([]);

  const { data: triviaData, isPending } = useQuery({
    queryKey: ["trivia", id],
    queryFn: async () => {
      const protocol = process.env.NEXT_PUBLIC_PARTYKIT_HOST?.startsWith(
        "localhost"
      )
        ? "http"
        : "https";
      const triviaData = await fetch(
        `${protocol}://${process.env.NEXT_PUBLIC_PARTYKIT_HOST}/parties/main/${id}`,
        { method: "GET" }
      )
        .then((res) => res.json())
        .catch((err) => err);
      return triviaData;
    },
  });

  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST,
    room: id,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMessage(event: any) {
      console.log(event);
      const data = JSON.parse(event.data);
      if (data.type === "answer") {
        setAnswers(data.answers);
      }
    },
  });

  useEffect(() => {
    if (triviaData?.trivia) {
      console.log("setting answers", triviaData.trivia.answers);
      setAnswers(triviaData.trivia.answers);
    }
  }, [triviaData]);

  if (!triviaData || isPending) return <QuestionSkeleton />;

  return (
    <main className="flex-grow p-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            Trivia Question
          </h1>
          <p className="text-xl text-blue-600">{triviaData.trivia?.question}</p>
        </header>
        <AnswerInput answers={answers} socket={socket} />
        <AnswerList answers={answers} />
      </div>
    </main>
  );
};

export default TriviaPage;
