import React from 'react'
import '@/styles/Home.module.css'
import Image from 'next/image';
import { Input, Button } from "@material-tailwind/react";

const ImageGenerator = () => {
    const [email, setEmail] = React.useState("");
    const onChange = ({ target }) => setEmail(target.value);

    return (
        <section className='px-12'>
            <div className='flex justify-center flex-col rounded-3xl p-12' style={{ backgroundColor: 'rgb(8 19 32)'}}>
                <h1 className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-center py-3 font-bold text-6xl my-5">Talkify AI</h1>
                <div className="img-loading">
                    <div className="image flex justify-center">
                        <Image src='/images/default-img.webp' className='rounded-2xl' alt='default-img' width={400} height={500} />
                    </div>
                </div>
                <div className="relative flex justify-center w-full m-auto my-5 max-w-[24rem]">
                    <Input
                        type="text"
                        label="Describe what you want to generate.."
                        value={email}
                        onChange={onChange}
                        className="pr-20"
                        containerProps={{
                            className: "min-w-0",
                        }}
                    />
                    <Button
                        size="sm"
                        color={email ? "white" : "white"}
                        disabled={!email}
                        className="!absolute right-1 top-1 rounded"
                    >
                        Generate
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default ImageGenerator
