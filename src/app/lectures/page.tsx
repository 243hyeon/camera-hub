import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Clock, Loader2 } from "lucide-react"

export default function LecturesPage() {
    return (
        <main className="container mx-auto py-20 px-4 min-h-[80vh] flex items-center justify-center">
            <Card className="max-w-2xl w-full border-none shadow-none bg-transparent text-center">
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <BookOpen className="w-20 h-20 text-primary opacity-20" />
                        <Loader2 className="w-10 h-10 text-primary animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                </div>

                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <Badge variant="secondary" className="px-4 py-1 rounded-full text-sm font-bold animate-pulse">
                            COMING SOON
                        </Badge>
                    </div>
                    <CardTitle className="text-5xl font-extrabold tracking-tight mb-4">
                        사진 강의 준비 중
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        최고의 사진 전문가들이 커리큘럼을 다듬고 있습니다.<br />
                        기초 이론부터 전문가급 보정 기술까지, 곧 만나보실 수 있습니다.
                    </p>

                    <div className="flex flex-wrap justify-center gap-8 mt-12 py-8 border-y border-muted/50">
                        <div className="flex flex-col items-center gap-2">
                            <Clock className="w-6 h-6 text-primary" />
                            <span className="text-sm font-bold">오픈 예정: 2024년 상반기</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <BookOpen className="w-6 h-6 text-primary" />
                            <span className="text-sm font-bold">총 12개 커리큘럼</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}
