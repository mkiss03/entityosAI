import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, LogIn } from "lucide-react";
import { cn } from "../utils/helpers";
import { AmbientNeon, AnimatedMeshGradient, ParticleNetwork } from "../components/ui";
import { auth } from "../lib/supabase";

export function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error: signInError } = await auth.signInWithGoogle();

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
      }
      // Note: User will be redirected to Google OAuth page
      // After successful auth, they'll be redirected back to /dashboard
    } catch (err) {
      setError(err.message || 'An error occurred during sign in');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Local CSS keyframes */}
      <style>{`
        @keyframes mesh {
          0% { background-position: 0% 0%; }
          35% { background-position: 100% 30%; }
          70% { background-position: 10% 100%; }
          100% { background-position: 0% 0%; }
        }
        @keyframes pageIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <AmbientNeon />

      {/* Top nav */}
      <header className="relative z-20 border-b border-slate-800/70 bg-slate-950/55 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="group inline-flex items-center gap-2">
            <span className="relative">
              <span className="absolute -inset-1 rounded-xl bg-gradient-to-r from-fuchsia-500/30 via-cyan-400/30 to-indigo-400/30 blur opacity-70 transition group-hover:opacity-100" />
              <span className="relative flex items-center gap-2 rounded-xl border border-slate-800/70 bg-slate-900/40 px-3 py-2">
                <Sparkles className="h-5 w-5 text-cyan-200" />
                <span className="text-sm font-semibold tracking-wide">EntityOS</span>
              </span>
            </span>
          </Link>

          <Link
            to="/"
            className="rounded-xl border border-slate-800/70 bg-slate-900/30 px-3 py-2 text-sm text-slate-200 hover:border-cyan-400/30"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Login Content */}
      <section className="relative z-10 overflow-hidden">
        <div className="absolute inset-0">
          <AnimatedMeshGradient />
          <ParticleNetwork density={48} />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/40 to-slate-950" />
        </div>

        <div className="relative mx-auto max-w-md px-4 py-20 sm:py-32">
          <div className="animate-[pageIn_360ms_ease-out]">
            {/* Login Card */}
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-fuchsia-500/26 via-cyan-400/22 to-indigo-400/22 blur" />
              <div className="relative rounded-2xl border border-slate-800/70 bg-slate-900/30 p-8 backdrop-blur-xl">
                {/* Header */}
                <div className="mb-8 text-center">
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-800/70 bg-slate-900/25 px-3 py-1 mb-4">
                    <span className="h-2 w-2 rounded-full bg-cyan-300/70" />
                    <span className="text-xs text-slate-300">Secure Authentication</span>
                  </div>

                  <h1 className="text-3xl font-semibold">
                    <span className="bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
                      Welcome to EntityOS
                    </span>
                  </h1>
                  <p className="mt-3 text-sm text-slate-400">
                    Sign in to access your knowledge graph dashboard
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                )}

                {/* Google Sign In Button */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className={cn(
                    "group relative w-full inline-flex items-center justify-center gap-3 rounded-xl px-6 py-3 text-sm font-semibold",
                    "border border-slate-800/70 bg-slate-900/35 backdrop-blur-xl",
                    "transition hover:border-cyan-400/40",
                    loading && "cursor-not-allowed opacity-60"
                  )}
                >
                  <span className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-fuchsia-500/25 via-cyan-400/25 to-indigo-400/25 blur opacity-0 transition group-hover:opacity-80" />

                  {/* Google Icon */}
                  <svg className="relative h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      className="text-blue-400"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      className="text-green-400"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      className="text-yellow-400"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      className="text-red-400"
                    />
                  </svg>

                  <span className="relative">
                    {loading ? 'Signing in...' : 'Sign in with Google'}
                  </span>
                  <LogIn className="relative h-4 w-4 text-slate-400 transition group-hover:text-cyan-200" />
                </button>

                {/* Divider */}
                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
                  <span className="text-xs text-slate-500">Secure OAuth 2.0</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
                </div>

                {/* Info */}
                <div className="space-y-2 text-center">
                  <p className="text-xs text-slate-400">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-400/70" />
                      <span>Encrypted</span>
                    </div>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-cyan-400/70" />
                      <span>GDPR Compliant</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-400">
                Need help?{" "}
                <a href="#" className="text-cyan-200 hover:text-cyan-100">
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
