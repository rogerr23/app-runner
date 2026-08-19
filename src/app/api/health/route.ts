import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "app-runner",
    timestamp: new Date().toISOString(),
  });
}
