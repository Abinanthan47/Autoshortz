import { Button } from '@/components/ui/button';
import { ArrowLeft, DownloadCloudIcon, PlayCircle } from 'lucide-react';
import Link from 'next/link';

function VideoInfo({ videoData }) {
    return (
        <div className='border p-5 rounded-xl space-y-4'>
            <div>
                <Link href={'/dashboard'}>
                    <h2 className='flex gap-2 items-center hover:text-blue-600 transition-colors'>
                        <ArrowLeft />
                        Back to Dashboard
                    </h2>
                </Link>
            </div>
            
            <div className='space-y-4'>
                <div>
                    <h3 className='font-semibold text-lg mb-2'>Project Details</h3>
                    <div className='space-y-2'>
                        <p><strong>Name:</strong> {videoData?.title || 'Untitled'}</p>
                        <p><strong>Topic:</strong> {videoData?.topic || 'N/A'}</p>
                        <p><strong>Style:</strong> {videoData?.VideoStyle || 'Default'}</p>
                        <p><strong>Caption Style:</strong> {videoData?.caption?.name || 'Default'}</p>
                        <p><strong>Voice:</strong> {videoData?.voice || 'Default'}</p>
                    </div>
                </div>

                <div>
                    <h4 className='font-semibold mb-2'>Script</h4>
                    <div className='bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto'>
                        <p className='text-sm text-gray-700'>{videoData?.script || 'No script available'}</p>
                    </div>
                </div>

                <div>
                    <h4 className='font-semibold mb-2'>Generation Status</h4>
                    <div className='space-y-2'>
                        <div className='flex items-center gap-2'>
                            <div className={`w-3 h-3 rounded-full ${videoData?.images ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span className='text-sm'>Images: {videoData?.images ? `${videoData.images.length} generated` : 'Not generated'}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className={`w-3 h-3 rounded-full ${videoData?.audioUrl ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span className='text-sm'>Audio: {videoData?.audioUrl ? 'Generated' : 'Not generated'}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className={`w-3 h-3 rounded-full ${videoData?.captionJson ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span className='text-sm'>Captions: {videoData?.captionJson ? `${videoData.captionJson.length} words` : 'Not generated'}</span>
                        </div>
                    </div>
                </div>

                <div className='pt-4 border-t'>
                    <p className='text-xs text-gray-500'>
                        Use the Browser Renderer tab to generate your video directly in the browser with smooth transitions and effects.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default VideoInfo