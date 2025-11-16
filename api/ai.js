// Vercel Serverless Function: /api/ai
// Handles AI-assisted tasks for Telugu-English Science Reader
// Author: Pawan Medidi

export default async function handler(req, res) {
  // Enable CORS for local development
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { task, payload } = req.body || {};
    if (!task) {
      return res.status(400).json({ error: 'Missing task parameter' });
    }

    // Get API key from environment variable (set in Vercel dashboard)
    // For local testing, we'll use the provided key
    const key = process.env.OPENAI_API_KEY;

    if (!key) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Build prompt based on task
    const prompt = buildPrompt(task, payload);
    const model = 'gpt-4o-mini'; // Small, fast, cost-effective

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Error:', errorText);
      return res.status(response.status).json({
        error: 'OpenAI API error',
        details: errorText
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim() || '{}';

    // Parse JSON response
    let jsonResult;
    try {
      jsonResult = JSON.parse(content);
    } catch (e) {
      // If not valid JSON, wrap in object
      jsonResult = { raw: content, error: 'Failed to parse JSON from AI' };
    }

    // Add metadata
    jsonResult._meta = {
      task,
      timestamp: new Date().toISOString(),
      model,
      tokens: data.usage?.total_tokens || 0
    };

    return res.status(200).json(jsonResult);

  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

// System prompt for all tasks
const SYSTEM_PROMPT = `You are an AI assistant for a bilingual (English–Telugu) science education tool for 7th-grade students.

CRITICAL RULES:
1. Return ONLY valid JSON in your response
2. Keep outputs short and age-appropriate for 7th graders
3. Telugu text must be scientifically accurate
4. Use everyday Telugu vocabulary, not overly technical terms
5. Be culturally sensitive to Telugu-speaking contexts (Andhra Pradesh, Telangana)
6. If unsure, acknowledge limitations rather than hallucinate

Your goal is to help teachers refine educational content for better learning outcomes.`;

// Build task-specific prompts
function buildPrompt(task, p) {
  switch (task) {
    case 'simplify_te':
      return `Task: Simplify Telugu sentence for ${p.grade || 7}th grade reading level

Input Telugu sentence:
"""
${p.te}
"""

Original English (for reference):
"""
${p.en || 'Not provided'}
"""

Requirements:
- Keep the scientific meaning intact
- Use simple, everyday Telugu words
- Maximum 25 words
- Avoid transliterations where possible
- Also provide simplified English version

Return JSON:
{
  "simplified_te": "simplified Telugu sentence here",
  "simplified_en": "simplified English version of the same meaning",
  "changes": "brief note on what was simplified"
}`;

    case 'generate_gloss':
      return `Task: Generate glossary entry for scientific term

English term: "${p.term_en}"
Context: """${p.context_en || 'Heat transfer science for 7th grade'}"""

Requirements:
- Provide standard Telugu equivalent
- Definition should be ~20 words, 7th-grade appropriate
- Example should be from everyday life (cooking, home, school)
- Make it relatable to Telugu-speaking students

Return JSON:
{
  "term_en": "${p.term_en}",
  "term_te": "Telugu translation",
  "def_en": "concise English definition",
  "def_te": "Telugu definition ~20 words",
  "example_en": "everyday example in English",
  "example_te": "everyday example in Telugu"
}`;

    case 'back_check':
      return `Task: Back-translation check to verify translation fidelity

Original English:
"""
${p.en}
"""

Telugu translation:
"""
${p.te}
"""

Instructions:
1. Translate the Telugu back into English
2. Compare with original English
3. Identify any meaning differences
4. Rate fidelity 0.0-1.0 (1.0 = perfect match)

Return JSON:
{
  "back_en": "your Telugu→English translation",
  "fidelity": 0.85,
  "notes": "Brief notes on any mismatches or 'Translation is accurate'"
}`;

    case 'cultural_review':
      return `Task: Review cultural appropriateness for Telugu-speaking students

English text:
"""
${p.en || ''}
"""

Telugu text:
"""
${p.te || ''}
"""

Context: 7th-grade science education in Andhra Pradesh/Telangana

Check for:
- Cultural insensitivity or unfamiliar references
- Urban/rural bias
- Gender bias
- Socioeconomic assumptions
- Religious/caste sensitivity

Return JSON:
{
  "risk": "low|medium|high",
  "notes": ["specific concern 1", "specific concern 2"],
  "suggestions": "brief improvement suggestion or 'Content appears appropriate'"
}`;

    case 'dialectal_variants':
      return `Task: Provide dialectal variants for Telugu term

Standard Telugu term: "${p.term_te}"
English meaning: "${p.term_en}"

Requirements:
- Provide 2-3 common dialectal variations (Coastal Andhra, Rayalaseema, Telangana)
- Note which dialect each variant belongs to
- All should be scientifically accurate

Return JSON:
{
  "standard": "${p.term_te}",
  "variants": [
    {"dialect": "Telangana", "term": "variant1"},
    {"dialect": "Coastal Andhra", "term": "variant2"}
  ]
}`;

    default:
      return `Task: ${task}
Payload: ${JSON.stringify(p)}

Return JSON with task results or {"error": "unknown task"}`;
  }
}
