'use client';
import { useState, useEffect } from 'react';
import { use } from "react";
import { BlobWriter, ZipWriter, BlobReader } from '@zip.js/zip.js'
import Image from "next/image";

export default function Home({ params }: { params: Promise<{ id: string }> }) {
    const unwrapParams = use(params);
    const [stickers, setStickers] = useState<{ id: string, url: string }[]>([]);

    useEffect(() => {
        fetch(`${window.location.origin}/api/store/${unwrapParams.id}`)
            .then(response => response.json())
            .then(stickers => {
                setStickers(stickers);
            });
    }, []);

    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

                {stickers ? <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={async () => {
                    const zipFileWriter = new BlobWriter();
                    const zipWriter = new ZipWriter(zipFileWriter);
                    for (const sticker of stickers) {
                        const res = await fetch(sticker.url);
                        const blob = await res.blob();
                        zipWriter.add(`${sticker.id}.png`, new BlobReader(blob));
                    }
                    zipWriter.close();
                    const zipFileBlob = await zipFileWriter.getData();

                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(zipFileBlob);
                    a.target = '_blank';
                    a.download = `${unwrapParams.id}.zip`;
                    a.click();
                }}>Download All</button> : null}

                {stickers?.map(sticker => {
                    return <>
                        <img src={sticker.url} alt={sticker.id} />
                        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={async () => {
                            const res = await fetch(sticker.url);
                            const blob = await res.blob();
                            const a = document.createElement("a");
                            a.href = URL.createObjectURL(await res.blob());
                            a.target = '_blank';
                            a.download = `${sticker.id}.png`;
                            a.click();
                        }}>{`${sticker.id}.png`}</button>
                    </>;
                })}

            </main>
            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="/file.svg"
                        alt="File icon"
                        width={16}
                        height={16}
                    />
                    Learn
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="/window.svg"
                        alt="Window icon"
                        width={16}
                        height={16}
                    />
                    Examples
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Image
                        aria-hidden
                        src="/globe.svg"
                        alt="Globe icon"
                        width={16}
                        height={16}
                    />
                    Go to nextjs.org →
                </a>
            </footer>
        </div>
    );
}
