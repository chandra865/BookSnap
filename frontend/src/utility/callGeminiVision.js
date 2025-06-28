import axios from 'axios';

export const callGeminiVision = async (base64Image, apiKey) => {
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `Extract the following fields from the image of a book cover:
- title
- author
- category(if available)
- publisher(if available)
- published year(if available)
- edition(if available)
- grade(if available)

Respond strictly in this JSON format:
{
  "title": "",
  "author": "",
  "grade": "",
  "category": "",
  "publisher": "",
  "publishedYear": "",
  "edition": ""
}`,
          },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image, // Base64 string only
            },
          },
        ],
      },
    ],
  };

  try {
    const { data } = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    const cleanedText = text
      .replace(/```json/i, '')
      .replace(/```/g, '')
      .trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.warn('Failed to parse Gemini response:', error?.response?.data || error.message);
    return null;
  }
};
