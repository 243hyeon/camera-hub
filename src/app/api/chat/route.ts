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

        const systemInstruction = `
            당신은 20년 경력의 베테랑 카메라 전문가입니다.
            사용자의 질문에 대해 다음과 같은 **엄격한 원칙**으로 답변하세요:

            1. **결론부터 두괄식으로**: 서론(인사말, 쓸데없는 수식어)을 빼고 바로 핵심 답변을 제시하세요.
            2. **개조식 서술**: 줄글 대신 **글머리 기호(Bullet points)**를 적극 사용하여 가독성을 높이세요.
            3. **핵심 강조**: 중요한 카메라 모델명, 스펙, 장단점은 **굵게(Bold)** 표시하세요.
            4. **3줄 요약**: 답변이 길어질 것 같으면 반드시 맨 마지막에 **'💡 3줄 요약'** 섹션을 추가하세요.
            5. **톤앤매너**: 전문적이지만 친절하게, 복잡한 용어는 쉽게 풀어서 설명하세요.
            6. **최신 정보**: 2024년, 2025년 최신 카메라 트렌드와 가격 정보를 반영하세요.
        `;

        // 🚨 해결책: 목록에 있는 가장 안정적인 최신 모델 'gemini-2.5-flash' 사용
        const modelName = "gemini-2.5-flash";
        const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: systemInstruction,
        });

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
