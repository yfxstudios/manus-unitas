"use client";

import { getCurrentUser, updateUser } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { BellRing, CalendarPlus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const notificationCategories = [
  {
    name: "New Events",
    eventName: "newEvents",
    component: CalendarPlus,
  },
  {
    name: "Reminders",
    eventName: "reminders",
    component: BellRing,
  },
];

const Notifications = () => {
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState(false);
  const [notifications, setNotifications] = useState({});
  const originalNotifications = useRef({});

  const { toast } = useToast()

  useEffect(() => {
    getCurrentUser().then(user => {
      setNotifications(user.notifications);
      originalNotifications.current = user.notifications;
      setLoading(false);
    });
  }, []);

  const onSave = async () => {
    setLoading(true);
    await updateUser({ notifications });
    setLoading(false);

    originalNotifications.current = notifications;
    setUpdated(true);

    toast({
      title: "Notifications updated",
      description: "Your notification preferences have been updated.",
    })
  };

  useEffect(() => {
    setUpdated(
      JSON.stringify(notifications) === JSON.stringify(originalNotifications.current)
    );
  }, [notifications]);

  return (
    <div className="flex flex-col items-center">
      <Toaster />
      <div className="flex flex-col gap-4 px-4 xs:px-16 max-w-xl w-full py-8">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        {notificationCategories.map(category => (
          <div
            key={category.eventName}
            className="flex items-center justify-between space-x-4 p-4 rounded-lg"
          >
            <div className="flex items-center">
              <category.component className="h-8 w-8 hidden xs:flex" />
              <h2 className="text-lg font-semibold ml-4">{category.name}</h2>
            </div>
            <Switch
              disabled={loading}
              checked={notifications[category.eventName]}
              onCheckedChange={checked =>
                setNotifications({
                  ...notifications,
                  [category.eventName]: checked,
                })
              }
            />
          </div>
        ))}
        <Button
          className="w-full"
          onClick={onSave}
          disabled={loading || updated}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default Notifications;
