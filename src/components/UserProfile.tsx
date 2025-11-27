import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { authApi, User } from '@/lib/api';

export default function UserProfile() {
  const { getAccessToken } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = getAccessToken();
        if (!token) return;
        const data = await authApi.getUserProfile(token);
        setUser(data);
      } catch (err) {
        console.error('Failed to load profile in UserProfile component');
      }
    };
    loadProfile();
    
    // Refresh profile every 30 seconds to catch updates
    const interval = setInterval(loadProfile, 30000);
    return () => clearInterval(interval);
  }, [getAccessToken]);

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-card border border-border rounded-lg shadow-sm">
      <Avatar className="h-10 w-10">
        <AvatarImage 
          src={user.profileImg || undefined} 
          alt={user.name}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <AvatarFallback className="text-sm bg-primary/10 text-primary">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      <div className="hidden sm:block">
        <p className="text-sm font-medium leading-none">{user.name}</p>
        <p className="text-xs text-muted-foreground mt-1">{user.roles}</p>
      </div>
    </div>
  );
}
