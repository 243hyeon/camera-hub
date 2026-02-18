"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useAppContext } from '@/components/AppProvider';

export default function BodiesPage() {
    const { lang } = useAppContext();
    const [cameras, setCameras] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // 🎯 다중 필터 상태
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

    // 🎯 비교 기능 상태
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

    // 필터 토글 함수
    const toggleFilter = (currentList: string[], value: string, setter: (val: string[]) => void) => {
        if (value === 'All') {
            setter([]);
        } else {
            if (currentList.includes(value)) {
                setter(currentList.filter(item => item !== value));
            } else {
                setter([...currentList, value]);
            }
        }
    };

    // 🎯 필터링 로직
    const filteredCameras = cameras.filter((camera) => {
        const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(camera.brand);
        const cameraLevel = camera.level || camera.tier || '미정';
        const matchLevel = selectedLevels.length === 0 || selectedLevels.includes(cameraLevel);
        return matchBrand && matchLevel;
    });

    // 🎯 다국어 번역 딕셔너리
    const t = {
        title: lang === 'KR' ? '카메라 바디' : 'Camera Bodies',
        desc: lang === 'KR' ? '시장을 선도하는 주요 브랜드의 미러리스 & DSLR 라인업 (실시간 데이터베이스 연동)' : 'Leading mirrorless & DSLR lineups from major brands (Real-time DB Sync)',
        brandFilter: lang === 'KR' ? '브랜드' : 'Brand',
        levelFilter: lang === 'KR' ? '등급' : 'Level',
        all: lang === 'KR' ? '전체 보기' : 'All',
        allLevels: lang === 'KR' ? '모든 등급' : 'All Levels',
        noResult: lang === 'KR' ? '선택하신 조건에 맞는 카메라가 없습니다.' : 'No cameras match your criteria.',
        compareBtn: lang === 'KR' ? '비교하기' : 'Compare',
        compareCancel: lang === 'KR' ? '비교 취소' : 'Cancel',
        currency: lang === 'KR' ? '원' : 'KRW',
        loading: lang === 'KR' ? '카메라 정보를 불러오는 중입니다... 📷' : 'Loading camera data... 📷',
        compareBarSelected: lang === 'KR' ? '대 선택됨' : 'selected',
        deleteAll: lang === 'KR' ? '전체 삭제' : 'Clear All',
        startCompare: lang === 'KR' ? '스펙 비교하기' : 'Compare Specs',
        modalTitle: lang === 'KR' ? '🔥 카메라 스펙 정밀 비교' : '🔥 Detailed Spec Comparison',
        specItem: lang === 'KR' ? '항목' : 'Specs',
    };

    const levelOptions = [
        { value: '보급기', label: lang === 'KR' ? '보급기' : 'Entry-level' },
        { value: '중급기', label: lang === 'KR' ? '중급기' : 'Mid-range' },
        { value: '상급기', label: lang === 'KR' ? '상급기' : 'High-end' },
        { value: '최상급기', label: lang === 'KR' ? '최상급기' : 'Flagship' }
    ];

    const specLabels: { [key: string]: string } = {
        type: lang === 'KR' ? '분류' : 'Type',
        level: lang === 'KR' ? '등급' : 'Level',
        sensor: lang === 'KR' ? '센서' : 'Sensor',
        pixels: lang === 'KR' ? '화소수' : 'Pixels',
        mount: lang === 'KR' ? '렌즈 마운트' : 'Lens Mount',
        video: lang === 'KR' ? '동영상' : 'Video',
        fps: lang === 'KR' ? '연사 속도' : 'Burst Speed',
        stabilization: lang === 'KR' ? '손떨림 보정' : 'Stabilization',
        display: lang === 'KR' ? '디스플레이' : 'Display',
        weight: lang === 'KR' ? '무게' : 'Weight',
    };

    const getLevelColor = (level: string) => {
        if (level === '보급기') return 'bg-green-100 dark:bg-green-900/90 text-green-700 dark:text-green-200 border-green-200 dark:border-green-500 shadow-sm';
        if (level === '중급기') return 'bg-blue-100 dark:bg-blue-900/90 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-500 shadow-sm';
        if (level === '상급기' || level === '고급기') return 'bg-red-100 dark:bg-red-900/90 text-red-700 dark:text-red-200 border-red-200 dark:border-red-500 shadow-sm';
        return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    };

    const toggleCompare = (camera: any) => {
        if (compareList.find((c) => c.id === camera.id)) {
            setCompareList(compareList.filter((c) => c.id !== camera.id));
        } else {
            if (compareList.length >= 3) {
                alert(lang === 'KR' ? '비교는 최대 3대까지만 가능합니다! 😅' : 'Maximum 3 cameras can be compared! 😅');
                return;
            }
            setCompareList([...compareList, camera]);
        }
    };

    if (loading) return <div className="text-center mt-20 text-gray-900 dark:text-white text-xl font-bold">{t.loading}</div>;

    return (
        <div className="container mx-auto p-6 max-w-7xl mt-10 pb-32 transition-colors duration-300">
            {/* 헤더 영역 */}
            <div className="mb-10 text-gray-900 dark:text-white">
                <h1 className="text-4xl font-extrabold mb-3 tracking-tight">{t.title}</h1>
                <p className="text-gray-600 dark:text-gray-400">{t.desc}</p>
            </div>

            {/* 필터 영역 */}
            <div className="mb-8 space-y-4 bg-white dark:bg-[#1c1c1c] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none transition-colors duration-300">
                <div className="flex items-center flex-wrap gap-3">
                    <span className="text-gray-500 font-bold text-sm mr-2 w-16">{t.brandFilter}</span>
                    <button
                        onClick={() => toggleFilter(selectedBrands, 'All', setSelectedBrands)}
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${selectedBrands.length === 0 ? 'bg-gray-900 text-white dark:bg-white dark:text-black shadow-lg scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}`}
                    >
                        {t.all}
                    </button>
                    {['Canon', 'Nikon', 'Sony'].map((brand) => (
                        <button
                            key={brand}
                            onClick={() => toggleFilter(selectedBrands, brand, setSelectedBrands)}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${selectedBrands.includes(brand) ? 'bg-gray-900 text-white dark:bg-white dark:text-black shadow-lg scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}`}
                        >
                            {brand}
                        </button>
                    ))}
                </div>
                <div className="flex items-center flex-wrap gap-3">
                    <span className="text-gray-500 font-bold text-sm mr-2 w-16">{t.levelFilter}</span>
                    <button
                        onClick={() => toggleFilter(selectedLevels, 'All', setSelectedLevels)}
                        className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${selectedLevels.length === 0 ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}`}
                    >
                        {t.allLevels}
                    </button>
                    {levelOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => toggleFilter(selectedLevels, opt.value, setSelectedLevels)}
                            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${selectedLevels.includes(opt.value) ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 카드 리스트 영역 */}
            {filteredCameras.length === 0 ? (
                <div className="text-center py-32 text-gray-500 text-lg">{t.noResult}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredCameras.map((camera) => {
                        const isComparing = compareList.find((c) => c.id === camera.id);
                        const displayLevel = levelOptions.find(opt => opt.value === camera.level)?.label || camera.level || '미정';

                        return (
                            <div key={camera.id} className={`bg-white dark:bg-[#1c1c1c] border rounded-2xl overflow-hidden hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 group flex flex-col h-full shadow-sm hover:shadow-xl dark:shadow-none ${isComparing ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-gray-200 dark:border-gray-800'}`}>
                                <Link href={`/bodies/${camera.id}`} className="flex flex-col flex-grow">
                                    <div className="relative h-56 bg-white p-6 flex items-center justify-center overflow-hidden">
                                        <span className={`absolute top-3 left-3 px-3 py-1 text-[10px] font-black rounded-full border z-10 ${getLevelColor(camera.level || camera.tier || '미정')}`}>
                                            {displayLevel}
                                        </span>
                                        <img src={camera.image_url || camera.imageUrl} alt={camera.name || camera.model} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                    </div>

                                    <div className="p-5 flex flex-col flex-grow">
                                        <span className="text-xs text-blue-600 dark:text-blue-500 font-bold tracking-widest uppercase mb-1">{camera.brand}</span>
                                        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">{camera.name || camera.model}</h2>

                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {camera.sensor && <span className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-medium px-2.5 py-1 rounded border border-gray-200 dark:border-gray-600">{camera.sensor}</span>}
                                            {camera.pixels && <span className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-medium px-2.5 py-1 rounded border border-gray-200 dark:border-gray-600">{camera.pixels} {lang === 'KR' ? '화소' : 'MP'}</span>}
                                        </div>

                                        <div className="mt-auto pt-6 flex items-end justify-between">
                                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                {camera.price?.toLocaleString()} <span className="text-xs font-normal text-gray-500">{t.currency}</span>
                                            </p>
                                        </div>
                                    </div>
                                </Link>

                                <div className="p-5 pt-0">
                                    <button
                                        onClick={() => toggleCompare(camera)}
                                        className={`w-full py-3 rounded-lg text-sm font-bold transition border ${isComparing ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                    >
                                        {isComparing ? t.compareCancel : t.compareBtn}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 플로팅 비교바 */}
            {compareList.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#121212] border-t border-gray-200 dark:border-gray-800 p-4 z-40 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in-up transition-colors duration-300">
                    <div className="flex flex-wrap gap-3">
                        {compareList.map((c) => (
                            <div key={c.id} className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 pl-2 pr-4 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden p-1">
                                    <img src={c.image_url || c.imageUrl} alt={c.name || c.model} className="w-full h-full object-contain" />
                                </div>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{c.name || c.model}</span>
                                <button onClick={() => toggleCompare(c)} className="text-gray-400 hover:text-red-500 font-bold">✕</button>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 font-medium">
                            <strong className="text-gray-900 dark:text-white">{compareList.length}</strong> / 3 {lang === 'KR' ? '대 선택됨' : 'selected'}
                        </span>
                        <button onClick={() => setCompareList([])} className="text-sm text-gray-400 hover:text-red-500 transition-colors font-bold underline underline-offset-4">{t.deleteAll}</button>
                        <button
                            onClick={() => setIsCompareModalOpen(true)}
                            disabled={compareList.length < 2}
                            className={`px-8 py-3 rounded-full font-extrabold text-white transition-all ${compareList.length >= 2 ? 'bg-blue-600 hover:bg-blue-500 shadow-lg' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'}`}
                        >
                            {t.startCompare}
                        </button>
                    </div>
                </div>
            )}

            {/* 비교 모달 */}
            {isCompareModalOpen && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsCompareModalOpen(false)}>
                    <div className="bg-white dark:bg-[#1c1c1c] w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl border border-gray-200 dark:border-gray-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white dark:bg-[#1c1c1c] p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center z-10">
                            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">{t.modalTitle}</h2>
                            <button onClick={() => setIsCompareModalOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-3xl">✕</button>
                        </div>
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-gray-700 dark:text-gray-300 border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="p-4 border-b border-gray-200 dark:border-gray-800 w-32 font-bold text-gray-400 bg-white dark:bg-[#1c1c1c] sticky left-0 z-20">{t.specItem}</th>
                                            {compareList.map((c) => (
                                                <th key={c.id} className="p-4 border-b border-gray-200 dark:border-gray-800 text-center min-w-[250px]">
                                                    <div className="w-40 h-40 mx-auto bg-white rounded-2xl flex items-center justify-center p-4 mb-4 shadow-inner">
                                                        <img src={c.image_url || c.imageUrl} alt={c.name || c.model} className="w-full h-full object-contain" />
                                                    </div>
                                                    <div className="text-blue-600 dark:text-blue-500 text-xs font-bold uppercase tracking-wider mb-1">{c.brand}</div>
                                                    <div className="font-extrabold text-xl text-gray-900 dark:text-white mb-2">{c.name || c.model}</div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {Object.entries(specLabels).map(([key, label]) => (
                                            <tr key={key} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                                <td className="p-4 font-bold text-gray-400 bg-white dark:bg-[#1c1c1c] sticky left-0 z-10">{label}</td>
                                                {compareList.map((c) => {
                                                    let val = c[key] || '-';
                                                    if (key === 'level') val = levelOptions.find(opt => opt.value === val)?.label || val;
                                                    return (
                                                        <td key={`${c.id}-${key}`} className="p-4 text-center font-medium text-gray-900 dark:text-gray-200">
                                                            {val}
                                                        </td>
                                                    );
                                                })}
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
