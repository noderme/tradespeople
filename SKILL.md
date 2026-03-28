# Trade Quotes: AI Skill Manifest

**Version**: 1.0  
**Author**: Manus AI (on behalf of Trade Quotes)  
**Last Updated**: March 28, 2026  

---

## 🎯 Overview

**Trade Quotes** is an **AI Skill** (Skill as a Service) that enables tradespeople (plumbers, electricians, HVAC technicians) to generate professional quotes, manage pricing, and send PDFs through natural conversation with an AI assistant.

Instead of logging into a dashboard, a plumber can simply say:
> *"I just finished replacing the kitchen faucet at the Smith house. Charge them $250. Send the quote to john@smith.com."*

The AI will use this Skill to:
1. Create a professional quote in the database.
2. Generate a PDF.
3. Send it via email.
4. All without the plumber opening a browser.

---

## 🔑 Authentication

**API Endpoint**: `https://tradespeople.app/api/skill`  
**Method**: POST  
**Authentication**: Bearer Token (API Key)

```bash
curl -X POST https://tradespeople.app/api/skill \
  -H "Authorization: Bearer YOUR_SKILL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "chat",
    "user_id": "plumber-uuid",
    "data": { "message": "faucet repair 250", "threadId": "thread-123" }
  }'
```

---

## 🛠️ Available Tools (Functions)

### 1. **`chat`** — Conversational Quote Building
**Purpose**: Handle natural language input from the plumber and build a quote through conversation.

**Request**:
```json
{
  "action": "chat",
  "user_id": "user-uuid",
  "data": {
    "message": "I just fixed a leaky pipe for $120",
    "threadId": "whatsapp-thread-123"
  }
}
```

**Response**:
```json
{
  "success": true,
  "action": "chat",
  "result": {
    "type": "message",
    "text": "Got it — leaky pipe $120 ✓. Anything else on this job?"
  }
}
```

**AI Logic**:
- Use this tool when the plumber is describing a job or adding line items.
- The AI should ask follow-up questions to clarify pricing and scope.
- When the plumber says "done," "send it," or "that's it," the AI should ask for the customer's name and email.
- The AI should **never** ask for information it can infer. If they say "faucet 150," assume $150 is the price.

---

### 2. **`get_price_history`** — Recall Previous Pricing
**Purpose**: Look up what the plumber charged for a similar job in the past.

**Request**:
```json
{
  "action": "get_price_history",
  "user_id": "user-uuid",
  "data": {
    "job_type": "p-trap replacement"
  }
}
```

**Response**:
```json
{
  "success": true,
  "action": "get_price_history",
  "result": {
    "job_type": "p-trap replacement",
    "last_total": 120,
    "use_count": 5
  }
}
```

**AI Logic**:
- Use this tool when the plumber mentions a job type (e.g., "P-trap," "faucet," "drain cleaning").
- Suggest the previous price: *"You usually charge $120 for a P-trap. Should I use that?"*
- If no history exists, ask the plumber to provide a price.

---

### 3. **`create_quote`** — Direct Quote Creation
**Purpose**: Directly create a quote without conversational steps (for advanced AI use).

**Request**:
```json
{
  "action": "create_quote",
  "user_id": "user-uuid",
  "data": {
    "customer_name": "John Smith",
    "customer_address": "42 Oak Street, Manchester",
    "line_items": [
      {
        "description": "Kitchen faucet replacement",
        "quantity": 1,
        "unit_price": 250,
        "total": 250
      }
    ],
    "notes": "Payment due 30 days",
    "tax_rate": 0.2
  }
}
```

**Response**:
```json
{
  "success": true,
  "action": "create_quote",
  "result": {
    "quote_id": "quote-uuid",
    "total": 300,
    "message": "Quote created for John Smith"
  }
}
```

**AI Logic**:
- Use this tool when you have all the information needed (customer name, items, prices).
- This bypasses the conversational flow for experienced users who want to be quick.

---

### 4. **`send_quote`** — Send Quote to Customer
**Purpose**: Send the generated quote via email or other channels.

**Request**:
```json
{
  "action": "send_quote",
  "user_id": "user-uuid",
  "data": {
    "quote_id": "quote-uuid",
    "email": "john@smith.com"
  }
}
```

**Response**:
```json
{
  "success": true,
  "action": "send_quote",
  "result": {
    "message": "Quote sent to john@smith.com"
  }
}
```

**AI Logic**:
- Use this tool ONLY when the plumber explicitly says "send it" and provides an email or phone number.
- Confirm the action: *"Sending the quote to john@smith.com now. Done!"*

---

### 5. **`get_quotes`** — Retrieve Quotes
**Purpose**: Get a list of the plumber's quotes (for dashboard-like queries).

**Request**:
```json
{
  "action": "get_quotes",
  "user_id": "user-uuid",
  "data": {
    "limit": 10,
    "status": "sent"
  }
}
```

**Response**:
```json
{
  "success": true,
  "action": "get_quotes",
  "result": [
    {
      "id": "quote-uuid",
      "customer_name": "John Smith",
      "total": 300,
      "status": "sent",
      "created_at": "2026-03-28T10:00:00Z"
    }
  ]
}
```

**AI Logic**:
- Use this tool when the plumber asks: *"Show me my recent quotes"* or *"How many quotes did I send this month?"*
- Summarize the results in natural language.

---

## 🧠 Intelligence Rules (The "Brain")

These rules define how the AI should behave when using the Trade Quotes Skill:

### 1. **Keep It Short**
- Replies should be **under 3 lines**. The plumber is on the job site, possibly with dirty hands.
- No fluff. Be direct and action-oriented.

### 2. **Smart Inference**
- If the plumber says *"faucet 250,"* assume the price is $250. Don't ask for clarification.
- If they say *"P-trap,"* infer they mean a P-trap replacement (not installation).
- Use context from their price history to make intelligent suggestions.

### 3. **Exact Wording**
- Never normalize or generalize the plumber's descriptions.
- If they say *"replaced leaky kitchen faucet,"* use that exact phrase in the line item.
- Don't change it to *"Plumbing Maintenance"* or *"Installation."*

### 4. **The "Done" Trigger**
- When the plumber says "done," "send it," "that's it," or "nope," they're signaling the end of the quote.
- Immediately show a summary with the total and ask for the customer's name.
- After getting the customer name, ask: *"Any extra details? (address, payment terms, notes) Or say 'skip' to generate now."*

### 5. **Tax & Currency**
- Automatically apply the plumber's `default_tax_rate` from their profile.
- Use the correct currency symbol (£, €, $) based on their settings.
- Display totals clearly: *"Subtotal: $250 | Tax: $50 | **Total: $300**"*

### 6. **Subscription Gating**
- If the plumber is on a "trial" plan and has exceeded 10 quotes, politely inform them:
  > *"You've used all 10 trial quotes. Upgrade to keep quoting: [Link to billing page]"*
- If their subscription is "canceled," ask them to reactivate.

---

## 📊 Example Conversations

### Scenario 1: Simple Quote
```
Plumber: "Faucet replacement 250"
AI: "Got it — faucet replacement $250 ✓. Anything else?"

Plumber: "Nope, send it to john@smith.com"
AI: "What's the customer's name?"

Plumber: "John Smith"
AI: "Any extra details? Or say 'skip' to generate now."

Plumber: "Skip"
AI: "Done! I've created the quote for John Smith. Sending it to john@smith.com now. ✓"
```

### Scenario 2: Using Price History
```
Plumber: "P-trap replacement"
AI: "You usually charge $120 for a P-trap. Should I use that?"

Plumber: "Yeah, add 50 for labor"
AI: "Got it — P-trap replacement $120 + labor $50 ✓. Total so far: $170. Anything else?"

Plumber: "That's it. Send to jane@email.com"
AI: "Customer name?"

Plumber: "Jane Doe"
AI: "Sending the $170 quote to jane@email.com. Done! ✓"
```

### Scenario 3: Complex Job
```
Plumber: "Drain cleaning 80"
AI: "Got it — drain cleaning $80 ✓. Anything else?"

Plumber: "Also replaced the p-trap, 120"
AI: "Got it — P-trap replacement $120 ✓. Anything else?"

Plumber: "And new fittings, 45"
AI: "Got it — new fittings $45 ✓. Anything else?"

Plumber: "That's all. Send it"
AI: "Subtotal: $245 | Tax: $49 | **Total: $294**. Customer name?"

Plumber: "Bob Johnson"
AI: "Email for Bob?"

Plumber: "bob@work.com"
AI: "Sending the $294 quote to bob@work.com. Done! ✓"
```

---

## 🚀 Deployment & Integration

### For Manus AI:
1. Add this Skill to your Skill Library.
2. When a user says *"Use my Trade Quotes skill,"* load this manifest.
3. Route all `chat`, `get_price_history`, `create_quote`, `send_quote`, and `get_quotes` calls to the API endpoint.

### For ChatGPT / Claude:
1. Register this as a custom "Plugin" or "Tool."
2. Provide the API endpoint and authentication details.
3. The AI will automatically call the appropriate function based on user intent.

### For Custom Integrations:
1. Use the API endpoint: `https://tradespeople.app/api/skill`
2. Authenticate with your `SKILL_API_KEY`.
3. Follow the request/response formats defined above.

---

## 🔐 Security & Privacy

- **API Keys**: Store `SKILL_API_KEY` securely in environment variables. Never expose in client-side code.
- **User Data**: All quotes and pricing data are associated with the authenticated `user_id`. No cross-user data leakage.
- **Rate Limiting**: Implement rate limiting on the `/api/skill` endpoint to prevent abuse.
- **Audit Logging**: Log all Skill API calls for compliance and debugging.

---

## 📈 Pricing & Monetization

### Skill as a Service (SkaaS) Model:
- **Free Tier**: Users get 10 quotes/month via the Skill (same as Web UI).
- **Starter Plan**: $29/month for 100 quotes/month via the Skill + Web UI.
- **Pro Plan**: $99/month for unlimited quotes via the Skill + Web UI + Priority support.

The plumber pays **once** for the Skill, and it works across **any AI platform** (Manus, ChatGPT, Claude, etc.).

---

## 🎓 Support & Documentation

- **API Documentation**: See `/docs/skill-api.md` in the repository.
- **Integration Guide**: See `/docs/skill-integration.md` for step-by-step setup.
- **Support**: Contact support@tradespeople.app for technical issues.

---

## 🔄 Versioning

- **v1.0** (March 28, 2026): Initial release with core quote building, pricing history, and email sending.
- **v1.1** (Planned): WhatsApp integration (once Meta APIs are re-enabled).
- **v2.0** (Planned): Invoice generation, payment tracking, and customer portal.

---

**End of Skill Manifest**
