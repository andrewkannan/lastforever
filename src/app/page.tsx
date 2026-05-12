import HomeClient from "./HomeClient";
import { getMemories } from "@/actions/memoryActions";

export const dynamic = 'force-dynamic'; // Ensure we fetch fresh memories

export default async function Home() {
  const memories = await getMemories();
  
  return <HomeClient initialMemories={memories} />;
}
