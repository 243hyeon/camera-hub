"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ModeToggle } from '@/components/mode-toggle'
import { useSearchParams } from 'next/navigation'

const Navbar = () => {
    const searchParams = useSearchParams()
    const [isAdminVisible, setIsAdminVisible] = useState(false)

    useEffect(() => {
        const isLocal = window.location.hostname === 'localhost'
        const hasAdminQuery = searchParams.get('admin') === 'true'
        setIsAdminVisible(isLocal || hasAdminQuery)
    }, [searchParams])

    const links = [
        { name: '뉴스', href: '/news' },
        { name: '바디', href: '/bodies' },
        { name: '렌즈', href: '/lenses' },
        { name: '비교', href: '/compare' },
        { name: '사진 강의', href: '/lectures' },
        { name: '커뮤니티', href: '/community' },
        { name: 'AI 가이드', href: '/ai-guide' },
    ]

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-xl font-bold tracking-tighter hover:text-primary transition-colors">
                        CAMERA HUB
                    </Link>
                    <div className="hidden md:flex gap-6 items-center">
                        {links.map((link) => (
                            <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {isAdminVisible && (
                        <Link href="/admin" className="hidden sm:inline-flex text-xs font-semibold px-3 py-1 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors border">
                            ADMIN
                        </Link>
                    )}
                    <ModeToggle />
                </div>
            </div>
        </nav>
    )
}

export default Navbar
