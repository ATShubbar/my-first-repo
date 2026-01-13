'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ConfirmationResult } from 'firebase/auth';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Card } from '@/components/ui';

export default function VerifyPhonePage() {
  const router = useRouter();
  const { verifyPhoneCode } = useAuth();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [phone, setPhone] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Get phone from session storage
    const storedData = sessionStorage.getItem('phoneAuthConfirmation');
    if (storedData) {
      const { phone: storedPhone } = JSON.parse(storedData);
      setPhone(storedPhone);
    }

    // Focus first input
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newCode = [...code];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit;
        }
      });
      setCode(newCode);

      // Focus appropriate input
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else {
      const newCode = [...code];
      newCode[index] = value.replace(/\D/g, '');
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      toast.error('Please enter the complete verification code');
      return;
    }

    if (!confirmationResult) {
      toast.error('Verification session expired. Please try again.');
      router.push('/login');
      return;
    }

    setIsLoading(true);

    try {
      await verifyPhoneCode(confirmationResult, verificationCode);
      toast.success('Phone verified successfully!');
      sessionStorage.removeItem('phoneAuthConfirmation');
      router.push('/styles');
    } catch (error) {
      toast.error((error as Error).message || 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    sessionStorage.removeItem('phoneAuthConfirmation');
    router.push('/login');
  };

  return (
    <Card className="animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Verify Your Phone
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          We sent a verification code to
        </p>
        <p className="font-medium text-gray-900 dark:text-white">{phone}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-2">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-bold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          ))}
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Verify Code
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Didn&apos;t receive the code?{' '}
        <button
          onClick={handleResend}
          className="font-medium text-purple-600 hover:text-purple-500"
        >
          Resend
        </button>
      </p>
    </Card>
  );
}
