import { JsonValue } from "@/generated/prisma/runtime/library";
import prisma from "../db/db-connection";

export interface UserStatus {
  userId: string;
  isOnline: boolean;
  lastLogin: Date | null;
  deviceInfo?: JsonValue;
  networkType?: JsonValue;
}

// Update user online status in database
export async function updateUserStatus(
  userId: string,
  isOnline: boolean,
  deviceInfo: JsonValue,
): Promise<UserStatus> {
  try {
    const status: UserStatus = {
      userId,
      isOnline,
      lastLogin: new Date(),
      deviceInfo,
    };

    
    await prisma.user.update({
      where: { id: userId },
      data: { isOnline, lastLogin: new Date(), deviceInfo },
    });

    return status;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
}

// Get user status from database
export async function getUserStatus(
  userId: string,
): Promise<UserStatus | null> {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) return null;

    return {
      userId: user.id,
      isOnline: user.isOnline || false,
      lastLogin: user.lastLogin || new Date(),
      deviceInfo: user.deviceInfo,
      networkType: user.networkInfo,
    };
  } catch (error) {
    console.error("Error getting user status:", error);
    return null;
  }
}

// Get all online users
export async function getOnlineUsers(): Promise<UserStatus[]> {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);

    const users = await prisma.user.findMany({
      where: {
        lastLogin: { gte: fiveMinutesAgo },
        isOnline: true,
      },
    });

    return users.map((user) => ({
      userId: user.id,
      isOnline: user.isOnline,
      lastLogin: user.lastLogin,
      deviceInfo: user.deviceInfo,
    }));
  } catch (error) {
    console.error("Error getting online users:", error);
    return [];
  }
}
