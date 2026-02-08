import Link from 'next/link'

const Footer = () => {
    return (
        <footer className="border-t bg-muted/20 mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="space-y-4">
                        <Link href="/" className="text-xl font-bold tracking-tighter">
                            CAMERA HUB
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            실제 AI 기술과 방대한 데이터베이스를 통해 최적의 카메라 장비를 제안하는 프리미엄 아카이브 플랫폼입니다.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 shadow-none sm:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Menu</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/news" className="hover:text-primary">최신 뉴스</Link></li>
                                <li><Link href="/bodies" className="hover:text-primary">카메라 바디</Link></li>
                                <li><Link href="/lenses" className="hover:text-primary">렌즈 DB</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Community</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/community" className="hover:text-primary">자유 게시판</Link></li>
                                <li><Link href="/lectures" className="hover:text-primary">사진 강의</Link></li>
                                <li><Link href="/ai-guide" className="hover:text-primary">AI 가이드</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Legal</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><Link href="/privacy" className="hover:text-primary">개인정보처리방침</Link></li>
                                <li><Link href="/terms" className="hover:text-primary">이용약관</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>© 2024 Camera Hub Academy. All rights reserved.</p>
                    <p>Designed for Professional Photographers</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
