// src/components/NotificationProvider.tsx
"use client";

import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { selectToken } from "@/store/authSlice";
import {
  fetchNotifications,
  selectNotifications,
  markNotificationAsRead,
  Notification as AppNotification,
} from "@/store/notificationSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const socket = io(); // Conexión al servidor Socket.IO en la misma URL

const NotificationProvider = () => {
  const token = useSelector(selectToken);
  const notifications = useSelector(selectNotifications);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    socket.on("new-ticket", (data) => {
      toast.info(data.message, {
        autoClose: 5000,
        position: "top-right",
        closeOnClick: true,
      });

      if (Notification.permission === "granted") {
        new Notification("Nueva notificación", {
          body: data.message,
        });
      }
    });

    return () => {
      socket.off("new-ticket");
    };
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(fetchNotifications(token));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (notifications && notifications.length > 0 && token) {
      notifications.forEach((notification: AppNotification) => {
        if (!notification.leido) {
          dispatch(markNotificationAsRead({ id: notification.id, token }));
        }
      });
    }
  }, [notifications, dispatch, token]);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission !== "granted") {
          console.warn(
            "Las notificaciones del navegador están deshabilitadas."
          );
        }
      });
    }
  }, []);

  return <ToastContainer />;
};

export default NotificationProvider;
