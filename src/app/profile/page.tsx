'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageBox } from '@/components/ui/message-box';
import { useAuth } from '@/contexts/auth-context';
import { accountAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut, User, Mail, Shield, Calendar, Key, Settings, Bell, Palette, Smartphone } from 'lucide-react';

export default function Profile() {
  const { logout, account, refreshAccount } = useAuth();
  const router = useRouter();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  const [isChangeAvatarOpen, setIsChangeAvatarOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isChangingAvatar, setIsChangingAvatar] = useState(false);

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
    if (!passwordData.currentPassword.trim()) {
      setPasswordMessage({ text: 'Current password is required', type: 'error' });
      return;
    }

    if (!passwordData.newPassword.trim()) {
      setPasswordMessage({ text: 'New password cannot be empty', type: 'error' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ text: 'New password must be at least 6 characters long', type: 'error' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ text: 'New passwords do not match', type: 'error' });
      return;
    }

    if (!account) return;

    setIsChangingPassword(true);
    setPasswordMessage(null);
    try {
      await accountAPI.updateAccount(account.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordMessage({ text: 'Password changed successfully!', type: 'success' });
      // Wait a moment to show success message, then close
      setTimeout(() => {
        setIsChangePasswordOpen(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordMessage(null);
      }, 1500);
    } catch (error: any) {
      console.error('Failed to change password:', error);
      const errorMessage = error?.message || 'Failed to change password. Please try again.';
      setPasswordMessage({ text: errorMessage, type: 'error' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleChangeAvatar = async () => {
    if (!avatarUrl.trim()) {
      return;
    }

    if (!account) return;

    setIsChangingAvatar(true);
    try {
      await accountAPI.updateAccount(account.id, { avatar_url: avatarUrl });
      await refreshAccount(); // Refresh the account data to get the updated avatar
      setIsChangeAvatarOpen(false);
      setAvatarUrl('');
    } catch (error) {
      console.error('Failed to change avatar:', error);
      alert('Failed to change avatar. Please try again.');
    } finally {
      setIsChangingAvatar(false);
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
      <div>
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          {/* Profile Header */}
          <div className="relative mb-4">
            <Card className="relative">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <Dialog open={isChangeAvatarOpen} onOpenChange={setIsChangeAvatarOpen}>
                    <DialogTrigger asChild>
                      <div className="relative cursor-pointer group">
                        <Avatar className="w-24 h-24 ring-4 ring-primary/20 shadow-xl transition-transform group-hover:scale-105">
                          <AvatarImage src={account.avatar_url} alt={account.username} />
                          <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-secondary text-white">
                            {account.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Avatar</DialogTitle>
                        <DialogDescription>
                          Enter the URL of your profile picture. You can use image hosting services like Imgur or Unsplash.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label htmlFor="avatar-url" className="text-sm font-medium">Image URL</label>
                          <Input
                            id="avatar-url"
                            type="url"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            placeholder="https://i.imgur.com/example.jpg"
                          />
                          <p className="text-xs text-muted-foreground">
                            Upload your image to Imgur, Unsplash, or any image hosting service and paste the direct link here.
                          </p>
                        </div>
                        {avatarUrl && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Preview</label>
                            <div className="flex justify-center p-4 bg-transparent rounded-lg">
                              <Avatar className="w-24 h-24 ring-4 ring-primary/20">
                                <AvatarImage src={avatarUrl} alt="Preview" />
                                <AvatarFallback>Preview</AvatarFallback>
                              </Avatar>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsChangeAvatarOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleChangeAvatar} disabled={isChangingAvatar}>
                          {isChangingAvatar ? 'Updating...' : 'Update Avatar'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          {account.username}
                        </h1>
                        <p className="text-muted-foreground mt-1">Welcome back to your account</p>
                      </div>

                      <div className="flex gap-3">
                        <Dialog open={isChangePasswordOpen} onOpenChange={(open) => {
                          setIsChangePasswordOpen(open);
                          if (!open) {
                            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                            setPasswordMessage(null);
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button className="gap-2 bg-primary text-primary-foreground border-primary hover:bg-primary/90 shadow-xs">
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
                                  onChange={(e) => {
                                    setPasswordData(prev => ({ ...prev, newPassword: e.target.value }));
                                    setPasswordMessage(null);
                                  }}
                                  placeholder="Enter new password"
                                />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="confirm-password" className="text-sm font-medium">Confirm New Password</label>
                                <Input
                                  id="confirm-password"
                                  type="password"
                                  value={passwordData.confirmPassword}
                                  onChange={(e) => {
                                    setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }));
                                    setPasswordMessage(null);
                                  }}
                                  placeholder="Confirm new password"
                                />
                              </div>
                              {passwordMessage && (
                                <MessageBox 
                                  message={passwordMessage.text} 
                                  type={passwordMessage.type}
                                />
                              )}
                            </div>
                            <div className="flex justify-end gap-3">
                              <Button variant="outline" onClick={() => setIsChangePasswordOpen(false)}>
                                Cancel
                              </Button>
                              <Button 
                                onClick={handleChangePassword} 
                                disabled={isChangingPassword || !passwordData.currentPassword.trim() || passwordData.newPassword !== passwordData.confirmPassword || !passwordData.newPassword.trim() || !passwordData.confirmPassword.trim()}
                                className="bg-primary text-primary-foreground border-primary hover:bg-primary/90 shadow-xs"
                              >
                                {isChangingPassword ? 'Changing...' : 'Change Password'}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button variant="outline" onClick={handleLogout} className="gap-2">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Your account details and profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-0">
                <div className="flex items-center justify-between p-3 rounded-lg bg-transparent">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Username</p>
                      <p className="text-xs text-muted-foreground">Your display name</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="!bg-primary/10 !text-primary !border-primary/50">
                    {account.username}
                  </Badge>
                </div>
                <div className="border-b border-border"></div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-transparent">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-xs text-muted-foreground">Your email address</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="!bg-primary/10 !text-primary !border-primary/50">
                    {account.email}
                  </Badge>
                </div>
                <div className="border-b border-border"></div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-transparent">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Account Role</p>
                      <p className="text-xs text-muted-foreground">Your account type</p>
                    </div>
                  </div>
                  <Badge variant={account.role === 'admin' ? 'default' : 'secondary'} className={account.role === 'admin' ? '!bg-success/10 !text-success !border-success/50' : '!bg-primary/10 !text-primary !border-primary/50'}>
                    {account.role}
                  </Badge>
                </div>
                <div className="border-b border-border"></div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-transparent">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Member Since</p>
                      <p className="text-xs text-muted-foreground">Account creation date</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="!bg-primary/10 !text-primary !border-primary/50">
                    {formatDate(account.created_at)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Manage your account preferences and security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-0">
                <div className="flex items-center justify-between p-3 rounded-lg bg-transparent">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email Verification</p>
                      <p className="text-xs text-muted-foreground">Secure your account</p>
                    </div>
                  </div>
                  <Badge variant={account.is_email_verified ? 'default' : 'destructive'} className={account.is_email_verified ? '!bg-secondary/10 !text-secondary !border-secondary/50' : '!bg-error/10 !text-error !border-error/50'}>
                    {account.is_email_verified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>
                <div className="border-b border-border"></div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-transparent">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email notifications</p>
                      <p className="text-xs text-muted-foreground">Email preferences</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="!bg-warning/10 !text-warning !border-warning/50">Coming Soon</Badge>
                </div>
                <div className="border-b border-border"></div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-transparent">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Push notifications</p>
                      <p className="text-xs text-muted-foreground">Mobile app alerts</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="!bg-warning/10 !text-warning !border-warning/50">Coming Soon</Badge>
                </div>
                <div className="border-b border-border"></div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-transparent">
                  <div className="flex items-center gap-3">
                    <Palette className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Theme</p>
                      <p className="text-xs text-muted-foreground">Customize appearance</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="!bg-warning/10 !text-warning !border-warning/50">Coming Soon</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}