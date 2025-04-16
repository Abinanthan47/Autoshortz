import { Button } from '@/components/ui/button';
import { ArrowLeft, DownloadCloudIcon } from 'lucide-react';
import Link from 'next/link';

function VideoInfo({ videoData }) {
    const handleDownload = async () => {
        if (!videoData?.downloadUrl) {
            alert("Video is not ready for download yet");
            return;
        }

        try {
            // Create a temporary anchor element
            const link = document.createElement('a');
            link.href = videoData.downloadUrl;
            link.download = `${videoData.title || 'video'}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Download error:", error);
            alert("Failed to download video");
        }
    };

    return (
        <div className='border p-5 rounded-xl'>
            <div>
                <Link href={'/dashboard'}>
                    <h2 className='flex gap-2 items-center'>
                        <ArrowLeft />
                        Back to Dashboard
                    </h2>
                </Link>
                <div className='flex flex-col gap-3'>
                    <h2 className='mt-5'>Project Name: {videoData?.title}</h2>
                    <p className='text-gray-500'>Script: {videoData?.script}</p>
                    <h2>Video Style: {videoData?.VideoStyle}</h2>
                    <Button
                        onClick={handleDownload}
                        disabled={!videoData?.downloadUrl}
                    >
                        <DownloadCloudIcon className="mr-2" />
                        {videoData?.downloadUrl ? 'Export Video' : 'Video Processing...'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default VideoInfo