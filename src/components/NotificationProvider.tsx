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
  Notification as AppNotification, // Renombrado para evitar conflicto
} from "@/store/notificationSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const socket = io("http://localhost:3000"); // Ajusta la URL si es necesario

const NotificationProvider = () => {
  const token = useSelector(selectToken) || ""; // Asegura que token siempre sea un string
  const notifications = useSelector(selectNotifications);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    socket.on("nueva-notificacion", (data) => {
      toast.info(data.mensaje, {
        autoClose: 5000,
        position: "top-right",
        closeOnClick: true,
      });

      if (Notification.permission === "granted") {
        new Notification("Nueva notificación", {
          body: data.mensaje,
        });
      }
    });

    return () => {
      socket.off("nueva-notificacion");
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
