import Link from 'next/link'
import { dummyPosts } from '@/data/posts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Eye, MessageSquare, PenLine } from 'lucide-react'

export default function CommunityPage() {
    return (
        <main className="container mx-auto py-12 px-4">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
                        자유 게시판 <MessageSquare className="text-primary w-8 h-8" />
                    </h1>
                    <p className="text-muted-foreground text-lg">카메라와 사진에 대한 일상적인 이야기를 나누는 공간입니다.</p>
                </div>
                <Button asChild className="rounded-2xl h-12 px-6 font-bold shadow-lg shadow-primary/20">
                    <Link href="/community/write" className="flex items-center gap-2">
                        <PenLine size={18} /> 글쓰기
                    </Link>
                </Button>
            </header>

            <Card className="border-muted/50 overflow-hidden shadow-2xl rounded-3xl">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow className="hover:bg-transparent border-b-2">
                                <TableHead className="w-[100px] text-center font-bold uppercase text-[11px] tracking-widest">번호</TableHead>
                                <TableHead className="font-bold uppercase text-[11px] tracking-widest">제목</TableHead>
                                <TableHead className="w-[120px] font-bold uppercase text-[11px] tracking-widest">작성자</TableHead>
                                <TableHead className="w-[120px] font-bold uppercase text-[11px] tracking-widest">날짜</TableHead>
                                <TableHead className="w-[100px] text-center font-bold uppercase text-[11px] tracking-widest">조회수</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dummyPosts.map((post) => (
                                <TableRow key={post.id} className="cursor-pointer group hover:bg-muted/30 transition-colors h-16">
                                    <TableCell className="text-center font-medium text-muted-foreground">{post.id}</TableCell>
                                    <TableCell>
                                        <div className="font-bold group-hover:text-primary transition-colors text-base">
                                            {post.title}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{post.author}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm font-medium">{post.createdAt}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1 text-muted-foreground font-bold text-xs">
                                            <Eye size={14} className="opacity-50" />
                                            {post.views}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    )
}
