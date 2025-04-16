"use client"
import { useAuthContext } from '@/app/provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { LoaderPinwheelIcon, SparklesIcon } from 'lucide-react'
import { useState } from 'react'

const suggestions = [
    "Historic Story",
    "Kids Story",
    "History Facts",
    "Movie Stories",
    "AI Innovations",
    "Space Mysteries",
    "Horror Stories",
    "Mythological Tales",
    "Tech Breakthroughs",
    "True Crime Stories",
    "Fantasy Adventures",
    "Science Experiments",
    "Motivational Stories"
];

const durationOptions = [
    { value: "30", label: "30 seconds" },
    { value: "45", label: "45 seconds" },
    { value: "60", label: "60 seconds" }
];

function Topic({ onHandleInputChange }) {
    const [SelectTopic, setSelectTopic] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState("60");
    const [selectedScriptIndex, setSelectedScriptIndex] = useState(null);
    const [scripts, setScripts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [customScript, setCustomScript] = useState("");
    const [activeTab, setActiveTab] = useState("Suggestions");
    const [error, setError] = useState("");
    const { user } = useAuthContext();

    const GenerateScript = async () => {
        if (user?.credits <= 0) {
            setError('Out of credits!');
            return;
        }

        let topicToUse = SelectTopic;
        if (activeTab === "your_topic") {
            topicToUse = document.querySelector('textarea[placeholder="Enter your idea"]')?.value;
        }

        if (!topicToUse?.trim()) {
            setError('Please enter a topic');
            return;
        }

        setError("");
        setLoading(true);
        setSelectedScriptIndex(null);
        try {
            console.log("Sending topic and duration to API:", { topic: topicToUse, duration: selectedDuration });

            const result = await axios.post('/api/generate-script', {
                topic: topicToUse,
                duration: selectedDuration
            }, {
                timeout: 60000
            });

            console.log("API response received:", result.status);

            if (result.data?.scripts && Array.isArray(result.data.scripts)) {
                setScripts(result.data.scripts);
                if (result.data.scripts.length > 0) {
                    handleScriptSelect(0);
                }
            } else {
                console.error("Invalid script format:", result.data);
                setError('Invalid script format received');
            }
        } catch (e) {
            console.error("Script generation error:", e);
            if (e.response) {
                console.error("Error response:", {
                    status: e.response.status,
                    data: e.response.data
                });
                setError(e.response.data?.error || `Error: ${e.response.status} - Failed to generate script`);
            } else if (e.request) {
                console.error("No response received:", e.request);
                setError('No response from server. Please try again later.');
            } else {
                console.error("Error details:", e.message);
                setError(`Error: ${e.message}`);
            }
        }
        setLoading(false);
    };

    const handleCustomScriptChange = (event) => {
        const scriptText = event.target.value;
        setCustomScript(scriptText);
        onHandleInputChange('script', scriptText);
    };

    const handleScriptSelect = (index) => {
        setSelectedScriptIndex(index);
        if (scripts[index]) {
            onHandleInputChange('script', scripts[index].content);
        }
    };

    return (
        <div>
            <h2 className='mb-1'>Project Title</h2>
            <Input placeholder='Enter Project Title' onChange={(event) => onHandleInputChange('title', event.target.value)} />

            <div className='mt-5'>
                <h2>Video Topic</h2>
                <p className='text-gray-600 text-sm'>Select a topic for your video</p>

                {error && (
                    <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <Tabs defaultValue="Suggestions" className="mt-2 w-full" onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="Suggestions">Suggestions</TabsTrigger>
                        <TabsTrigger value="your_topic">Your Topic</TabsTrigger>
                        <TabsTrigger value="custom_script">Custom Script</TabsTrigger>
                    </TabsList>

                    <TabsContent value="Suggestions">
                        <div>
                            {suggestions.map((suggestion, index) => (
                                <Button
                                    variant="outline"
                                    key={index}
                                    className={`m-1 ${suggestion === SelectTopic ? 'bg-secondary' : ''}`}
                                    onClick={() => {
                                        setSelectTopic(suggestion);
                                        onHandleInputChange('topic', suggestion);
                                    }}
                                >
                                    {suggestion}
                                </Button>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="your_topic">
                        <h2 className='mb-1'>Enter Your Own Topic</h2>
                        <Textarea
                            placeholder="Enter your idea"
                            onChange={(event) => onHandleInputChange('topic', event.target.value)}
                        />
                    </TabsContent>

                    <TabsContent value="custom_script">
                        <h2 className='mb-1'>Paste Your Custom Script</h2>
                        <Textarea
                            placeholder="Paste your script here..."
                            className="min-h-32"
                            value={customScript}
                            onChange={handleCustomScriptChange}
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            Your video will be generated directly from this script
                        </p>
                    </TabsContent>
                </Tabs>

                {activeTab !== "custom_script" && (
                    <div className="mt-4">
                        <h2 className="mb-2">Video Duration</h2>
                        <Select
                            value={selectedDuration}
                            onValueChange={(value) => {
                                setSelectedDuration(value);
                                onHandleInputChange('duration', value);
                            }}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                                {durationOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {scripts.length > 0 && (
                    <div className='mt-3'>
                        <h2>Generated Scripts</h2>
                        <div className="space-y-3">
                            {scripts.map((script, index) => (
                                <div
                                    key={index}
                                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedScriptIndex === index ? 'bg-secondary' : 'hover:bg-secondary/50'
                                        }`}
                                    onClick={() => handleScriptSelect(index)}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-medium">Script {index + 1}</h3>
                                        {selectedScriptIndex === index && (
                                            <span className="text-sm text-green-500">Selected</span>
                                        )}
                                    </div>
                                    <div className="max-h-40 overflow-y-auto">
                                        <p className="text-sm text-gray-500 whitespace-pre-wrap">{script.content}</p>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-xs text-gray-400">Scenes: {script.scenes.length}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {activeTab !== "custom_script" && (
                <Button className='mt-3' size="sm" disabled={loading} onClick={GenerateScript}>
                    {loading ? <LoaderPinwheelIcon className='animate-spin' /> : <SparklesIcon />} Generate Scripts
                </Button>
            )}
        </div>
    );
}

export default Topic;