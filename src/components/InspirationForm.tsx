import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInspirationStore } from "@/store/useInspirationStore";
import { Inspiration, COLORS } from "@/types";
import { X, Plus, Check, Trash2, Star } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function InspirationForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addInspiration, updateInspiration, getInspirationById, inspirations } = useInspirationStore();
  
  const isEdit = !!id;
  const existingInspiration = id ? getInspirationById(id) : null;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [priority, setPriority] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    if (existingInspiration) {
      setTitle(existingInspiration.title);
      setContent(existingInspiration.content);
      setTags(existingInspiration.tags);
      setPriority(existingInspiration.priority);
      setColor(existingInspiration.color);
    }
  }, [existingInspiration]);

  const handleAddTag = () => {
    const trimmed = tagsInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagsInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEdit && id) {
      updateInspiration(id, {
        title,
        content,
        tags,
        priority,
        color,
      });
    } else {
      addInspiration({
        title,
        content,
        tags,
        priority,
        color,
      });
    }
    
    navigate("/");
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
          <h1 className="text-3xl font-bold text-gray-800 font-serif">
            {isEdit ? "编辑灵感" : "捕捉灵感"}
          </h1>
          <div className="w-20"></div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="h-3 w-full" style={{ backgroundColor: color }} />
          
          <div className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标题
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="给你的灵感起个名字..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all text-lg font-serif"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                内容
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="记录你的想法..."
                rows={8}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                标签
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-orange-900"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="添加标签，按回车确认"
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                优先级
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p as any)}
                    className={cn(
                      "p-2 rounded-xl transition-all",
                      priority >= p
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    )}
                  >
                    <Star size={24} className={priority >= p ? "fill-current" : ""} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                颜色
              </label>
              <div className="flex gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      "w-10 h-10 rounded-full transition-transform hover:scale-110",
                      color === c && "ring-4 ring-offset-2 ring-gray-300"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                <Check size={20} className="inline mr-2" />
                保存
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
