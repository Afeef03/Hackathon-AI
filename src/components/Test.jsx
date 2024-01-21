import TypingAnimation from "./TypingAnimation";
import axios from "axios";
import styles from "@/styles/Home.module.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";
import { AiFillAudio } from "react-icons/ai";
import { FaStop } from "react-icons/fa";

const Test = () => {
    const [inputValue, setInputValue] = useState("");
    const [chatLog, setChatLog] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
        useSpeechRecognition();
    const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

    const [availableVoices, setAvailableVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    useEffect(() => {
        if (synth) {
            const voices = synth.getVoices();
            setAvailableVoices(voices);
            setSelectedVoice(voices[0]); // Default to the first available voice
        }
    }, [synth]);

    useEffect(() => {
        if (selectedVoice) {
            synth.cancel(); // Cancel any ongoing speech when the voice changes
            speakText("Voice changed."); // Speak a sample text with the new voice
        }
    }, [selectedVoice, synth]);

    const handleStartListening = (event) => {
        event.preventDefault(); // Prevent the default form submission action
        setIsListening(true);
        resetTranscript();
        SpeechRecognition.startListening();
    };

    const speakText = (text) => {
        if (synth && selectedVoice) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = selectedVoice;
            synth.speak(utterance);
        }
    };

    const handleStopListening = () => {
        setIsListening(false);
        SpeechRecognition.stopListening();
        // Process the transcript directly here
        if (transcript) {
            setChatLog((prevChatLog) => [
                ...prevChatLog,
                { type: "user", message: transcript },
            ]);
            handleUserMessage(transcript);
            resetTranscript();
        }
    };

    const handleUserMessage = (message) => {
        // Check if the user wants to change the voice
        if (
            message.toLowerCase().includes("change your accent") ||
            message.toLowerCase().includes("change your language")
        ) {
            // Provide the user with a list of available voices
            const voiceOptions = availableVoices
                .map((voice) => voice.name)
                .join(", ");
            setChatLog((prevChatLog) => [
                ...prevChatLog,
                { type: "bot", message: `Available voices: ${voiceOptions} ` },
            ]);
        } else {
            // Continue with the regular chat logic
            setChatLog((prevChatLog) => [
                ...prevChatLog,
                { type: "user", message: message },
            ]);
            sendMessage(message);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (inputValue.trim() !== "") {
            setChatLog((prevChatLog) => [
                ...prevChatLog,
                { type: "user", message: inputValue },
            ]);

            sendMessage(inputValue);

            setInputValue("");
        }
    };

    const sendMessage = (message) => {
        const url = "https://api.openai.com/v1/chat/completions";
        const data = {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }],
        };
        const key = "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";
        const header = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
        };

        setIsLoading(true);

        axios
            .post(url, data, { headers: header })
            .then((response) => {
                console.log(response);
                setChatLog((prevChatLog) => [
                    ...prevChatLog,
                    { type: "bot", message: response.data.choices[0].message.content },
                ]);
                speakText(response.data.choices[0].message.content); // Call speakText with the bot's response
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                console.log(error);
            });
    };

    const handleVoiceChange = (selectedVoiceName) => {
        const newSelectedVoice = availableVoices.find(
            (voice) => voice.name === selectedVoiceName
        );
        if (newSelectedVoice) {
            setSelectedVoice(newSelectedVoice);
        }
    };

    return (
        //max-w-[700px]
        <div className="container mx-auto">
            <div className="flex flex-col bg-gray-900" style={{ height: '100vh' }}>
                <h1 className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-center py-3 font-bold text-6xl">
                    Talkify AI
                </h1>
                <div className="flex-grow p-6">
                    <div className="flex flex-col space-y-4">
                        {chatLog.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`${message.type === "user" ? "bg-purple-500" : "bg-gray-800"
                                        } rounded-lg p-4 text-white max-w-sm`}
                                >
                                    {message.message}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div key={chatLog.length} className="flex justify-start">
                                <div className="bg-gray-800 rounded-lg p-4 text-white max-w-sm">
                                    <TypingAnimation />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="flex-none p-6 fixed-bottom">
                    <div className="flex rounded-lg border gap-3 border-gray-700 bg-gray-800">
                        <input
                            type="text"
                            className="flex-grow px-4 py-2 bg-transparent text-white focus:outline-none"
                            placeholder="Type your message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button
                            type="button"
                            className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300"
                            onClick={handleStartListening}
                            disabled={isListening}
                        >
                            <AiFillAudio />
                        </button>
                        <button
                            type="button"
                            className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300"
                            onClick={handleStopListening}
                            disabled={!isListening}
                        >
                            <FaStop />
                        </button>
                        <button
                            type="submit"
                            className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300"
                        >
                            Send
                        </button>

                        <select
                            value={selectedVoice ? selectedVoice.name : ""}
                            onChange={(e) => handleVoiceChange(e.target.value)}
                            className="bg-transparent text-white focus:outline-none"
                        >
                            {availableVoices.map((voice) => (
                                <option
                                    key={voice.name}
                                    value={voice.name}
                                    className="bg-purple-500"
                                >
                                    {voice.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Test;