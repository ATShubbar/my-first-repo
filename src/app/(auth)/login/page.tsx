'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HiMail, HiLockClosed, HiPhone } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input, Card } from '@/components/ui';

type AuthMethod = 'email' | 'phone';

export default function LoginPage() {
  const router = useRouter();
  const { signInWithEmail, signInWithGoogle, sendPhoneVerification } = useAuth();

  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmail(email, password);
      toast.success('Welcome back!');
      router.push('/styles');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      await signInWithGoogle();
      toast.success('Welcome back!');
      router.push('/styles');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const confirmationResult = await sendPhoneVerification(phone, 'recaptcha-container');
      // Store confirmation result in session storage for verification page
      sessionStorage.setItem('phoneAuthConfirmation', JSON.stringify({ phone }));
      router.push(`/verify-phone?confirmation=${encodeURIComponent(JSON.stringify(confirmationResult))}`);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Sign in to continue creating amazing art
        </p>
      </div>

      {/* Auth Method Toggle */}
      <div className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1 mb-6">
        <button
          onClick={() => setAuthMethod('email')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            authMethod === 'email'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Email
        </button>
        <button
          onClick={() => setAuthMethod('phone')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            authMethod === 'phone'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          Phone
        </button>
      </div>

      {authMethod === 'email' ? (
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<HiMail className="w-5 h-5" />}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<HiLockClosed className="w-5 h-5" />}
            required
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign In
          </Button>
        </form>
      ) : (
        <form onSubmit={handlePhoneLogin} className="space-y-4">
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 234 567 8900"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftIcon={<HiPhone className="w-5 h-5" />}
            helperText="Include country code (e.g., +1 for US)"
            required
          />
          <div id="recaptcha-container" />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Send Code
          </Button>
        </form>
      )}

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleLogin}
        isLoading={isLoading}
        leftIcon={<FcGoogle className="w-5 h-5" />}
      >
        Google
      </Button>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="font-medium text-purple-600 hover:text-purple-500"
        >
          Sign up
        </Link>
      </p>
    </Card>
  );
}
