// OpenAI API integration for EntityOS
// Generates knowledge graph data from brand names

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * System prompt for OpenAI - Strictly enforces JSON output
 */
const SYSTEM_PROMPT = `You are an expert knowledge graph generator for brand analysis.

CRITICAL RULES:
1. You MUST respond with ONLY valid JSON - no other text
2. Do NOT include markdown, code blocks, or explanations
3. Output EXACTLY this structure:

{
  "nodes": [
    {"id": "string", "kind": "org|person|topic|product|asset|capability", "score": 0.0-1.0}
  ],
  "links": [
    {"source": "string", "target": "string", "rel": "string"}
  ]
}

CONSTRAINTS:
- Generate 6-12 nodes
- Generate 8-15 links
- Node kinds MUST be one of: org, person, topic, product, asset, capability
- Scores are 0.0 to 1.0 (confidence/importance)
- All source/target in links must reference existing node IDs
- Make relationships meaningful for brand analysis

OUTPUT ONLY THE JSON - NO OTHER TEXT.`;

/**
 * Generate a knowledge graph for a brand using OpenAI
 * @param {string} brandName - The brand name to analyze
 * @returns {Promise<{nodes: Array, links: Array}>} - Knowledge graph data
 */
export async function generateGraph(brandName) {
  // Validate API key
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-openai-api-key-here') {
    console.warn('OpenAI API key not configured. Using fallback graph.');
    return createFallbackGraph(brandName);
  }

  try {
    const userPrompt = `Generate a knowledge graph for the brand: "${brandName}"

Include:
- The brand itself (org)
- Key people (CEO, founder if known)
- Industry/sector (topic)
- Main products/services (product)
- Market segments (topic)
- Core capabilities (capability)
- Strategic assets (asset)

Remember: OUTPUT ONLY JSON, no other text.`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Fast and cost-effective
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' }, // Enforce JSON mode
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    // Parse and validate JSON
    const graphData = JSON.parse(content);

    // Validate structure
    if (!graphData.nodes || !Array.isArray(graphData.nodes)) {
      throw new Error('Invalid graph structure: missing nodes array');
    }
    if (!graphData.links || !Array.isArray(graphData.links)) {
      throw new Error('Invalid graph structure: missing links array');
    }

    // Validate node kinds
    const validKinds = ['org', 'person', 'topic', 'product', 'asset', 'capability'];
    graphData.nodes = graphData.nodes.filter(node => {
      if (!validKinds.includes(node.kind)) {
        console.warn(`Invalid node kind "${node.kind}" for node "${node.id}". Skipping.`);
        return false;
      }
      return true;
    });

    // Ensure scores are in valid range
    graphData.nodes = graphData.nodes.map(node => ({
      ...node,
      score: Math.max(0, Math.min(1, node.score || 0.5)),
    }));

    // Validate links reference existing nodes
    const nodeIds = new Set(graphData.nodes.map(n => n.id));
    graphData.links = graphData.links.filter(link => {
      const sourceExists = nodeIds.has(link.source);
      const targetExists = nodeIds.has(link.target);
      if (!sourceExists || !targetExists) {
        console.warn(`Invalid link: ${link.source} -> ${link.target}. Skipping.`);
        return false;
      }
      return true;
    });

    console.log('Generated graph:', graphData);
    return graphData;

  } catch (error) {
    console.error('Error generating graph with OpenAI:', error);
    console.warn('Falling back to mock graph');
    return createFallbackGraph(brandName);
  }
}

/**
 * Create a fallback graph when OpenAI fails
 * @param {string} brandName - The brand name
 * @returns {{nodes: Array, links: Array}} - Fallback graph
 */
function createFallbackGraph(brandName) {
  return {
    nodes: [
      { id: brandName, kind: "org", score: 0.85 },
      { id: "Industry Leader", kind: "person", score: 0.75 },
      { id: "Core Product", kind: "product", score: 0.80 },
      { id: "Technology", kind: "topic", score: 0.70 },
      { id: "Innovation", kind: "capability", score: 0.72 },
      { id: "Market Position", kind: "topic", score: 0.68 },
      { id: "Brand Assets", kind: "asset", score: 0.65 },
      { id: "Customer Base", kind: "topic", score: 0.78 },
    ],
    links: [
      { source: brandName, target: "Industry Leader", rel: "led_by" },
      { source: brandName, target: "Core Product", rel: "offers" },
      { source: brandName, target: "Technology", rel: "uses" },
      { source: brandName, target: "Innovation", rel: "focuses_on" },
      { source: brandName, target: "Market Position", rel: "holds" },
      { source: brandName, target: "Brand Assets", rel: "owns" },
      { source: "Core Product", target: "Customer Base", rel: "targets" },
      { source: "Innovation", target: "Technology", rel: "drives" },
      { source: "Industry Leader", target: "Innovation", rel: "champions" },
    ],
  };
}
