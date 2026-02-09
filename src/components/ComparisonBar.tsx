"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Scale } from 'lucide-react'

export default function ComparisonBar() {
    const [bodyCount, setBodyCount] = useState(0)
    const [lensCount, setLensCount] = useState(0)

    useEffect(() => {
        const updateCounts = () => {
            const bodies = JSON.parse(localStorage.getItem('compare-bodies') || '[]')
            const lenses = JSON.parse(localStorage.getItem('compare-lenses') || '[]')
            setBodyCount(bodies.length)
            setLensCount(lenses.length)
        }

        // Listen for storage changes from other tabs
        window.addEventListener('storage', updateCounts)
        // Check manually on click since localStorage doesn't fire events on the same page
        window.addEventListener('click', updateCounts)

        updateCounts()

        return () => {
            window.removeEventListener('storage', updateCounts)
            window.removeEventListener('click', updateCounts)
        }
    }, [])

    if (bodyCount === 0 && lensCount === 0) return null

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-8 min-w-[320px]">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center">
                        <Scale className="text-primary w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mb-1">Comparison Tray</p>
                        <div className="flex gap-2">
                            {bodyCount > 0 && (
                                <span className="text-sm font-bold text-white">바디 {bodyCount}</span>
                            )}
                            {bodyCount > 0 && lensCount > 0 && <span className="text-zinc-700">|</span>}
                            {lensCount > 0 && (
                                <span className="text-sm font-bold text-white">렌즈 {lensCount}</span>
                            )}
                        </div>
                    </div>
                </div>

                <Link href="/compare">
                    <Button className="rounded-2xl px-6 h-12 font-bold group">
                        비교하기
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>
        </div>
    )
}
