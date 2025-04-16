"use client"
import { AbsoluteFill, Audio, Img, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from 'remotion';

const captionStyles = {
    'Youtuber': 'text-yellow-400 text-7xl font-bold [text-shadow:_2px_2px_0_#ff0505] drop-shadow-md px-3 py-1',
    'Supreme': 'text-white text-6xl font-medium italic drop-shadow-lg py-1 px-3 rounded-lg',
    'Neon': 'text-green-500 text-6xl font-bold uppercase tracking-wide drop-shadow-lg px-3 py-1 rounded-lg',
    'Carbon': 'text-white text-7xl font-bold uppercase [text-shadow:_3px_3px_0_#000] drop-shadow-md px-3 py-1',
    'Glitch': 'text-pink-500 text-6xl font-bold uppercase tracking-wide drop-shadow-[4px_4px_0_rgba(0,0,0,0.2)] px-3 py-1 rounded-lg',
    'Fire': 'text-red-500 text-6xl font-bold px-3 py-1 rounded-lg'
};

function RemotionComposition({ videoData }) {
    const captions = videoData?.captionJson;
    const { fps, width, height } = useVideoConfig();
    const imageList = videoData?.images;
    const frame = useCurrentFrame();
    const selectedCaptionStyle = videoData?.caption?.name || 'Youtuber';

    const getDurationFrame = () => {
        const totalDuration = captions[captions.length - 1]?.end * fps;
        return totalDuration;
    };

    const getCurrentCaption = () => {
        const currentTime = frame / fps;
        const currentCaption = captions?.find(
            (item) => currentTime >= item?.start && currentTime <= item?.end
        );
        return currentCaption ? currentCaption?.word : "";
    };

    const getSceneTransition = (index) => {
        const sceneDuration = getDurationFrame() / imageList.length;
        const sceneStart = index * sceneDuration;
        const sceneEnd = (index + 1) * sceneDuration;
        const transitionDuration = fps * 0.8;

        const fadeIn = interpolate(
            frame,
            [sceneStart, sceneStart + transitionDuration],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const fadeOut = interpolate(
            frame,
            [sceneEnd - transitionDuration, sceneEnd],
            [1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const scale = interpolate(
            frame,
            [sceneStart, sceneStart + sceneDuration / 2, sceneEnd],
            [1, 1.08, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const rotation = interpolate(
            frame,
            [sceneStart, sceneStart + sceneDuration / 2, sceneEnd],
            [-2, 0, 2],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return {
            opacity: Math.min(fadeIn, fadeOut),
            scale,
            rotation
        };
    };

    const currentCaption = getCurrentCaption();

    const captionSpring = spring({
        fps,
        frame,
        config: {
            damping: 200,
            stiffness: 100,
        },
    });

    return (
        <div>
            <AbsoluteFill>
                {imageList?.map((item, index) => {
                    const sceneDuration = getDurationFrame() / imageList.length;
                    const startTime = index * sceneDuration;
                    const transition = getSceneTransition(index);

                    return (
                        <Sequence key={index} from={startTime} durationInFrames={sceneDuration}>
                            <AbsoluteFill
                                style={{
                                    opacity: transition.opacity,
                                    transform: `scale(${transition.scale}) rotate(${transition.rotation}deg)`,
                                }}
                            >
                                <Img
                                    src={item}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        filter: "brightness(1.1) contrast(1.1)",
                                    }}
                                />
                            </AbsoluteFill>
                        </Sequence>
                    );
                })}
            </AbsoluteFill>

            {currentCaption && (
                <AbsoluteFill
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        bottom: 100,
                        height: 250,
                        textAlign: 'center',
                        top: 1000,
                        padding: '20px',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        transform: `scale(${captionSpring})`,
                        opacity: captionSpring,
                    }}
                >
                    <h2
                        className={captionStyles[selectedCaptionStyle]}
                        style={{
                            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                            fontSize: '3.2rem',
                            fontWeight: 'bold',
                            letterSpacing: '1px',
                            transition: 'all 0.3s ease',
                            lineHeight: '1.2',
                            maxWidth: '90%',
                            margin: '0 auto',
                        }}
                    >
                        {currentCaption}
                    </h2>
                </AbsoluteFill>
            )}

            {videoData?.audioUrl && <Audio src={videoData.audioUrl} />}
        </div>
    );
}

export default RemotionComposition;
