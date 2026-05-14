"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMemories() {
  try {
    const memories = await prisma.memory.findMany({
      orderBy: { createdAt: "asc" }
    });
    return memories;
  } catch (error) {
    console.error("Failed to fetch memories:", error);
    return [];
  }
}

export async function updateMemoryPosition(id: string, x: number, y: number) {
  try {
    await prisma.memory.update({
      where: { id },
      data: { posX: x, posY: y }
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Failed to update position:", error);
    return { success: false, error: "Failed to update" };
  }
}

export async function deleteMemory(id: string) {
  try {
    await prisma.memory.delete({
      where: { id }
    });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete memory:", error);
    return { success: false, error: "Failed to delete" };
  }
}

export async function addMemory(formData: FormData) {
  try {
    const type = formData.get("type") as string;
    const caption = formData.get("caption") as string;
    const date = formData.get("date") as string;
    const location = formData.get("location") as string;
    const content = formData.get("content") as string;
    const songTitle = formData.get("songTitle") as string;
    const songArtist = formData.get("songArtist") as string;
    const songSpotifyId = formData.get("songSpotifyId") as string;

    if (type === "vinyl_song") {
      const audioFiles = formData.getAll("audioFiles") as File[];
      if (audioFiles && audioFiles.length > 0) {
        for (const file of audioFiles) {
          if (file.size > 0) {
            const buffer = await file.arrayBuffer();
            const base64Data = Buffer.from(buffer).toString("base64");
            const imageBase64 = `data:${file.type};base64,${base64Data}`;
            // Use filename as initial title, strip extension
            const title = file.name.replace(/\.[^/.]+$/, "");
            
            await prisma.memory.create({
              data: {
                type: "vinyl_song",
                caption: title,
                imageBase64,
                posX: 0,
                posY: 0,
                rotation: 0
              }
            });
          }
        }
        revalidatePath("/");
        revalidatePath("/admin");
        return { success: true };
      }
    }
    
    // Handle image if provided
    let imageBase64 = null;
    const imageFile = formData.get("image") as File;
    if (imageFile && imageFile.size > 0) {
      const buffer = await imageFile.arrayBuffer();
      const base64Data = Buffer.from(buffer).toString("base64");
      // Prepend the mime type so it can be used directly in an img src
      imageBase64 = `data:${imageFile.type};base64,${base64Data}`;
    }

    // Spawn perfectly at top-left of initial viewport to ensure it is immediately visible
    const posX = 600;
    const posY = 300;
    const rotation = (Math.random() - 0.5) * 15; // -7.5 to 7.5 degrees

    await prisma.memory.create({
      data: {
        type: type || "photo",
        caption,
        date,
        location,
        content,
        songTitle,
        songArtist,
        songSpotifyId,
        imageBase64,
        posX,
        posY,
        rotation
      }
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to add memory:", error);
    return { success: false, error: "Failed to add memory" };
  }
}

export async function editMemory(id: string, formData: FormData) {
  try {
    const type = formData.get("type") as string;
    const caption = formData.get("caption") as string;
    const date = formData.get("date") as string;
    const location = formData.get("location") as string;
    const content = formData.get("content") as string;
    const songTitle = formData.get("songTitle") as string;
    const songArtist = formData.get("songArtist") as string;
    const songSpotifyId = formData.get("songSpotifyId") as string;
    
    // Check if new image was provided
    let imageBase64: string | undefined = undefined;
    const imageFile = formData.get("image") as File;
    if (imageFile && imageFile.size > 0) {
      const buffer = await imageFile.arrayBuffer();
      const base64Data = Buffer.from(buffer).toString("base64");
      imageBase64 = `data:${imageFile.type};base64,${base64Data}`;
    }

    const updateData: any = {
      type: type || "photo",
      caption,
      date,
      location,
      content,
      songTitle,
      songArtist,
      songSpotifyId,
    };

    if (imageBase64 !== undefined) {
      updateData.imageBase64 = imageBase64;
    }

    await prisma.memory.update({
      where: { id },
      data: updateData
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to edit memory:", error);
    return { success: false, error: "Failed to edit memory" };
  }
}
