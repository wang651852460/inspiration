import { useParams, useNavigate } from "react-router-dom";
import { useInspirationStore } from "@/store/useInspirationStore";
import { useSupabaseSync } from "@/hooks/useSupabaseSync";
import { X, Edit, Trash2, Tag, Star, Clock, Pencil } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInspirationById } = useInspirationStore();
  const { syncDeleteInspiration, isLoading } = useSupabaseSync();
  
  const inspiration = id ? getInspirationById(id) : null;
  const hasDrawing = inspiration && !!(inspiration as any).drawing;

  if (!inspiration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">灵感不存在</h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderPriorityStars = (priority: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={cn(
              "fill-current",
              star <= priority ? "text-yellow-500" : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  const handleDelete = async () => {
    if (confirm("确定要删除这个灵感吗？")) {
      try {
        await syncDeleteInspiration(inspiration.id);
        navigate("/");
      } catch (error) {
        console.error("Failed to delete inspiration:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X size={20} />
            <span>返回</span>
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/edit/${inspiration.id}`)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
            >
              <Edit size={20} />
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div
            className="h-4 w-full"
            style={{ backgroundColor: inspiration.color }}
          />
          
          <div className="p-8 md:p-12">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-800 mb-4 font-serif">
                {inspiration.title}
              </h1>
              <div className="flex flex-wrap gap-4 items-center">
                {renderPriorityStars(inspiration.priority)}
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Clock size={16} />
                  创建于 {formatDate(inspiration.createdAt)}
                </div>
              </div>
            </div>

            {hasDrawing && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Pencil size={18} className="text-orange-500" />
                  <span className="text-sm font-medium text-gray-700">绘画内容</span>
                </div>
                <img
                  src={(inspiration as any).drawing}
                  alt="Drawing"
                  className="w-full rounded-xl shadow-md"
                />
              </div>
            )}

            {inspiration.content && (
              <div className="mb-8">
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                  {inspiration.content}
                </p>
              </div>
            )}

            {inspiration.tags.length > 0 && (
              <div className="border-t border-gray-100 pt-6">
                <div className="flex flex-wrap gap-2">
                  {inspiration.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm"
                    >
                      <Tag size={14} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {inspiration.updatedAt !== inspiration.createdAt && (
              <div className="mt-6 pt-4 border-t border-gray-100 text-gray-400 text-sm">
                最后更新于 {formatDate(inspiration.updatedAt)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
