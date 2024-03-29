import TypingAnimation from "./TypingAnimation";
import axios from "axios";
import styles from "@/styles/Home.module.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";
import { AiFillAudio } from "react-icons/ai";
import { FaStop } from "react-icons/fa";

const TextChat = () => {
    const [inputValue, setInputValue] = useState("");
    const [chatLog, setChatLog] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
        useSpeechRecognition();

    if (browserSupportsSpeechRecognition === null) return null;

    // if (!browserSupportsSpeechRecognition) {
    //     return toast;
    // }

    const handleStartListening = () => {
        setIsListening(true);
        resetTranscript(); // Clear any existing transcript
        SpeechRecognition.startListening();
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
            sendMessage(transcript);
            resetTranscript();
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setChatLog((prevChatLog) => [
            ...prevChatLog,
            { type: "user", message: inputValue },
        ]);

        sendMessage(inputValue);

        setInputValue("");
    };

    const sendMessage = (message) => {
        const url = "https://api.openai.com/v1/chat/completions";
        const data = {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message },
            { role: "user", content: "Whats your name?" },
            { role: "user", content: "Another user message if needed" }, // Add other user messages if necessary
            { role: "assistant",content: "My name is mohd afeef. How can I help you" },
            ],
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

                const botMessage = response.data.choices[0].message.content;

                // Check if the response is in points or a paragraph
                const isPoints = botMessage.includes("\n1.");

                const formattedMessage = isPoints ? (
                    <ul>
                        {botMessage.split("\n").map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                ) : (
                    <p>{botMessage}</p>
                );

                setChatLog((prevChatLog) => [
                    ...prevChatLog,
                    { type: "bot", message: formattedMessage },
                ]);

                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                console.log(error);
            });
    };


    //   const sendAudio = (message) => {
    //     const url = "https://api.openai.com/v1/audio/speech";
    //     const data = {
    //       model: "tts-1",
    //       messages: [{ role: "user", content: message }],
    //     };
    //     const key = "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";
    //     const header = {
    //       "Content-Type": "application/json",
    //       Authorization: Bearer ${key},
    //     };

    //     setIsLoading(true);

    //     axios
    //       .post(url, data, { headers: header })
    //       .then((response) => {
    //         console.log(response);
    //         setChatLog((prevChatLog) => [
    //           ...prevChatLog,
    //           { type: "bot", message: response.data.choices[0].message.content },
    //         ]);
    //         setIsLoading(false);
    //       })
    //       .catch((error) => {
    //         setIsLoading(false);
    //         console.log(error);
    //       });
    //   };

    return (
        //max-w-[700px]
        <div className="container mx-auto ">
            <div className="flex flex-col bg-gray-900">
                <h1 className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-center py-3 font-bold text-6xl">
                    Talkify AI
                </h1>
                <div className="flex-grow p-6">
                    <div className="flex flex-col space-y-2">
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
                                    {/* <img src="/images/default-img.webp" alt="img" /> */}
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
                        <input
                            type="file"
                            className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300"


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
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TextChat;