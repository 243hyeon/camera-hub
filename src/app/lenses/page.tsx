"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link'; // 자세히 보기 링크용

export default function LensesPage() {
    const [lenses, setLenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // 🎯 4단 다중 필터 상태 (배열로 변경하여 중복 선택 지원!)
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedAngles, setSelectedAngles] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

    // 🎯 비교 기능 상태
    const [compareList, setCompareList] = useState<any[]>([]);
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

    useEffect(() => {
        const fetchLenses = async () => {
            const { data } = await supabase.from('lenses').select('*').order('id', { ascending: true });
            if (data) setLenses(data);
            setLoading(false);
        };
        fetchLenses();
    }, []);

    // 필터 토글 함수
    const toggleFilter = (currentList: string[], value: string, setter: (val: string[]) => void) => {
        if (value === 'All') {
            setter([]); // '전체' 클릭 시 초기화
        } else {
            if (currentList.includes(value)) {
                setter(currentList.filter(item => item !== value)); // 이미 있으면 제거
            } else {
                setter([...currentList, value]); // 없으면 추가
            }
        }
    };

    // 🎯 4단 필터링 로직 (중복 선택 지원 버전)
    const filteredLenses = lenses.filter((lens) => {
        const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(lens.brand);
        const matchAngle = selectedAngles.length === 0 || selectedAngles.includes(lens.angle);
        const matchType = selectedTypes.length === 0 || selectedTypes.includes(lens.lens_type);
        const matchLevel = selectedLevels.length === 0 || selectedLevels.includes(lens.level);
        return matchBrand && matchAngle && matchType && matchLevel;
    });

    const getLevelColor = (level: string) => {
        if (level === '보급기') return 'bg-green-900/90 text-green-200 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]';
        if (level === '중급기') return 'bg-blue-900/90 text-blue-200 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]';
        if (level === '상급기') return 'bg-red-900/90 text-red-200 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]';
        if (level === '최상급기') return 'bg-purple-900/90 text-purple-200 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]';
        return 'bg-gray-800 text-gray-300 border-gray-600';
    };

    const toggleCompare = (lens: any) => {
        if (compareList.find((c) => c.id === lens.id)) {
            setCompareList(compareList.filter((c) => c.id !== lens.id));
        } else {
            if (compareList.length >= 3) {
                alert('비교는 최대 3개까지만 가능합니다! 😅');
                return;
            }
            setCompareList([...compareList, lens]);
        }
    };

    if (loading) {
        return <div className="text-center text-white mt-20 text-xl font-bold">방대한 렌즈 정보를 불러오는 중입니다... 🔍</div>;
    }

    return (
        <div className="container mx-auto p-6 max-w-7xl mt-10 relative pb-32">
            <div className="mb-10 text-white">
                <h1 className="text-4xl font-extrabold mb-3 tracking-tight">렌즈 목록</h1>
                <p className="text-gray-400">당신의 시선을 완성할 70여 종의 완벽한 렌즈 라인업</p>
            </div>

            {/* 👇 4단 정밀 필터 영역 (중복 선택 지원!) 👇 */}
            <div className="mb-8 space-y-4 bg-[#1c1c1c] p-6 rounded-2xl border border-gray-800">

                {/* 1. 브랜드 */}
                <div className="flex items-center flex-wrap gap-3">
                    <span className="text-gray-500 font-bold text-sm mr-2 w-16">브랜드</span>
                    <button
                        onClick={() => toggleFilter(selectedBrands, 'All', setSelectedBrands)}
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${selectedBrands.length === 0 ? 'bg-white text-black shadow-lg scale-105' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                    >
                        전체 보기
                    </button>
                    {['Canon', 'Nikon', 'Sony'].map((brand) => (
                        <button
                            key={brand}
                            onClick={() => toggleFilter(selectedBrands, brand, setSelectedBrands)}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${selectedBrands.includes(brand) ? 'bg-white text-black shadow-lg scale-105' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                        >
                            {brand}
                        </button>
                    ))}
                </div>

                {/* 2. 화각 */}
                <div className="flex items-center flex-wrap gap-3">
                    <span className="text-gray-500 font-bold text-sm mr-2 w-16">화각</span>
                    <button
                        onClick={() => toggleFilter(selectedAngles, 'All', setSelectedAngles)}
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${selectedAngles.length === 0 ? 'bg-teal-600 text-white shadow-[0_0_15px_rgba(13,148,136,0.5)] scale-105' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                    >
                        모든 화각
                    </button>
                    {['광각', '표준', '망원', '초망원'].map((angle) => (
                        <button
                            key={angle}
                            onClick={() => toggleFilter(selectedAngles, angle, setSelectedAngles)}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${selectedAngles.includes(angle) ? 'bg-teal-600 text-white shadow-[0_0_15px_rgba(13,148,136,0.5)] scale-105' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                        >
                            {angle}
                        </button>
                    ))}
                </div>

                {/* 3. 종류 */}
                <div className="flex items-center flex-wrap gap-3">
                    <span className="text-gray-500 font-bold text-sm mr-2 w-16">종류</span>
                    <button
                        onClick={() => toggleFilter(selectedTypes, 'All', setSelectedTypes)}
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${selectedTypes.length === 0 ? 'bg-white text-black shadow-lg scale-105' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                    >
                        모든 종류
                    </button>
                    {['단렌즈', '줌렌즈', '매크로'].map((type) => (
                        <button
                            key={type}
                            onClick={() => toggleFilter(selectedTypes, type, setSelectedTypes)}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${selectedTypes.includes(type) ? 'bg-white text-black shadow-lg scale-105' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* 4. 등급 */}
                <div className="flex items-center flex-wrap gap-3">
                    <span className="text-gray-500 font-bold text-sm mr-2 w-16">등급</span>
                    <button
                        onClick={() => toggleFilter(selectedLevels, 'All', setSelectedLevels)}
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${selectedLevels.length === 0 ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] scale-105' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                    >
                        모든 등급
                    </button>
                    {['보급기', '중급기', '상급기', '최상급기'].map((level) => (
                        <button
                            key={level}
                            onClick={() => toggleFilter(selectedLevels, level, setSelectedLevels)}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${selectedLevels.includes(level) ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] scale-105' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </div>

            {/* 👇 렌즈 카드 목록 👇 */}
            {filteredLenses.length === 0 ? (
                <div className="text-center py-32 text-gray-500 text-lg">선택하신 조건에 맞는 렌즈가 없습니다. 😅</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredLenses.map((lens) => {
                        const isComparing = compareList.find((c) => c.id === lens.id);

                        return (
                            <div key={lens.id} className={`bg-[#1c1c1c] border rounded-2xl overflow-hidden hover:border-gray-500 transition-all duration-300 group flex flex-col h-full ${isComparing ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-gray-800'}`}>
                                <div className="relative h-56 bg-white p-6 flex items-center justify-center overflow-hidden">
                                    <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-extrabold rounded-full border backdrop-blur-md z-10 ${getLevelColor(lens.level)}`}>
                                        {lens.level || '상태 미정'}
                                    </span>
                                    <img src={lens.image_url} alt={lens.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                </div>

                                <div className="p-5 flex flex-col flex-grow">
                                    <span className="text-xs text-blue-500 font-bold tracking-widest uppercase mb-1">{lens.brand}</span>
                                    <h2 className="text-xl font-extrabold text-white tracking-tight">{lens.name}</h2>

                                    {/* 화각(angle) 배지가 맨 앞에 추가된 스펙 태그 영역 */}
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {lens.angle && <span className="bg-gray-800 text-teal-300 text-xs font-bold px-2.5 py-1 rounded border border-teal-700/50 shadow-sm">{lens.angle}</span>}
                                        {lens.focal_length && <span className="bg-gray-800 text-gray-200 text-xs font-medium px-2.5 py-1 rounded border border-gray-600 shadow-sm">{lens.focal_length}</span>}
                                        {lens.aperture && <span className="bg-gray-800 text-yellow-500 text-xs font-bold px-2.5 py-1 rounded border border-yellow-700/50 shadow-sm">{lens.aperture}</span>}
                                        {lens.lens_type && <span className="bg-gray-800 text-gray-300 text-xs font-medium px-2.5 py-1 rounded border border-gray-600 shadow-sm">{lens.lens_type}</span>}
                                    </div>

                                    <p className="text-sm text-gray-400 mt-4 line-clamp-2 break-keep flex-grow">
                                        {lens.description}
                                    </p>

                                    <div className="mt-5 flex items-end justify-between">
                                        <p className="text-xl font-bold text-white">
                                            {lens.price?.toLocaleString()} <span className="text-xs font-normal text-gray-400">원</span>
                                        </p>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <button className="flex-1 text-center bg-white text-black py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition">
                                            자세히 보기
                                        </button>
                                        <button onClick={() => toggleCompare(lens)} className={`px-4 py-2 rounded-lg text-sm font-bold transition border ${isComparing ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'}`}>
                                            {isComparing ? '비교 취소' : '비교'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 👇 렌즈 비교 플로팅 바 & 모달 👇 */}
            {compareList.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-gray-800 p-4 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in-up">
                    <div className="flex flex-wrap gap-3">
                        {compareList.map((c) => (
                            <div key={c.id} className="flex items-center gap-3 bg-gray-800 pl-2 pr-4 py-1 rounded-full border border-gray-700">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden p-1">
                                    <img src={c.image_url} alt={c.name} className="w-full h-full object-contain" />
                                </div>
                                <span className="text-sm font-bold text-white">{c.name}</span>
                                <button onClick={() => toggleCompare(c)} className="text-gray-400 hover:text-red-400 font-bold">✕</button>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400 font-medium"><strong className="text-white">{compareList.length}</strong> / 3 개 선택됨</span>
                        <button onClick={() => setCompareList([])} className="text-sm text-gray-400 hover:text-red-400 transition-colors font-bold underline underline-offset-4 decoration-gray-600 hover:decoration-red-400">
                            전체 삭제
                        </button>
                        <button onClick={() => setIsCompareModalOpen(true)} disabled={compareList.length < 2} className={`px-8 py-3 rounded-full font-extrabold text-white transition-all ${compareList.length >= 2 ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-gray-700 cursor-not-allowed text-gray-500'}`}>
                            스펙 비교하기
                        </button>
                    </div>
                </div>
            )}

            {isCompareModalOpen && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsCompareModalOpen(false)}>
                    <div className="bg-[#1c1c1c] w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl border border-gray-700 shadow-2xl custom-scrollbar" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-[#1c1c1c] p-6 border-b border-gray-800 flex justify-between items-center z-10">
                            <h2 className="text-2xl font-extrabold text-white">🔥 렌즈 스펙 정밀 비교</h2>
                            <button onClick={() => setIsCompareModalOpen(false)} className="text-gray-400 hover:text-white text-3xl transition-colors">✕</button>
                        </div>
                        <div className="p-6">
                            <table className="w-full text-left text-gray-300">
                                <thead>
                                    <tr>
                                        <th className="p-4 border-b border-gray-800 w-32 font-bold text-gray-500">항목</th>
                                        {compareList.map((c) => (
                                            <th key={c.id} className="p-4 border-b border-gray-800 text-center w-1/3">
                                                <div className="w-40 h-40 mx-auto bg-white rounded-2xl flex items-center justify-center p-4 mb-4 shadow-inner">
                                                    <img src={c.image_url} alt={c.name} className="w-full h-full object-contain" />
                                                </div>
                                                <div className="text-blue-500 text-xs font-bold uppercase tracking-wider mb-1">{c.brand}</div>
                                                <div className="font-extrabold text-xl text-white mb-2">{c.name}</div>
                                                <div className="text-lg font-bold">{c.price?.toLocaleString()} <span className="text-sm font-normal text-gray-400">원</span></div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {[
                                        { label: '렌즈 마운트', key: 'mount' },
                                        { label: '화각(분류)', key: 'angle' },
                                        { label: '종류', key: 'lens_type' },
                                        { label: '등급', key: 'level' },
                                        { label: '초점 거리', key: 'focal_length' },
                                        { label: '최대 개방 조리개', key: 'aperture' },
                                        { label: '무게', key: 'weight' },
                                    ].map((spec) => (
                                        <tr key={spec.key} className="hover:bg-gray-800/30 transition-colors">
                                            <td className="p-4 font-bold text-gray-500">{spec.label}</td>
                                            {compareList.map((c) => (
                                                <td key={`${c.id}-${spec.key}`} className={`p-4 text-center font-medium ${spec.key === 'aperture' ? 'text-yellow-400 font-bold' : spec.key === 'angle' ? 'text-teal-300 font-bold' : 'text-gray-200'}`}>
                                                    {c[spec.key] ? (spec.key === 'weight' ? `${c[spec.key]}g` : c[spec.key]) : '-'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
