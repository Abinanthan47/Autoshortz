    "use client"
    import { useState } from "react"

    const options = [
        {
            name: 'Youtuber',
            style: 'text-yellow-400 text-5xl font-bold    [text-shadow:_2px_2px_0_#ef4444] tracking-wide drop-shadow-md px-3 py-1    '
        },
        {
            name: 'Supreme',
            style: 'text-white text-5xl font-medium italic drop-shadow-lg py-1 px-3 rounded-lg'
        },
        {
            name: 'Neon',
            style: 'text-green-500 text-5xl font-bold uppercase tracking-wide drop-shadow-lg px-3 py-1 rounded-lg '
        },
        {
            name: 'Carbon',
            style: 'text-white text-5xl font-bold uppercase  [text-shadow:_3px_3px_0_#000]  drop-shadow-md px-3 py-1    '
        },
        {
            name: 'Glitch',
            style: 'text-pink-500 text-5xl font-bold uppercase tracking-wide drop-shadow-[4px_4px_0_rgba(0,0,0,0.2)] px-3 py-1 rounded-lg'
        },
        {
            name: 'Fire',
            style: 'text-red-500 text-5xl font-bold px-3 py-1 rounded-lg'
        },
    ]

    function Captions({ onHandleInputChange }) {
        const [selectedCaptionStyle, setSelectedCaptionStyle] = useState()
        return (
            <div className='mt-5'>
                <h2>caption Style</h2>
                <p className='text-sm text-gray-400 mb-2'>Select Caption Style</p>

                <div className="flex flex-wrap gap-4">
                    {options.map((option, index) => (
                        <div key={index}
                            onClick={() => {
                                setSelectedCaptionStyle(option.name)
                                onHandleInputChange('caption', option)
                            }}
                            className={`p-2 hover:border rounded-lg  bg-slate-900 border-gray-300
                        cursor-pointer ${selectedCaptionStyle == option.name && 'border'}`}>
                            <h2 className={`${option.style} text-[32px]`}>{option.name}</h2>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    export default Captions