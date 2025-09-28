import { User } from './types';
import { db } from './database';

// Simple authentication for development - replace with proper auth in production
export class AuthService {
  private static currentUser: User | null = null;

  static async login(email: string, password: string): Promise<User | null> {
    // Mock authentication - in production, verify against database
    if (email === 'alex@autodiagnostics.ai' && password === 'password') {
      const user = await db.getUser('user-1');
      if (user) {
        this.currentUser = user;
        return user;
      }
    }
    return null;
  }

  static async logout(): Promise<void> {
    this.currentUser = null;
  }

  static getCurrentUser(): User | null {
    return this.currentUser;
  }

  static async requireAuth(): Promise<User> {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('Authentication required');
    }
    return user;
  }

  static async requireRole(role: User['role']): Promise<User> {
    const user = await this.requireAuth();
    if (user.role !== role && user.role !== 'engineer') {
      throw new Error(`Role ${role} required`);
    }
    return user;
  }
}

// Middleware helper for API routes
export async function withAuth(
  handler: (request: Request, user: User) => Promise<Response>
) {
  return async (request: Request) => {
    try {
      const user = await AuthService.requireAuth();
      return await handler(request, user);
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}

