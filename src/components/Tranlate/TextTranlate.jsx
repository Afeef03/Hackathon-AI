import Image from "next/image";
import axios from 'axios';
import React, { useState, useEffect } from "react";
import LoadingDots from "./LoadingDots";
import languages from '../../tools/Languages'
import { Toaster, toast } from "react-hot-toast";

const TextTranslate = () => {
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState(languages[0].value);
    const [generatedTranslation, setGeneratedTranslation] = useState("");
    const [text, setText] = useState("");
    const currentModel = "gpt-4";

    const prompt = `Please translate the following text into ${language}. The translation should always be in ${language}. \n\nOriginal text:\n"${text}"\n\nPlease provide your translation below:`;



    const translateText = async () => {
        setGeneratedTranslation("");
        //   setLoading(true);

        try {

            const url = "https://api.openai.com/v1/chat/completions"
            const data = {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt },
                ],
            };
            // const res = await axios.post("https://api.openai.com/v1/chat/completions")
            const key = "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"
            const header = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${key}`,
            };

            axios.post(url, data, { headers: header }).then((response) => {
                setGeneratedTranslation(response.data.choices[0].message.content);
                console.log(response.data);
            })
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred while translating.");
        }
    }



    const handleChange = (event) => {
        const selectedValue = event.target.value;
        const selectedLabel = languages.find(
            (language) => language.value === selectedValue
        )?.value;
        if (selectedLabel) {
            setLanguage(selectedLabel);
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
            <div className="flex mb-5 items-center space-x-3">
                <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
                <p className="text-left font-medium text-white">Choose your Language.</p>
            </div>

            <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-black dark:focus:border-black"
                onChange={handleChange}
                value={language}
            >
                {languages.map((language) => (
                    <option key={language.value} value={language.value}>
                        {language.label}
                    </option>
                ))}
            </select>

            {!loading && (
                <button
                    className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                    onClick={translateText}
                >
                    Translate &rarr;
                </button>
            )}
            {loading && (
                <button
                    className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                    disabled
                >
                    <LoadingDots color="white" style="large" />
                </button>
            )}

            {generatedTranslation && (
                <>
                    <label className="block my-2 text-md text-left font-medium text-gray-900 dark:text-white">
                        Translation:
                    </label>
                    <div
                        className="p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer"
                        onClick={() => {
                            navigator.clipboard.writeText(generatedTranslation);
                            toast("Translation copied to clipboard", {
                                icon: "✂️",
                            });
                        }}
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

export default TextTranslate;
