"use client"

import { use } from 'react'
import { dummyPosts } from '@/data/posts'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { ChevronLeft, User, Calendar, Eye, Share2, MoreHorizontal } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const post = dummyPosts.find(p => p.id === parseInt(id))

    if (!post) {
        notFound()
    }

    return (
        <main className="container mx-auto py-12 px-4 max-w-4xl">
            <Button variant="ghost" asChild className="mb-8 -ml-4 hover:bg-transparent hover:text-primary">
                <Link href="/community" className="flex items-center gap-1 font-bold">
                    <ChevronLeft className="w-5 h-5" />
                    커뮤니티 목록으로
                </Link>
            </Button>

            <Card className="border-muted/50 overflow-hidden shadow-2xl rounded-3xl">
                <CardHeader className="p-10 pb-6">
                    <div className="flex justify-between items-start mb-6">
                        <div className="space-y-4 flex-1">
                            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">{post.title}</h1>
                            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-medium">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-foreground font-bold">{post.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {post.createdAt}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4" />
                                    조회 {post.views}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" className="rounded-full">
                                <Share2 size={18} />
                            </Button>
                            <Button variant="outline" size="icon" className="rounded-full">
                                <MoreHorizontal size={18} />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <Separator className="mx-10 w-auto" />

                <CardContent className="p-10 pt-10 min-h-[400px]">
                    <div className="prose prose-zinc dark:prose-invert max-w-none text-lg leading-relaxed whitespace-pre-wrap">
                        {post.content}
                    </div>
                </CardContent>

                <CardFooter className="p-10 bg-muted/20 border-t flex justify-between items-center">
                    <div className="flex gap-4">
                        <Button variant="outline" className="rounded-xl px-6 h-12 font-bold">
                            이전글
                        </Button>
                        <Button variant="outline" className="rounded-xl px-6 h-12 font-bold">
                            다음글
                        </Button>
                    </div>
                    <Button asChild className="rounded-xl px-8 h-12 font-extrabold shadow-lg shadow-primary/20">
                        <Link href="/community">목록보기</Link>
                    </Button>
                </CardFooter>
            </Card>

            <div className="mt-12 space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    댓글 <span className="text-primary">0</span>
                </h3>
                <div className="bg-muted/30 border-2 border-dashed rounded-3xl p-12 text-center text-muted-foreground">
                    <p className="font-medium">등록된 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
                </div>
                <div className="bg-background border rounded-3xl p-6 shadow-sm">
                    <textarea
                        className="w-full min-h-[100px] p-4 bg-transparent border-none focus:ring-0 resize-none text-base"
                        placeholder="타인에게 불쾌감을 주는 욕설이나 비방은 자제해주시기 바랍니다."
                    />
                    <div className="flex justify-end mt-4">
                        <Button className="rounded-xl px-8 h-12 font-bold">댓글 등록</Button>
                    </div>
                </div>
            </div>
        </main>
    )
}
