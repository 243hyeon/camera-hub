"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useAppContext } from '@/components/AppProvider'; // 👈 중앙 통제실 연결!

export default function LensesPage() {
    const { lang } = useAppContext(); // 현재 언어 상태 가져오기
    const [lenses, setLenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedBrand, setSelectedBrand] = useState('All');
    const [selectedAngle, setSelectedAngle] = useState('All');
    const [selectedType, setSelectedType] = useState('All');
    const [selectedLevel, setSelectedLevel] = useState('All');

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

    const filteredLenses = lenses.filter((lens) => {
        const matchBrand = selectedBrand === 'All' || lens.brand === selectedBrand;
        const matchAngle = selectedAngle === 'All' || lens.angle === selectedAngle;
        const matchType = selectedType === 'All' || lens.lens_type === selectedType;
        const matchLevel = selectedLevel === 'All' || lens.level === selectedLevel;
        return matchBrand && matchAngle && matchType && matchLevel;
    });

    // 🎯 다국어 번역 딕셔너리
    const t = {
        title: lang === 'KR' ? '렌즈 대백과' : 'Lens Encyclopedia',
        desc: lang === 'KR' ? '당신의 시선을 완성할 70여 종의 완벽한 렌즈 라인업' : 'A complete lineup of over 70 lenses to perfect your vision',
        filterBrand: lang === 'KR' ? '브랜드' : 'Brand',
        filterAngle: lang === 'KR' ? '화각' : 'Angle',
        filterType: lang === 'KR' ? '종류' : 'Type',
        filterLevel: lang === 'KR' ? '등급' : 'Level',
        noResult: lang === 'KR' ? '조건에 맞는 렌즈가 없습니다. 😅' : 'No lenses match your criteria. 😅',
        currency: lang === 'KR' ? '원' : 'KRW',
        detailBtn: lang === 'KR' ? '자세히 보기' : 'Details',
        compareBtn: lang === 'KR' ? '비교' : 'Compare',
        cancelBtn: lang === 'KR' ? '비교 취소' : 'Cancel',
        clearAll: lang === 'KR' ? '전체 삭제' : 'Clear All',
        doCompare: lang === 'KR' ? '스펙 비교하기' : 'Compare Specs',
        selected: lang === 'KR' ? '개 선택됨' : 'selected',
    };

    // 🎯 필터 및 태그 번역 매핑
    const brandOptions = [
        { value: 'All', label: lang === 'KR' ? '전체 보기' : 'All Brands' },
        { value: 'Sony', label: 'Sony' }, { value: 'Canon', label: 'Canon' }, { value: 'Nikon', label: 'Nikon' }
    ];

    const angleOptions = [
        { value: 'All', label: lang === 'KR' ? '모든 화각' : 'All Angles' },
        { value: '광각', label: lang === 'KR' ? '광각' : 'Wide' },
        { value: '표준', label: lang === 'KR' ? '표준' : 'Standard' },
        { value: '망원', label: lang === 'KR' ? '망원' : 'Telephoto' },
        { value: '초망원', label: lang === 'KR' ? '초망원' : 'Super Telephoto' }
    ];

    const typeOptions = [
        { value: 'All', label: lang === 'KR' ? '모든 종류' : 'All Types' },
        { value: '단렌즈', label: lang === 'KR' ? '단렌즈' : 'Prime' },
        { value: '줌렌즈', label: lang === 'KR' ? '줌렌즈' : 'Zoom' },
        { value: '망원줌렌즈', label: lang === 'KR' ? '망원줌렌즈' : 'Telephoto Zoom' },
        { value: '매크로', label: lang === 'KR' ? '매크로' : 'Macro' }
    ];

    const levelOptions = [
        { value: 'All', label: lang === 'KR' ? '모든 등급' : 'All Levels' },
        { value: '보급기', label: lang === 'KR' ? '보급기' : 'Entry-level' },
        { value: '중급기', label: lang === 'KR' ? '중급기' : 'Mid-range' },
        { value: '상급기', label: lang === 'KR' ? '상급기' : 'High-end' },
        { value: '최상급기', label: lang === 'KR' ? '최상급기' : 'Flagship' }
    ];

    const toggleCompare = (lens: any) => {
        if (compareList.find((c) => c.id === lens.id)) setCompareList(compareList.filter((c) => c.id !== lens.id));
        else {
            if (compareList.length >= 3) { alert(lang === 'KR' ? '최대 3개까지만 가능합니다!' : 'Maximum 3 lenses allowed!'); return; }
            setCompareList([...compareList, lens]);
        }
    };

    if (loading) return <div className="text-center mt-20 text-gray-900 dark:text-white text-xl font-bold">Loading... 🔍</div>;

    return (
        <div className="container mx-auto p-6 max-w-7xl mt-10 relative pb-32 transition-colors duration-300">

            <div className="mb-10 text-gray-900 dark:text-white">
                <h1 className="text-4xl font-extrabold mb-3 tracking-tight">{t.title}</h1>
                <p className="text-gray-600 dark:text-gray-400">{t.desc}</p>
            </div>

            {/* 필터 영역 */}
            <div className="mb-8 space-y-4 bg-white dark:bg-[#1c1c1c] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none transition-colors duration-300">
                {[
                    { label: t.filterBrand, options: brandOptions, state: selectedBrand, set: setSelectedBrand, activeColor: 'bg-gray-900 text-white dark:bg-white dark:text-black' },
                    { label: t.filterAngle, options: angleOptions, state: selectedAngle, set: setSelectedAngle, activeColor: 'bg-teal-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.4)]' },
                    { label: t.filterType, options: typeOptions, state: selectedType, set: setSelectedType, activeColor: 'bg-gray-900 text-white dark:bg-white dark:text-black' },
                    { label: t.filterLevel, options: levelOptions, state: selectedLevel, set: setSelectedLevel, activeColor: 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' },
                ].map((filter, idx) => (
                    <div key={idx} className="flex items-center flex-wrap gap-3">
                        <span className="text-gray-500 font-bold text-sm mr-2 w-16">{filter.label}</span>
                        {filter.options.map((opt) => (
                            <button key={opt.value} onClick={() => filter.set(opt.value)} className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${filter.state === opt.value ? `${filter.activeColor} scale-105` : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}`}>
                                {opt.label}
                            </button>
                        ))}
                    </div>
                ))}
            </div>

            {/* 리스트 영역 */}
            {filteredLenses.length === 0 ? (
                <div className="text-center py-32 text-gray-500 text-lg">{t.noResult}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredLenses.map((lens) => {
                        const isComparing = compareList.find((c) => c.id === lens.id);
                        return (
                            <div key={lens.id} className={`bg-white dark:bg-[#1c1c1c] border rounded-2xl overflow-hidden hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300 group flex flex-col h-full shadow-sm hover:shadow-xl dark:shadow-none ${isComparing ? 'border-blue-500 dark:border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-gray-200 dark:border-gray-800'}`}>

                                <div className="relative h-56 bg-gray-50 dark:bg-white p-6 flex items-center justify-center overflow-hidden">
                                    <span className={`absolute top-3 left-3 px-3 py-1 text-xs font-extrabold rounded-full bg-gray-800 text-white z-10`}>
                                        {levelOptions.find(o => o.value === lens.level)?.label || lens.level}
                                    </span>
                                    <img src={lens.image_url} alt={lens.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                                </div>

                                <div className="p-5 flex flex-col flex-grow">
                                    <span className="text-xs text-blue-600 dark:text-blue-500 font-bold tracking-widest uppercase mb-1">{lens.brand}</span>
                                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">{lens.name}</h2>

                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {lens.angle && <span className="bg-teal-50 dark:bg-gray-800 text-teal-600 dark:text-teal-300 text-xs font-bold px-2.5 py-1 rounded border border-teal-200 dark:border-teal-700/50">{angleOptions.find(o => o.value === lens.angle)?.label || lens.angle}</span>}
                                        {lens.focal_length && <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-medium px-2.5 py-1 rounded border border-gray-200 dark:border-gray-600">{lens.focal_length}</span>}
                                        {lens.aperture && <span className="bg-yellow-50 dark:bg-gray-800 text-yellow-600 dark:text-yellow-500 text-xs font-bold px-2.5 py-1 rounded border border-yellow-200 dark:border-yellow-700/50">{lens.aperture}</span>}
                                        {lens.lens_type && <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium px-2.5 py-1 rounded border border-gray-200 dark:border-gray-600">{typeOptions.find(o => o.value === lens.lens_type)?.label || lens.lens_type}</span>}
                                    </div>

                                    <div className="mt-5 flex items-end justify-between flex-grow">
                                        <p className="text-xl font-bold text-gray-900 dark:text-white mt-auto">
                                            {lens.price?.toLocaleString()} <span className="text-xs font-normal text-gray-500">{t.currency}</span>
                                        </p>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <Link href={`/lenses/${lens.id}`} className="flex-1 flex items-center justify-center text-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white py-2 rounded-lg text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                                            {t.detailBtn}
                                        </Link>
                                        <button onClick={() => toggleCompare(lens)} className={`px-4 py-2 rounded-lg text-sm font-bold transition border ${isComparing ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'bg-white dark:bg-[#1c1c1c] text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                                            {isComparing ? t.cancelBtn : t.compareBtn}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 비교 플로팅 바 & 모달 (다크모드 지원) */}
            {compareList.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#121212] border-t border-gray-200 dark:border-gray-800 p-4 z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.5)] flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in-up transition-colors duration-300">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium"><strong className="text-gray-900 dark:text-white">{compareList.length}</strong> / 3 {t.selected}</span>
                        <button onClick={() => setCompareList([])} className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 font-bold underline underline-offset-4 decoration-gray-300 dark:decoration-gray-600">
                            {t.clearAll}
                        </button>
                        <button onClick={() => setIsCompareModalOpen(true)} disabled={compareList.length < 2} className={`px-8 py-3 rounded-full font-extrabold text-white transition-all ${compareList.length >= 2 ? 'bg-blue-600 hover:bg-blue-700 shadow-lg' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'}`}>
                            {t.doCompare}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
