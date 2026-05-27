import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useInspirationStore } from "@/store/useInspirationStore";
import InspirationCard from "@/components/InspirationCard";
import { Plus, Search, Filter, Sparkles } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const { inspirations, searchInspirations, getAllTags } = useInspirationStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const allTags = getAllTags();

  const filteredInspirations = useMemo(() => {
    let result = inspirations;
    
    if (searchQuery) {
      result = searchInspirations(searchQuery);
    }
    
    if (selectedTags.length > 0) {
      result = result.filter((insp) =>
        selectedTags.some((tag) => insp.tags.includes(tag))
      );
    }
    
    return result;
  }, [inspirations, searchQuery, selectedTags, searchInspirations]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 font-serif flex items-center gap-3">
              <Sparkles className="text-orange-500" />
              灵感花园
            </h1>
            <p className="text-gray-500 mt-2">
              记录每一个闪耀的想法
            </p>
          </div>
          
          <button
            onClick={() => navigate("/create")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-amber-600 transition-all transform hover:-translate-y-0.5"
          >
            <Plus size={20} />
            捕捉灵感
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="搜索灵感..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
              />
            </div>
            
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <Filter size={20} className="text-gray-400" />
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      selectedTags.includes(tag)
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {filteredInspirations.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-100 rounded-full mb-6">
              <Sparkles size={48} className="text-orange-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              {searchQuery || selectedTags.length > 0
                ? "没有找到匹配的灵感"
                : "还没有灵感"}
            </h2>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedTags.length > 0
                ? "试试其他关键词或标签"
                : "点击上方按钮开始记录你的第一个灵感"}
            </p>
            {searchQuery || selectedTags.length > 0 ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTags([]);
                }}
                className="px-6 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
              >
                清除筛选
              </button>
            ) : (
              <button
                onClick={() => navigate("/create")}
                className="px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
              >
                开始记录
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInspirations.map((inspiration) => (
              <InspirationCard key={inspiration.id} inspiration={inspiration} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
