from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import json
import os
import re
from urllib import error as urlerror
from urllib import request as urlrequest

try:
    import anthropic
except Exception:  # pragma: no cover - handled by runtime fallback
    anthropic = None

# Load environment variables from .env file
load_dotenv()

# Initialize Flask with specific folder paths for the new directory structure
app = Flask(__name__,
            template_folder='templates',
            static_folder='static')

app.secret_key = "pocketsmart_secret_key_2024"

SYSTEM_PROMPT = """You are PocketSmart AI, an expert personal finance assistant.
You help users analyze budgets and get product recommendations.
Always be encouraging and practical. Use Rs for Indian context or $ for US.
When providing analysis, use Markdown (bolding and lists) for readability."""

PROVIDER = os.environ.get("LLM_PROVIDER", "auto").strip().lower()
ANTHROPIC_MODEL = os.environ.get("ANTHROPIC_MODEL", "claude-3-5-sonnet-20241022")
OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434/api/chat")
OLLAMA_MODEL = os.environ.get("OLLAMA_MODEL", "llama3.1:8b")


def build_anthropic_client():
    if anthropic is None:
        raise RuntimeError("anthropic package is not installed")

    api_key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY is missing in .env")
    if not api_key.startswith("sk-ant-"):
        raise RuntimeError("ANTHROPIC_API_KEY looks invalid. Use a real Anthropic key starting with 'sk-ant-'.")
    return anthropic.Anthropic(api_key=api_key)


def get_anthropic_client():
    if not hasattr(get_anthropic_client, "client"):
        get_anthropic_client.client = build_anthropic_client()
    return get_anthropic_client.client


# Helper function to clean numeric strings (removes symbols, commas, spaces)
def clean_numeric(value):
    try:
        if value is None or value == "":
            return 0.0
        return float(re.sub(r"[^\d.]", "", str(value)))
    except Exception:
        return 0.0


def mock_response(messages):
    user_text = ""
    for msg in reversed(messages):
        if msg.get("role") == "user":
            user_text = str(msg.get("content", "")).strip()
            break

    if not user_text:
        user_text = "Tell me how to improve my monthly budget."

    return (
        "Using free mock mode (no paid API).\n\n"
        "1. Split spending into Needs, Wants, and Savings.\n"
        "2. Keep savings transfer automatic on salary day.\n"
        "3. Track top 3 expense categories weekly and reduce one by 10%.\n\n"
        f"You asked: {user_text}\n"
    )


def anthropic_response(messages):
    client = get_anthropic_client()
    response = client.messages.create(
        model=ANTHROPIC_MODEL,
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=messages,
    )
    return response.content[0].text


def ollama_response(messages):
    payload = {
        "model": OLLAMA_MODEL,
        "messages": [{"role": "system", "content": SYSTEM_PROMPT}] + messages,
        "stream": False,
    }
    req = urlrequest.Request(
        OLLAMA_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urlrequest.urlopen(req, timeout=20) as resp:
        body = json.loads(resp.read().decode("utf-8"))
    return body.get("message", {}).get("content", "No response from Ollama.")


def generate_ai_text(messages):
    active_provider = PROVIDER

    if active_provider == "anthropic":
        return anthropic_response(messages)
    if active_provider == "ollama":
        return ollama_response(messages)
    if active_provider == "mock":
        return mock_response(messages)

    # auto mode: Anthropic -> Ollama -> Mock
    if active_provider != "auto":
        raise RuntimeError("Invalid LLM_PROVIDER. Use one of: auto, anthropic, ollama, mock")

    errors = []

    try:
        return anthropic_response(messages)
    except Exception as e:
        errors.append(f"anthropic: {e}")

    try:
        return ollama_response(messages)
    except (Exception, urlerror.URLError) as e:
        errors.append(f"ollama: {e}")

    print("INFO: Falling back to mock provider.")
    if errors:
        print("INFO: Provider errors:")
        for item in errors:
            print(f"- {item}")

    return mock_response(messages)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json() or {}
    user_message = data.get("message", "")
    history = data.get("history", [])

    # Keep only last 10 messages for context to save tokens
    formatted_history = [
        {"role": m["role"], "content": m["content"]} for m in history[-10:]
        if isinstance(m, dict) and "role" in m and "content" in m
    ]

    try:
        response_text = generate_ai_text(
            formatted_history + [{"role": "user", "content": user_message}]
        )
        return jsonify({
            "status": "success",
            "response": response_text
        })
    except Exception as e:
        print(f"Chat Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route("/analyze-budget", methods=["POST"])
def analyze_budget():
    data = request.get_json() or {}
    income = clean_numeric(data.get("income", 0))
    raw_expenses = data.get("expenses", [])

    expense_items = []
    fallback_expenses_text = ""

    # Preferred shape from frontend: [{category, amount}, ...]
    if isinstance(raw_expenses, list):
        for item in raw_expenses:
            if not isinstance(item, dict):
                continue
            category = str(item.get("category", "Other")).strip() or "Other"
            amount = clean_numeric(item.get("amount", 0))
            if amount > 0:
                expense_items.append({"category": category, "amount": amount})
    elif isinstance(raw_expenses, str):
        # Backward-compatible path if expenses are sent as free text
        fallback_expenses_text = raw_expenses

    if expense_items:
        expenses_text = "\n".join(
            f"- {item['category']}: Rs {item['amount']:.2f}" for item in expense_items
        )
        total_expenses = round(sum(item["amount"] for item in expense_items), 2)
    else:
        expenses_text = fallback_expenses_text or "No expenses provided"
        expense_values = re.findall(r"(\d+(?:\.\d+)?)", expenses_text)
        total_expenses = round(sum(float(v) for v in expense_values), 2)

    prompt = (
        f"Income: Rs {income:.2f}\n"
        f"Expenses details:\n{expenses_text}\n\n"
        "Please analyze this budget. Categorize expenses, calculate the percentage of income spent, "
        "and provide 3 tips to save more."
    )

    try:
        analysis_text = generate_ai_text([{"role": "user", "content": prompt}])

        savings = round(income - total_expenses, 2)
        savings_percent = round((savings / income * 100), 1) if income > 0 else 0

        return jsonify({
            "analysis": analysis_text,
            "total_expenses": total_expenses,
            "savings": savings,
            "savings_percent": savings_percent
        })
    except Exception as e:
        print(f"Budget Error: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json() or {}
    category = data.get("category", "General")
    budget = clean_numeric(data.get("budget", 0))
    reqs = data.get("requirements", "None")

    prompt = (
        f"Recommend the best {category} within a budget of Rs {budget:.2f}. "
        f"Requirements: {reqs}. Provide 3 options (Budget, Value, Premium) with approximate prices."
    )

    try:
        response_text = generate_ai_text([{"role": "user", "content": prompt}])
        return jsonify({
            "recommendations": response_text
        })
    except Exception as e:
        print(f"Recommendation Error: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
