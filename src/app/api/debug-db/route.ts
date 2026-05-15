import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const memories = await prisma.memory.findMany({
    select: { id: true, type: true, imageBase64: true, imageUrl: true, caption: true }
  });

  const summary = memories.map(m => ({
    id: m.id,
    type: m.type,
    caption: m.caption,
    hasBase64: !!m.imageBase64,
    imageUrl: m.imageUrl,
    base64Prefix: m.imageBase64 ? m.imageBase64.substring(0, 30) : null
  }));

  return NextResponse.json({ summary });
}
