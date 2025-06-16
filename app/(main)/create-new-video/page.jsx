"use client"
import { useAuthContext } from '@/app/provider';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import axios from 'axios';
import { useMutation } from 'convex/react';
import { Loader2, WandSparklesIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Captions from './_components/Captions';
import Preview from './_components/Preview';
import Topic from './_components/Topic';
import VideoStyle from './_components/VideoStyle';
import Voice from './_components/Voice';

function CreateNewVideo() {
    const [formData, setFormData] = useState();
    const CreateIntialVideoRecord = useMutation(api.videoData.CreateVideoData);
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onHandleInputChange = (fieldName, fieldValue) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: fieldValue
        }))
        console.log("Form data updated:", { ...formData, [fieldName]: fieldValue });
    }

    const GenerateVideo = async () => {
        console.log("Starting video generation with data:", formData);

        if (user?.credits <= 0) {
            toast.error('Please add more credits!')
            return;
        }

        if (!formData?.title || !formData?.topic || !formData?.script || !formData.VideoStyle || !formData?.caption || !formData?.voice) {
            toast.error('Please fill in all required fields');
            console.log("Missing fields:", {
                title: !!formData?.title,
                topic: !!formData?.topic,
                script: !!formData?.script,
                VideoStyle: !!formData?.VideoStyle,
                caption: !!formData?.caption,
                voice: !!formData?.voice
            });
            return;
        }
        
        setLoading(true);
        
        try {
            console.log("Creating initial video record...");
            const resp = await CreateIntialVideoRecord({
                title: formData.title,
                topic: formData.topic,
                script: formData.script,
                VideoStyle: formData.VideoStyle,
                caption: formData.caption,
                voice: formData.voice,
                uid: user?._id,
                createdBy: user?.email,
                credits: user?.credits,
            });
            
            console.log("Video record created:", resp);
            toast.success('Video record created successfully!');

            console.log("Starting video data generation...");
            const result = await axios.post('/api/generate-video-data', {
                ...formData,
                recordId: resp,
            });
            
            console.log("Video generation result:", result.data);
            
            if (result.data.success) {
                toast.success('Video generated successfully! Redirecting to dashboard...');
                
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);
            } else {
                throw new Error(result.data.error || 'Video generation failed');
            }
            
        } catch (error) {
            console.error('Error generating video:', error);
            
            if (error.response) {
                console.error('Server response:', error.response.data);
                toast.error(`Server error: ${error.response.data.error || 'Unknown error'}`);
            } else if (error.request) {
                console.error('Network error:', error.request);
                toast.error('Network error. Please check your connection.');
            } else {
                console.error('Error details:', error.message);
                toast.error(`Error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h2 className='text-3xl'>Create New Video</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 mt-8 gap-7'>
                <div className='col-span-2 p-7 border rounded-xl h-[72vh] overflow-auto'>
                    <Topic onHandleInputChange={onHandleInputChange} />
                    <VideoStyle onHandleInputChange={onHandleInputChange} />
                    <Voice onHandleInputChange={onHandleInputChange} />
                    <Captions onHandleInputChange={onHandleInputChange} />
                    <Button 
                        className='w-full mt-5'
                        disabled={loading}
                        onClick={GenerateVideo}
                    > 
                        {loading ? (
                            <>
                                <Loader2 className='animate-spin mr-2' />
                                Generating Video...
                            </>
                        ) : (
                            <>
                                <WandSparklesIcon className='mr-2' />
                                Generate Video
                            </>
                        )}
                    </Button>
                </div>
                <div>
                    <Preview formData={formData} />
                </div>
            </div>
        </div>
    )
}

export default CreateNewVideo