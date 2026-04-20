import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || "taha-2024"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"

const secret = new TextEncoder().encode(JWT_SECRET)

export interface JwtPayload {
  userId: string
  username: string
  email: string
  phone?: string
  role: string
  patientId?: string
}

export async function signToken(
  payload: Omit<JwtPayload, "iat" | "exp">
): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(JWT_EXPIRES_IN)
    .setIssuedAt()
    .sign(secret)
}

export async function verifyToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as JwtPayload
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function getUserFromToken(token: string) {
  return await verifyToken(token)
}