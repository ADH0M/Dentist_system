import prisma from "@/lib/db/db-connection";
import { NextRequest } from "next/server";

export const GET = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      isActive: true,
      role: true,
      photo: true,
    },
  });
  return new Response(JSON.stringify(users));
};

export const POST = async (req: NextRequest) => {
  try {
    const { userId, state, deviceInfo } = await req.json();


    await prisma.user.update({
      where: { id: userId },
      data: { isOnline: state === true, lastLogin: new Date(), deviceInfo },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.log(error);
    return Response.json({ success: false });
  }
};
