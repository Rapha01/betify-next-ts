'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function Profile() {
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect even if logout fails
      router.push('/login');
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="bg-muted/50 min-h-[30vh] rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">User Profile</h2>
            <p className="text-muted-foreground mb-4">Manage your account settings</p>
            {user && (
              <p className="text-sm text-muted-foreground mb-4">
                Logged in as: <span className="font-medium">{user.username}</span>
              </p>
            )}
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full max-w-xs"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <div className="bg-muted/50 aspect-square rounded-xl flex items-center justify-center">
            <span className="text-muted-foreground">Account Settings</span>
          </div>
          <div className="bg-muted/50 aspect-square rounded-xl flex items-center justify-center">
            <span className="text-muted-foreground">Preferences</span>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}