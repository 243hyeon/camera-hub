// src/app/bodies/[id]/page.tsx
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const dynamic = 'force-dynamic'; // 실시간 DB 연동을 위한 마법의 한 줄!

export default async function BodyDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    // 1. 주소창의 id 값(예: 1)을 이용해 Supabase에서 딱 1개의 카메라 데이터만 뽑아옵니다.
    const { data: camera, error } = await supabase
        .from('bodies')
        .select('*')
        .eq('id', params.id)
        .single();

    // 2. 에러가 나거나 카메라가 없으면 보여줄 에러 화면
    if (error || !camera) {
        return (
            <div className="container mx-auto p-10 text-center text-white mt-20">
                <h1 className="text-2xl text-red-500 mb-4">카메라 정보를 찾을 수 없습니다. 😥</h1>
                <Link href="/bodies" className="text-blue-500 hover:underline">목록으로 돌아가기</Link>
            </div>
        );
    }

    // 3. 성공적으로 가져왔을 때 보여줄 웅장한 상세 페이지 화면
    return (
        <div className="container mx-auto p-6 max-w-5xl mt-12 text-white">
            <Link href="/bodies" className="text-gray-400 hover:text-white mb-8 inline-block transition-colors">
                ← 목록으로 돌아가기
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-[#1c1c1c] border border-gray-800 p-8 rounded-3xl shadow-2xl">

                {/* 왼쪽: 카메라 이미지 */}
                <div className="relative h-[400px] w-full bg-white rounded-2xl overflow-hidden flex items-center justify-center p-6">
                    {/* 상세 페이지는 제품의 전체 모습이 잘려선 안 되므로 object-contain을 사용합니다 */}
                    <img
                        src={camera.image_url || camera.imageUrl}
                        alt={camera.name || camera.model}
                        className="w-full h-full object-contain drop-shadow-lg"
                    />
                </div>

                {/* 오른쪽: 상세 스펙 정보 */}
                <div className="flex flex-col justify-center space-y-6">
                    <div>
                        <span className="text-sm text-blue-500 font-extrabold tracking-widest uppercase mb-2 block">
                            {camera.brand}
                        </span>
                        <h1 className="text-4xl font-extrabold tracking-tight">{camera.name || camera.model}</h1>
                    </div>

                    <p className="text-3xl font-bold">
                        {(camera.price || 0).toLocaleString()} <span className="text-xl font-medium text-gray-400">원</span>
                    </p>

                    <div className="space-y-4 mt-4 pt-6 border-t border-gray-800">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">분류</h3>
                            <p className="text-lg">{camera.type || camera.tier}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">상세 설명</h3>
                            <p className="leading-relaxed break-keep text-gray-300">
                                {camera.description || '등록된 상세 설명이 없습니다.'}
                            </p>
                        </div>
                    </div>

                    {/* 👇 여기서부터 새로 추가하는 '주요 스펙' 영역입니다 👇 */}
                    <div className="mt-8 pt-8 border-t border-gray-800">
                        <h3 className="text-lg font-bold text-white mb-6">주요 스펙</h3>
                        <div className="grid grid-cols-2 gap-4">

                            {/* 센서 */}
                            {(camera.sensor) && (
                                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 block">센서</span>
                                    <span className="text-gray-200">{camera.sensor}</span>
                                </div>
                            )}

                            {/* 화소수 */}
                            {(camera.pixels) && (
                                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 block">화소수</span>
                                    <span className="text-gray-200">{camera.pixels}</span>
                                </div>
                            )}

                            {/* 동영상 */}
                            {(camera.video) && (
                                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 block">동영상</span>
                                    <span className="text-gray-200">{camera.video}</span>
                                </div>
                            )}

                            {/* 무게 */}
                            {(camera.weight) && (
                                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 block">무게</span>
                                    <span className="text-gray-200">{camera.weight}</span>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
