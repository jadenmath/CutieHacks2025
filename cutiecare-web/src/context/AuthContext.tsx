import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

export interface AuthUser {
  id: string
  email: string | undefined
}

type AuthMode = 'signin' | 'signup'

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  mode: AuthMode
  setMode: (mode: AuthMode) => void
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  error: string | null
  notice: string | null
  resendConfirmation: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const BLOCKED_EMAIL_DOMAINS = ['example.com', 'test.com', 'email.com', 'demo.com', 'local', 'localhost']

const isBlockedEmail = (email: string) => {
  const [, domain] = email.toLowerCase().split('@')
  if (!domain) return true
  return BLOCKED_EMAIL_DOMAINS.includes(domain.trim())
}

const mapSupabaseUser = (user: User | null): AuthUser | null => {
  if (!user) return null
  return {
    id: user.id,
    email: user.email ?? undefined,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<AuthMode>('signin')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const init = async () => {
      if (!isSupabaseConfigured || !supabase) {
        setError('Supabase environment variables are missing. Add them to your .env file to enable auth.')
        setLoading(false)
        return
      }
      setLoading(true)
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (!mounted) return
      if (sessionError) {
        setError(sessionError.message)
      }
      setUser(mapSupabaseUser(session?.user ?? null))
      setLoading(false)
    }

    init()

    if (!isSupabaseConfigured || !supabase) {
      return () => {
        mounted = false
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setUser(mapSupabaseUser(session?.user ?? null))
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!email || !password) {
        setError('Enter both email and password to continue.')
        return
      }
      if (!isSupabaseConfigured || !supabase) {
        setError('Supabase is not configured. Check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values.')
        return
      }
      setError(null)
      setNotice(null)
      setLoading(true)
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
      } else {
        setUser(mapSupabaseUser(data.user ?? null))
      }
      setLoading(false)
    },
    [],
  )

  const signUp = useCallback(
    async (email: string, password: string) => {
      if (!email || !password) {
        setError('Enter both email and password to continue.')
        return
      }
      if (isBlockedEmail(email)) {
        setError('Use a real email you can open. Placeholder domains like example.com are blocked because Supabase sends a verification link.')
        return
      }
      if (!isSupabaseConfigured || !supabase) {
        setError('Supabase is not configured. Check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values.')
        return
      }
      setError(null)
      setNotice(null)
      setLoading(true)
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        setError(signUpError.message)
      } else {
        if (data.session) {
          setUser(mapSupabaseUser(data.user ?? null))
          setNotice(null)
        } else {
          setNotice(`We just sent a confirmation link to ${email}. Open it to finish creating your CutieCare account.`)
          setMode('signin')
        }
      }
      setLoading(false)
    },
    [],
  )

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setError('Supabase is not configured. Set your environment variables to enable sign out.')
      return
    }
    setError(null)
    setLoading(true)
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) {
      setError(signOutError.message)
    }
    setUser(null)
    setNotice(null)
    setLoading(false)
  }, [])

  const resendConfirmation = useCallback(
    async (email: string) => {
      if (!email) {
        setError('Enter your email first so CutieCare knows where to send the link.')
        return
      }
      if (!isSupabaseConfigured || !supabase) {
        setError('Supabase is not configured. Check your environment variables and try again.')
        return
      }
      setLoading(true)
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
      })
      if (resendError) {
        setError(resendError.message)
      } else {
        setNotice(`Sent another confirmation email to ${email}. Peek at your inbox (and spam) to finish signing up.`)
      }
      setLoading(false)
    },
    [],
  )

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, mode, setMode, signIn, signUp, signOut, error, notice, resendConfirmation }),
    [user, loading, mode, signIn, signUp, signOut, error, notice, resendConfirmation],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
