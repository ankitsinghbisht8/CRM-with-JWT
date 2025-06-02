import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY);

// Generate message suggestions for a campaign
export const generateMessageSuggestions = async (req, res) => {
  try {
    const { goal, audience, tone = 'professional' } = req.body;
    
    if (!goal) {
      return res.status(400).json({ message: 'Campaign goal is required' });
    }
    
    const audienceDescription = audience || 'customers';
    
    const prompt = `You're a creative marketing expert crafting compelling messages for a CRM campaign.

Campaign Details:
- Goal: ${goal}
- Target Audience: ${audienceDescription}
- Tone: ${tone}

Task:
Write 3 punchy, scroll-stopping marketing messages (each under 160 characters) that:
- Spark attention immediately
- Speak directly to the audience's needs
- Align with the tone and goal above
- Include a clear and irresistible call-to-action

Return ONLY a JSON object in this exact format, with no additional text or markdown:
{
  "messages": [
    "Message 1 here",
    "Message 2 here",
    "Message 3 here"
  ]
}`;

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    let suggestions;
    
    try {
      // Try to parse the response as JSON
      const parsed = JSON.parse(text);
      
      if (parsed.messages && Array.isArray(parsed.messages)) {
        suggestions = parsed.messages;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      
      // Fallback: extract messages from the text
      const lines = text.split('\n').filter(line => line.trim().length > 0);
      suggestions = lines.slice(0, 3).map(line => line.replace(/^[\d\.\-\*\s]+/, '').trim());
      
      if (suggestions.length === 0) {
        suggestions = [
          'Transform your business with our solution. Get started today!',
          'Unlock your potential. Contact us for a free consultation.',
          'Ready for growth? Let us help you succeed. Learn more now!'
        ];
      }
    }

    // Log the suggestions for debugging (remove for production)
    console.log(suggestions);

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error('Error generating message suggestions:', error);
    
    // Fallback suggestions
    const fallbackSuggestions = [
      'Transform your business with our solution. Get started today!',
      'Unlock your potential. Contact us for a free consultation.',
      'Ready for growth? Let us help you succeed. Learn more now!'
    ];
    
    res.status(200).json({ suggestions: fallbackSuggestions });
  }
};