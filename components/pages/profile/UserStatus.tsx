"use client";

import useNetworkStatus from "@/hooks/useNetworkStatus";
import { UAParser } from "ua-parser-js";

import { useCallback, useEffect } from "react";
import { toast } from "sonner";

const UserStatus = ({ userId }: { userId: string }) => {
  const { isOnline, wasOffline } = useNetworkStatus();
  const parser = new UAParser();
  const deviceInfo = parser.getResult();

  const handleUpdateUserState = useCallback(
    async (state: boolean) => {
      if (typeof window !== "undefined") {
        if (state) {
          const res = await fetch("/api/admin/users", {
            method: "post",
            body: JSON.stringify({ userId, state, deviceInfo }),
          });
          await res.json();
        }
      }
    },
    [userId, deviceInfo],
  );

  useEffect(() => {
    handleUpdateUserState(isOnline);
    if (!isOnline) {
      toast.warning("You are offline", { position: "bottom-left" });
    } else if (isOnline && wasOffline) {
      toast.success("You are online againe", { position: "bottom-left" });
    }

    return () => {
      handleUpdateUserState(false);
    };
  }, [isOnline, wasOffline, handleUpdateUserState]);

  useEffect(() => {
    const handleExit = () => {
      const data = JSON.stringify({
        userId,
        state: false,
        deviceInfo: deviceInfo,
      });

      navigator.sendBeacon("/api/admin/users", data);
    };

    window.addEventListener("beforeunload", handleExit);

    return () => {
      window.removeEventListener("beforeunload", handleExit);
    };
  }, [deviceInfo, userId]);
  return <></>;
};

export default UserStatus;
