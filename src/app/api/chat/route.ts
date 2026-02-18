import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GOOGLE_GEMINI_API_KEY?.trim();

        if (!apiKey) {
            console.error("❌ [Server Error] API Key is missing.");
            return NextResponse.json(
                { error: "AI 설정이 완료되지 않았습니다. 관리자에게 문의하세요." },
                { status: 500 }
            );
        }

        const body = await req.json();
        const { messages, lang } = body;
        const lastMessage = messages[messages.length - 1].content;

        const genAI = new GoogleGenerativeAI(apiKey);

        const systemInstruction = `
            당신은 'Camera Hub'의 수석 큐레이터이자 카메라 전문가입니다.
            사용자의 질문에 대해 다음과 같은 **엄격한 원칙**으로 답변하세요:

            1. **정체성 유지 (Guardrails)**: 
               - 오직 카메라, 렌즈, 사진 촬영, 영상 제작 등 **사진/영상 장비 및 기술**에 관련된 질문에만 답변하세요.
               - 요리, 날씨, 정치, 일반 상식 등 관련 없는 질문에는 "죄송합니다. 저는 Camera Hub의 카메라 전문 가이드라서 그 질문에는 답할 수 없습니다."라고 정중히 거절하세요.
            2. **결론부터 두괄식으로**: 카메라 모델이나 정보를 물으면 핵심부터 즉시 답변하세요.
            3. **비교는 표(Table)로**: 2개 이상의 제품 비교 시 반드시 마크다운 표를 사용하세요. 
               - 표의 맨 오른쪽 컬럼에 '비교하기'를 추가하고 \`[[COMPARE:정확한모델명]]\` 형식을 넣으세요.
            4. **다국어 대응**: 요청(lang)이 'KR'이면 한국어로, 'EN'이면 영어로 답변하세요.
            5. **전문성**: 최신 카메라 트렌드(2024-2025)를 반영하여 전문가 수준의 스펙 분석을 제공하세요.
            6. **3줄 요약**: 답변 끝에 반드시 '💡 3줄 요약' 또는 '💡 3-Line Summary'를 추가하세요.
        `;

        // 🎯 2.0-flash 모델 사용 (목록에서 확인된 사용 가능한 모델)
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: systemInstruction,
        });

        const result = await model.generateContent(lastMessage);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ role: 'ai', content: text });

    } catch (error: any) {
        console.error("🚨 [Gemini API Error]", error);

        // 할당량 초과 에러 처리
        if (error.message?.includes("429")) {
            return NextResponse.json(
                { error: "AI 서비스 요청 한도가 초과되었습니다. 잠시 후 다시 시도해 주세요." },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: "AI 처리 중 오류가 발생했습니다.", details: error.message },
            { status: 500 }
        );
    }
}
