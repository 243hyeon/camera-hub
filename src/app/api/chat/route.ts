import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // 1. 환경 변수 확인 로그 (보안을 위해 앞 4자리만 출력)
        const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
        console.log("🔑 [API Check] Key exists?", !!apiKey);
        if (apiKey) console.log("🔑 [API Check] Key starts with:", apiKey.substring(0, 4) + "...");

        if (!apiKey) {
            console.error("❌ [Server Error] GOOGLE_GEMINI_API_KEY is missing!");
            return NextResponse.json(
                { error: "Server Configuration Error: API Key missing" },
                { status: 500 }
            );
        }

        // 2. 요청 데이터 파싱
        const body = await req.json();
        const { messages } = body;

        // 마지막 사용자 메시지 추출
        const lastMessage = messages[messages.length - 1].content;
        console.log("📝 [User Message]", lastMessage);

        // 3. Gemini 모델 초기화
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 4. 응답 생성 요청
        const result = await model.generateContent(lastMessage);
        const response = await result.response;
        const text = response.text();

        console.log("✅ [Gemini Response]", text.substring(0, 20) + "...");

        return NextResponse.json({ role: 'assistant', content: text });

    } catch (error: any) {
        console.error("🚨 [Critical Error]", error);
        return NextResponse.json(
            { error: "AI Processing Failed", details: error.message },
            { status: 500 }
        );
    }
}
