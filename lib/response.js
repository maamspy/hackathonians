import { NextResponse } from "next/server";

export function success(data, { meta, status = 200 } = {}) {
  return NextResponse.json(
    { success: true, data, ...(meta ?? {}) },
    { status },
  );
}

export function error(message, { status = 400, details } = {}) {
  return NextResponse.json(
    {
      success: false,
      error: { message, ...(details ? { details } : {}) },
    },
    { status },
  );
}
