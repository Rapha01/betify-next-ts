export default function Home() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="bg-muted/50 min-h-[50vh] rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-6 flex items-center justify-center">
            <span className="text-4xl">🎮</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Welcome to Betify</h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-md">
            Your ultimate gaming platform for discovering, tracking, and managing your favorite games.
          </p>
          <div className="text-sm text-muted-foreground">
            Home page content coming soon...
          </div>
        </div>
      </div>

      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="bg-muted/50 aspect-square rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-xl">🎯</span>
            </div>
            <span className="text-muted-foreground font-medium">Game Library</span>
          </div>
        </div>
        <div className="bg-muted/50 aspect-square rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-xl">⭐</span>
            </div>
            <span className="text-muted-foreground font-medium">Favorites</span>
          </div>
        </div>
        <div className="bg-muted/50 aspect-square rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
            <span className="text-muted-foreground font-medium">Statistics</span>
          </div>
        </div>
      </div>
    </div>
  );
}
