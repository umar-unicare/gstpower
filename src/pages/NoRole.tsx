import { useEffect, useRef } from 'react';
import { Shield, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import gsap from 'gsap';

export default function NoRole() {
  const { user, logout } = useAuth();
  const shieldRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shieldRef.current && contentRef.current) {
      // Animate shield
      gsap.fromTo(
        shieldRef.current,
        { scale: 0, rotation: -180, opacity: 0 },
        { 
          scale: 1, 
          rotation: 0, 
          opacity: 1, 
          duration: 1,
          ease: 'elastic.out(1, 0.5)'
        }
      );

      // Pulse animation for shield
      gsap.to(shieldRef.current, {
        scale: 1.1,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Animate content
      gsap.fromTo(
        contentRef.current.children,
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8,
          stagger: 0.2,
          delay: 0.5,
          ease: 'power3.out'
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <Card className="w-full max-w-md p-8 text-center shadow-lg">
        <div ref={shieldRef} className="mb-6 flex justify-center">
          <div className="relative">
            <Shield className="h-24 w-24 text-muted-foreground/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-muted/50 animate-pulse" />
            </div>
          </div>
        </div>

        <div ref={contentRef} className="space-y-4">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Access Pending
          </h1>
          
          <p className="text-lg text-muted-foreground">
            Welcome, <span className="font-semibold text-foreground">{user?.name}</span>!
          </p>

          <p className="text-muted-foreground">
            Your account is currently awaiting role assignment. Please contact your system administrator to grant you access to the application.
          </p>

          <div className="pt-6 space-y-3">
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => window.location.href = 'mailto:admin@powerfurnitures.com'}
            >
              <Mail className="h-4 w-4" />
              Contact Administrator
            </Button>

            <Button
              variant="ghost"
              className="w-full"
              onClick={logout}
            >
              Sign Out
            </Button>
          </div>

          <div className="pt-4 text-xs text-muted-foreground">
            Once a role is assigned, you'll be able to access all features.
          </div>
        </div>
      </Card>
    </div>
  );
}