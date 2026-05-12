"use client";

import { useState, useEffect } from "react";
import { getMemories, addMemory, deleteMemory, editMemory } from "@/actions/memoryActions";
import { Trash2, Plus, LogIn, Pencil } from "lucide-react";

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
    if (editingMemory) {
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
    <div className="min-h-screen bg-background text-foreground p-8 md:p-12 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-serif text-4xl text-ink">Memory CMS</h1>
          <button 
            onClick={() => {
              setIsAdding(!isAdding);
              if (isAdding) setEditingMemory(null); // Clear edit state on cancel
            }}
            className="flex items-center gap-2 bg-ink text-paper px-6 py-3 rounded shadow hover:bg-ink-light transition"
          >
            <Plus size={20} className={isAdding ? "rotate-45 transition-transform" : "transition-transform"} />
            {isAdding ? "Cancel" : "Add Memory"}
          </button>
        </div>

        {isAdding && (
          <form key={editingMemory ? editingMemory.id : "new"} onSubmit={handleAdd} data-memory-type={editingMemory?.type || "photo"} className="bg-white p-8 rounded-lg shadow-lg mb-12 flex flex-col gap-6">
            <h2 className="font-sans text-xl font-bold text-ink">{editingMemory ? "Edit Memory / Item" : "Add New Memory / Item"}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-ink-light">Type</label>
                <select name="type" defaultValue={editingMemory?.type || "photo"} className="p-3 border rounded bg-transparent text-ink" onChange={(e) => {
                  const form = e.target.form;
                  if (form) {
                    form.dataset.memoryType = e.target.value;
                    // Trigger a re-render to update UI
                    setMemories([...memories]); 
                  }
                }}>
                  <option value="photo">Photo (Polaroid)</option>
                  <option value="note">Sticky Note</option>
                  <option value="letter">Love Letter</option>
                  <option value="timeline">Timeline Milestone</option>
                  <option value="future">Future Dream</option>
                </select>
              </div>

              {/* Hide Date for Notes, Letters, Future. Show for Photo and Timeline. */}
              <div className="flex flex-col gap-2" style={{ 
                display: typeof document !== "undefined" && ["note", "letter", "future"].includes(document.querySelector('form')?.dataset.memoryType || "photo") ? "none" : "flex" 
              }}>
                <label className="text-sm font-bold text-ink-light">
                  {typeof document !== "undefined" && document.querySelector('form')?.dataset.memoryType === "timeline" ? "Year (e.g. 2024)" : "Date"}
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

              {/* Hide Image Upload for everything except Photo */}
              <div className="flex flex-col gap-2" style={{ 
                display: typeof document !== "undefined" && document.querySelector('form')?.dataset.memoryType !== "photo" && document.querySelector('form')?.dataset.memoryType !== undefined ? "none" : "flex" 
              }}>
                <label className="text-sm font-bold text-ink-light">Image Upload {editingMemory?.imageBase64 && "(Optional: leave blank to keep current image)"}</label>
                <input name="image" type="file" accept="image/*" className="p-3 border rounded bg-transparent text-ink" />
              </div>
              
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-bold text-ink-light">
                  {typeof document !== "undefined" && document.querySelector('form')?.dataset.memoryType === "timeline" ? "Event Name" : "Caption or Content"}
                </label>
                <textarea name="caption" rows={3} defaultValue={editingMemory?.caption || editingMemory?.content || ""} placeholder="Write your text here..." className="p-3 border rounded bg-transparent text-ink" />
              </div>

              {/* Hide Spotify for everything except Photo */}
              <div className="flex flex-col gap-2 md:col-span-2 border-t pt-4 mt-2" style={{ 
                display: typeof document !== "undefined" && document.querySelector('form')?.dataset.memoryType !== "photo" && document.querySelector('form')?.dataset.memoryType !== undefined ? "none" : "flex" 
              }}>
                <label className="text-sm font-bold text-ink-light mb-1">Spotify Music Integration (Optional)</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input name="songTitle" type="text" defaultValue={editingMemory?.songTitle || ""} placeholder="Song Title" className="p-3 border rounded bg-transparent text-ink" />
                  <input name="songArtist" type="text" defaultValue={editingMemory?.songArtist || ""} placeholder="Artist" className="p-3 border rounded bg-transparent text-ink" />
                  <input name="songSpotifyId" type="text" defaultValue={editingMemory?.songSpotifyId || ""} placeholder="Spotify Track ID" className="p-3 border rounded bg-transparent text-ink" />
                </div>
              </div>
            </div>

            <button disabled={isLoading} type="submit" className="bg-rose-soft text-ink font-bold p-4 rounded hover:bg-rose-soft/80 transition mt-4">
              {isLoading ? "Saving..." : (editingMemory ? "Update Memory" : "Save Memory")}
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
                <div className="flex gap-2">
                  <button 
                    onClick={() => startEdit(m)}
                    className="text-ink-light hover:text-ink p-2 rounded hover:bg-ink/5 transition"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(m.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
