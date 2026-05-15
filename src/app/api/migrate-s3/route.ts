import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToS3 } from "@/lib/s3";

// Allow this route to run longer if there are many large images
export const maxDuration = 300; 

export async function GET() {
  try {
    // 1. Find all memories that still have the legacy base64 data
    const memories = await prisma.memory.findMany({
      where: {
        imageBase64: {
          not: null
        }
      }
    });

    if (memories.length === 0) {
      return NextResponse.json({ message: "No memories need migration. Your database is clean!" });
    }

    let successCount = 0;
    let errors = [];

    // 2. Process each memory sequentially to avoid overwhelming the database or S3
    for (const memory of memories) {
      try {
        if (memory.imageBase64 && memory.imageBase64.startsWith("data:")) {
          // Format is usually: "data:image/png;base64,iVBORw0KGgoAAA..."
          const parts = memory.imageBase64.split(",");
          if (parts.length === 2) {
            const mimeType = parts[0].split(":")[1].split(";")[0];
            const base64Data = parts[1];
            
            // Convert Base64 back to raw binary Buffer
            const buffer = Buffer.from(base64Data, "base64");
            
            // Construct a filename
            const ext = mimeType.split("/")[1] || "bin";
            const filename = `legacy-migration-${memory.id}.${ext}`;

            // 3. Upload to S3
            const imageUrl = await uploadToS3(buffer, filename, mimeType);

            // 4. Update the memory to point to the S3 URL and DELETE the base64 string
            await prisma.memory.update({
              where: { id: memory.id },
              data: {
                imageUrl,
                imageBase64: null // Delete the huge payload from DB
              }
            });

            successCount++;
          }
        }
      } catch (err: any) {
        console.error(`Failed to migrate memory ${memory.id}:`, err);
        errors.push({ id: memory.id, error: err.message });
      }
    }

    return NextResponse.json({ 
      message: `Migration complete. Successfully migrated ${successCount} items to S3 and freed up database space.`, 
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
