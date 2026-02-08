import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { dummyCameras } from "@/data/cameras";
import { dummyLenses } from "@/data/lenses";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

export async function POST(req: Request) {
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
        console.error("CRITICAL ERROR: GOOGLE_GEMINI_API_KEY is not defined in environment variables.");
        return NextResponse.json({ error: "API Key not configured on server." }, { status: 500 });
    }

    try {
        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1].content;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // RAG 시스템을 위한 컨텍스트 생성 (카메라/렌즈 데이터)
        const context = `
현재 데이터베이스의 제품 정보:
카메라: ${dummyCameras.map(c => `${c.brand} ${c.model} (${c.tier})`).join(", ")}
렌즈: ${dummyLenses.map(l => `${l.brand} ${l.model} (${l.grade})`).join(", ")}

위의 정보를 참고하여 사용자의 질문에 답변하세요. 
답변은 친절하고 전문적이어야 하며, 한국어로 작성하세요.
`;

        const prompt = `${context}\n\n사용자 질문: ${lastMessage}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ content: text });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: "Failed to fetch AI response" }, { status: 500 });
    }
}
