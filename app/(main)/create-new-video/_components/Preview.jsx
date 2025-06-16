"use client"
import Image from 'next/image';
import { options } from './VideoStyle';

function Preview({formData}) {
    const selectVideoStyle = formData && options.find((item => item?.name == formData?.VideoStyle));
    
    return (
        <div className='relative'>
            <h2 className='mb-3 text-2xl'>Preview</h2>
            {selectVideoStyle?.image ? (
                <Image 
                    src={selectVideoStyle.image} 
                    alt={selectVideoStyle.name || 'Video style preview'} 
                    width={1000} 
                    height={300}
                    className='w-full h-[70vh] object-cover rounded-xl'
                />
            ) : (
                <div className='w-full h-[70vh] bg-gray-200 rounded-xl flex items-center justify-center'>
                    <p className='text-gray-500'>Select a video style to see preview</p>
                </div>
            )}

            {formData?.caption?.name && (
                <h2 className={`${formData?.caption?.style} absolute bottom-7 w-full text-center`}>
                    {formData.caption.name}
                </h2>
            )}
        </div>
    )
}

export default Preview