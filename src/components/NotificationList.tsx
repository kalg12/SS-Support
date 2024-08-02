// src/components/NotificationList.tsx
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Notification {
  id: number;
  usuario_id: number;
  mensaje: string;
  leido: boolean;
  fecha_creacion: string;
}

const NotificationList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications/list");
        const data = await response.json();

        if (data.success) {
          setNotifications(data.notifications);
        } else {
          Swal.fire("Error", data.message, "error");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        Swal.fire(
          "Error",
          "An error occurred while fetching notifications",
          "error"
        );
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notifications-list">
      {notifications.map((notification) => (
        <div key={notification.id} className="notification-item">
          <p>{notification.mensaje}</p>
          <span>{new Date(notification.fecha_creacion).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
