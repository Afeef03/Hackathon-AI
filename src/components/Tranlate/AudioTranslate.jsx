import Image from "next/image";
import React, { useState, useEffect } from "react";
import LoadingDots from "./LoadingDots";
import { Toaster, toast } from "react-hot-toast";

const AudioTranslate = () => {
    const [generatedTranslation, setGeneratedTranslation] = useState("");
    const [text, setText] = useState("");
    const [availableVoices, setAvailableVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);

    const speakText = (text) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.onend = () => {
            const blob = new Blob([new Uint8Array(audioBuffer)]);
            setAudioBlob(blob);
        };

        const audioBuffer = [];
        utterance.onaudioprocess = (event) => {
            const { inputBuffer } = event;
            const data = new Float32Array(inputBuffer.getChannelData(0));
            const buffer = new Int16Array(data.length);

            for (let i = 0; i < data.length; i++) {
                buffer[i] = data[i] * 0x7fff;
            }

            audioBuffer.push(new Uint8Array(buffer));
        };

        synth.speak(utterance);
    };

    const handleTranslate = () => {
        // Replace this with your translation logic
        // For now, let's assume the translation is the same as the entered text
        setGeneratedTranslation(text);

        // Speak the translated text
        speakText(text);
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(generatedTranslation);
        toast("Translation copied to clipboard", {
            icon: "✂️",
        });
    };

    const handleDownloadAudio = () => {
        if (audioBlob) {
            const extension = audioBlob.type.split("/")[1]; // Get the file extension from the MIME type
            const url = URL.createObjectURL(audioBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `translated_audio.mp3`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            toast("No audio available for download.", { icon: "🔊" });
        }
    };


    const updateVoices = () => {
        const synth = window.speechSynthesis;
        const voices = synth.getVoices();
        setAvailableVoices(voices);
        if (voices.length > 0) {
            setSelectedVoice(voices[0]); // Default to the first available voice
        }
    };

    useEffect(() => {
        updateVoices();
        window.speechSynthesis.onvoiceschanged = updateVoices;
    }, []);

    const handleVoiceChange = (selectedVoiceName) => {
        const newSelectedVoice = availableVoices.find(
            (voice) => voice.name === selectedVoiceName
        );
        if (newSelectedVoice) {
            setSelectedVoice(newSelectedVoice);
            toast(`Voice changed to ${newSelectedVoice.name}`);
            speakText("Voice changed.");
        }
    };

    return (
        <div className="max-w-xl w-full">
            <div className="flex mt-10 items-center space-x-3 ">
                <Image src="/1-black.png" width={30} height={30} alt="1 icon" />
                <p className="text-left font-medium text-white">
                    Enter the text you want to translate.
                </p>
            </div>
            <textarea
                className="block p-2.5 my-3 w-full h-[80px] text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-black focus:border-black dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-black dark:focus:border-black"
                placeholder="Write your text here..."
                onChange={(e) => setText(e.target.value)}
            ></textarea>

            <div className="flex space-x-2">
                <button
                    className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300"
                    onClick={handleTranslate}
                >
                    Translate & Speak
                </button>

                <select
                    value={selectedVoice ? selectedVoice.name : ""}
                    onChange={(e) => handleVoiceChange(e.target.value)}
                    className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300"
                >
                    {availableVoices.map((voice) => (
                        <option key={voice.name} value={voice.name}>
                            {voice.name}
                        </option>
                    ))}
                </select>

                <button
                    className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300"
                    onClick={handleDownloadAudio}
                >
                    Download Audio
                </button>
            </div>

            {generatedTranslation && (
                <>
                    <label className="block my-2 text-md text-left font-medium text-gray-900 dark:text-white">
                        Translation:
                    </label>
                    <div
                        className="p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                        onClick={handleCopyToClipboard}
                    >
                        <p> {generatedTranslation}</p>
                    </div>
                    <p className="my-1 text-sm text-gray-500 dark:text-gray-300">
                        Click on translation to copy on clipboard
                    </p>
                </>
            )}
        </div>
    );
};

export default AudioTranslate;
