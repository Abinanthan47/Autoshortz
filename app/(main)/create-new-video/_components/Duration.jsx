"use client"
import { useEffect, useState } from "react";

const durationOptions = [
    { value: 30, name: "30 seconds" },
    { value: 45, name: "45 seconds" },
    { value: 60, name: "60 seconds" }
]

function Duration({ onHandleInputChange, selectedTopic, selectedScript }) {
    const [selectedDuration, setSelectedDuration] = useState(30);

    useEffect(() => {
        // Reset duration when topic or script changes
        setSelectedDuration(30);
        onHandleInputChange('duration', 30);
    }, [selectedTopic, selectedScript]);

    const handleDurationChange = (value) => {
        setSelectedDuration(value);
        onHandleInputChange('duration', value);
    };

    return (
        <div className="mt-5">
            <h2>Video Duration</h2>
            <p className="text-sm text-gray-400 mb-2">Select length for your video</p>

            <div className="grid grid-cols-3 gap-3">
                {durationOptions.map((option) => (
                    <div
                        key={option.value}
                        className={`cursor-pointer p-3 bg-slate-200 border-slate-600
                            dark:bg-slate-900 hover:border
                            rounded-lg dark:border-white text-center
                            ${option.value === selectedDuration ? 'border' : ''}`}
                        onClick={() => handleDurationChange(option.value)}
                    >
                        {option.name}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Duration
