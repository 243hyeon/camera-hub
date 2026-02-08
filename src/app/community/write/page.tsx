"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, ImagePlus, Send } from 'lucide-react'
import Link from 'next/link'

export default function WritePostPage() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // 시뮬레이션: 실제 등록 로직은 생략
        setTimeout(() => {
            alert('게시글이 성공적으로 등록되었습니다 (데모 운영 중)')
            setIsSubmitting(false)
            router.push('/community')
        }, 1000)
    }

    return (
        <main className="container mx-auto py-12 px-4 max-w-3xl">
            <Button variant="ghost" asChild className="mb-6 hover:bg-transparent px-0 group text-muted-foreground">
                <Link href="/community" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    목록으로 돌아가기
                </Link>
            </Button>

            <Card className="border-muted/50 shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-muted/30 border-b px-8 py-10">
                    <CardTitle className="text-3xl font-black">새 게시글 작성</CardTitle>
                    <p className="text-muted-foreground mt-2">당신의 소중한 경험과 정보를 커뮤니티와 공유하세요.</p>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="p-8 space-y-8">
                        {/* Title Input */}
                        <div className="space-y-3">
                            <Label htmlFor="title" className="text-sm font-bold uppercase tracking-widest text-primary">제목</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="게시글 제목을 입력해주세요"
                                required
                                className="h-14 text-lg font-bold border-muted focus-visible:ring-primary rounded-xl"
                            />
                        </div>

                        {/* Content Textarea */}
                        <div className="space-y-3">
                            <Label htmlFor="content" className="text-sm font-bold uppercase tracking-widest text-primary">내용</Label>
                            <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="자유롭게 내용을 작성해주세요..."
                                required
                                className="min-h-[300px] text-base leading-relaxed border-muted focus-visible:ring-primary rounded-xl resize-none p-4"
                            />
                        </div>

                        {/* Image Upload UI (Mock) */}
                        <div className="space-y-3">
                            <Label className="text-sm font-bold uppercase tracking-widest text-primary text-secondary-foreground">사진 첨부</Label>
                            <div className="border-2 border-dashed border-muted rounded-2xl p-10 flex flex-col items-center justify-center gap-4 bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer relative overflow-hidden group">
                                <ImagePlus className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                                <div className="text-center">
                                    <p className="font-bold">이미지 파일을 여기에 드롭하거나 클릭하세요</p>
                                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, JPEG (최대 10MB)</p>
                                </div>
                                <Input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="image/*"
                                />
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="bg-muted/30 border-t p-8 flex justify-end gap-3">
                        <Button variant="outline" type="button" asChild className="h-12 px-6 rounded-xl font-bold">
                            <Link href="/community">작성 취소</Link>
                        </Button>
                        <Button type="submit" disabled={isSubmitting} className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20">
                            {isSubmitting ? '등록 중...' : (
                                <span className="flex items-center gap-2">
                                    게시글 등록 <Send className="w-4 h-4" />
                                </span>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </main>
    )
}
