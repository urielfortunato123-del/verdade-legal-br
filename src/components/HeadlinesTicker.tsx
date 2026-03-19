import { useEffect } from "react";
import { useNews } from "@/hooks/useNews";
import { useBreakingNewsAlert } from "@/hooks/useBreakingNewsAlert";
import { Flame, ExternalLink, Bell } from "lucide-react";
import { Button } from "./ui/button";

export function HeadlinesTicker() {
  const { data: news, isLoading } = useNews("geral");
  const { checkForBreakingNews, requestNotificationPermission } = useBreakingNewsAlert();

  // Check for new headlines whenever news updates
  useEffect(() => {
    if (news?.length) {
      checkForBreakingNews(news);
    }
  }, [news, checkForBreakingNews]);

  // Request notification permission on first interaction
  useEffect(() => {
    const handleClick = () => {
      requestNotificationPermission();
      document.removeEventListener("click", handleClick);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [requestNotificationPermission]);

  if (isLoading || !news?.length) return null;

  const headlines = news.slice(0, 10);

  return (
    <div className="w-full bg-gradient-to-r from-rose-600 via-red-600 to-orange-600 text-white overflow-hidden">
      <div className="container mx-auto px-4 flex items-center gap-3 h-10">
        {/* Label */}
        <div className="flex items-center gap-1.5 shrink-0 font-bold text-xs uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
          <Flame className="w-3.5 h-3.5" />
          <span>Agora</span>
        </div>

        {/* Scrolling ticker */}
        <div className="overflow-hidden flex-1 relative">
          <div className="animate-ticker flex whitespace-nowrap gap-8">
            {[...headlines, ...headlines].map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium hover:text-white/80 transition-colors shrink-0"
              >
                <span className="text-yellow-300 font-bold text-xs">{item.source}</span>
                <span>{item.title}</span>
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
            ))}
          </div>
        </div>

        {/* Notification bell */}
        <button
          onClick={() => requestNotificationPermission()}
          className="shrink-0 p-1.5 rounded-full hover:bg-white/20 transition-colors"
          title="Ativar notificações de breaking news"
        >
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
