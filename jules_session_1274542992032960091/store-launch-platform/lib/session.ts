export interface SessionData {
  userId: string
  email: string
  role: string
  name: string | null
}

export function parseSession(sessionCookie: string): SessionData | null {
  try {
    const decoded = Buffer.from(sessionCookie, 'base64').toString('utf-8')
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export function encodeSession(data: SessionData): string {
  return Buffer.from(JSON.stringify(data)).toString('base64')
}
