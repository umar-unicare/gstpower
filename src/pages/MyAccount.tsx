// import { useState } from 'react';
// import { Save, Upload, User as UserIcon } from 'lucide-react';
// import Layout from '@/components/Layout';
// import UserProfile from '@/components/UserProfile';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { toast } from 'sonner';
// import { useAuth } from '@/hooks/useAuth';

// export default function MyAccount() {
//   const { user, updateProfile } = useAuth();
//   const [name, setName] = useState(user?.name || '');
//   const [email, setEmail] = useState(user?.email || '');
//   const [mobileNumber, setMobileNumber] = useState(user?.mobileNumber || '');
//   const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfilePicture(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSave = () => {
//     updateProfile({
//       name,
//       email,
//       mobileNumber,
//       profilePicture,
//     });
//     toast.success('Profile updated successfully');
//   };

//   const getInitials = (name: string) => {
//     return name
//       .split(' ')
//       .map(n => n[0])
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   return (
//     <Layout>
//       <div className="p-6 space-y-6 max-w-4xl mx-auto">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary">My Account</h1>
//             <p className="text-sm sm:text-base text-muted-foreground">Manage your profile information</p>
//           </div>
//           <UserProfile />
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <UserIcon className="h-5 w-5" />
//               Profile Information
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {/* Profile Picture */}
//             <div className="flex flex-col items-center gap-4">
//               <Avatar className="h-32 w-32">
//                 <AvatarImage src={profilePicture} alt={name} />
//                 <AvatarFallback className="text-3xl bg-primary/10 text-primary">
//                   {name ? getInitials(name) : 'U'}
//                 </AvatarFallback>
//               </Avatar>
//               <div>
//                 <input
//                   type="file"
//                   id="profile-upload"
//                   className="hidden"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                 />
//                 <Label htmlFor="profile-upload">
//                   <Button variant="outline" asChild>
//                     <span className="cursor-pointer">
//                       <Upload className="mr-2 h-4 w-4" />
//                       Upload Picture
//                     </span>
//                   </Button>
//                 </Label>
//               </div>
//             </div>

//             {/* Form Fields */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="name">Name</Label>
//                 <Input
//                   id="name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="Your name"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="your.email@example.com"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="mobile">Mobile Number</Label>
//                 <Input
//                   id="mobile"
//                   type="tel"
//                   value={mobileNumber}
//                   onChange={(e) => setMobileNumber(e.target.value)}
//                   placeholder="+91 1234567890"
//                   maxLength={10}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="role">Role</Label>
//                 <Input
//                   id="role"
//                   value={user?.role || 'USER'}
//                   disabled
//                   className="bg-muted cursor-not-allowed"
//                 />
//               </div>
//             </div>

//             <Button onClick={handleSave} className="w-full md:w-auto">
//               <Save className="mr-2 h-4 w-4" />
//               Save Changes
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     </Layout>
//   );
// }

// import { useEffect, useState } from 'react';
// import { Save, Upload, Trash2, User as UserIcon } from 'lucide-react';
// import Layout from '@/components/Layout';
// import UserProfile from '@/components/UserProfile';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { toast } from 'sonner';
// import { useAuth } from '@/hooks/useAuth';
// import { authApi, User } from '@/lib/api';

// export default function MyAccount() {
//  // const { accessToken } = useAuth();
//     const { getAccessToken } = useAuth();
//   const [user, setUser] = useState<User | null>(null);
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [profileImgPreview, setProfileImgPreview] = useState<string | null>(null);
//   const [newProfileFile, setNewProfileFile] = useState<File | null>(null);
//   const token = getAccessToken();

//   useEffect(() => {
//     const loadProfile = async () => {
//       try {
//         const token = getAccessToken();
//         const data = await authApi.getUserProfile(token);
//         setUser(data);
//         setName(data.name || '');
//         setEmail(data.email || '');
//         setMobileNumber(data.mobileNumber || '');
//         setProfileImgPreview(data.profileImg || null);
//       } catch (err) {
//         toast.error('Failed to load profile');
//       }
//     };
//     loadProfile();
//   }, [token, getAccessToken]);

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setNewProfileFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setProfileImgPreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleRemoveImage = async () => {
//     if (!user) return;
//     try {
//       const accessToken = getAccessToken();
//       await authApi.deleteProfileImage(accessToken, user.mobileNumber);
//       setProfileImgPreview(null);
//       setNewProfileFile(null);
//       toast.success('Profile image removed successfully');
//     } catch {
//       toast.error('Failed to remove profile image');
//     }
//   };

//   const handleSave = async () => {
//     if (!user) return;

//     try {
//       const accessToken = getAccessToken();
//       await authApi.updateUserProfile(accessToken, {
//         name,
//         email,
//         mobileNumber,
//         profileImgFile: newProfileFile || undefined,
//         removeProfileImg: !newProfileFile && !profileImgPreview, // true if user deleted image
//       });
//       toast.success('Profile updated successfully');
//     } catch {
//       toast.error('Failed to update profile');
//     }
//   };

//   const getInitials = (name: string) => {
//     return name
//       .split(' ')
//       .map(n => n[0])
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   return (
//     <Layout>
//       <div className="p-6 space-y-6 max-w-4xl mx-auto">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary">My Account</h1>
//             <p className="text-sm sm:text-base text-muted-foreground">Manage your profile information</p>
//           </div>
//           <UserProfile />
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <UserIcon className="h-5 w-5" />
//               Profile Information
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {/* Profile Picture */}
//             <div className="flex flex-col items-center gap-4">
//               <Avatar className="h-32 w-32">
//                 <AvatarImage src={profileImgPreview || undefined} alt={name} />
//                 <AvatarFallback className="text-3xl bg-primary/10 text-primary">
//                   {name ? getInitials(name) : 'U'}
//                 </AvatarFallback>
//               </Avatar>

//               <div className="flex gap-3">
//                 <input
//                   type="file"
//                   id="profile-upload"
//                   className="hidden"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                 />
//                 <Label htmlFor="profile-upload">
//                   <Button variant="outline" asChild>
//                     <span className="cursor-pointer">
//                       <Upload className="mr-2 h-4 w-4" />
//                       {profileImgPreview ? 'Change Picture' : 'Upload Picture'}
//                     </span>
//                   </Button>
//                 </Label>
//                 {profileImgPreview && (
//                   <Button variant="destructive" onClick={handleRemoveImage}>
//                     <Trash2 className="mr-2 h-4 w-4" /> Remove
//                   </Button>
//                 )}
//               </div>
//             </div>

//             {/* Form Fields */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label htmlFor="name">Name</Label>
//                 <Input
//                   id="name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   placeholder="Your name"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="your.email@example.com"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="mobile">Mobile Number</Label>
//                 <Input
//                   id="mobile"
//                   type="tel"
//                   value={mobileNumber}
//                   onChange={(e) => setMobileNumber(e.target.value)}
//                   placeholder="+91 1234567890"
//                   maxLength={10}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="role">Role</Label>
//                 <Input
//                   id="role"
//                   value={user?.roles || 'USER'}
//                   disabled
//                   className="bg-muted cursor-not-allowed"
//                 />
//               </div>
//             </div>

//             <Button onClick={handleSave} className="w-full md:w-auto">
//               <Save className="mr-2 h-4 w-4" />
//               Save Changes
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     </Layout>
//   );
// }

import { useEffect, useState } from 'react';
import { Save, Upload, Trash2, User as UserIcon } from 'lucide-react';
import Layout from '@/components/Layout';
import UserProfile from '@/components/UserProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { authApi, User } from '@/lib/api';

export default function MyAccount() {
  const { getAccessToken } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [profileImgPreview, setProfileImgPreview] = useState<string | null>(null);
  const [newProfileFile, setNewProfileFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadProfile = async () => {
    try {
      const token = getAccessToken();
      if (!token) return;
      const data = await authApi.getUserProfile(token);
      setUser(data);
      setName(data.name || '');
      setEmail(data.email || '');
      setMobileNumber(data.mobileNumber || '');
      setProfileImgPreview(data.profileImg || null);
      setNewProfileFile(null);
    } catch (err) {
      toast.error('Failed to load profile');
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setNewProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImgPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const accessToken = getAccessToken();
      if (!accessToken) throw new Error('No access token');
      await authApi.deleteProfileImage(accessToken, user.mobileNumber);
      await loadProfile(); // Reload to get updated profile from backend
      toast.success('Profile image removed successfully');
    } catch {
      toast.error('Failed to remove profile image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const accessToken = getAccessToken();
      if (!accessToken) throw new Error('No access token');
      await authApi.updateUserProfile(accessToken, {
        name,
        email,
        mobileNumber,
        profileImgFile: newProfileFile || undefined,
        removeProfileImg: !newProfileFile && !profileImgPreview,
      });
      await loadProfile(); // Reload to get updated profile from backend
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary">My Account</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage your profile information</p>
          </div>
          <UserProfile />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profileImgPreview || undefined} alt={name} />
                <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                  {name ? getInitials(name) : 'U'}
                </AvatarFallback>
              </Avatar>

              <div className="flex gap-3">
                <input
                  type="file"
                  id="profile-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <Label htmlFor="profile-upload">
                  <Button variant="outline" asChild>
                    <span className="cursor-pointer">
                      <Upload className="mr-2 h-4 w-4" />
                      {profileImgPreview ? 'Change Picture' : 'Upload Picture'}
                    </span>
                  </Button>
                </Label>
                {profileImgPreview && (
                  <Button variant="destructive" onClick={handleRemoveImage} disabled={isLoading}>
                    <Trash2 className="mr-2 h-4 w-4" /> Remove
                  </Button>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="+91 1234567890"
                  maxLength={10}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={user?.roles || 'USER'}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
              </div>
            </div>

            <Button onClick={handleSave} className="w-full md:w-auto" disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
