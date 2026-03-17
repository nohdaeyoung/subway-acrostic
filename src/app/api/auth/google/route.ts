import { NextResponse } from "next/server";
import { SignJWT } from "jose";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET 환경변수가 설정되지 않았습니다.");
  return new TextEncoder().encode(secret);
}

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: "토큰이 없습니다." }, { status: 400 });
    }

    // Verify Firebase ID token via Google's public endpoint
    const verifyRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );

    if (!verifyRes.ok) {
      return NextResponse.json({ error: "토큰 검증에 실패했습니다." }, { status: 401 });
    }

    const data = await verifyRes.json();
    const user = data.users?.[0];
    if (!user?.email) {
      return NextResponse.json({ error: "이메일 정보를 가져올 수 없습니다." }, { status: 401 });
    }

    // Check allowed email
    const allowedEmail = process.env.ADMIN_GOOGLE_EMAIL;
    if (!allowedEmail || user.email !== allowedEmail) {
      return NextResponse.json(
        { error: "허용되지 않은 계정입니다." },
        { status: 403 }
      );
    }

    const token = await new SignJWT({ role: "admin", email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(getSecret());

    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
