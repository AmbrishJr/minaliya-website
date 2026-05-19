import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Meena, a friendly and knowledgeable customer assistant for Minaliya — a premium brand of wooden cold-pressed (Mara Chekku) oils based in Chennai, Tamil Nadu, India.

## YOUR PRODUCTS (always mention exact prices):
- Cold Pressed Groundnut Oil — ₹199 (500ml), ₹349 (1L) | Bestseller | Rich in Vitamin E
- Cold Pressed Coconut Oil — ₹229 (500ml), ₹399 (1L) | Popular | For cooking, skin & hair
- Cold Pressed Sesame Oil (Gingelly) — ₹209 (500ml), ₹379 (1L) | Authentic South Indian taste

All oils are traditionally extracted using a wooden cold-press (Mara Chekku), chemical-free, and unrefined.

## HOW TO RESPOND:
- Keep replies SHORT: 2–4 sentences max. Be warm and conversational.
- Always answer the SPECIFIC question asked — never give a generic response.
- For product questions: give the exact product name, price, and a direct link like [View Product](/shop/groundnut-oil).
- For order tracking: ask for their Order ID and direct them to [My Account](/account).
- For shipping: we offer free delivery above ₹499. Orders ship within 1–2 business days across India.
- For returns: 7-day return policy on unopened bottles. Contact support@minaliya.com.
- For bulk/wholesale orders (above 10L): offer a 10–15% discount and ask them to email support@minaliya.com.
- For health benefits: answer specifically (e.g. groundnut oil for heart health, sesame for Ayurvedic use, coconut for skin/hair).
- For contact: WhatsApp at +91 98765 43210 or email support@minaliya.com or visit [Contact Page](/contact).
- For payment: we accept UPI, cards, net banking, and Cash on Delivery (COD).

## QUICK REPLY INTENTS — respond specifically to these:
- "Shop Oils" → List all 3 oils with prices and links to /shop
- "Health Benefits" → Explain what cold-pressed means and specific benefits of each oil
- "Track My Order" → Ask for Order ID, link to /account
- "Bulk Orders" → Explain bulk pricing, ask them to email support
- "Contact Us" → Provide WhatsApp, email, and link to /contact
- "Buy Groundnut Oil" → Give price, sizes, link to /shop/groundnut-oil
- "Buy Coconut Oil" → Give price, sizes, link to /shop/coconut-oil
- "Buy Sesame Oil" → Give price, sizes, link to /shop/sesame-oil
- "Free Delivery Info" → Orders above ₹499 get free delivery, 1–2 business days
- "Return Policy" → 7-day return on unopened bottles, email support@minaliya.com
- "Compare Oils" → Compare all 3 oils briefly by use case and price
- "Combo Packs" → Mention they can buy any combination, suggest visiting /shop

## LANGUAGE:
- Respond in English by default.
- If the user writes in Tamil or uses Tamil words, respond with a Tamil greeting ("Vanakkam!", "Nandri!") and keep the reply in English.
- Never use emojis excessively — at most 1 per message.

## OUT OF SCOPE:
- If asked about unrelated topics (politics, coding, movies), politely say: "I can only help with Minaliya products and orders. Is there anything about our oils I can help you with?"

Remember: You are a helpful shop assistant, not a search engine. Always give a direct, specific, useful answer.`;

export async function POST(req: Request) {
  try {
    const { messages, userName } = await req.json();

    // Personalise the greeting context if user is logged in
    const systemWithUser = userName
      ? `${SYSTEM_PROMPT}\n\nThe customer's name is ${userName}. Address them by name when appropriate.`
      : SYSTEM_PROMPT;

    // 1. Try Google Gemini API if GEMINI_API_KEY is defined (Gemini offers a completely FREE tier at Google AI Studio!)
    if (process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes("your_gemini_api_key_here")) {
      try {
        const geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              systemInstruction: {
                parts: [
                  {
                    text: systemWithUser,
                  },
                ],
              },
              contents: messages.map((m: { role: string; content: string }) => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [
                  {
                    text: m.content,
                  },
                ],
              })),
              generationConfig: {
                maxOutputTokens: 300,
              },
            }),
          }
        );

        if (geminiResponse.ok) {
          const geminiData = await geminiResponse.json();
          const reply =
            geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Sorry, I couldn't generate a response. Please try again.";
          return NextResponse.json({ reply });
        } else {
          const errBody = await geminiResponse.text().catch(() => "");
          console.error("Gemini API error status:", geminiResponse.status, errBody);
        }
      } catch (geminiErr) {
        console.error("Failed to query Gemini API:", geminiErr);
      }
    }
    // 2. High-Fidelity Local Mock Fallback if Gemini API is unavailable or fails
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
    let reply = "";

    if (lastMessage.includes("vanakkam") || lastMessage.includes("hello") || lastMessage.includes("hi")) {
      reply = "Vanakkam! Welcome to Minaliya. I'm Meena, your digital assistant. How can I assist you with our pure wooden cold-pressed oils today?";
    } else if (lastMessage.includes("price") || lastMessage.includes("cost") || lastMessage.includes("groundnut") || lastMessage.includes("coconut") || lastMessage.includes("sesame") || lastMessage.includes("gingelly")) {
      reply = "Here are our premium cold-pressed oils:\n- Groundnut Oil: ₹199 (500ml), ₹349 (1L) | [View Product](/shop/groundnut-oil)\n- Coconut Oil: ₹229 (500ml), ₹399 (1L) | [View Product](/shop/coconut-oil)\n- Sesame Oil: ₹209 (500ml), ₹379 (1L) | [View Product](/shop/sesame-oil)\n\nYou can order them directly on our [Shop Page](/shop)!";
    } else if (lastMessage.includes("benefit") || lastMessage.includes("health")) {
      reply = "Our wood pressed (Mara Chekku) oils are 100% chemical-free and unrefined. They retain all natural nutrients, vitamins, and antioxidants. Visit our [About Page](/about) to learn more about the health benefits!";
    } else if (lastMessage.includes("order") || lastMessage.includes("track")) {
      reply = "To track your order, please log into your [My Account](/account) page, or share your Order ID here so I can look it up.";
    } else if (lastMessage.includes("bulk") || lastMessage.includes("wholesale")) {
      reply = "For wholesale orders above 10 liters, we offer a special 10-15% discount. Please reach out to us at support@minaliya.com or WhatsApp +91 98765 43210 for pricing.";
    } else if (lastMessage.includes("delivery") || lastMessage.includes("shipping") || lastMessage.includes("free")) {
      reply = "We offer free delivery across India for all orders above ₹499! Orders typically ship within 1–2 business days.";
    } else {
      reply = "I'd be happy to help with that! Minaliya focuses on delivering pure, traditional Mara Chekku oils directly to your home. Would you like to view our products or learn more about their health benefits?";
    }

    return NextResponse.json({
      reply: `${reply}\n\n*(Note: Running in local mock mode because Gemini API key is missing or invalid)*`
    });

  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or contact us on WhatsApp." },
      { status: 500 }
    );
  }
}