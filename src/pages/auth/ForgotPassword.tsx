import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/lib/api";
import LampAnimation from "@/components/LampAnimation";
import { Mail, ArrowLeft } from "lucide-react";
import furnitureBg from "@/assets/furniture-bg.jpg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [showForm, setShowForm] = useState(() => {
    return sessionStorage.getItem("authFormVisible") === "true";
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLampToggle = (isOn: boolean) => {
    if (isOn) {
      setShowForm(true);
      sessionStorage.setItem("authFormVisible", "true");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await authApi.requestPasswordReset(email);
      toast({
        title: "OTP sent!",
        description: "Check your email for the OTP to reset your password.",
      });
      navigate(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden relative">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${furnitureBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-background/70 to-accent/60 backdrop-blur-sm" />
      
      <div className="container max-w-6xl mx-auto flex items-center justify-center gap-12 flex-wrap relative z-10">
        {!showForm && (
          <div className="lamp-wrapper">
            <LampAnimation onLampToggle={handleLampToggle} />
            <p className="text-center text-foreground/80 mt-8 text-sm animate-pulse font-medium">
              Pull the cord to reset your path
            </p>
          </div>
        )}

        <div
          className={`auth-form-wrapper transition-all duration-500 ${
            showForm ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="auth-card bg-card border-2 border-primary/20 rounded-2xl p-8 shadow-2xl min-w-[380px] backdrop-blur-sm">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 text-primary">Forgot Password?</h1>
              <p className="text-muted-foreground">Enter your email to reset your password</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Send Reset Link
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/auth/login"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
