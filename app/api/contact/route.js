import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(req) {

  try {

    const body = await req.json();

    const {
      fullname,
      email,
      service,
      budget,
      timeframe,
      contract,
      details,
    } = body;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("project_requests")
      .insert([
        {
          user_id: user?.id,
          fullname,
          email,
          service,
          budget,
          timeframe,
          contract,
          details,
          status: "Pending",
        },
      ]);

    if (error) {

      console.log(error);

      return NextResponse.json({
        success: false,
        error,
      });

    }

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (err) {

    console.log(err);

    return NextResponse.json({
      success: false,
      error: err.message,
    });

  }

}