import { getTodayVisits } from "@/lib/actions/visit-action";

export const GET = async () => {
  try {
    const data = await getTodayVisits();
    if (!data.success && data.error) {
      Response.json({
        success: false,
        error: data.error,
        state: 500,
      });
    }

    return Response.json({
      ...data,
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
