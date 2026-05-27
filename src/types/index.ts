export interface Inspiration {
  id: string;
  title: string;
  content: string;
  tags: string[];
  priority: 1 | 2 | 3 | 4 | 5;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export const COLORS = [
  "#FF6B35",
  "#F7C59F",
  "#2EC4B6",
  "#9B5DE5",
  "#00BBF9",
  "#FFD166",
  "#06D6A0",
  "#EF476F",
];
