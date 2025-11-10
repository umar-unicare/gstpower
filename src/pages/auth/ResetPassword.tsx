import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { authApi } from '@/lib/api';
import furnitureBg from '@/assets/furniture-bg.jpg';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get('email') || '';
  const [email, setEmail] = useState(emailFromUrl);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    try {
      await authApi.resetPassword(email, otp, newPassword);
      toast({
        title: 'Success',
        description: 'Password reset successfully',
      });
      navigate('/auth/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset password. Please check your OTP.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${furnitureBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background/60 to-secondary/20 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md p-8 animate-fade-in">
        <div className="bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-border">
          <h2 className="text-3xl font-bold text-center mb-2 text-foreground">Reset Password</h2>
          <p className="text-center text-muted-foreground mb-8">
            Enter the OTP sent to your email
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Reset Password
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Remember your password?{' '}
            <button
              onClick={() => navigate('/auth/login')}
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
