'use client'

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { GameCard, type Game } from '@/components/game-card';
import { gameAPI } from '@/lib/api';
import { Plus, Loader2 } from 'lucide-react';

export default function MyGames() {
  const { account } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [gameName, setGameName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Games state
  const [games, setGames] = useState<Game[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalGames, setTotalGames] = useState(0);
  const gamesPerPage = 9;

  const fetchGames = async (page: number = 1) => {
    if (!account?.id) return;
    
    setIsLoadingGames(true);
    try {
      const response = await gameAPI.getGamesByAccountId(account.id, page, gamesPerPage);
      setGames(response.data || []);
      setTotalGames(response.total || 0);
      setTotalPages(Math.ceil((response.total || 0) / gamesPerPage));
      setCurrentPage(page);
    } catch (err: any) {
      console.error('Failed to fetch games:', err);
      setGames([]);
    } finally {
      setIsLoadingGames(false);
    }
  };

  useEffect(() => {
    if (account?.id) {
      fetchGames(1);
    }
  }, [account]);

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameName.trim()) return;

    setError('');
    setIsLoading(true);

    try {
      await gameAPI.createGame(gameName.trim(), '', ''); // genre and releaseDate can be empty for now
      setGameName('');
      setIsDialogOpen(false);
      // Refresh the games list
      await fetchGames(1);
    } catch (err: any) {
      setError(err.message || 'Failed to create game');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchGames(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  return (
    <ProtectedRoute>
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Create Button */}
        <div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="w-4 h-4" />
                New Game
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="sr-only">
                <DialogTitle>Create New Game</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateGame} className="space-y-4">
                <div>
                  <Input
                    id="gameName"
                    type="text"
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    placeholder="Enter game name"
                    required
                    disabled={isLoading}
                  />
                </div>
                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading || !gameName.trim()}>
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Creating...
                    </>
                  ) : (
                    'Create Game'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Loading State */}
        {isLoadingGames ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-muted/50 aspect-[4/3] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : games.length === 0 ? (
          /* Empty State */
          <div className="bg-muted/50 min-h-[50vh] flex-1 rounded-xl flex flex-col items-center justify-center gap-4 p-8">
            <div className="text-muted-foreground text-center">
              <p className="text-lg font-medium mb-2">No games yet</p>
              <p className="text-sm">Create your first game to get started</p>
            </div>
          </div>
        ) : (
          <>
            {/* Games Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    // Show first page, last page, current page, and pages around current
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    if (!showPage) {
                      // Show ellipsis only once between gaps
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    }

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </ProtectedRoute>
  )
}