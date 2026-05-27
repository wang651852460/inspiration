import { useNavigate } from "react-router-dom";
import { Inspiration } from "@/types";
import { Clock, Tag, Star } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InspirationCardProps {
  inspiration: Inspiration;
}

export default function InspirationCard({ inspiration }: InspirationCardProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderPriorityStars = (priority: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={12}
            className={cn(
              "fill-current",
              star <= priority ? "text-yellow-500" : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      onClick={() => navigate(`/detail/${inspiration.id}`)}
      className="group cursor-pointer relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
    >
      <div
        className="h-2 w-full"
        style={{ backgroundColor: inspiration.color }}
      />
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800 line-clamp-1 font-serif">
            {inspiration.title}
          </h3>
          {renderPriorityStars(inspiration.priority)}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {inspiration.content}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {inspiration.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
          {inspiration.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
              +{inspiration.tags.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center text-gray-400 text-xs">
          <Clock size={12} className="mr-1" />
          {formatDate(inspiration.createdAt)}
        </div>
      </div>
    </div>
  );
}
