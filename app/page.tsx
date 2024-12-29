"use client";
import { useState } from "react";

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// actions
import { handleCreateTrivia } from "./actions";

// Hooks
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const [question, setQuestion] = useState<string>("");
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">
          Trivia of the Day
        </h1>
        <p className="text-xl text-blue-600">
          What&apos;s the trivia question for today?
        </p>
      </header>
      <form
        className="w-full max-w-md"
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateTrivia({
            question,
            userId: user?.id ?? "",
            userName: user?.firstName ?? "",
          });
        }}
      >
        <div className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Enter your trivia question here..."
            className="w-full p-3 text-lg"
            name="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={!question}
            onClick={() =>
              handleCreateTrivia({
                question,
                userId: user?.id ?? "",
                userName: user?.firstName ?? "",
              })
            }
          >
            Submit Question
          </Button>
        </div>
      </form>
    </div>
  );
}
