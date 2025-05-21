import db from "@/db";
import { lucia } from "@/db/lucia";
import { userTable } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;

//--- Start Typescript ---\\
type Email = {
  email: string;
  primary: boolean;
  verified: boolean;
};
//--- End Typescript ---\\

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("state"); // passed from /api/auth/github

  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code" },
      { status: 400 },
    );
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
        }),
      },
    );

    const { access_token } = await tokenResponse.json();

    // Get GitHub user data
    const userResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const user = await userResponse.json();

    // Get user email (GitHub doesn't always provide it in the first response)
    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const emails = await emailResponse.json();

    const primaryEmail = emails.find(
      (email: Email) => email.primary && email.verified,
    )?.email;

    if (!primaryEmail) {
      return NextResponse.json(
        { error: "No verified email found" },
        { status: 400 },
      );
    }

    let [existingUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, String(user.id)));

    if (!existingUser) {
      existingUser = {
        id: String(user.id),
        name: user.name,
        username: user.login,
        email: primaryEmail,
        avatar: user.avatar_url,
        githubAccessToken: access_token,
      };

      await db.insert(userTable).values(existingUser);
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/${redirectTo}`,
    );
  } catch (error) {
    console.error("OAuth Error:", error);
    return NextResponse.json({ error: "OAuth failed" }, { status: 500 });
  }
}
