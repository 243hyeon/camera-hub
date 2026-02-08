import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
    return (
        <main className="container mx-auto py-12 px-4 max-w-4xl">
            <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="px-0">
                    <CardTitle className="text-4xl font-extrabold tracking-tight mb-4">개인정보처리방침</CardTitle>
                    <p className="text-muted-foreground">시행일: 2024년 2월 8일</p>
                </CardHeader>
                <CardContent className="px-0 prose dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-4">1. 수집하는 개인정보의 항목</h2>
                        <p>Camera Hub는 서비스 제공을 위해 최소한의 개인정보만을 수집합니다.</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>커뮤니티 이용 시: 닉네임, 이메일 주소</li>
                            <li>자동 수집 항목: IP 주소, 쿠키, 방문 기록</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">2. 개인정보의 이용 목적</h2>
                        <p>수집된 정보는 다음의 목적으로만 이용됩니다.</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>사용자 식별 및 커뮤니티 관리</li>
                            <li>AI 가이드 서비스 개인화</li>
                            <li>서비스 개선을 위한 통계 분석</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">3. 개인정보의 보유 및 이용기간</h2>
                        <p>원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">4. 제3자 제공 및 위탁</h2>
                        <p>Camera Hub는 사용자의 동의 없이 개인정보를 외부에 제공하거나 위탁하지 않습니다. 단, 법령의 규정에 의거한 경우는 예외로 합니다.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4">5. 사용자의 권리</h2>
                        <p>사용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며, 서비스 탈퇴를 통해 개인정보 이용에 대한 동의를 철회할 수 있습니다.</p>
                    </section>
                </CardContent>
            </Card>
        </main>
    )
}
