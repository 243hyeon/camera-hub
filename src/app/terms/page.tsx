import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
    return (
        <main className="container mx-auto py-12 px-4 max-w-4xl">
            <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="px-0">
                    <CardTitle className="text-4xl font-extrabold tracking-tight mb-4">이용약관</CardTitle>
                    <p className="text-muted-foreground">시행일: 2024년 2월 8일</p>
                </CardHeader>
                <CardContent className="px-0 prose dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">제1조 (목적)</h2>
                        <p>본 약관은 Camera Hub(이하 "서비스")가 제공하는 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">제2조 (용어의 정의)</h2>
                        <p>본 약관에서 사용하는 주요 용어의 정의는 다음과 같습니다.</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>회원: 서비스에 접속하여 이 약관에 따라 이용계약을 체결하고 서비스를 이용하는 고객</li>
                            <li>콘텐츠: 서비스가 제공하는 정보, 텍스트, 이미지, AI 답변 등 일체의 내용물</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">제3조 (서비스의 제공 및 변경)</h2>
                        <p>서비스는 카메라 정보 제공, AI 가이드, 커뮤니티 등 건전한 취미 생활을 돕는 기능을 제공하며, 운영상 필요한 경우 서비스 내용을 변경할 수 있습니다.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">제4조 (회원의 의무)</h2>
                        <p>회원은 다음과 같은 행위를 해서는 안 됩니다.</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>타인의 정보를 도용하거나 허위 실명을 사용하는 행위</li>
                            <li>서비스의 안정적 운영을 방해하거나 부적절한 게시물을 올리는 행위</li>
                            <li>지식재산권을 침해하거나 서비스의 명예를 훼손하는 행위</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">제5조 (책임의 제한)</h2>
                        <p>서비스는 AI 가이드가 생성한 답변의 정확성에 대해 보증하지 않으며, 사용자의 최종적인 구매 및 이용 결정에 따른 책임은 사용자 본인에게 있습니다.</p>
                    </section>
                </CardContent>
            </Card>
        </main>
    )
}
