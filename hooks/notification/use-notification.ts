// hooks/notification/use-notifications.ts
import { useMemo } from "react";

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  image: string;
  createdAt: Date;
  read: boolean;
};

export function useNotifications() {
  const notifications: AppNotification[] = [
    {
      id: "1",
      title: "Vitamins and minerals",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      image: "https://via.placeholder.com/60",
      createdAt: new Date(),
      read: false,
    },
    {
      id: "2",
      title: "Important vegetables?",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      image: "https://via.placeholder.com/60",
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
    },
    {
      id: "3",
      title: "Nugget Chicken fingers",
      body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      image: "https://via.placeholder.com/60",
      createdAt: new Date(Date.now() - 1000 * 60 * 60),
      read: true,
    },
  ];

  const grouped = useMemo(() => {
    const today: AppNotification[] = [];
    const yesterday: AppNotification[] = [];

    notifications.forEach((n) => {
      const diff =
        (Date.now() - n.createdAt.getTime()) / (1000 * 60 * 60);

      diff < 24 ? today.push(n) : yesterday.push(n);
    });

    return { today, yesterday };
  }, []);

  return grouped;
}
