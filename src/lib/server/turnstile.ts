import { env } from "cloudflare:workers";

interface TurnstileResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export async function verifyTurnstile(token: string): Promise<boolean> {
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: env?.TURNSTILE_SECRET_KEY || import.meta.env.TURNSTILE_SECRET_KEY,
        response: token,
      }),
    });

    if (!res.ok) {
      console.error(`Turnstile verification failed with status: ${res.status}`);
      return false;
    }

    const data: TurnstileResponse = await res.json();
    return data.success === true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}
