import { NextResponse } from "next/server";

const GITHUB_OAUTH_URL = "https://github.com/login/oauth/authorize";
const CLIENT_ID = process.env.GITHUB_CLIENT_ID!;

export function GET() {
  const redirectUri = `${GITHUB_OAUTH_URL}?client_id=${CLIENT_ID}&scope=user:email`;
  return NextResponse.redirect(redirectUri);
}
