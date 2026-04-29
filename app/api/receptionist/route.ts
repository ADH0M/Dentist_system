import prisma from "@/lib/db/db-connection";
import { SearchWithPhone } from "@/lib/validations/schema";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const validation = SearchWithPhone.safeParse(body.phone);

    if (!validation.success) {
      return Response.json({
        success: false,
        error: validation.error.issues[0].message,
        state: 400,
      });
    }

    const usersPhones = await prisma.user.findMany({
      where: { phone: { startsWith: body.phone } },
      select: {
        id: true,
        gender: true,
        phone: true,
        username: true,
        patient: {
          select: { id: true },
        },
      },
    });

    const data = usersPhones.map((user)=>({
      userId:user.id,
      patientId:user.patient?.id,
      username:user.username,
      gender:user.gender,
      phone:user.phone
    }));
    
    return Response.json({
      success: true,
      data: { data },
    });
  } catch (error) {
    console.log(error);

    return Response.json({
      success: false,
      error: "Internal server error",
      state: 500,
    });
  }
};
