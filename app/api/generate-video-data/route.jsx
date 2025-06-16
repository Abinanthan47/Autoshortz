import { NextResponse } from "next/server";

// Mock function to simulate video data generation
async function generateMockVideoData(formData) {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock generated data
  return {
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
    images: [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=720&h=1280&fit=crop",
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=720&h=1280&fit=crop",
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=720&h=1280&fit=crop",
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=720&h=1280&fit=crop"
    ],
    captionJson: [
      { word: "Welcome", start: 0, end: 1 },
      { word: "to", start: 1, end: 1.5 },
      { word: "our", start: 1.5, end: 1.8 },
      { word: "amazing", start: 1.8, end: 2.5 },
      { word: "AI", start: 2.5, end: 3 },
      { word: "video", start: 3, end: 3.5 },
      { word: "generator", start: 3.5, end: 4.5 },
      { word: "experience", start: 4.5, end: 5.5 }
    ]
  };
}

export async function POST(req) {
  try {
    const formData = await req.json();
    console.log("Received video generation request:", formData);

    if (!formData.title || !formData.topic || !formData.script) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // For demo purposes, generate mock data instead of using external APIs
    const videoData = await generateMockVideoData(formData);

    console.log("Generated video data:", videoData);

    // In a real implementation, you would update the database here
    // For now, we'll just return success
    return NextResponse.json({ 
      success: true, 
      message: "Video data generated successfully",
      data: videoData
    });

  } catch (error) {
    console.error("Error in generate-video-data:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate video data",
        details: error.message 
      },
      { status: 500 }
    );
  }
}