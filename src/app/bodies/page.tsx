"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function BodiesPage() {
    const [cameras, setCameras] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // 필터 상태
    const [selectedBrand, setSelectedBrand] = useState('All');
    const [selectedLevel, setSelectedLevel] = useState('All');

    // 🎯 비교 기능 상태 (선택된 카메라 목록, 모달 창 열림 여부)
    const [compareList, setCompareList] = useState<any[]>([]);
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

    useEffect(() => {
        const fetchCameras = async () => {
            const { data } = await supabase.from('bodies').select('*');
            if (data) setCameras(data);
            setLoading(false);
        };
        fetchCameras();
    }, []);

    const filteredCameras = cameras.filter((camera) => {
        const matchBrand = selectedBrand === 'All' || camera.brand === selectedBrand;
        // 'level' 또는 'tier' 컬럼을 모두 지원하도록 합니다.
        const cameraLevel = camera.level || camera.tier || '미정';
        const matchLevel = selectedLevel === 'All' || cameraLevel === selectedLevel;
        return matchBrand && matchLevel;
    });

    const getLevelColor = (level: string) => {
        if (level === '보급기') return 'bg-green-900/90 text-green-200 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]';
        if (level === '중급기') return 'bg-blue-900/90 text-blue-200 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]';
        if (level === '상급기' || level === '고급기') return 'bg-red-900/90 text-red-200 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]';
        return 'bg-gray-800 text-gray-300 border-gray-600';
    };

    // 🎯 비교함에 넣고 빼는 마법의 함수
    const toggleCompare = (camera: any) => {
        if (compareList.find((c) => c.id === camera.id)) {
            setCompareList(compareList.filter((c) => c.id !== camera.id)); // 이미 있으면 빼기
        } else {
            if (compareList.length >= 3) {
                alert('비교는 최대 3대까지만 가능합니다! 😅');
                return;
            }
            setCompareList([...compareList, camera]); // 없으면 넣기
        }
    };

    if (loading) {
        return <div className="text-center text-white mt-20 text-xl font-bold">카메라 정보를 불러오는 중입니다... 📷</div>;
    }

    return (
        <div className="container mx-auto p-6 max-w-7xl mt-10 relative pb-32">
            <div className="mb-10 text-white">
                <h1 className="text-4xl font-extrabold mb-3 tracking-tight">카메라 바디</h1>
                <p className="text-gray-400">시장을 선도하는 주요 브랜드의 미러리스 & DSLR 라인업 (실시간 데이터베이스 연동)</p>
            </div>

            {/* 필터 버튼 영역 */}
            <div className="mb-8 space-y-4 bg-[#1c1c1c] p-6 rounded-2xl border border-gray-800">
                <div className="flex items-center flex-wrap gap-3">
                    <span className="text-gray-500 font-bold text-sm mr-2 w-16">브랜드</span>
                    {/* 사용자 요청에 따른 브랜드 순서: Canon, Nikon, Sony */}
                    {['All', 'Canon', 'Nikon', 'Sony'].map((brand) => (
                        <button
                            key={brand}
                            onClick={() => setSelectedBrand(brand)}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${selectedBrand === brand ? 'bg-white text-black shadow-lg scale-105' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                }`}
                        >
                            {brand === 'All' ? '전체 보기' : brand}
                        </button>
                    ))}
                </div>
                <div className="flex items-center flex-wrap gap-3">
                    <span className="text-gray-500 font-bold text-sm mr-2 w-16">등급</span>
                    {['All', '보급기', '중급기', '상급기'].map((level) => (
                        <button
                            key={level}
                            onClick={() => setSelectedLevel(level)}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${selectedLevel === level ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] scale-105' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                }`}
                        >
                            {level === 'All' ? '모든 등급' : level}
                        </button>
                    ))}
                </div>
            </div>

            {/* 카메라 카드 목록 영역 */}
            {filteredCameras.length === 0 ? (
                <div className="text-center py-32 text-gray-500 text-lg">선택하신 조건에 맞는 카메라가 없습니다. 😅</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredCameras.map((camera) => {
                        const isComparing = compareList.find((c) => c.id === camera.id); // 비교함에 있는지 확인

                        return (
                            <div key={camera.id} className={`bg-[#1c1c1c] border rounded-2xl overflow-hidden hover:border-gray-500 transition-all duration-300 group flex flex-col h-full ${isComparing ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-gray-800'}`}>
                                <div className="relative h-56 bg-white p-6 flex items-center justify-center overflow-hidden">
                                    <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-extrabold rounded-full border backdrop-blur-md z-10 ${getLevelColor(camera.level || camera.tier || '미정')}`}>
                                        {camera.level || camera.tier || '상태 미정'}
                                    </span>
                                    <img src={camera.image_url || camera.imageUrl} alt={camera.name || camera.model} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                </div>

                                <div className="p-5 flex flex-col flex-grow">
                                    <span className="text-xs text-blue-500 font-bold tracking-widest uppercase mb-1">{camera.brand}</span>
                                    <h2 className="text-xl font-extrabold text-white tracking-tight">{camera.name || camera.model}</h2>

                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {camera.sensor && <span className="bg-gray-800 text-gray-200 text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-600 shadow-sm">{camera.sensor}</span>}
                                        {camera.pixels && <span className="bg-gray-800 text-gray-200 text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-600 shadow-sm">{camera.pixels} 화소</span>}
                                    </div>

                                    <div className="mt-auto pt-6 flex items-end justify-between">
                                        <p className="text-xl font-bold text-white">
                                            {camera.price?.toLocaleString()} <span className="text-xs font-normal text-gray-400">원</span>
                                        </p>
                                    </div>

                                    {/* 🎯 버튼 영역 업데이트 */}
                                    <div className="mt-4 flex gap-2">
                                        <Link href={`/bodies/${camera.id}`} className="flex-1 text-center bg-white text-black py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition">
                                            자세히 보기
                                        </Link>
                                        <button
                                            onClick={() => toggleCompare(camera)}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold transition border ${isComparing ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'}`}
                                        >
                                            {isComparing ? '비교 취소' : '비교'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 🎯 1. 하단 플로팅 바 (비교함) */}
            {compareList.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-gray-800 p-4 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in-up">
                    <div className="flex flex-wrap gap-3">
                        {compareList.map((c) => (
                            <div key={c.id} className="flex items-center gap-3 bg-gray-800 pl-2 pr-4 py-1 rounded-full border border-gray-700">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden p-1">
                                    <img src={c.image_url || c.imageUrl} alt={c.name || c.model} className="w-full h-full object-contain" />
                                </div>
                                <span className="text-sm font-bold text-white">{c.name || c.model}</span>
                                <button onClick={() => toggleCompare(c)} className="text-gray-400 hover:text-red-400 font-bold">✕</button>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400 font-medium"><strong className="text-white">{compareList.length}</strong> / 3 대 선택됨</span>

                        {/* 👇 여기에 '전체 삭제' 버튼이 추가되었습니다! 👇 */}
                        <button
                            onClick={() => setCompareList([])}
                            className="text-sm text-gray-400 hover:text-red-400 transition-colors font-bold underline underline-offset-4 decoration-gray-600 hover:decoration-red-400"
                        >
                            전체 삭제
                        </button>
                        {/* 👆 여기까지 👆 */}

                        <button
                            onClick={() => setIsCompareModalOpen(true)}
                            disabled={compareList.length < 2}
                            className={`px-8 py-3 rounded-full font-extrabold text-white transition-all ${compareList.length >= 2 ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-gray-700 cursor-not-allowed text-gray-500'
                                }`}
                        >
                            스펙 비교하기
                        </button>
                    </div>
                </div>
            )}

            {/* 🎯 2. 스펙 비교 모달 창 (팝업) */}
            {isCompareModalOpen && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-[#1c1c1c] w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl border border-gray-700 shadow-2xl custom-scrollbar">

                        <div className="sticky top-0 bg-[#1c1c1c] p-6 border-b border-gray-800 flex justify-between items-center z-10">
                            <h2 className="text-2xl font-extrabold text-white">🔥 카메라 스펙 정밀 비교</h2>
                            <button onClick={() => setIsCompareModalOpen(false)} className="text-gray-400 hover:text-white text-3xl transition-colors">✕</button>
                        </div>

                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-gray-300 border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="p-4 border-b border-gray-800 w-32 font-bold text-gray-500 bg-[#1c1c1c] sticky left-0 z-20">항목</th>
                                            {compareList.map((c) => (
                                                <th key={c.id} className="p-4 border-b border-gray-800 text-center min-w-[250px]">
                                                    <div className="w-40 h-40 mx-auto bg-white rounded-2xl flex items-center justify-center p-4 mb-4 shadow-inner">
                                                        <img src={c.image_url || c.imageUrl} alt={c.name || c.model} className="w-full h-full object-contain" />
                                                    </div>
                                                    <div className="text-blue-500 text-xs font-bold uppercase tracking-wider mb-1">{c.brand}</div>
                                                    <div className="font-extrabold text-xl text-white mb-2">{c.name || c.model}</div>
                                                    <div className="text-lg font-bold">{c.price?.toLocaleString()} <span className="text-sm font-normal text-gray-400">원</span></div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {[
                                            { label: '분류', key: 'type' },
                                            { label: '등급', key: 'level' },
                                            { label: '센서', key: 'sensor' },
                                            { label: '화소수', key: 'pixels' },
                                            { label: '렌즈 마운트', key: 'mount' },
                                            { label: '동영상', key: 'video' },
                                            { label: '연사 속도', key: 'fps' },
                                            { label: '손떨림 보정', key: 'stabilization' },
                                            { label: '디스플레이', key: 'display' },
                                            { label: '무게', key: 'weight' },
                                        ].map((spec) => (
                                            <tr key={spec.key} className="hover:bg-gray-800/30 transition-colors">
                                                <td className="p-4 font-bold text-gray-500 bg-[#1c1c1c] sticky left-0 z-10">{spec.label}</td>
                                                {compareList.map((c) => (
                                                    <td key={`${c.id}-${spec.key}`} className="p-4 text-center font-medium text-gray-200">
                                                        {c[spec.key] || c.tier || '-'}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
