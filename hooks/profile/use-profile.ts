import { useCallback, useState } from "react";
import { router } from "expo-router";

export function useProfile() {
  const [activeTab, setActiveTab] = useState<"post" | "videos" | "bookmark">(
    "post"
  );

  const user = {
    name: "Braxton Stark",
    email: "braxtonstark@gmail.com",
    avatar: "https://i.pravatar.cc/150",
    cover:
      "https://images.unsplash.com/photo-1520975916090-3105956dac38",
    stats: {
      posts: 160,
      following: 289,
      followers: 2019,
      rating: 4.7,
      reviews: 12,
    },
  };

  const posts = [
    { id: "1", image: "https://source.unsplash.com/400x400/?food" },
    { id: "2", image: "https://source.unsplash.com/400x401/?meal" },
    { id: "3", image: "https://source.unsplash.com/400x402/?dish" },
    { id: "4", image: "https://source.unsplash.com/400x403/?restaurant" },
  ];

  const goBack = useCallback(() => {
    router.back();
  }, []);

  const changeTab = useCallback(
    (tab: "post" | "videos" | "bookmark") => {
      setActiveTab(tab);
    },
    []
  );

  return {
    user,
    posts,
    activeTab,
    goBack,
    changeTab,
  };
}
