import { useEffect } from "react";
import { useNews } from "@/hooks/useNews";
import { useBreakingNewsAlert } from "@/hooks/useBreakingNewsAlert";
import { ExternalLink, Bell } from "lucide-react";

export function HeadlinesTicker() {
  const { data: news, isLoading } = useNews("geral");
  const { checkForBreakingNews, requestNotificationPermission } = useBreakingNewsAlert();

  useEffect(() => {
    if (news?.length) {
      checkForBreakingNews(news);
    }
  }, [news, checkForBreakingNews]);

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
    <div className="w-full border-b border-border dark:border-border/50 bg-background dark:bg-background/40 dark:backdrop-blur-md overflow-hidden">
      <div className="container mx-auto px-4 flex items-center gap-3 h-9">
        {/* LIVE label */}
        <span className="label-live shrink-0">AO VIVO</span>

        {/* Scrolling ticker */}
        <div className="overflow-hidden flex-1 relative">
          <div className="animate-ticker flex whitespace-nowrap gap-8">
            {[...headlines, ...headlines].map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[13px] hover:underline transition-colors shrink-0"
              >
                <span className="font-semibold text-muted-foreground">{item.source}</span>
                <span className="text-foreground">{item.title}</span>
                <ExternalLink className="w-3 h-3 text-muted-foreground" />
              </a>
            ))}
          </div>
        </div>

        <button
          onClick={() => requestNotificationPermission()}
          className="shrink-0 p-1 rounded-sm hover:bg-muted transition-colors"
          title="Ativar notificações"
        >
          <Bell className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
