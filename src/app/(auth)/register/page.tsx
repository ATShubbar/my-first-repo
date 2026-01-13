'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HiMail, HiLockClosed, HiUser, HiPhone } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input, Card } from '@/components/ui';

type AuthMethod = 'email' | 'phone';

export default function RegisterPage() {
  const router = useRouter();
  const { signUpWithEmail, signInWithGoogle, sendPhoneVerification } = useAuth();

  const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await signUpWithEmail(email, password, name);
      toast.success('Account created successfully!');
      router.push('/styles');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);

    try {
      await signInWithGoogle();
      toast.success('Account created successfully!');
      router.push('/styles');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to sign up with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const confirmationResult = await sendPhoneVerification(phone, 'recaptcha-container');
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
          Create Account
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Start creating amazing AI art today
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
        <form onSubmit={handleEmailRegister} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<HiUser className="w-5 h-5" />}
            required
          />
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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<HiLockClosed className="w-5 h-5" />}
            helperText="At least 6 characters"
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            leftIcon={<HiLockClosed className="w-5 h-5" />}
            required
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Create Account
          </Button>
        </form>
      ) : (
        <form onSubmit={handlePhoneRegister} className="space-y-4">
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
            Send Verification Code
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
        onClick={handleGoogleRegister}
        isLoading={isLoading}
        leftIcon={<FcGoogle className="w-5 h-5" />}
      >
        Google
      </Button>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-purple-600 hover:text-purple-500"
        >
          Sign in
        </Link>
      </p>
    </Card>
  );
}
