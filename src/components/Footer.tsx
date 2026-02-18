import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t border-gray-800 bg-[#121212] pt-16 pb-8 mt-20 text-white">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    {/* 왼쪽 로고 및 설명 */}
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-2xl font-black text-white mb-4 tracking-tight">CAMERA HUB</h2>
                        <p className="text-gray-400 leading-relaxed max-w-sm break-keep">
                            실제 AI 기술과 방대한 데이터베이스를 통해<br />
                            나에게 꼭 맞는 최적의 카메라 장비를 찾아주는<br />
                            프리미엄 아카이브 플랫폼입니다.
                        </p>
                    </div>

                    {/* 중앙 메뉴 1 */}
                    <div>
                        <h3 className="text-white font-bold mb-4 tracking-widest text-sm uppercase">탐색 메뉴</h3>
                        <ul className="space-y-3 text-gray-400 text-sm font-medium">
                            <li><Link href="/" className="hover:text-blue-400 transition-colors">실시간 뉴스</Link></li>
                            <li><Link href="/bodies" className="hover:text-blue-400 transition-colors">카메라 바디</Link></li>
                            <li><Link href="/lenses" className="hover:text-blue-400 transition-colors">렌즈 대백과</Link></li>
                        </ul>
                    </div>

                    {/* 중앙 메뉴 2 (커뮤니티 & 법적고지 합침) */}
                    <div>
                        <h3 className="text-white font-bold mb-4 tracking-widest text-sm uppercase">커뮤니티 & 지원</h3>
                        <ul className="space-y-3 text-gray-400 text-sm font-medium">
                            <li><Link href="/lectures" className="hover:text-blue-400 transition-colors">사진 강의</Link></li>
                            <li><Link href="/board" className="hover:text-blue-400 transition-colors">자유 게시판</Link></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">이용약관 및 개인정보처리방침</a></li>
                        </ul>
                    </div>

                </div>

                {/* 하단 카피라이트 */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
                    <p>© 2026 Camera Hub Academy. All rights reserved.</p>
                    <p>사진을 사랑하는 모든 분들을 위한 프리미엄 가이드</p>
                </div>
            </div>
        </footer>
    );
}
