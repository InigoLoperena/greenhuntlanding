import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { Trophy, Medal } from "lucide-react";

interface LeaderboardEntry {
  nickname: string;
  stores_count: number;
  total_earned: number;
}

export function AmbassadorLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const { t } = useLanguage();

  const displayedLeaderboard = showAll ? leaderboard : leaderboard.slice(0, 20);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('ambassador_leaderboard')
        .select('*');

      if (error) throw error;
      setLeaderboard(data || []);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (index === 2) return <Medal className="h-6 w-6 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>;
  };

  if (loading) {
    return (
      <Card className="bg-black/50 border-primary/20">
        <CardContent className="p-8 text-center">
          <p className="text-subtitle-styled font-sedgwick-ave text-xl">{t('ambassador.loading')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/50 border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl font-permanent-marker" style={{ color: '#699e4b' }}>
          {t('ambassador.leaderboard')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {leaderboard.length === 0 ? (
          <p className="text-center text-subtitle-styled font-sedgwick-ave text-xl py-8">
            {t('ambassador.leaderboard.empty')}
          </p>
        ) : (
          <>
            <div className="space-y-4">
              {displayedLeaderboard.map((entry, index) => (
                <div
                  key={entry.nickname}
                  className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-primary/10 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 flex justify-center">
                      {getRankIcon(index)}
                    </div>
                    <div>
                      <p className="font-permanent-marker text-lg" style={{ color: '#699e4b' }}>
                        {entry.nickname}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6 text-right">
                    <div>
                      <p className="text-subtitle-styled font-sedgwick-ave text-sm">
                        {t('ambassador.leaderboard.stores')}
                      </p>
                      <p className="text-lg font-permanent-marker text-accent">
                        {entry.stores_count}
                      </p>
                    </div>
                    <div>
                      <p className="text-subtitle-styled font-sedgwick-ave text-sm">
                        {t('ambassador.leaderboard.earned')}
                      </p>
                      <p className="text-lg font-permanent-marker text-accent">
                        ${Number(entry.total_earned).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {leaderboard.length > 20 && !showAll && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAll(true)}
                  className="text-accent hover:text-accent/80 font-permanent-marker text-lg underline transition-colors"
                >
                  See more
                </button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}