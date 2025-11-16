import { FormEvent, useState } from 'react'
import { Card } from '../components/Card'
import { PrimaryButton } from '../components/PrimaryButton'
import { useAuth } from '../context/AuthContext'

export function AuthScreen() {
  const { mode, setMode, signIn, signUp, loading, error, notice, resendConfirmation } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (mode === 'signin') {
      await signIn(email, password)
    } else {
      await signUp(email, password)
    }
  }

  const toggleText =
    mode === 'signin' ? "Don't have an account?" : 'Already have an account?'
  const toggleAction = mode === 'signin' ? 'Sign up' : 'Sign in'
  const helperCopy =
    mode === 'signup'
      ? 'Use an email inbox you can open—Supabase sends a confirmation link before unlocking CutieCare.'
      : 'Signed up already? Confirm the email we sent, then sign in with the same password.'

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-sky-50 to-violet-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-lg w-full">
        <Card className="hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.16)] transition duration-200">
          <div className="space-y-6">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-3xl font-semibold text-slate-900">Welcome to CutieCare</h1>
              <p className="text-sm text-slate-600">
                A soft place to track moods, journal gently, and keep your wellness rituals close.
              </p>
            </div>

            <div className="inline-flex rounded-full bg-slate-100/70 p-1 mx-auto">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  mode === 'signin'
                    ? 'bg-white text-pink-600 shadow'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  mode === 'signup'
                    ? 'bg-white text-pink-600 shadow'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Sign up
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-widest text-slate-500">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={loading}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-widest text-slate-500">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={loading}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:bg-white"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="space-y-2">
                <PrimaryButton type="submit" disabled={loading} className="w-full justify-center">
                  {loading ? 'Just a sec…' : mode === 'signin' ? 'Sign in' : 'Sign up'}
                </PrimaryButton>
                <p className="text-xs text-slate-500">{helperCopy}</p>
                {notice && (
                  <p className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-2xl px-3 py-2">
                    {notice}
                  </p>
                )}
                {error && <p className="text-sm text-pink-600">{error}</p>}
                {mode === 'signup' && (
                  <button
                    type="button"
                    onClick={() => resendConfirmation(email)}
                    disabled={!email || loading}
                    className="text-xs font-semibold text-pink-600 hover:text-pink-500 disabled:text-slate-400"
                  >
                    Resend verification email
                  </button>
                )}
                {loading && <p className="text-xs text-slate-400">CutieCare is getting things ready…</p>}
              </div>
            </form>

            <p className="text-center text-sm text-slate-600">
              {toggleText}{' '}
              <button
                type="button"
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="font-semibold text-pink-600 hover:text-pink-500"
              >
                {toggleAction}
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
