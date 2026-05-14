"use client";

import { useState, useEffect } from "react";
import { getMemories, addMemory, deleteMemory, editMemory } from "@/actions/memoryActions";
import { Trash2, Plus, LogIn, Pencil, X, Settings } from "lucide-react";
import MemoryBoard from "@/components/MemoryBoard";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [memories, setMemories] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingMemory, setEditingMemory] = useState<any | null>(null);
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
    
    let res;
    // Check if editing a real memory from DB, not a fallback placeholder
    if (editingMemory && editingMemory.id && editingMemory.id !== "drawer") {
      res = await editMemory(editingMemory.id, formData);
    } else {
      res = await addMemory(formData);
    }

    setIsLoading(false);
    
    if (res.success) {
      setIsAdding(false);
      setEditingMemory(null);
      fetchMemories();
    } else {
      alert(editingMemory ? "Failed to update memory." : "Failed to add memory.");
    }
  };

  const startEdit = (memory: any) => {
    setEditingMemory(memory);
    setIsAdding(true);
    // Smooth scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="w-screen h-screen relative overflow-hidden bg-floral-paper">
      <MemoryBoard initialMemories={memories} isAdmin={true} onEdit={startEdit} />

      {/* Global Settings Button */}
      <button 
        onClick={() => {
          const settingsMem = memories.find(m => m.type === "settings") || { type: "settings" };
          setEditingMemory(settingsMem);
          setIsAdding(true);
        }}
        className="absolute bottom-8 left-8 bg-white/80 backdrop-blur-sm text-ink p-4 rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform z-50 flex items-center justify-center"
      >
        <Settings size={24} />
      </button>

      {/* Floating Action Button for Add */}
      <button 
        onClick={() => {
          setIsAdding(true);
          setEditingMemory(null);
        }}
        className="absolute bottom-8 right-8 bg-rose-soft text-ink p-4 rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform z-50 flex items-center justify-center"
      >
        <Plus size={32} />
      </button>

      {/* Add/Edit Modal */}
      {isAdding && (
        <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar relative">
            
            <button 
              onClick={() => {
                setIsAdding(false);
                setEditingMemory(null);
              }}
              className="absolute top-6 right-6 text-ink-light hover:text-ink transition z-10 bg-white/80 p-2 rounded-full"
            >
              <X size={24} />
            </button>

            <form key={editingMemory ? editingMemory.id : "new"} onSubmit={handleAdd} data-memory-type={editingMemory?.type || "photo"} className="p-8 flex flex-col gap-6">
              <h2 className="font-sans text-xl font-bold text-ink pr-8">
                {editingMemory?.type === "settings" ? "Global Settings" : (editingMemory ? "Edit Memory / Item" : "Add New Memory / Item")}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-ink-light">Type</label>
                  <select name="type" defaultValue={editingMemory?.type || "photo"} className="p-3 border rounded bg-transparent text-ink" onChange={(e) => {
                    const form = e.target.form;
                    if (form) {
                      form.dataset.memoryType = e.target.value;
                      setMemories([...memories]); 
                    }
                  }}>
                    <option value="photo">Photo (Polaroid)</option>
                    <option value="note">Hidden Easter Egg (Flower)</option>
                    <option value="letter">Love Letter</option>
                    <option value="timeline">Timeline Milestone</option>
                    <option value="future">Future Dream</option>
                    <option value="cassette">Cassette (Voice Note)</option>
                    {editingMemory?.type === "settings" && <option value="settings">Global Settings</option>}
                  </select>
                </div>

                {/* Hide Date for Notes, Letters, Future, Cassette. Show for Photo, Timeline, Settings. */}
                <div className="flex flex-col gap-2" style={{ 
                  display: typeof document !== "undefined" && ["note", "letter", "future", "cassette"].includes(document.querySelector('form')?.dataset.memoryType || "photo") ? "none" : "flex" 
                }}>
                  <label className="text-sm font-bold text-ink-light">
                    {typeof document !== "undefined" && document.querySelector('form')?.dataset.memoryType === "timeline" ? "Year (e.g. 2024)" : (
                      typeof document !== "undefined" && document.querySelector('form')?.dataset.memoryType === "settings" ? "Anniversary Date" : "Date"
                    )}
                  </label>
                  <input name="date" type="text" defaultValue={editingMemory?.date || ""} placeholder="e.g. October 14, 2023" className="p-3 border rounded bg-transparent text-ink" />
                </div>

                {/* Hide Location for everything except Photo */}
                <div className="flex flex-col gap-2" style={{ 
                  display: typeof document !== "undefined" && document.querySelector('form')?.dataset.memoryType !== "photo" && document.querySelector('form')?.dataset.memoryType !== undefined ? "none" : "flex" 
                }}>
                  <label className="text-sm font-bold text-ink-light">Location</label>
                  <input name="location" type="text" defaultValue={editingMemory?.location || ""} placeholder="e.g. Malibu, CA" className="p-3 border rounded bg-transparent text-ink" />
                </div>

                {/* Hide Media Upload for everything except Photo, Cassette, Settings */}
                <div className="flex flex-col gap-2" style={{ 
                  display: typeof document !== "undefined" && !["photo", "cassette", "settings"].includes(document.querySelector('form')?.dataset.memoryType || "photo") && document.querySelector('form')?.dataset.memoryType !== undefined ? "none" : "flex" 
                }}>
                  <label className="text-sm font-bold text-ink-light">
                    {typeof document !== "undefined" && document.querySelector('form')?.dataset.memoryType === "cassette" ? "Voice Note Upload (.mp3, .wav)" : "Image / Audio Upload"} 
                    {editingMemory?.imageBase64 && " (Optional: leave blank to keep current)"}
                  </label>
                  <input 
                    name="image" 
                    type="file" 
                    accept={typeof document !== "undefined" && document.querySelector('form')?.dataset.memoryType === "cassette" ? "audio/*" : typeof document !== "undefined" && document.querySelector('form')?.dataset.memoryType === "photo" ? "image/*" : "image/*,audio/*"} 
                    className="p-3 border rounded bg-transparent text-ink" 
                  />
                </div>
                
                <div className="flex flex-col gap-2 md:col-span-2" style={{ 
                  display: typeof document !== "undefined" && document.querySelector('form')?.dataset.memoryType === "settings" ? "none" : "flex" 
                }}>
                  <label className="text-sm font-bold text-ink-light">
                    {typeof document !== "undefined" && document.querySelector('form')?.dataset.memoryType === "timeline" ? "Event Name" : "Caption or Content"}
                  </label>
                  <textarea name="caption" rows={3} defaultValue={editingMemory?.caption || editingMemory?.content || ""} placeholder="Write your text here..." className="p-3 border rounded bg-transparent text-ink" />
                </div>

                {/* Spotify / Settings Fields */}
                <div className="flex flex-col gap-2 md:col-span-2 border-t pt-4 mt-2" style={{ 
                  display: typeof document !== "undefined" && !["photo", "settings"].includes(document.querySelector('form')?.dataset.memoryType || "photo") && document.querySelector('form')?.dataset.memoryType !== undefined ? "none" : "flex" 
                }}>
                  <label className="text-sm font-bold text-ink-light mb-1">
                    {typeof document !== "undefined" && document.querySelector('form')?.dataset.memoryType === "settings" ? "Vinyl Player Music (Spotify Track ID or Direct MP3 URL)" : "Spotify Music Integration (Optional)"}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input name="songTitle" type="text" defaultValue={editingMemory?.songTitle || ""} placeholder="Song Title" className="p-3 border rounded bg-transparent text-ink" />
                    <input name="songArtist" type="text" defaultValue={editingMemory?.songArtist || ""} placeholder="Artist" className="p-3 border rounded bg-transparent text-ink" />
                    <input name="songSpotifyId" type="text" defaultValue={editingMemory?.songSpotifyId || ""} placeholder="Spotify Track ID or Direct Link" className="p-3 border rounded bg-transparent text-ink" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                {editingMemory && editingMemory.id && editingMemory.id !== "drawer" ? (
                  <button 
                    type="button"
                    onClick={async () => {
                      setIsAdding(false);
                      await handleDelete(editingMemory.id);
                    }}
                    className="text-red-500 flex items-center gap-2 hover:bg-red-50 p-3 rounded transition font-bold"
                  >
                    <Trash2 size={20} /> Delete
                  </button>
                ) : (
                  <div></div>
                )}
                
                <button disabled={isLoading} type="submit" className="bg-rose-soft text-ink font-bold px-8 py-3 rounded hover:bg-rose-soft/80 transition shadow-sm">
                  {isLoading ? "Saving..." : (editingMemory ? "Update" : "Save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
