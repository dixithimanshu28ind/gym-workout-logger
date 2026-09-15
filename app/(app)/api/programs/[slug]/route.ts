import { NextResponse } from "next/server";

import { getCmsProgramDetail } from "@/lib/cmsPrograms";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getCmsProgramDetail(slug);
  if (!result) {
    return NextResponse.json({ error: "Program not found" }, { status: 404 });
  }
  return NextResponse.json(result);
}
