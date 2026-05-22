import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = "https://api.freeapi.app/api/v1/public/youtube/videos";

interface Thumbnails {
  default: { url: string; width: number; height: number };
  medium: { url: string; width: number; height: number };
  high: { url: string; width: number; height: number };
  standard: { url: string; width: number; height: number };
  maxres: { url: string; width: number; height: number };
}

interface Snippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
  tags: string[];
  categoryId: string;
  liveBroadcastContent: string;
  localized: { title: string; description: string };
  defaultAudioLanguage: string;
}

interface ContentDetails {
  duration: string;
  dimension: string;
  definition: string;
  caption: string;
  licensedContent: boolean;
  contentRating: Record<string, unknown>;
  projection: string;
}

interface Statistics {
  viewCount: string;
  likeCount: string;
  favoriteCount: string;
  commentCount: string;
}

interface VideoItem {
  kind: string;
  items: {
    kind: string;
    id: string;
    snippet: Snippet;
    contentDetails: ContentDetails;
    statistics: Statistics;
  };
}

interface ApiResponse {
  statusCode: number;
  data: {
    page: number;
    limit: number;
    totalPages: number;
    previousPage: boolean;
    nextPage: boolean;
    totalItems: number;
    currentPageItems: number;
    data: VideoItem[];
  };
  message: string;
  success: boolean;
}

function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";

  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatViews(views: string): string {
  const num = parseInt(views);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return views;
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1)
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
  }
  return "Just now";
}

export default function YouTubeVideos() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchVideos = async (pageNum: number = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}?page=${pageNum}&limit=12`);
      if (!res.ok) throw new Error("Failed to fetch videos");
      const data: ApiResponse = await res.json();
      if (data.success && data.data?.data) {
        setVideos(data.data.data);
        setHasMore(data.data.nextPage);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen p-8">
      <nav className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center text-[#2d2d2d] no-underline font-medium px-4 py-2 border-2 border-[#2d2d2d] rounded-lg hover:bg-[#2d2d2d] hover:text-[#faf8f5] transition-all"
        >
          ← Back to Projects
        </Link>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-[#2d2d2d]">
          YouTube Videos
        </h1>
        <p className="text-[#6b6b6b] mt-1">Browse latest videos</p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg text-red-700">
          {error}
          <button onClick={() => fetchVideos(page)} className="ml-2 underline">
            Retry
          </button>
        </div>
      )}

      {loading && videos.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="text-[#6b6b6b]">Loading videos...</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => {
              const { snippet, contentDetails, statistics } = video.items;
              return (
                <div key={video.items.id} className="group cursor-pointer">
                  <div className="relative aspect-video bg-gray-200 rounded-xl overflow-hidden mb-3">
                    <img
                      src={
                        snippet.thumbnails.high?.url ||
                        snippet.thumbnails.medium.url
                      }
                      alt={snippet.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                      {formatDuration(contentDetails.duration)}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-9 h-9 rounded-full bg-[#e8d5c4] flex items-center justify-center text-sm font-medium text-[#2d2d2d]">
                        {snippet.channelTitle.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[#2d2d2d] font-medium text-sm line-clamp-2 group-hover:text-[#1a1a1a]">
                        {snippet.title}
                      </h3>
                      <p className="text-[#6b6b6b] text-sm mt-1">
                        {snippet.channelTitle}
                      </p>
                      <p className="text-[#6b6b6b] text-sm">
                        {formatViews(statistics.viewCount)} views •{" "}
                        {timeAgo(snippet.publishedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => {
                  setPage((p) => p + 1);
                  fetchVideos(page + 1);
                }}
                disabled={loading}
                className="px-6 py-2 bg-[#2d2d2d] text-[#faf8f5] rounded-lg font-medium hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
