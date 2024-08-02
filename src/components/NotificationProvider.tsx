// src/components/NotificationProvider.tsx
"use client";
import React, { useEffect } from "react";

const NotificationProvider = () => {
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (Notification.permission === "granted") {
      new Notification(title, options);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications/list");
        const data = await response.json();

        if (data.success) {
          data.notifications.forEach((notification: any) => {
            showNotification("Nueva notificación", {
              body: notification.mensaje,
            });
          });
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default NotificationProvider;
