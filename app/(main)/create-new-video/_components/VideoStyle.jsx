"use client"
import Image from "next/image";
import { useState } from "react";

export const options = [
    {
        name: 'Realistic',
        image: '/realstic.jpg'
    },
    {
        name: 'Cinematic',
        image: '/cinematic.jpg'
    },
    {
        name: 'Cartoon',
        image: '/cartton.jpg'
    },
    {
        name: 'Watercolor',
        image: '/watercolor.jpg'
    }, {
        name: 'Cyberpunk',
        image: '/cyberpunk.jpg'
    }, {
        name: 'GTA',
        image: '/gta.jpg'
    },
    {
        name: '3D Pixar',
        image: '/pixar.jpg'
    },
    {
        name: 'Anime',
        image: '/Anime.jpg'
    },
]

function VideoStyle({ onHandleInputChange }) {
    const [selectedStyle, setSelectedStyle] = useState();
    return (
        <div className="mt-5">
            <h2>Video Style</h2>
            <p className="text-sm text-gray-400 mb-1">Select Video Style</p>

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
                {options?.map((option, index) => (
                    <div key={option.name} className="relative"
                        onClick={() => {
                            setSelectedStyle(option.name);
                            onHandleInputChange('VideoStyle', option.name)
                        }}
                    >
                        <Image src={option.image}
                            alt={option.name}
                            width={500}
                            height={120}
                            className={`object-cover h-[100px] lg:h-[150px] xl:h-[180px]
                        rounded-lg p-1 hover:border border-gray-300 cursor-pointer
                         ${option.name == selectedStyle && 'border'}`}
                        />
                        <h2 className="absolute bottom-1 text-center w-full text-white ">{option.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default VideoStyle