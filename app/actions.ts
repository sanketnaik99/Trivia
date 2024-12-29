"use server";

import { redirect } from "next/navigation";
import { ulid } from "ulid";

interface Args {
  question: string;
  userId: string;
  userName: string;
}

export const handleCreateTrivia = async ({
  question,
  userId,
  userName,
}: Args) => {
  "use server";
  const protocol = process.env.NEXT_PUBLIC_PARTYKIT_HOST?.startsWith(
    "localhost"
  )
    ? "http"
    : "https";
  const id = ulid();
  const res = await fetch(
    `${protocol}://${process.env.NEXT_PUBLIC_PARTYKIT_HOST}/parties/main/${id}`,
    {
      method: "POST",
      body: JSON.stringify({
        type: "question",
        data: { question, userId, userName },
      }),
    }
  );

  if (res.ok) {
    redirect(`/trivia/${id}`);
  }
};
