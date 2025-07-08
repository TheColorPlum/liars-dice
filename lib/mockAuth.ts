// Mock authentication system for testing without Supabase
export interface MockUser {
  id: string
  email: string
  user_metadata: {
    username: string
  }
  app_metadata: any
  aud: string
  created_at: string
}

export interface MockSession {
  user: MockUser
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

class MockAuthClient {
  private currentUser: MockUser | null = null
  private currentSession: MockSession | null = null
  private listeners: Array<(event: string, session: MockSession | null) => void> = []

  async getSession(): Promise<{ data: { session: MockSession | null } }> {
    return { data: { session: this.currentSession } }
  }

  async signInWithPassword(credentials: { email: string; password: string }): Promise<{ error: any }> {
    // Mock successful login
    const user: MockUser = {
      id: `user_${Date.now()}`,
      email: credentials.email,
      user_metadata: {
        username: credentials.email.split('@')[0]
      },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString()
    }

    const session: MockSession = {
      user,
      access_token: 'mock_token',
      refresh_token: 'mock_refresh_token',
      expires_in: 3600,
      token_type: 'bearer'
    }

    this.currentUser = user
    this.currentSession = session

    // Notify listeners
    this.listeners.forEach(listener => listener('SIGNED_IN', session))

    return { error: null }
  }

  async signUp(credentials: { email: string; password: string; options?: { data?: { username?: string } } }): Promise<{ error: any }> {
    // Mock successful signup
    const user: MockUser = {
      id: `user_${Date.now()}`,
      email: credentials.email,
      user_metadata: {
        username: credentials.options?.data?.username || credentials.email.split('@')[0]
      },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString()
    }

    const session: MockSession = {
      user,
      access_token: 'mock_token',
      refresh_token: 'mock_refresh_token',
      expires_in: 3600,
      token_type: 'bearer'
    }

    this.currentUser = user
    this.currentSession = session

    // Notify listeners
    this.listeners.forEach(listener => listener('SIGNED_UP', session))

    return { error: null }
  }

  async signInAnonymously(): Promise<{ error: any }> {
    // Mock anonymous login
    const user: MockUser = {
      id: `guest_${Date.now()}`,
      email: 'guest@example.com',
      user_metadata: {
        username: 'Guest'
      },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString()
    }

    const session: MockSession = {
      user,
      access_token: 'mock_guest_token',
      refresh_token: 'mock_guest_refresh_token',
      expires_in: 3600,
      token_type: 'bearer'
    }

    this.currentUser = user
    this.currentSession = session

    // Notify listeners
    this.listeners.forEach(listener => listener('SIGNED_IN', session))

    return { error: null }
  }

  async signOut(): Promise<{ error: any }> {
    this.currentUser = null
    this.currentSession = null

    // Notify listeners
    this.listeners.forEach(listener => listener('SIGNED_OUT', null))

    return { error: null }
  }

  onAuthStateChange(callback: (event: string, session: MockSession | null) => void): { data: { subscription: { unsubscribe: () => void } } } {
    this.listeners.push(callback)

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            const index = this.listeners.indexOf(callback)
            if (index > -1) {
              this.listeners.splice(index, 1)
            }
          }
        }
      }
    }
  }
}

export const mockSupabase = {
  auth: new MockAuthClient()
}