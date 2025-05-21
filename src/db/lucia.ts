import { Lucia } from "lucia";
import { adapter } from "./adapter";

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      name: attributes.name,
      username: attributes.username,
      email: attributes.email,
      accessToken: attributes.githubAccessToken,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  name: string;
  username: string;
  email: string;
  githubAccessToken: string;
}
