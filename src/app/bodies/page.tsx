"use client"; // 필터(버튼 클릭) 기능을 사용하기 위한 마법의 명령어

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function BodiesPage() {
    const [cameras, setCameras] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // 현재 선택된 필터 상태를 저장하는 공간
    const [selectedBrand, setSelectedBrand] = useState('All');
    const [selectedLevel, setSelectedLevel] = useState('All');

    // 처음에 화면이 켜질 때 Supabase에서 데이터를 가져옵니다.
    useEffect(() => {
        const fetchCameras = async () => {
            const { data } = await supabase.from('bodies').select('*');
            if (data) setCameras(data);
            setLoading(false);
        };
        fetchCameras();
    }, []);

    // 선택된 브랜드와 등급에 맞춰 카메라를 걸러내는(필터링) 로직
    const filteredCameras = cameras.filter((camera) => {
        const matchBrand = selectedBrand === 'All' || camera.brand === selectedBrand;
        // 'level' 또는 'tier' 컬럼을 모두 지원하도록 합니다.
        const cameraLevel = camera.level || camera.tier || '미정';
        const matchLevel = selectedLevel === 'All' || cameraLevel === selectedLevel;
        return matchBrand && matchLevel;
    });

    // 등급별로 배지 색상을 화려하게 바꿔주는 함수!
    const getLevelColor = (level: string) => {
        if (level === '보급기') return 'bg-green-900/90 text-green-200 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]';
        if (level === '중급기') return 'bg-blue-900/90 text-blue-200 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]';
        if (level === '상급기' || level === '고급기') return 'bg-red-900/90 text-red-200 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]';
        return 'bg-gray-800 text-gray-300 border-gray-600'; // 미정일 때 기본색
    };

    if (loading) {
        return <div className="text-center text-white mt-20 text-xl font-bold">카메라 정보를 불러오는 중입니다... 📷</div>;
    }

    return (
        <div className="container mx-auto p-6 max-w-7xl mt-10">
            <div className="mb-10 text-white">
                <h1 className="text-4xl font-extrabold mb-3 tracking-tight text-white">카메라 바디</h1>
                <p className="text-gray-400">시장을 선도하는 주요 브랜드의 미러리스 & DSLR 라인업</p>
            </div>

            {/* 👇 필터 버튼 영역 👇 */}
            <div className="mb-8 space-y-4 bg-[#1c1c1c] p-6 rounded-2xl border border-gray-800">

                {/* 1. 브랜드 필터 */}
                <div className="flex items-center flex-wrap gap-3">
                    <span className="text-gray-500 font-bold text-sm mr-2 w-16">브랜드</span>
                    {['All', 'Canon', 'Nikon', 'Sony'].map((brand) => (
                        <button
                            key={brand}
                            onClick={() => setSelectedBrand(brand)}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${selectedBrand === brand
                                ? 'bg-white text-black shadow-lg scale-105'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                }`}
                        >
                            {brand === 'All' ? '전체 보기' : brand}
                        </button>
                    ))}
                </div>

                {/* 2. 등급(Level) 필터 */}
                <div className="flex items-center flex-wrap gap-3">
                    <span className="text-gray-500 font-bold text-sm mr-2 w-16">등급</span>
                    {['All', '보급기', '중급기', '상급기'].map((level) => (
                        <button
                            key={level}
                            onClick={() => setSelectedLevel(level)}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${selectedLevel === level
                                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] scale-105'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                }`}
                        >
                            {level === 'All' ? '모든 등급' : level}
                        </button>
                    ))}
                </div>
            </div>

            {/* 👇 카메라 카드 목록 영역 👇 */}
            {filteredCameras.length === 0 ? (
                <div className="text-center py-32 text-gray-500 text-lg">
                    선택하신 조건에 맞는 카메라가 없습니다. 😅
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredCameras.map((camera) => (
                        <div key={camera.id} className="bg-[#1c1c1c] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-colors group flex flex-col h-full shadow-lg">

                            {/* 이미지 및 등급 배지 영역 */}
                            <div className="relative h-56 bg-white p-6 flex items-center justify-center overflow-hidden">
                                {/* 🎨 다이내믹 컬러가 적용된 등급 배지! */}
                                <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-extrabold rounded-full border backdrop-blur-md z-10 ${getLevelColor(camera.level || camera.tier || '미정')}`}>
                                    {camera.level || camera.tier || '상태 미정'}
                                </span>

                                <img
                                    src={camera.image_url || camera.imageUrl}
                                    alt={camera.name || camera.model}
                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>

                            {/* 하단 정보 영역 */}
                            <div className="p-5 flex flex-col flex-grow">
                                <span className="text-xs text-blue-500 font-bold tracking-widest uppercase mb-1">{camera.brand}</span>
                                <h2 className="text-xl font-extrabold text-white tracking-tight">{camera.name || camera.model}</h2>

                                {/* 핵심 스펙 가독성 개선 배지 */}
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {camera.sensor && (
                                        <span className="bg-gray-800 text-gray-200 text-[11px] font-medium px-2 py-1 rounded border border-gray-700">
                                            {camera.sensor}
                                        </span>
                                    )}
                                    {camera.pixels && (
                                        <span className="bg-gray-800 text-gray-200 text-[11px] font-medium px-2 py-1 rounded border border-gray-700">
                                            {camera.pixels} 화소
                                        </span>
                                    )}
                                </div>

                                <div className="mt-auto pt-6 flex items-end justify-between">
                                    <p className="text-xl font-bold text-white">
                                        {camera.price?.toLocaleString()} <span className="text-xs font-normal text-gray-400">원</span>
                                    </p>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <Link href={`/bodies/${camera.id}`} className="flex-1 text-center bg-white text-black py-2 rounded-lg text-sm font-bold hover:bg-zinc-200 transition">
                                        자세히 보기
                                    </Link>
                                    <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm font-bold hover:bg-gray-700 transition border border-gray-700">
                                        비교
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
