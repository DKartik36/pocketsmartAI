from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ---- HOME BUDGET ----
@app.route("/home_budget", methods=["POST"])
def home_budget():
    data = request.json
    budget = data.get("budget", 0)
    room_type = data.get("room_type", "Living Room")

    allocations = {
        "Living Room": [
            {"item": "Sofa Set", "pct": 0.30, "source": "IKEA"},
            {"item": "Coffee Table", "pct": 0.10, "source": "Amazon"},
            {"item": "TV Unit", "pct": 0.15, "source": "Flipkart"},
            {"item": "Wall Art & Decor", "pct": 0.10, "source": "Amazon"},
            {"item": "Lighting Fixtures", "pct": 0.12, "source": "IKEA"},
            {"item": "Curtains & Rugs", "pct": 0.10, "source": "Flipkart"},
            {"item": "Indoor Plants", "pct": 0.05, "source": "Amazon"},
            {"item": "Cushions & Throws", "pct": 0.08, "source": "IKEA"},
        ],
        "Bedroom": [
            {"item": "Bed Frame & Mattress", "pct": 0.35, "source": "IKEA"},
            {"item": "Wardrobe", "pct": 0.20, "source": "Flipkart"},
            {"item": "Bedside Tables", "pct": 0.08, "source": "Amazon"},
            {"item": "Bedding Set", "pct": 0.10, "source": "Amazon"},
            {"item": "Table Lamp", "pct": 0.07, "source": "IKEA"},
            {"item": "Mirror", "pct": 0.08, "source": "Flipkart"},
            {"item": "Wall Decor", "pct": 0.07, "source": "Amazon"},
            {"item": "Storage Organizers", "pct": 0.05, "source": "IKEA"},
        ],
        "Kitchen": [
            {"item": "Modular Cabinets", "pct": 0.30, "source": "IKEA"},
            {"item": "Countertop Appliances", "pct": 0.20, "source": "Amazon"},
            {"item": "Dining Set", "pct": 0.15, "source": "Flipkart"},
            {"item": "Cookware Set", "pct": 0.10, "source": "Amazon"},
            {"item": "Lighting", "pct": 0.08, "source": "IKEA"},
            {"item": "Storage Jars & Rack", "pct": 0.07, "source": "Flipkart"},
            {"item": "Kitchen Decor", "pct": 0.05, "source": "Amazon"},
            {"item": "Utensils & Tools", "pct": 0.05, "source": "Flipkart"},
        ],
    }

    items = allocations.get(room_type, allocations["Living Room"])
    results = [{"item": i["item"], "price": round(budget * i["pct"]), "source": i["source"]} for i in items]
    return jsonify({"room_type": room_type, "budget": budget, "recommendations": results})


# ---- PARTY BUDGET ----
@app.route("/party_budget", methods=["POST"])
def party_budget():
    data = request.json
    budget = data.get("budget", 0)
    event_type = data.get("event_type", "Birthday")

    splits = {
        "Birthday": [
            {"category": "Food & Cake", "pct": 0.30, "platform": "Swiggy"},
            {"category": "Venue", "pct": 0.25, "platform": "OYO"},
            {"category": "Decoration", "pct": 0.20, "platform": "Amazon"},
            {"category": "Entertainment", "pct": 0.15, "platform": "BookMyShow"},
            {"category": "Gifts & Favors", "pct": 0.10, "platform": "Flipkart"},
        ],
        "Wedding": [
            {"category": "Catering", "pct": 0.35, "platform": "Zomato"},
            {"category": "Venue & Stage", "pct": 0.30, "platform": "OYO"},
            {"category": "Floral Decoration", "pct": 0.15, "platform": "BigBasket"},
            {"category": "Music & DJ", "pct": 0.10, "platform": "BookMyShow"},
            {"category": "Photography", "pct": 0.10, "platform": "UrbanClap"},
        ],
        "Corporate Event": [
            {"category": "Catering & Snacks", "pct": 0.25, "platform": "Zomato"},
            {"category": "Venue Rental", "pct": 0.30, "platform": "OYO"},
            {"category": "AV Equipment", "pct": 0.20, "platform": "Amazon"},
            {"category": "Branding & Print", "pct": 0.15, "platform": "Vistaprint"},
            {"category": "Gifting", "pct": 0.10, "platform": "Flipkart"},
        ],
    }

    items = splits.get(event_type, splits["Birthday"])
    results = [
        {"category": i["category"], "amount": round(budget * i["pct"]), "percentage": round(i["pct"] * 100), "platform": i["platform"]}
        for i in items
    ]
    return jsonify({"event_type": event_type, "budget": budget, "splits": results})


# ---- JEWELRY BUDGET ----
@app.route("/jewelry_budget", methods=["POST"])
def jewelry_budget():
    data = request.json
    budget = data.get("budget", 0)
    occasion = data.get("occasion", "Casual")

    recommendations = {
        "Wedding": [
            {"type": "Necklace Set", "pct": 0.35, "material": "Gold Plated"},
            {"type": "Earrings", "pct": 0.20, "material": "Gold & Pearl"},
            {"type": "Bangles Set", "pct": 0.15, "material": "Gold Plated"},
            {"type": "Maang Tikka", "pct": 0.10, "material": "Kundan"},
            {"type": "Anklet", "pct": 0.10, "material": "Silver"},
            {"type": "Ring", "pct": 0.10, "material": "Diamond Look"},
        ],
        "Party": [
            {"type": "Statement Necklace", "pct": 0.30, "material": "Rose Gold"},
            {"type": "Drop Earrings", "pct": 0.25, "material": "Crystal"},
            {"type": "Bracelet", "pct": 0.20, "material": "Silver"},
            {"type": "Cocktail Ring", "pct": 0.15, "material": "Gold Plated"},
            {"type": "Hair Pin", "pct": 0.10, "material": "Crystal"},
        ],
        "Casual": [
            {"type": "Pendant Chain", "pct": 0.30, "material": "Sterling Silver"},
            {"type": "Stud Earrings", "pct": 0.25, "material": "Silver"},
            {"type": "Thin Bracelet", "pct": 0.20, "material": "Leather & Steel"},
            {"type": "Simple Ring", "pct": 0.15, "material": "Silver"},
            {"type": "Anklet", "pct": 0.10, "material": "Beaded"},
        ],
    }

    items = recommendations.get(occasion, recommendations["Casual"])
    results = [{"type": i["type"], "price": round(budget * i["pct"]), "material": i["material"]} for i in items]
    return jsonify({"occasion": occasion, "budget": budget, "recommendations": results})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
