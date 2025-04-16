"use client"
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import RemotionPlayer from '../_components/RemotionPlayer';
import VideoInfo from '../_components/VideoInfo';

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
                <RemotionPlayer videoData={videoData} />
            </div>
            <div>
                <VideoInfo videoData={videoData} />
            </div>
        </div>
    )
}

export default PlayVideo