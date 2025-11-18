'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut, User, Mail, Shield, Calendar, Key, Settings, Bell, Palette, Smartphone } from 'lucide-react';

export default function Profile() {
  const { logout, account, updateAccount } = useAuth();
  const router = useRouter();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/login');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (!account) return;

    setIsChangingPassword(true);
    try {
      await updateAccount({ password: passwordData.newPassword });
      setIsChangePasswordOpen(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password changed successfully');
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('Failed to change password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!account) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Profile Header */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 rounded-3xl blur-3xl"></div>
            <Card className="relative border-0 shadow-2xl bg-card/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 ring-4 ring-primary/20 shadow-xl">
                      <AvatarImage src={account.avatarUrl} alt={account.username} />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-secondary text-white">
                        {account.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-background shadow-lg"></div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          {account.username}
                        </h1>
                        <p className="text-muted-foreground mt-1">Welcome back to your account</p>
                      </div>

                      <div className="flex gap-3">
                        <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2">
                              <Key className="w-4 h-4" />
                              Change Password
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Change Password</DialogTitle>
                              <DialogDescription>
                                Enter your current password and choose a new secure password.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <label htmlFor="current-password" className="text-sm font-medium">Current Password</label>
                                <Input
                                  id="current-password"
                                  type="password"
                                  value={passwordData.currentPassword}
                                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                  placeholder="Enter current password"
                                />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="new-password" className="text-sm font-medium">New Password</label>
                                <Input
                                  id="new-password"
                                  type="password"
                                  value={passwordData.newPassword}
                                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                  placeholder="Enter new password"
                                />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="confirm-password" className="text-sm font-medium">Confirm New Password</label>
                                <Input
                                  id="confirm-password"
                                  type="password"
                                  value={passwordData.confirmPassword}
                                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                  placeholder="Confirm new password"
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-3">
                              <Button variant="outline" onClick={() => setIsChangePasswordOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleChangePassword} disabled={isChangingPassword}>
                                {isChangingPassword ? 'Changing...' : 'Change Password'}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button variant="destructive" onClick={handleLogout} className="gap-2">
                          <LogOut className="w-4 h-4" />
                          Logout
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Details & Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Information */}
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Your account details and profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{account.username}</p>
                      <p className="text-xs text-muted-foreground">Your display name</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{account.email}</p>
                      <p className="text-xs text-muted-foreground">Your email address</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Account Role</p>
                      <p className="text-xs text-muted-foreground">Your account type</p>
                    </div>
                  </div>
                  <Badge variant={account.role === 'admin' ? 'default' : 'secondary'} className="mt-1">
                    {account.role}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{formatDate(account.created_at)}</p>
                      <p className="text-xs text-muted-foreground">Account creation date</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Manage your account preferences and security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email Verification</p>
                      <p className="text-xs text-muted-foreground">Secure your account</p>
                    </div>
                  </div>
                  <Badge variant={account.is_email_verified ? 'default' : 'destructive'}>
                    {account.is_email_verified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email notifications</p>
                      <p className="text-xs text-muted-foreground">Email preferences</p>
                    </div>
                  </div>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Push notifications</p>
                      <p className="text-xs text-muted-foreground">Mobile app alerts</p>
                    </div>
                  </div>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <Palette className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Theme</p>
                      <p className="text-xs text-muted-foreground">Customize appearance</p>
                    </div>
                  </div>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-6 shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Frequently used account management options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => router.push('/mygames')}>
                  <User className="w-6 h-6" />
                  <span>My Games</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => router.push('/favorites')}>
                  <span className="text-2xl">❤️</span>
                  <span>Favorites</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => setIsChangePasswordOpen(true)}>
                  <Key className="w-6 h-6" />
                  <span>Security</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}