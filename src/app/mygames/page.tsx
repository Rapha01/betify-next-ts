import { ProtectedRoute } from '@/components/protected-route';

export default function MyGames() {
  return (
    <ProtectedRoute>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
            <span className="text-muted-foreground">My Game 1</span>
          </div>
          <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
            <span className="text-muted-foreground">My Game 2</span>
          </div>
          <div className="bg-muted/50 aspect-video rounded-xl flex items-center justify-center">
            <span className="text-muted-foreground">My Game 3</span>
          </div>
        </div>
        <div className="bg-muted/50 min-h-[50vh] flex-1 rounded-xl flex items-center justify-center">
          <span className="text-muted-foreground text-lg">My Games</span>
        </div>
      </div>
    </ProtectedRoute>
  )
}