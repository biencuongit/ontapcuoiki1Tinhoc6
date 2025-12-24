
import { GoogleGenAI, Type } from "@google/genai";

export const parseQuestionBankFromText = async (text: string) => {
  if (!process.env.API_KEY) return null;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `NHIỆM VỤ QUAN TRỌNG: 
    Hãy trích xuất TẤT CẢ các câu hỏi từ văn bản đề cương môn Tin học dưới đây. 
    Yêu cầu tuyệt đối:
    1. KHÔNG bỏ sót bất kỳ câu hỏi nào trong văn bản gốc.
    2. Phân loại thành 2 nhóm: MULTIPLE_CHOICE (Trắc nghiệm có 4 đáp án A, B, C, D) và ESSAY (Tự luận/Câu hỏi mở).
    3. Trích xuất chính xác đáp án đúng cho phần trắc nghiệm.
    4. Trích xuất nội dung gợi ý trả lời đầy đủ cho phần tự luận.
    
    Văn bản nguồn:
    """
    ${text}
    """`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mcQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                content: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      text: { type: Type.STRING }
                    },
                    required: ["id", "text"]
                  }
                },
                correctAnswer: { type: Type.STRING }
              },
              required: ["content", "options", "correctAnswer"]
            }
          },
          essayQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                content: { type: Type.STRING },
                correctAnswer: { type: Type.STRING }
              },
              required: ["content", "correctAnswer"]
            }
          }
        },
        required: ["mcQuestions", "essayQuestions"]
      }
    }
  });

  try {
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return null;
  }
};

export const gradeEssayAnswer = async (question: string, studentAnswer: string, referenceAnswer: string): Promise<number> => {
    if (!process.env.API_KEY || !studentAnswer.trim()) return 0;
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Bạn là giáo viên Tin học THCS. Hãy chấm điểm câu trả lời của học sinh.
        Quy tắc:
        - Điểm từ 0.0 đến 1.0.
        - Chấm dựa trên ý nghĩa, từ khóa và độ chính xác so với đáp án mẫu. 
        - Khuyến khích sự sáng tạo nhưng phải đúng kiến thức.
        
        Câu hỏi: "${question}"
        Đáp án mẫu: "${referenceAnswer}"
        Câu trả lời của học sinh: "${studentAnswer}"
        
        Trả về DUY NHẤT một con số (ví dụ: 0.8 hoặc 1.0).`,
    });
    
    const scoreText = response.text.trim();
    const score = parseFloat(scoreText);
    return isNaN(score) ? 0.5 : score;
};
