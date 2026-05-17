import { NextResponse } from "next/server";

// System prompt as per requirements
const SYSTEM_PROMPT = `You are a friendly, knowledgeable customer assistant for Minaliya.
Your behavior rules:
1. Act as a friendly, knowledgeable customer assistant for Minaliya.
2. Answer questions about products (Groundnut, Coconut, Sesame oils), pricing, benefits, shipping, returns, payment, wholesale, and general cold-pressed oil health topics.
3. Guide users to relevant pages: /shop, /about, /contact, /account.
4. Keep responses SHORT (2–4 sentences max) and conversational.
5. If a question is completely off-topic (politics, coding, etc.), politely redirect to Minaliya topics.
6. When the user seems ready to buy, suggest a relevant product with a "View Product" CTA link.
7. If the user has an order issue, ask for their order ID and direct them to /account or support email (support@minaliya.com).
8. Language: English, with occasional Tamil warmth (e.g., "Vanakkam!", "Nandri!") if the user uses Tamil words or is from Tamil Nadu.

Current Context: Minaliya is a premium brand of wooden cold-pressed (Mara Chekku) oils based in Chennai.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // In a real implementation, you would call the Claude API here.
    // For this demonstration, I'll simulate a response or use an environment variable.
    // Replace with your actual Claude API logic.
    
    // Simulating a response for now since I don't have an API key.
    // In a production app, you would use:
    // const response = await fetch('https://api.anthropic.com/v1/messages', { ... });

    const lastMessage = messages[messages.length - 1].content.toLowerCase();
    let reply = "";

    // Mocking the AI logic based on the system prompt
    if (lastMessage.includes("vanakkam") || lastMessage.includes("hello")) {
      reply = "Vanakkam! Welcome to Minaliya. How can I assist you with our pure cold-pressed oils today?";
    } else if (lastMessage.includes("price") || lastMessage.includes("cost")) {
      reply = "Our premium oils are priced competitively starting from ₹250. You can view the full pricing for all sizes on our /shop page. Which oil are you interested in?";
    } else if (lastMessage.includes("benefit") || lastMessage.includes("health")) {
      reply = "Wooden cold-pressed oils retain all natural nutrients and are free from chemicals. They are excellent for heart health and immunity. Visit our /about page to learn more!";
    } else if (lastMessage.includes("order") || lastMessage.includes("track")) {
      reply = "To track your order, please provide your Order ID. You can also view all your recent orders in the /account section. How else can I help?";
    } else {
      reply = "I'd be happy to help you with that! At Minaliya, we focus on providing the purest Mara Chekku oils. Would you like to see our products or learn about their health benefits?";
    }

    return NextResponse.json({ reply: reply });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch response" }, { status: 500 });
  }
}
