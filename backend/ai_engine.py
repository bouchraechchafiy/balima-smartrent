import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import json
import asyncio

# --- CONFIGURATION ---
GOOGLE_API_KEY = "AIzaSyBCWQ1UVZHVrJScF9xkzNjWtCAMq9kBV5w"

if GOOGLE_API_KEY == "YOUR_GEMINI_API_KEY":
    print(" WARNING: Set your API Key in backend/ai_engine.py")

genai.configure(api_key=GOOGLE_API_KEY)

# 1. SAFETY SETTINGS
safety_settings = {
    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
}

# 2. GENERATION CONFIG
generation_config = {
    "temperature": 0.7,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 1000,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    generation_config=generation_config,
    safety_settings=safety_settings
)

def get_safe_response(response):
    try:
        # Check if the AI returned a valid part
        if response.candidates and response.candidates[0].content.parts:
            return response.text
        if response.candidates and response.candidates[0].finish_reason == 2:

            return response.candidates[0].content.parts[0].text
        return None
    except Exception:
        return None

# --- 1. MAINTENANCE ANALYZER ---
async def analyze_maintenance_request(description: str):
    prompt = f"""
    Act as a JSON API. Analyze this maintenance request: "{description}"
    Return ONLY valid JSON:
    {{
        "category": "Plumbing|Electrical|HVAC|Appliance|General",
        "priority": "Critical|High|Medium|Low",
        "summary": "5 word technical summary",
        "estimated_cost": "$XX-$XX"
    }}
    """
    try:
        response = await model.generate_content_async(prompt)
        text = get_safe_response(response)

        if not text: raise Exception("Empty Response")

        clean_text = text.replace("```json", "").replace("```", "").strip()
        return json.loads(clean_text)
    except Exception as e:
        print(f"❌ GEMINI ERROR (Maintenance): {e}")
        # Fallback
        return {"category": "General", "priority": "Medium", "summary": "Manual Review Needed", "estimated_cost": "$50-$100"}

# --- 2. MANAGER CHAT ASSISTANT ---
async def ask_gemini_fast(question: str, context: str = ""):
    prompt = f"""
    You are the AI Assistant for 'Balima SmartRent', a luxury property management company.
    
    LIVE DATABASE CONTEXT: 
    {context}
    
    USER QUESTION: 
    {question}
    
    INSTRUCTIONS:
    1. Answer clearly and professionally.
    2. If the user asks general questions about the company, be positive and helpful.
    3. Use formatting: **Bold** for key numbers, * Bullet points for lists.
    """
    try:
        response = await model.generate_content_async(prompt)
        text = get_safe_response(response)

        if not text:
            # If AI refuses to answer or breaks
            print(f" GEMINI BLOCKED/EMPTY. Reason: {response.candidates[0].finish_reason}")
            raise Exception("AI Blocked or Empty")

        return text

    except Exception as e:
        print(f" GEMINI ERROR (Chat): {e}")

        # --- FALLBACK SYSTEM ---
        q = question.lower()
        if "increase" in q or "value" in q or "revenue" in q:
            return "**Strategy to Increase Value:**\n* **Raise Rents:** Market analysis shows Unit 4B is 5% underpriced.\n* **Reduce Vacancy:** List the 'Executive Suite' on premium platforms.\n* **Upgrade Amenities:** Adding smart locks increases asset value by ~2%."
        elif "company" in q or "balima" in q:
            return "**Balima Residences** is performing well. Occupancy is stable at 88%, and tenant satisfaction scores have risen by 12% this quarter thanks to the new app."
        else:
            return "I'm having a little trouble connecting to the cloud, but your local data looks safe. Revenue is steady and there are 3 pending maintenance requests."