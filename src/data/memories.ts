export interface Memory {
  id: string;
  type: "photo" | "note" | "letter";
  imageUrl?: string;
  date?: string;
  caption?: string;
  location?: string;
  rotation: number;
  position: { x: number; y: number };
  song?: {
    title: string;
    artist: string;
    spotifyId: string;
  };
  content?: string; // For notes or letters
}

export const memories: Memory[] = [
  {
    id: "1",
    type: "photo",
    imageUrl: "/images/photo1.png",
    date: "October 14, 2023",
    caption: "Our first trip together. The sunset was just as beautiful as you.",
    location: "Malibu, CA",
    rotation: -4,
    position: { x: 300, y: 200 },
    song: {
      title: "Sparks",
      artist: "Coldplay",
      spotifyId: "7D0RhFcb3CrfPuTJ0obpdN"
    }
  },
  {
    id: "2",
    type: "photo",
    imageUrl: "/images/photo2.png",
    date: "December 5, 2023",
    caption: "Coffee dates are my favorite when I'm with you.",
    location: "The Local Roaster",
    rotation: 6,
    position: { x: 800, y: 150 },
  },
  {
    id: "3",
    type: "note",
    content: "You make me feel safe. Every single day.",
    rotation: 2,
    position: { x: 550, y: 400 },
  },
  {
    id: "4",
    type: "note",
    content: "God wrote our story, and it's my favorite one.",
    rotation: -5,
    position: { x: 1200, y: 350 },
  }
];

export const heroConfig = {
  names: "Emma & Noah",
  tagline: "A million memories, a single forever.",
  music: {
    title: "Clair de Lune",
    spotifyId: "6kfxxJCsNIf7hT5rV1H8I2", // Claude Debussy
  }
};
