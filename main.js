// ============================================
//  PocketSmart AI – Main JavaScript
// ============================================

let chatHistory = [];

// ----------- Tab Switching -----------
function switchTab(tab, btn) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    btn.classList.add('active');

    const titles = {
        chat: ['AI Financial Assistant', 'Ask anything about your budget & finances'],
        budget: ['Budget Analyzer', 'Analyze your income and expenses with AI'],
        recommend: ['Smart Recommendations', 'Get AI-powered picks within your budget']
    };
    document.getElementById('pageTitle').textContent = titles[tab][0];
    document.getElementById('pageSub').textContent = titles[tab][1];
}

// ----------- Chat -----------
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;

    appendMessage('user', msg);
    input.value = '';
    autoResize(input);
    chatHistory.push({ role: 'user', content: msg });

    const typingId = showTyping();
    document.getElementById('sendBtn').disabled = true;

    try {
        const res = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg, history: chatHistory.slice(0, -1) })
        });
        const data = await res.json();
        removeTyping(typingId);

        if (data.status === 'success') {
            appendMessage('bot', data.response);
            chatHistory.push({ role: 'assistant', content: data.response });
        } else {
            appendMessage('bot', '⚠️ Something went wrong. Please try again.');
        }
    } catch (e) {
        removeTyping(typingId);
        appendMessage('bot', '⚠️ Connection error. Please check your server.');
    }
    document.getElementById('sendBtn').disabled = false;
}

function appendMessage(role, text) {
    const wrap = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `message ${role === 'bot' ? 'bot-message' : 'user-message'} animate-in`;

    const formattedText = formatMarkdown(text);

    div.innerHTML = `
        <div class="msg-avatar ${role === 'bot' ? 'bot-avatar' : 'user-avatar'}">${role === 'bot' ? 'PS' : 'ME'}</div>
        <div class="msg-bubble">${formattedText}</div>
    `;
    wrap.appendChild(div);
    wrap.scrollTop = wrap.scrollHeight;
}

function showTyping() {
    const wrap = document.getElementById('chatMessages');
    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.id = id;
    div.className = 'message bot-message animate-in';
    div.innerHTML = `
        <div class="msg-avatar bot-avatar">PS</div>
        <div class="msg-bubble">
            <div class="typing-dots"><span></span><span></span><span></span></div>
        </div>
    `;
    wrap.appendChild(div);
    wrap.scrollTop = wrap.scrollHeight;
    return id;
}

function removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function sendQuick(text) {
    document.getElementById('chatInput').value = text;
    sendMessage();
}

function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 140) + 'px';
}

// ----------- Budget Analyzer -----------
function addExpense() {
    const list = document.getElementById('expensesList');
    const row = document.createElement('div');
    row.className = 'expense-row';
    const id = 'expense-' + Date.now();
    row.innerHTML = `
        <label for="${id}-cat">Category</label>
        <select id="${id}-cat" name="category" class="expense-cat">
            <option>🏠 Housing/Rent</option>
            <option>🍔 Food & Groceries</option>
            <option>🚗 Transport</option>
            <option>💊 Healthcare</option>
            <option>📱 Subscriptions</option>
            <option>🎬 Entertainment</option>
            <option>👔 Clothing</option>
            <option>📚 Education</option>
            <option>💳 Loan EMI</option>
            <option>🔧 Utilities</option>
            <option>Other</option>
        </select>
        
        <label for="${id}-amt">Amount (₹)</label>
        <input type="number" id="${id}-amt" name="amount" class="expense-amt" placeholder="Amount (₹)">
        
        <button type="button" class="del-btn" onclick="removeExpense(this)">×</button>
    `;
    list.appendChild(row);
}

function removeExpense(btn) {
    const rows = document.querySelectorAll('.expense-row');
    if (rows.length > 1) btn.closest('.expense-row').remove();
}

async function analyzeBudget() {
    const income = parseFloat(document.getElementById('incomeInput').value) || 0;
    if (!income) { alert('Please enter your monthly income.'); return; }

    const rows = document.querySelectorAll('.expense-row');
    const expenses = [];
    rows.forEach(row => {
        const cat = row.querySelector('.expense-cat').value.replace(/[^\w\s\/&]/g, '').trim();
        const amt = parseFloat(row.querySelector('.expense-amt').value) || 0;
        if (amt > 0) expenses.push({ category: cat, amount: amt });
    });

    if (!expenses.length) { alert('Please add at least one expense.'); return; }

    const btn = document.querySelector('#budgetForm .analyze-btn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Analyzing...';

    try {
        const res = await fetch('/analyze-budget', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ income, expenses })
        });
        const data = await res.json();

        showBudgetResult(income, expenses, data);
    } catch (e) {
        alert('Error analyzing budget. Please try again.');
    }

    btn.disabled = false;
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg> Analyze My Budget`;
}

function showBudgetResult(income, expenses, data) {
    const result = document.getElementById('budgetResult');
    result.style.display = 'block';

    // Health badge
    const badge = document.getElementById('healthBadge');
    const savPct = data.savings_percent || 0;
    if (savPct >= 20) { badge.textContent = '✅ Healthy'; badge.className = 'health-badge health-good'; }
    else if (savPct >= 5) { badge.textContent = '⚠️ Warning'; badge.className = 'health-badge health-warn'; }
    else { badge.textContent = '🚨 Critical'; badge.className = 'health-badge health-danger'; }

    // Stats
    document.getElementById('budgetStats').innerHTML = `
        <div class="stat-item">
            <div class="stat-val" style="color: var(--accent)">₹${income.toLocaleString()}</div>
            <div class="stat-lbl">Income</div>
        </div>
        <div class="stat-item">
            <div class="stat-val" style="color: var(--danger)">₹${data.total_expenses.toLocaleString()}</div>
            <div class="stat-lbl">Expenses</div>
        </div>
        <div class="stat-item">
            <div class="stat-val" style="color: ${data.savings >= 0 ? 'var(--accent)' : 'var(--danger)'}">₹${Math.abs(data.savings).toLocaleString()}</div>
            <div class="stat-lbl">${data.savings >= 0 ? 'Savings' : 'Deficit'}</div>
        </div>
        <div class="stat-item">
            <div class="stat-val" style="color: ${savPct >= 20 ? 'var(--accent)' : savPct >= 5 ? 'var(--warn)' : 'var(--danger)'}">
                ${savPct}%
            </div>
            <div class="stat-lbl">Saved</div>
        </div>
    `;

    // Donut Chart
    drawDonut(expenses, data.total_expenses, income, data.savings);

    // Analysis text
    document.getElementById('analysisText').textContent = data.analysis;

    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function drawDonut(expenses, totalExp, income, savings) {
    const canvas = document.getElementById('donutChart');
    const ctx = canvas.getContext('2d');
    const colors = ['#00e5a0', '#00b8ff', '#a78bfa', '#ff5b7f', '#ffb347', '#f472b6', '#34d399', '#60a5fa', '#fb923c', '#e879f9', '#94a3b8'];

    ctx.clearRect(0, 0, 200, 200);
    const cx = 100, cy = 100, r = 75, inner = 48;
    let startAngle = -Math.PI / 2;

    const items = [...expenses];
    if (savings > 0) items.push({ category: '💾 Savings', amount: savings });
    const total = income;

    const legend = document.getElementById('donutLegend');
    legend.innerHTML = '';

    items.forEach((item, i) => {
        const slice = (item.amount / total) * 2 * Math.PI;
        const color = colors[i % colors.length];

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, startAngle, startAngle + slice);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();

        // Inner hole
        ctx.beginPath();
        ctx.arc(cx, cy, inner, 0, 2 * Math.PI);
        ctx.fillStyle = '#0f1118';
        ctx.fill();

        const pct = Math.round((item.amount / total) * 100);
        const cleanCat = item.category.replace(/[^\w\s\/&]/g, '').trim();
        legend.innerHTML += `
            <div class="legend-item">
                <div class="legend-dot" style="background:${color}"></div>
                <span style="color:var(--text-muted)">${cleanCat} – <strong style="color:var(--text)">${pct}%</strong></span>
            </div>
        `;

        startAngle += slice;
    });

    // Center text
    ctx.fillStyle = '#e8eaf0';
    ctx.font = 'bold 13px Syne, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Budget', cx, cy - 8);
    ctx.font = '11px DM Sans, sans-serif';
    ctx.fillStyle = '#8890a4';
    ctx.fillText('breakdown', cx, cy + 9);
}

// ----------- Recommendations -----------
function setCategory(cat) {
    document.getElementById('recCategory').value = cat;
}

async function getRecommendations() {
    const category = document.getElementById('recCategory').value.trim();
    const budget = parseFloat(document.getElementById('recBudget').value) || 0;
    const requirements = document.getElementById('recRequirements').value.trim();

    if (!category) { alert('Please enter what you are looking for.'); return; }
    if (!budget) { alert('Please enter your budget.'); return; }

    const btn = document.querySelector('#tab-recommend .analyze-btn');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Finding best picks...';

    try {
        const res = await fetch('/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category, budget, requirements })
        });
        const data = await res.json();

        const result = document.getElementById('recResult');
        result.style.display = 'block';
        document.getElementById('recContent').textContent = data.recommendations;
        result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e) {
        alert('Error getting recommendations. Please try again.');
    }

    btn.disabled = false;
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Get Smart Recommendations`;
}

// ----------- Markdown Formatter -----------
function formatMarkdown(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code style="background:rgba(255,255,255,0.07);padding:2px 6px;border-radius:4px;font-size:13px">$1</code>')
        .replace(/^#{1,3} (.+)/gm, '<strong style="font-size:15px;color:var(--text)">$1</strong>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>');
}