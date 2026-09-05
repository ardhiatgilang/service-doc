import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { TEKNISI_COOKIE, ADMIN_COOKIE } from "./cookie-names";

const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET belum diset di environment variables (.env.local).");
}

const secretKey = new TextEncoder().encode(SESSION_SECRET);
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 hari

export { TEKNISI_COOKIE, ADMIN_COOKIE };

async function createSessionToken(payload: Record<string, string>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(secretKey);
}

async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as Record<string, string>;
  } catch {
    return null;
  }
}

export async function createTeknisiSession(technicianId: string, nip: string) {
  const token = await createSessionToken({ technicianId, nip });
  const store = await cookies();
  store.set(TEKNISI_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function getTeknisiSession() {
  const store = await cookies();
  const token = store.get(TEKNISI_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifySessionToken(token);
  if (!payload?.technicianId) return null;
  return { technicianId: payload.technicianId, nip: payload.nip };
}

export async function clearTeknisiSession() {
  const store = await cookies();
  store.delete(TEKNISI_COOKIE);
}

export async function createAdminSession(adminId: string, username: string) {
  const token = await createSessionToken({ adminId, username });
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function getAdminSession() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifySessionToken(token);
  if (!payload?.adminId) return null;
  return { adminId: payload.adminId, username: payload.username };
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}
