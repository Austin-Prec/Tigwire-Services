import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setIsSubmitting(false);

    if (signInError) {
      setError('That email and password combination is not recognized.');
      return;
    }

    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal-500 px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-charcoal-400 mb-4">
            <Lock size={20} className="text-white" />
          </div>
          <h1 className="font-garamond text-white text-2xl font-bold">Writing area sign in</h1>
          <p className="font-arial text-charcoal-200 text-sm mt-2">
            Tigwire Services
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg p-8 shadow-lg"
        >
          <label className="block font-arial text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal-400 mb-4"
            placeholder="you@example.com"
          />

          <label className="block font-arial text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-charcoal-400 mb-6"
            placeholder="••••••••"
          />

          {error && (
            <p className="text-sage-400 text-sm font-arial mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-charcoal-500 text-white py-3 rounded-lg font-arial text-sm font-semibold uppercase tracking-wide hover:bg-charcoal-600 transition-colors disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
