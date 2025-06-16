"use client"
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import BrowserVideoPlayer from '../_components/BrowserVideoPlayer';
import VideoInfo from '../_components/VideoInfo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function PlayVideo() {
    const { videoId } = useParams();
    const convex = useConvex();
    const [videoData, setVideoData] = useState();

    useEffect(() => {
        videoId && GetVideoDataById();
    }, [videoId])

    const GetVideoDataById = async () => {
        const result = await convex.query(api.videoData.GetVideoById, {
            videoId: videoId
        });
        console.log(result);
        setVideoData(result);
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
            <div>
                <Tabs defaultValue="browser" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="browser">Browser Renderer</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="browser" className="mt-4">
                        <BrowserVideoPlayer videoData={videoData} />
                    </TabsContent>
                    
                    <TabsContent value="preview" className="mt-4">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Video Preview</h3>
                            {videoData?.images && videoData.images.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2">
                                    {videoData.images.slice(0, 4).map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Scene ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg"
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No images available for preview</p>
                            )}
                            
                            {videoData?.audioUrl && (
                                <div>
                                    <h4 className="font-medium mb-2">Audio</h4>
                                    <audio controls className="w-full">
                                        <source src={videoData.audioUrl} type="audio/mpeg" />
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
            <div>
                <VideoInfo videoData={videoData} />
            </div>
        </div>
    )
}

export default PlayVideo