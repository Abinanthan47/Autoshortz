"use client"
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";


const voiceOptions = [
    {
        "value": "b_sarah",
        "name": "Sarah (Female)"
    },
    {
        "value": "af_sky",
        "name": "Sky (Female)"
    },
    {
        "value": "am_adam",
        "name": "Adam (Male)"
    },
    {
        "value": "hf_alpha",
        "name": "Alpha (Female)"
    },
    {
        "value": "am_fenrir",
        "name": "Fenrir (Male)"
    },
    {
        "value": "am liam",
        "name": "Liam (Male)"
    },
    {
        "value": "am_michael",
        "name": " Michael (Male)"
    },
    {
        "value": "am_onyx",
        "name": "Onyx (Male)"
    },
]

function Voice({ onHandleInputChange }) {
    const [selectedVoice, setSelectedVoice] = useState();
    return (
        <div className='mt-5'>
            <h2>Video Voice</h2>
            <p className='text-sm text-gray-400 mb-2'>Select Voice for Video</p>
            <ScrollArea className="h-[150px] w-full">
                <div className="grid grid-cols-2 gap-3">
                    {voiceOptions.map((voice, index) => (
                        <h2 className={`cursor-pointer p-3 bg-slate-200 border-slate-600
                     dark:bg-slate-900 hover-border
                      rounded-lg dark:border-white ${voice.name == selectedVoice && 'border'}`} key={index}
                            onClick={() => {
                                setSelectedVoice(voice.name);
                                onHandleInputChange('voice', voice.value)
                            }}
                        >{voice.name}</h2>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}

export default Voice