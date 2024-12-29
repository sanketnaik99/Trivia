import type * as Party from "partykit/server";
import type { Trivia } from "../types/trivia";

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {}

  trivia: Trivia | undefined;

  async onStart() {
    this.trivia = await this.room.storage.get<Trivia>("trivia");
  }

  async saveTrivia() {
    if (this.trivia) {
      await this.room.storage.put<Trivia>("trivia", this.trivia);
    }
  }

  async onRequest(req: Party.Request): Promise<Response> {
    const url = new URL(req.url);
    if (req.method === "POST") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body = await req.json<{ type: string; data: any }>();

      if (body.type === "question") {
        this.trivia = {
          question: body.data.question,
          userId: body.data.userId,
          userName: body.data.userName,
          createdAt: new Date().toISOString(),
          answers: [],
        };

        this.saveTrivia();

        return new Response(JSON.stringify({ trivia: this.trivia }), {
          status: 201,
        });
      } else if (body.type === "answer") {
        if (this.trivia) {
          this.trivia.answers.push({
            answer: body.data.answer,
            userName: body.data.userName,
            userId: body.data.userId,
            createdAt: new Date().toISOString(),
          });
          this.saveTrivia();
          return new Response(JSON.stringify({ trivia: this.trivia }), {
            status: 200,
          });
        } else {
          return new Response("Not Found", { status: 404 });
        }
      } else {
        return new Response("Not Found", { status: 404 });
      }
    } else if (
      url.pathname.startsWith("/parties/main/") &&
      req.method === "GET"
    ) {
      console.log("Fetching trivia...", JSON.stringify(this.trivia));
      if (this.trivia) {
        return new Response(JSON.stringify({ trivia: this.trivia }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } else {
        return new Response("Not Found", { status: 404 });
      }
    } else {
      return new Response("Not Found", { status: 404 });
    }
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
        id: ${conn.id}
        room: ${this.room.id}
        url: ${new URL(ctx.request.url).pathname}`
    );
  }

  onMessage(message: string, sender: Party.Connection) {
    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`);
    // as well as broadcast it to all the other connections in the room...
    const data = JSON.parse(message);
    this.trivia?.answers.push({
      answer: data.data.answer,
      userName: data.data.userName,
      userId: data.data.userId,
      createdAt: new Date().toISOString(),
    });
    this.saveTrivia();
    this.room.broadcast(
      JSON.stringify({ type: "answer", answers: this.trivia?.answers })
    );
  }
}

Server satisfies Party.Worker;
