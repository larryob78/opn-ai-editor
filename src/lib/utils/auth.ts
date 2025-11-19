import { adminAuth } from '@/lib/firebase/admin';

export type UserRole = 'SPOTTER' | 'RESPONDER' | 'ADMIN';

export interface AuthUser {
  uid: string;
  email: string | null;
  role: UserRole;
  organisationId?: string;
}

/**
 * Verify Firebase ID token and get user role
 */
export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);

    return {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      role: (decodedToken.role as UserRole) || 'SPOTTER',
      organisationId: decodedToken.organisationId as string | undefined,
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Set custom claims for a user
 */
export async function setUserRole(
  uid: string,
  role: UserRole,
  organisationId?: string
): Promise<void> {
  const claims: Record<string, any> = { role };

  if (organisationId) {
    claims.organisationId = organisationId;
  }

  await adminAuth.setCustomUserClaims(uid, claims);
}

/**
 * Check if user has required role
 */
export function hasRole(user: AuthUser | null, allowedRoles: UserRole[]): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}

/**
 * Get authorization header from request
 */
export function getAuthToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.substring(7);
}

/**
 * Middleware to protect API routes
 */
export async function requireAuth(
  request: Request,
  allowedRoles: UserRole[]
): Promise<AuthUser> {
  const token = getAuthToken(request);

  if (!token) {
    throw new Error('Unauthorized: No token provided');
  }

  const user = await verifyToken(token);

  if (!user) {
    throw new Error('Unauthorized: Invalid token');
  }

  if (!hasRole(user, allowedRoles)) {
    throw new Error(
      `Forbidden: Required roles: ${allowedRoles.join(', ')}, but user has role: ${user.role}`
    );
  }

  return user;
}
