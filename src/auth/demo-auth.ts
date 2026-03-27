import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export const ACCESS_COOKIE_NAME = "demo_access_token";
export const REFRESH_COOKIE_NAME = "demo_refresh_token";
export const DEFAULT_ACCESS_TTL_MS = 8_000;
export const DEFAULT_REFRESH_TTL_MS = 60_000;
const DEFAULT_DEMO_SECRET = "supabase-ssr-auth-starter-local-demo-secret";

export interface DemoUser {
  email: string;
  displayName: string;
}

export interface SessionSnapshot {
  accessTokenExpiresAt: number;
  refreshCount: number;
  refreshTokenExpiresAt: number;
  user: DemoUser;
}

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
  session: SessionSnapshot;
}

interface DemoAuthOptions {
  accessTokenTtlMs?: number;
  now?: () => number;
  randomToken?: () => string;
  refreshTokenTtlMs?: number;
  secret?: string;
}

export interface DemoAuthService {
  getSessionFromAccessToken(accessToken?: string): SessionSnapshot | null;
  refreshSession(refreshToken?: string): SessionTokens | null;
  signIn(email: string): SessionTokens;
}

interface AccessTokenPayload {
  accessTokenExpiresAt: number;
  displayName: string;
  email: string;
  nonce: string;
  refreshCount: number;
  refreshTokenExpiresAt: number;
  type: "access";
}

interface RefreshTokenPayload {
  displayName: string;
  email: string;
  nonce: string;
  refreshCount: number;
  refreshTokenExpiresAt: number;
  type: "refresh";
}

function encodeBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function createDisplayName(email: string) {
  const [localPart = "Demo user"] = email.split("@");
  const words = localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));

  return words.join(" ") || "Demo user";
}

function createSessionSnapshot(payload: AccessTokenPayload): SessionSnapshot {
  return {
    accessTokenExpiresAt: payload.accessTokenExpiresAt,
    refreshCount: payload.refreshCount,
    refreshTokenExpiresAt: payload.refreshTokenExpiresAt,
    user: {
      displayName: payload.displayName,
      email: payload.email
    }
  };
}

export function createDemoAuthService(options: DemoAuthOptions = {}): DemoAuthService {
  const now = options.now ?? (() => Date.now());
  const accessTokenTtlMs = options.accessTokenTtlMs ?? DEFAULT_ACCESS_TTL_MS;
  const refreshTokenTtlMs = options.refreshTokenTtlMs ?? DEFAULT_REFRESH_TTL_MS;
  const randomToken = options.randomToken ?? randomUUID;
  const secret = options.secret ?? DEFAULT_DEMO_SECRET;

  function signPayload(payload: AccessTokenPayload | RefreshTokenPayload) {
    const encodedPayload = encodeBase64Url(JSON.stringify(payload));
    const signature = createHmac("sha256", secret).update(encodedPayload).digest("base64url");
    return `${encodedPayload}.${signature}`;
  }

  function verifyPayload<T extends AccessTokenPayload | RefreshTokenPayload>(token: string | undefined, expectedType: T["type"]) {
    if (!token) {
      return null;
    }

    const [encodedPayload, signature] = token.split(".");

    if (!encodedPayload || !signature) {
      return null;
    }

    const expectedSignature = createHmac("sha256", secret).update(encodedPayload).digest("base64url");

    if (
      signature.length !== expectedSignature.length ||
      !timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    ) {
      return null;
    }

    const parsedPayload = JSON.parse(decodeBase64Url(encodedPayload)) as T;

    if (parsedPayload.type !== expectedType) {
      return null;
    }

    return parsedPayload;
  }

  function issueTokens(user: DemoUser, refreshCount: number): SessionTokens {
    const currentTime = now();
    const refreshTokenExpiresAt = currentTime + refreshTokenTtlMs;
    const accessTokenPayload: AccessTokenPayload = {
      accessTokenExpiresAt: currentTime + accessTokenTtlMs,
      displayName: user.displayName,
      email: user.email,
      nonce: randomToken(),
      refreshCount,
      refreshTokenExpiresAt,
      type: "access"
    };
    const refreshTokenPayload: RefreshTokenPayload = {
      displayName: user.displayName,
      email: user.email,
      nonce: randomToken(),
      refreshCount,
      refreshTokenExpiresAt,
      type: "refresh"
    };

    return {
      accessToken: signPayload(accessTokenPayload),
      refreshToken: signPayload(refreshTokenPayload),
      session: createSessionSnapshot(accessTokenPayload)
    };
  }

  return {
    signIn(email) {
      const normalizedEmail = email.trim().toLowerCase();

      return issueTokens(
        {
          displayName: createDisplayName(normalizedEmail),
          email: normalizedEmail
        },
        0
      );
    },
    getSessionFromAccessToken(accessToken) {
      const payload = verifyPayload<AccessTokenPayload>(accessToken, "access");

      if (!payload) {
        return null;
      }

      const currentTime = now();

      if (payload.accessTokenExpiresAt <= currentTime || payload.refreshTokenExpiresAt <= currentTime) {
        return null;
      }

      return createSessionSnapshot(payload);
    },
    refreshSession(refreshToken) {
      const payload = verifyPayload<RefreshTokenPayload>(refreshToken, "refresh");

      if (!payload || payload.refreshTokenExpiresAt <= now()) {
        return null;
      }

      return issueTokens(
        {
          displayName: payload.displayName,
          email: payload.email
        },
        payload.refreshCount + 1
      );
    }
  };
}
