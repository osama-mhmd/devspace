import { NextResponse } from "next/server";

const GITHUB_OAUTH_URL = "https://github.com/login/oauth/authorize";
const CLIENT_ID = process.env.GITHUB_CLIENT_ID!;

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const redirectTo = searchParams.get("redirectTo");

  const redirectUri = `${GITHUB_OAUTH_URL}?client_id=${CLIENT_ID}&scope=user:email&state=${redirectTo ?? "app"}`;
  return NextResponse.redirect(redirectUri);
}
