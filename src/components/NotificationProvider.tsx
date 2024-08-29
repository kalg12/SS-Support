"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { selectToken } from "@/store/authSlice";
import {
  fetchNotifications,
  selectNotifications,
  markNotificationAsRead,
} from "@/store/notificationSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotificationProvider = () => {
  const token = useSelector(selectToken) || ""; // Asegura que token siempre sea un string
  const notifications = useSelector(selectNotifications);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchAndNotify = async () => {
      if (token) {
        await dispatch(fetchNotifications(token));
        notifications.forEach((notification) => {
          if (!notification.leido) {
            toast.info(notification.mensaje, {
              autoClose: 5000,
              position: "top-right",
              closeOnClick: true,
            });

            if (Notification.permission === "granted") {
              new Notification("Nueva notificación", {
                body: notification.mensaje,
              });
            }

            dispatch(markNotificationAsRead({ id: notification.id, token }));
          }
        });
      }
    };

    // Polling every 30 seconds to check for new notifications
    const intervalId = setInterval(fetchAndNotify, 300000);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [token, dispatch, notifications]);

  return <ToastContainer />;
};

export default NotificationProvider;
