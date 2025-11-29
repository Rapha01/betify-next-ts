'use client'

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/contexts/auth-context';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { GameCard, type Game } from '@/components/game/game-card';
import { gameAPI } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function Favorites() {
  const { account } = useAuth();
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
      const response = await gameAPI.getFavoriteGamesByAccountId(account.id, page, gamesPerPage);
      setGames(response.data || []);
      setTotalGames(response.total || 0);
      setTotalPages(Math.ceil((response.total || 0) / gamesPerPage));
      setCurrentPage(page);
    } catch (err: any) {
      console.error('Failed to fetch favorite games:', err);
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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchGames(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
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
              <p className="text-lg font-medium mb-2">No favorite games yet</p>
              <p className="text-sm">Games you favorite will appear here</p>
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