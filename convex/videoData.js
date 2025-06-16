import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateVideoData = mutation({
  args: {
    title: v.string(),
    topic: v.string(),
    script: v.string(),
    VideoStyle: v.string(),
    caption: v.any(),
    voice: v.string(),
    uid: v.string(), // Changed from v.id("users") to v.string() for mock data
    createdBy: v.string(),
    credits: v.number(),
  },

  handler: async (ctx, args) => {
    // For demo purposes, create a mock record
    const mockId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // In a real app, this would insert into the database
    // For now, we'll just return a mock ID
    console.log("Creating video record:", {
      title: args.title,
      topic: args.topic,
      script: args.script,
      VideoStyle: args.VideoStyle,
      caption: args.caption,
      voice: args.voice,
      uid: args.uid,
      createdBy: args.createdBy,
      status: "pending",
    });

    return mockId;
  },
});

export const UpdateVideoRecord = mutation({
  args: {
    recordId: v.string(), // Changed from v.id("videoData") to v.string()
    audioUrl: v.string(),
    images: v.any(),
    captionJson: v.any(),
    downloadUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log("Updating video record:", args.recordId, {
      audioUrl: args.audioUrl,
      captionJson: args.captionJson,
      images: args.images,
      downloadUrl: args.downloadUrl,
      status: "completed",
    });
    
    // For demo purposes, just log the update
    return { success: true };
  },
});

export const GetUserVideos = query({
  args: {
    uid: v.string(), // Changed from v.id("users") to v.string()
  },
  handler: async (ctx, args) => {
    // Return mock video data for demo
    return [
      {
        _id: "mock_video_1",
        title: "Sample Video 1",
        topic: "AI Technology",
        script: "This is a sample script about AI technology...",
        VideoStyle: "Realistic",
        caption: { name: "Youtuber", style: "text-yellow-400 text-5xl font-bold" },
        voice: "b_sarah",
        uid: args.uid,
        createdBy: "demo@example.com",
        status: "completed",
        images: [
          "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=720&h=1280&fit=crop",
          "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=720&h=1280&fit=crop"
        ],
        audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
        captionJson: [
          { word: "Welcome", start: 0, end: 1 },
          { word: "to", start: 1, end: 1.5 },
          { word: "AI", start: 1.5, end: 2 },
          { word: "technology", start: 2, end: 3 }
        ],
        _creationTime: Date.now() - 86400000 // 1 day ago
      }
    ];
  },
});

export const GetVideoById = query({
  args: {
    videoId: v.string(), // Changed from v.id("videoData") to v.string()
  },
  handler: async (ctx, args) => {
    // Return mock video data for demo
    return {
      _id: args.videoId,
      title: "Sample Video",
      topic: "AI Technology",
      script: "This is a sample script about AI technology and its impact on our daily lives...",
      VideoStyle: "Realistic",
      caption: { name: "Youtuber", style: "text-yellow-400 text-5xl font-bold" },
      voice: "b_sarah",
      uid: "mock-user-id",
      createdBy: "demo@example.com",
      status: "completed",
      images: [
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=720&h=1280&fit=crop",
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=720&h=1280&fit=crop",
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=720&h=1280&fit=crop"
      ],
      audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      captionJson: [
        { word: "Welcome", start: 0, end: 1 },
        { word: "to", start: 1, end: 1.5 },
        { word: "the", start: 1.5, end: 1.8 },
        { word: "future", start: 1.8, end: 2.5 },
        { word: "of", start: 2.5, end: 2.8 },
        { word: "AI", start: 2.8, end: 3.5 },
        { word: "technology", start: 3.5, end: 4.5 }
      ],
      _creationTime: Date.now() - 86400000
    };
  },
});