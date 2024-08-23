"use client";

import React, { useEffect } from "react";
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

const NotificationProvider = () => {
  const token = useSelector(selectToken);
  const notifications = useSelector(selectNotifications);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (token) {
      dispatch(fetchNotifications(token));
    }
  }, [token, dispatch]);

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      notifications.forEach((notification: AppNotification) => {
        if (!notification.leido) {
          toast.info(notification.mensaje, {
            onClose: () => {
              if (token) {
                dispatch(
                  markNotificationAsRead({ id: notification.id, token })
                );
              }
            },
          });

          // Notificación del navegador
          if (Notification.permission === "granted") {
            new Notification("Nueva notificación", {
              body: notification.mensaje,
            });
          }
        }
      });
    }
  }, [notifications, dispatch, token]);

  // Solicita permisos de notificación del navegador al montar el componente
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
