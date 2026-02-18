"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function LensDetailPage() {
    const params = useParams(); // URL에서 [id] 값을 가져옵니다.
    const [lens, setLens] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLens = async () => {
            // id 값과 일치하는 렌즈 딱 하나만(single) 가져옵니다.
            const { data } = await supabase
                .from('lenses')
                .select('*')
                .eq('id', params.id)
                .single();

            if (data) setLens(data);
            setLoading(false);
        };
        if (params.id) fetchLens();
    }, [params.id]);

    // 등급별 컬러 배지 (목록과 동일하게 맞춤)
    const getLevelColor = (level: string) => {
        if (level === '보급기') return 'bg-green-900/90 text-green-200 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]';
        if (level === '중급기') return 'bg-blue-900/90 text-blue-200 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]';
        if (level === '상급기') return 'bg-red-900/90 text-red-200 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]';
        if (level === '최상급기') return 'bg-purple-900/90 text-purple-200 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]';
        return 'bg-gray-800 text-gray-300 border-gray-600';
    };

    if (loading) return <div className="text-center text-white mt-32 text-2xl font-bold animate-pulse">렌즈 정보를 정밀 스캔 중입니다... 🔍</div>;
    if (!lens) return <div className="text-center text-white mt-32 text-2xl font-bold">렌즈를 찾을 수 없습니다. 😅</div>;

    return (
        <div className="container mx-auto p-6 max-w-6xl mt-10 text-white animate-fade-in-up">
            {/* 뒤로 가기 버튼 */}
            <Link href="/lenses" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors font-bold group">
                <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> 렌즈 목록으로 돌아가기
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* 왼쪽: 초대형 이미지 영역 */}
                <div className="bg-white rounded-[2rem] p-12 flex items-center justify-center h-[500px] lg:h-[600px] shadow-[0_0_40px_rgba(255,255,255,0.05)] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-transparent opacity-50"></div>
                    <img
                        src={lens.image_url}
                        alt={lens.name}
                        className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                </div>

                {/* 오른쪽: 렌즈 상세 정보 및 스펙 영역 */}
                <div className="flex flex-col justify-center">

                    {/* 상단 스펙 배지 모음 */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-extrabold border backdrop-blur-md ${getLevelColor(lens.level)}`}>
                            {lens.level}
                        </span>
                        <span className="bg-teal-900/80 text-teal-200 text-sm font-bold px-4 py-1.5 rounded-full border border-teal-500 shadow-sm">
                            {lens.angle}
                        </span>
                        <span className="bg-gray-800 text-gray-300 text-sm font-bold px-4 py-1.5 rounded-full border border-gray-600 shadow-sm">
                            {lens.lens_type}
                        </span>
                    </div>

                    <span className="text-sm text-blue-500 font-black tracking-[0.2em] uppercase mb-2">{lens.brand}</span>
                    <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">{lens.name}</h1>

                    <p className="text-gray-400 text-lg mb-10 leading-relaxed break-keep">
                        "{lens.description}"
                    </p>

                    <div className="mb-10">
                        <p className="text-4xl font-black text-white">
                            {lens.price?.toLocaleString()} <span className="text-xl font-medium text-gray-500 ml-1">원</span>
                        </p>
                    </div>

                    {/* 하단 상세 스펙 테이블 */}
                    <div className="bg-[#1c1c1c] rounded-2xl border border-gray-800 p-8 shadow-inner">
                        <h3 className="text-xl font-extrabold mb-6 border-b border-gray-800 pb-4 text-white">렌즈 상세 스펙</h3>

                        <div className="grid grid-cols-2 gap-y-6 text-base">
                            <div className="text-gray-500 font-bold">마운트 규격</div>
                            <div className="text-gray-200 font-extrabold">{lens.mount}</div>

                            <div className="text-gray-500 font-bold">초점 거리</div>
                            <div className="text-gray-200 font-extrabold">{lens.focal_length}</div>

                            <div className="text-gray-500 font-bold">최대 개방 조리개</div>
                            <div className="text-yellow-400 font-black text-lg">{lens.aperture}</div>

                            <div className="text-gray-500 font-bold">무게</div>
                            <div className="text-gray-200 font-extrabold">{lens.weight} g</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
