import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import LampAnimation from "@/components/LampAnimation";
import { Eye, EyeOff, Phone } from "lucide-react";
import furnitureBg from "@/assets/furniture-bg.jpg";

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect logged-in users away from login page
    if (isAuthenticated) {
      const redirectPath = user?.role === 'ADMIN' ? '/billing' : '/';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    // Clear form visibility on page load/refresh
    sessionStorage.removeItem("authFormVisible");
  }, []);

  const handleLampToggle = (isOn: boolean) => {
    if (isOn) {
      setShowForm(true);
      sessionStorage.setItem("authFormVisible", "true");
    } else {
      setShowForm(false);
      sessionStorage.removeItem("authFormVisible");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(mobileNumber, password);
    
    if (success) {
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      navigate("/billing");
    } else {
      toast({
        title: "Login failed",
        description: "Invalid mobile number or password.",
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
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 via-stone-800/50 to-slate-900/60 backdrop-blur-sm" />
      
      <div className="container max-w-6xl mx-auto flex items-center justify-center gap-12 flex-wrap relative z-10">
        <div className="lamp-wrapper relative z-20">
          <LampAnimation onLampToggle={handleLampToggle} />
          <p className="text-center text-white mt-8 text-sm animate-pulse font-medium drop-shadow-lg">
            Pull the cord to {showForm ? 'close' : 'illuminate your path'}
          </p>
        </div>

        <div
          className={`auth-form-wrapper transition-all duration-500 relative z-10 ${
            showForm ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none absolute"
          }`}
        >
          <div className="auth-card bg-card border-2 border-primary/20 rounded-2xl p-8 shadow-2xl min-w-[380px] backdrop-blur-sm">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 text-primary">Welcome Back</h1>
              <p className="text-muted-foreground">Sign in to continue to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="mobileNumber"
                    type="tel"
                    placeholder="9999999999"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="pl-10"
                    required
                    maxLength={10}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-accent hover:text-accent/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Sign In
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{" "}
              <Link to="/auth/signup" className="text-accent hover:text-accent/80 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
