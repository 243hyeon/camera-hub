import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // 1. API 키 검증 및 공백 제거 (Trim)
        const apiKey = process.env.GOOGLE_GEMINI_API_KEY?.trim();

        if (!apiKey) {
            console.error("❌ [Server Error] API Key is missing or empty.");
            return NextResponse.json(
                { error: "Server Configuration Error: API Key missing" },
                { status: 500 }
            );
        }

        // 2. 요청 데이터 파싱
        const body = await req.json();
        const { messages } = body;
        const lastMessage = messages[messages.length - 1].content;

        // 3. Gemini 모델 초기화
        const genAI = new GoogleGenerativeAI(apiKey);

        // 🚨 해결책: 최신 모델(1.5-flash) 대신 가장 안정적인 'gemini-pro' 사용
        // 이유: Vercel 서버의 라이브러리 버전이 낮아도 이 모델은 무조건 작동합니다.
        const modelName = "gemini-pro";
        const model = genAI.getGenerativeModel({ model: modelName });

        console.log(`🚀 [AI Request] Model: ${modelName}, Message: ${lastMessage.substring(0, 20)}...`);

        // 4. 응답 생성 요청
        const result = await model.generateContent(lastMessage);
        const response = await result.response;
        const text = response.text();

        console.log("✅ [AI Response] Success!");

        return NextResponse.json({ role: 'assistant', content: text });

    } catch (error: any) {
        console.error("🚨 [Gemini API Error]", error);

        // 지능형 에러 핸들링
        if (error.message?.includes("404") || error.message?.includes("Not Found")) {
            return NextResponse.json(
                {
                    error: "AI 모델 연결 실패",
                    details: "API 키 권한 문제이거나, 해당 모델(gemini-1.5-flash)을 사용할 수 없는 프로젝트입니다. Google AI Studio에서 '새 프로젝트'로 키를 재생성해주세요."
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: "AI 처리 중 오류가 발생했습니다.", details: error.message },
            { status: 500 }
        );
    }
}
