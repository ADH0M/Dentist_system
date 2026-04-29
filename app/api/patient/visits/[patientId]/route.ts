import prisma from "@/lib/db/db-connection";
import { SimplePatientVisitType } from "@/type/types";

export async function GET(
  request: Request,
  { params }: RouteContext<"/api/patient/visits/[patientId]">,
) {
  const { patientId } = await params;
  const res = (await prisma.visit.findMany({
    where: { patientId, deletedAt: undefined },
    select: {
      id: true,
      createdAt: true,
      deletedAt: true,
      type: true,
      patientId: true,
      invoice: {
        select: {
          paidAmount: true,
          totalAmount: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })) as SimplePatientVisitType[];
  if (!res) {
    return Response.json({ error: "visit not found" }, { status: 404 });
  }

  return Response.json(res);
}
