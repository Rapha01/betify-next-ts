import { ProtectedRoute } from '@/components/protected-route';

export default function Profile() {
  return (
    <ProtectedRoute>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="bg-muted/50 min-h-[30vh] rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">User Profile</h2>
            <p className="text-muted-foreground">Manage your account settings</p>
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