import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function UserProfile() {
  const { user } = useAuth();

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
        <AvatarImage src={user.profilePicture} alt={user.name} />
        <AvatarFallback className="text-sm bg-primary/10 text-primary">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      <div className="hidden sm:block">
        <p className="text-sm font-medium leading-none">{user.name}</p>
        <p className="text-xs text-muted-foreground mt-1">{user.role}</p>
      </div>
    </div>
  );
}
