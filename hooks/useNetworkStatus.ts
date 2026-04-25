// hooks/useNetworkStatus.ts
"use client";

import { useState, useEffect } from "react";

interface NetworkStatus {
  isOnline: boolean;
  wasOffline: boolean;
}

const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: true,
    wasOffline: false,
  });

  useEffect(() => {
    const handleOnline = () => {
      console.log("Network connected");
      setNetworkStatus((prev) => ({
        ...prev,
        isOnline: true,
        wasOffline: prev.wasOffline || !prev.isOnline,
      }));
    };

    const handleOffline = () => {
      console.log("Network disconnected");
      setNetworkStatus((prev) => ({
        ...prev,
        isOnline: false,
        wasOffline: true,
      }));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { ...networkStatus };
};

export default useNetworkStatus;
