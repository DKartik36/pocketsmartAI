import streamlit as st
import requests
import plotly.graph_objects as go

st.set_page_config(page_title="PocketSmart AI", page_icon="💰", layout="wide")

# Custom CSS for white theme
st.markdown("""
<style>
    .stApp { background-color: #FAFBFD; }
    .stTabs [data-baseweb="tab-list"] { gap: 8px; }
    .stTabs [data-baseweb="tab"] {
        background-color: white;
        border-radius: 12px;
        padding: 10px 20px;
        border: 1px solid #E5E7EB;
    }
    .stTabs [aria-selected="true"] {
        background: linear-gradient(135deg, #6366F1, #8B5CF6);
        color: white;
    }
    .metric-card {
        background: white;
        border-radius: 16px;
        padding: 20px;
        border: 1px solid #E5E7EB;
        box-shadow: 0 4px 24px -4px rgba(99,102,241,0.08);
        text-align: center;
    }
</style>
""", unsafe_allow_html=True)

BACKEND_URL = "http://localhost:5000"

st.title("💰 PocketSmart AI")
st.caption("Your Smart Budget & Recommendation Assistant")

tab1, tab2, tab3 = st.tabs(["🏠 Home Interiors", "🎉 Party Planning", "💎 Jewelry"])

with tab1:
    st.subheader("Home Budget Planner")
    col1, col2 = st.columns(2)
    with col1:
        home_budget = st.number_input("Total Budget (₹)", min_value=1000, value=50000, step=1000, key="home_b")
    with col2:
        room_type = st.selectbox("Room Type", ["Living Room", "Bedroom", "Kitchen"])

    if st.button("Get Recommendations", key="home_btn"):
        try:
            resp = requests.post(f"{BACKEND_URL}/home_budget", json={"budget": home_budget, "room_type": room_type})
            data = resp.json()
            st.success(f"Budget plan for {room_type} — ₹{home_budget:,}")
            cols = st.columns(2)
            for i, item in enumerate(data["recommendations"]):
                with cols[i % 2]:
                    st.container()
                    st.metric(label=item["item"], value=f"₹{item['price']:,}")
                    st.caption(f"Source: {item['source']}")
        except Exception as e:
            st.error(f"Backend error: {e}")

with tab2:
    st.subheader("Party Budget Planner")
    col1, col2 = st.columns(2)
    with col1:
        party_budget = st.number_input("Total Budget (₹)", min_value=1000, value=100000, step=1000, key="party_b")
    with col2:
        event_type = st.selectbox("Event Type", ["Birthday", "Wedding", "Corporate Event"])

    if st.button("Plan My Party", key="party_btn"):
        try:
            resp = requests.post(f"{BACKEND_URL}/party_budget", json={"budget": party_budget, "event_type": event_type})
            data = resp.json()
            st.success(f"Budget split for {event_type} — ₹{party_budget:,}")

            cols = st.columns(len(data["splits"]))
            for i, split in enumerate(data["splits"]):
                with cols[i]:
                    st.metric(label=split["category"], value=f"₹{split['amount']:,}", delta=f"{split['percentage']}%")
                    st.caption(f"via {split['platform']}")

            fig = go.Figure(data=[go.Pie(
                labels=[s["category"] for s in data["splits"]],
                values=[s["amount"] for s in data["splits"]],
                hole=0.4,
                marker_colors=["#f472b6", "#a78bfa", "#60a5fa", "#34d399", "#fbbf24"]
            )])
            fig.update_layout(paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)")
            st.plotly_chart(fig, use_container_width=True)
        except Exception as e:
            st.error(f"Backend error: {e}")

with tab3:
    st.subheader("Jewelry Budget Planner")
    col1, col2 = st.columns(2)
    with col1:
        jewelry_budget = st.number_input("Total Budget (₹)", min_value=500, value=25000, step=500, key="jewelry_b")
    with col2:
        occasion = st.selectbox("Occasion", ["Wedding", "Party", "Casual"])

    uploaded = st.file_uploader("Upload outfit image (optional, mock analysis)", type=["png", "jpg", "jpeg"])
    if uploaded:
        st.info("🤖 AI Analysis: Warm tones detected — recommendations adjusted!")

    if st.button("Get Jewelry Picks", key="jewelry_btn"):
        try:
            resp = requests.post(f"{BACKEND_URL}/jewelry_budget", json={"budget": jewelry_budget, "occasion": occasion})
            data = resp.json()
            st.success(f"Jewelry picks for {occasion} — ₹{jewelry_budget:,}")
            cols = st.columns(2)
            for i, item in enumerate(data["recommendations"]):
                with cols[i % 2]:
                    st.metric(label=item["type"], value=f"₹{item['price']:,}")
                    st.caption(f"Material: {item['material']}")
        except Exception as e:
            st.error(f"Backend error: {e}")
