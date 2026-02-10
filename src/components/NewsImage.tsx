"use client"; // 👈 이게 있어야 브라우저 이벤트(onError)를 쓸 수 있습니다!

import { useState } from "react";

export default function NewsImage({ src, alt, className }: { src?: string, alt: string, className?: string }) {
    const [isError, setIsError] = useState(false);

    // 이미지가 없거나 로드 중 에러가 나면 대체 화면(📷)을 보여줌
    if (!src || isError) {
        return (
            <div className={`w-full h-full flex items-center justify-center bg-zinc-800 ${className}`}>
                <span className="text-4xl opacity-20">📷</span>
            </div>
        );
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setIsError(true)} // 에러 발생 시 상태 변경
        />
    );
}
