import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import LampAnimation from "@/components/LampAnimation";
import { Eye, EyeOff, Mail, User, Phone } from "lucide-react";
import furnitureBg from "@/assets/furniture-bg.jpg";

const Signup = () => {
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForm, setShowForm] = useState(() => {
    return sessionStorage.getItem("authFormVisible") === "true";
  });
  const { signup, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLampToggle = (isOn: boolean) => {
    if (isOn) {
      setShowForm(true);
      sessionStorage.setItem("authFormVisible", "true");
    }
  };

  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await signup(name, mobileNumber, password, email);
    
    if (success) {
      toast({
        title: "Account created!",
        description: "Please login with your mobile number and password.",
      });
      navigate("/auth/login");
    } else {
      toast({
        title: "Signup failed",
        description: "An account with this mobile number already exists.",
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
      <div className="absolute inset-0 bg-gradient-to-br from-accent/80 via-background/70 to-primary/60 backdrop-blur-sm" />
      
      <div className="container max-w-6xl mx-auto flex items-center justify-center gap-12 flex-wrap relative z-10">
        {!showForm && (
          <div className="lamp-wrapper">
            <LampAnimation onLampToggle={handleLampToggle} />
            <p className="text-center text-foreground/80 mt-8 text-sm animate-pulse font-medium">
              Pull the cord to begin your journey
            </p>
          </div>
        )}

        <div
          className={`auth-form-wrapper transition-all duration-500 ${
            showForm ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="auth-card bg-card border-2 border-accent/20 rounded-2xl p-8 shadow-2xl min-w-[380px] backdrop-blur-sm">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 text-accent">Create Account</h1>
              <p className="text-muted-foreground">Join us to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    required
                    minLength={6}
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

              <Button type="submit" className="w-full" size="lg" variant="default">
                Create Account
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-accent hover:text-accent/80 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
