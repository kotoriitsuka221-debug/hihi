/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined. AI functionality will be limited.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export async function askGemini(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "Bạn là một trợ lý ảo chuyên nghiệp về kế toán Việt Nam. Hãy giúp sinh viên giải đáp các thắc mắc về công thức, định khoản và các bài tập kế toán. Trả lời bằng tiếng Việt, súc tích và chính xác.",
      },
      history: history,
    });

    const result = await chat.sendMessage({
      message: prompt,
    });

    return result.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Xin lỗi, hiện tại trợ lý AI đang gặp sự cố. Vui lòng thử lại sau.";
  }
}
