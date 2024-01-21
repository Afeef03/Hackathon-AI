import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <header className="flex justify-between items-center w-full mt-5 border-b-2 pb-7 sm:px-4 px-2">
            <Link href="/" className="flex space-x-3">
                <Image
                    alt="header text"
                    src="/log.svg"
                    className="sm:w-12 sm:h-12 w-8 h-8"
                    width={32}
                    height={32}

                />

            </Link>
            <div className="flex items-center">
                <div className="bg-gray-200 rounded-full py-2 px-4 inline-flex items-center">
                    <p className="sm:text-2xl text-2xl font-bold ml-2 tracking-tight text-gray-700">Free, Fun, and Effective</p>
                </div>
            </div>
        </header>
    );
}
