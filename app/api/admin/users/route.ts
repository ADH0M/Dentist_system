import prisma from "@/lib/db/db-connection";

export  const GET = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            email: true,
            phone: true,
            isActive: true,
            type: true,
            photo: true,
        },
    });
    return new Response(JSON.stringify(users));
};