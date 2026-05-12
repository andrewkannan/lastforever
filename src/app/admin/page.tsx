"use client";

import { useState, useEffect } from "react";
import { getMemories, addMemory, deleteMemory } from "@/actions/memoryActions";
import { Trash2, Plus, LogIn } from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [memories, setMemories] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Authenticate
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "kenishalikescoffee") {
      setIsAuthenticated(true);
      fetchMemories();
    } else {
      alert("Incorrect passcode");
    }
  };

  const fetchMemories = async () => {
    const data = await getMemories();
    setMemories(data);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this memory?")) {
      await deleteMemory(id);
      fetchMemories();
    }
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await addMemory(formData);
    setIsLoading(false);
    
    if (res.success) {
      setIsAdding(false);
      fetchMemories();
    } else {
      alert("Failed to add memory.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg flex flex-col gap-4 max-w-sm w-full">
          <h1 className="font-serif text-3xl text-ink text-center mb-4">Secret Area</h1>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter passcode"
            className="p-3 border border-ink-light/20 rounded focus:outline-none focus:border-ink bg-transparent"
          />
          <button type="submit" className="flex items-center justify-center gap-2 bg-ink text-paper p-3 rounded hover:bg-ink-light transition">
            <LogIn size={20} />
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8 md:p-12 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-serif text-4xl text-ink">Memory CMS</h1>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 bg-ink text-paper px-6 py-3 rounded shadow hover:bg-ink-light transition"
          >
            <Plus size={20} />
            {isAdding ? "Cancel" : "Add Memory"}
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleAdd} className="bg-white p-8 rounded-lg shadow-lg mb-12 flex flex-col gap-6">
            <h2 className="font-sans text-xl font-bold">Add New Memory</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-ink-light">Type</label>
                <select name="type" className="p-3 border rounded bg-transparent">
                  <option value="photo">Photo (Polaroid)</option>
                  <option value="note">Sticky Note</option>
                  <option value="letter">Love Letter</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-ink-light">Date</label>
                <input name="date" type="text" placeholder="e.g. October 14, 2023" className="p-3 border rounded bg-transparent" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-ink-light">Location</label>
                <input name="location" type="text" placeholder="e.g. Malibu, CA" className="p-3 border rounded bg-transparent" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-ink-light">Image Upload</label>
                <input name="image" type="file" accept="image/*" className="p-3 border rounded bg-transparent" />
              </div>
              
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-bold text-ink-light">Caption or Content</label>
                <textarea name="caption" rows={3} placeholder="Write your memory or note here..." className="p-3 border rounded bg-transparent" />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2 border-t pt-4 mt-2">
                <label className="text-sm font-bold text-ink-light mb-1">Spotify Music Integration (Optional)</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input name="songTitle" type="text" placeholder="Song Title" className="p-3 border rounded bg-transparent" />
                  <input name="songArtist" type="text" placeholder="Artist" className="p-3 border rounded bg-transparent" />
                  <input name="songSpotifyId" type="text" placeholder="Spotify Track ID" className="p-3 border rounded bg-transparent" />
                </div>
              </div>
            </div>

            <button disabled={isLoading} type="submit" className="bg-rose-soft text-ink font-bold p-4 rounded hover:bg-rose-soft/80 transition mt-4">
              {isLoading ? "Saving..." : "Save Memory"}
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((m) => (
            <div key={m.id} className="bg-white p-6 rounded-lg shadow-sm border border-ink/5 flex flex-col gap-4">
              {m.imageBase64 && (
                <div className="w-full h-40 relative rounded overflow-hidden">
                  <img src={m.imageBase64} alt="memory" className="object-cover w-full h-full" />
                </div>
              )}
              
              <div>
                <span className="bg-ink/5 text-ink-light px-2 py-1 rounded text-xs font-bold uppercase tracking-widest">
                  {m.type}
                </span>
              </div>
              
              <p className="font-serif text-lg text-ink line-clamp-2">
                {m.caption || m.content || "No caption"}
              </p>

              <div className="flex justify-between items-center text-sm text-ink-light mt-auto pt-4 border-t border-ink/5">
                <span>{m.date || "No date"}</span>
                <button 
                  onClick={() => handleDelete(m.id)}
                  className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
