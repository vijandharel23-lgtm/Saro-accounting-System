/* ==========================================================================
   SAROFINANCE BUSINESS LOGIC & CONTROLLER - DIGITAL AGENCY ACCOUNTING
   ========================================================================== */

// --- STATE MANAGEMENT ---
let DB = {
    clients: [],
    expenses: [],
    employees: [],
    assets: [],
    activity: [],
    openingBalance: 0,
    investments: []
};

// Target Admin Credentials
const ADMIN_ID = "accounting@sarobynayasathi.com";
const ADMIN_PW = "saroaccount@600k";

// Global Chart References
let plChartInstance = null;
let expenseChartInstance = null;

// --- DATABASE SERVICE LAYER ---
function loadDatabase() {
    const rawData = localStorage.getItem("saro_agency_db");
    if (rawData) {
        try {
            DB = JSON.parse(rawData);
            // Verify structure has all arrays
            DB.clients = DB.clients || [];
            DB.expenses = DB.expenses || [];
            DB.employees = DB.employees || [];
            DB.assets = DB.assets || [];
            DB.activity = DB.activity || [];
            DB.openingBalance = DB.openingBalance || 0;
            DB.investments = DB.investments || [];
        } catch (e) {
            console.error("Error parsing local DB, seeding default", e);
            seedDefaultDatabase();
        }
    } else {
        seedDefaultDatabase();
    }
}

function saveDatabase() {
    localStorage.setItem("saro_agency_db", JSON.stringify(DB));
}

function logActivity(text, type = "info") {
    const timestamp = new Date().toISOString();
    DB.activity.unshift({
        id: "act_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
        timestamp,
        text,
        type // 'info', 'success', 'warning', 'danger'
    });
    // Keep max 50 logs
    if (DB.activity.length > 50) {
        DB.activity.pop();
    }
    saveDatabase();
}

function seedDefaultDatabase() {
    console.log("Seeding default mockup accounting database...");
    
    // Seed Clients
    DB.clients = [
        {
            id: "cli_1",
            name: "Apex Fitness Co.",
            category: "Digital Marketing Package",
            startDate: "2026-05-10",
            fee: 2500,
            email: "billing@apexfit.com",
            payments: [
                { cycleIndex: 1, dueDate: "2026-05-10", status: "Paid", paidDate: "2026-05-10", amountPaid: 2500, method: "E-Banking" },
                { cycleIndex: 2, dueDate: "2026-06-10", status: "Paid", paidDate: "2026-06-10", amountPaid: 2500, method: "E-Banking" },
                { cycleIndex: 3, dueDate: "2026-07-10", status: "Unpaid", paidDate: null, amountPaid: 0, method: "" }
            ]
        },
        {
            id: "cli_2",
            name: "Horizon SaaS",
            category: "Digital Marketing Package",
            startDate: "2026-06-01",
            fee: 4000,
            email: "finance@horizonsaas.io",
            payments: [
                { cycleIndex: 1, dueDate: "2026-06-01", status: "Paid", paidDate: "2026-06-02", amountPaid: 4000, method: "E-Banking" },
                { cycleIndex: 2, dueDate: "2026-07-01", status: "Paid", paidDate: "2026-07-02", amountPaid: 4000, method: "E-Banking" },
                { cycleIndex: 3, dueDate: "2026-08-01", status: "Unpaid", paidDate: null, amountPaid: 0, method: "" }
            ]
        },
        {
            id: "cli_3",
            name: "Novus Law Group",
            category: "Social Media Marketing",
            startDate: "2026-07-05",
            fee: 1800,
            email: "accounts@novuslaw.com",
            payments: [
                { cycleIndex: 1, dueDate: "2026-07-05", status: "Paid", paidDate: "2026-07-06", amountPaid: 1800, method: "E-Banking" },
                { cycleIndex: 2, dueDate: "2026-08-05", status: "Unpaid", paidDate: null, amountPaid: 0, method: "" }
            ]
        },
        {
            id: "cli_4",
            name: "Starlight E-commerce",
            category: "Website Commission",
            startDate: "2026-07-12",
            fee: 3500,
            email: "hello@starlightshop.co",
            payments: [
                { cycleIndex: 1, dueDate: "2026-07-12", status: "Unpaid", paidDate: null, amountPaid: 0, method: "" },
                { cycleIndex: 2, dueDate: "2026-08-12", status: "Unpaid", paidDate: null, amountPaid: 0, method: "" }
            ]
        }
    ];

    // Seed Expenses
    DB.expenses = [
        { id: "exp_1", date: "2026-06-15", category: "Rent & Utilities", desc: "Digital Hub Office Space Rent", amount: 950.00, source: "E-Banking" },
        { id: "exp_2", date: "2026-06-20", category: "Ad Spend (Google/Meta)", desc: "Meta Ads Platform (Apex Fitness campaigns)", amount: 1200.00, source: "E-Banking" },
        { id: "exp_3", date: "2026-06-25", category: "Software & SaaS Subscriptions", desc: "SEMrush Team Subscription Plan", amount: 249.00, source: "Cheque" },
        { id: "exp_4", date: "2026-07-01", category: "Software & SaaS Subscriptions", desc: "Adobe Creative Cloud Teams License", amount: 160.00, source: "E-Banking" },
        { id: "exp_5", date: "2026-07-05", category: "Rent & Utilities", desc: "High-speed Fiber Internet Provider", amount: 110.00, source: "E-Banking" },
        // Salaries expense seeds
        { id: "exp_sal_1", date: "2026-06-30", category: "Salaries & Bonuses", desc: "Staff Payroll: John Doe (Senior Media Buyer)", amount: 4500.00, source: "E-Banking" },
        { id: "exp_sal_2", date: "2026-06-30", category: "Salaries & Bonuses", desc: "Staff Payroll: Alice Smith (Account Manager)", amount: 3800.00, source: "E-Banking" },
        { id: "exp_sal_3", date: "2026-06-30", category: "Salaries & Bonuses", desc: "Staff Payroll: Bob Johnson (Content Creator)", amount: 2500.00, source: "Cheque" }
    ];

    // Seed Employees
    DB.employees = [
        { id: "emp_1", name: "John Doe", role: "Senior Media Buyer", salary: 4500, email: "john@agency.com", lastPaidDate: "2026-06-30" },
        { id: "emp_2", name: "Alice Smith", role: "Account Manager", salary: 3800, email: "alice@agency.com", lastPaidDate: "2026-06-30" },
        { id: "emp_3", name: "Bob Johnson", role: "Content Creator", salary: 2500, email: "bob@agency.com", lastPaidDate: "2026-06-30" }
    ];

    // Seed Assets
    DB.assets = [
        { id: "ast_1", name: "Apple MacBook Pro 16\" M3 Max", cost: 3500.00, depreciationRate: 20, purchaseDate: "2025-10-15" },
        { id: "ast_2", name: "Office Apple iMac 24\" Retina", cost: 1800.00, depreciationRate: 20, purchaseDate: "2026-01-10" },
        { id: "ast_3", name: "Ergonomic Office Chairs (Set of 6)", cost: 1200.00, depreciationRate: 10, purchaseDate: "2026-02-05" }
    ];

    // Seed Capital & Investments
    DB.openingBalance = 50000.00;
    DB.investments = [
        { id: "inv_1", date: "2026-05-01", type: "inward", desc: "Founder's Initial Capital Contribution", amount: 15000.00, source: "E-Banking" },
        { id: "inv_2", date: "2026-06-10", type: "outward", desc: "Corporate Fixed Deposit Investment", amount: 5000.00, source: "Cheque" }
    ];

    // Seed Activities
    DB.activity = [
        { id: "act_init", timestamp: new Date().toISOString(), text: "Accounting system initialized with starter template agency database.", type: "info" }
    ];

    saveDatabase();
}

// --- DATE HELPER FUNCTION ---
function addMonths(dateString, months) {
    const d = new Date(dateString);
    const day = d.getDate();
    d.setMonth(d.getMonth() + months);
    // Boundary check for month-end mismatch (e.g. Jan 31 + 1 month = March 3 or Feb 28 depending on how setMonth resolves it)
    if (d.getDate() < day) {
        d.setDate(0); 
    }
    return d.toISOString().split('T')[0];
}

function getDaysBetween(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = d1 - d2;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// --- DEPRECIATION CALCULATION HELPER ---
function calculateAssetCurrentValue(asset) {
    const purchaseDate = new Date(asset.purchaseDate);
    const currentDate = new Date();
    
    // Monthly aging calculation
    let months = (currentDate.getFullYear() - purchaseDate.getFullYear()) * 12;
    months += currentDate.getMonth() - purchaseDate.getMonth();
    
    if (months < 0) months = 0;
    
    const annualRate = parseFloat(asset.depreciationRate) / 100;
    const monthlyRate = annualRate / 12;
    
    const depreciatedFactor = 1 - (monthlyRate * months);
    const currentValue = parseFloat(asset.cost) * Math.max(0, depreciatedFactor);
    
    return {
        ageMonths: months,
        currentValue: parseFloat(currentValue.toFixed(2))
    };
}

// --- AUTHENTICATION MODULE ---
function checkAuth() {
    const sessionToken = sessionStorage.getItem("saro_admin_session");
    if (sessionToken === "logged_in") {
        document.getElementById("login-overlay").classList.add("hide");
        document.getElementById("app-container").classList.remove("hide");
        initDashboard();
        return true;
    } else {
        document.getElementById("login-overlay").classList.remove("hide");
        document.getElementById("app-container").classList.add("hide");
        return false;
    }
}

document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const errorEl = document.getElementById("login-error");

    if (email === ADMIN_ID && password === ADMIN_PW) {
        errorEl.classList.add("hide");
        sessionStorage.setItem("saro_admin_session", "logged_in");
        logActivity("Admin successfully logged in.", "success");
        checkAuth();
    } else {
        errorEl.classList.remove("hide");
        logActivity(`Failed login attempt from email: ${email}`, "danger");
    }
});

document.getElementById("btn-logout").addEventListener("click", function() {
    sessionStorage.removeItem("saro_admin_session");
    logActivity("Admin logged out.", "info");
    checkAuth();
});

// --- NAVIGATION & ROUTER ---
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();
        
        // Remove active class from all links
        document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
        // Add active class to clicked link
        this.classList.add("active");
        
        const targetViewId = this.getAttribute("data-target");
        
        // Hide all views
        document.querySelectorAll(".view-section").forEach(sec => sec.classList.remove("active"));
        // Show target view
        document.getElementById(targetViewId).classList.add("active");
        
        // Update Title
        const label = this.querySelector("span").textContent;
        document.getElementById("view-title").textContent = label + (label === "Dashboard" ? " Overview" : "");
        
        // Refresh modules based on selected navigation item
        switch(targetViewId) {
            case "sec-dashboard":
                initDashboard();
                break;
            case "sec-clients":
                renderClients();
                break;
            case "sec-expenses":
                renderExpenses();
                break;
            case "sec-salaries":
                renderEmployees();
                break;
            case "sec-assets":
                renderAssets();
                break;
            case "sec-capital":
                renderCapital();
                break;
            case "sec-backup":
                // No special load needed
                break;
        }
    });
});

// Theme toggler
const themeToggleBtn = document.getElementById("theme-toggle");
themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    document.body.classList.toggle("dark-theme");
    const isLightTheme = document.body.classList.contains("light-theme");
    document.getElementById("sun-icon").classList.toggle("hide", isLightTheme);
    document.getElementById("moon-icon").classList.toggle("hide", !isLightTheme);
    logActivity(`Switched interface color theme to ${isLightTheme ? 'Light' : 'Dark'} mode`, "info");
    
    // Rerender active view graphs if dashboard is visible
    if (document.getElementById("sec-dashboard").classList.contains("active")) {
        initDashboard();
    }
});

// --- CLIENTS MODULE LOGIC ---

// Render client list
function renderClients(searchQuery = "") {
    const tbody = document.getElementById("clients-tbody");
    tbody.innerHTML = "";
    
    const query = searchQuery.toLowerCase().trim();
    const filtered = DB.clients.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.category.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-4">No matching clients found.</td></tr>`;
        return;
    }

    filtered.forEach(client => {
        const m1 = client.payments.find(p => p.cycleIndex === 1) || { status: "Unpaid", dueDate: client.startDate };
        const m2 = client.payments.find(p => p.cycleIndex === 2) || { status: "Unpaid", dueDate: addMonths(client.startDate, 1) };
        
        // Calculate next outstanding cycle and due date
        let nextCycle = client.payments.find(p => p.status === "Unpaid");
        let nextDueStr = "Completed Plan";
        let nextDueBadgeType = "badge-success";
        
        if (nextCycle) {
            nextDueStr = nextCycle.dueDate;
            const daysLeft = getDaysBetween(nextCycle.dueDate, new Date().toISOString().split('T')[0]);
            if (daysLeft < 0) {
                nextDueBadgeType = "badge-danger";
            } else if (daysLeft <= 7) {
                nextDueBadgeType = "badge-warning";
            } else {
                nextDueBadgeType = "badge-info";
            }
        }
        
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <div style="font-weight: 600;">${escapeHtml(client.name)}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(client.email)}</div>
            </td>
            <td><span class="badge badge-info">${escapeHtml(client.category)}</span></td>
            <td>${client.startDate}</td>
            <td style="font-weight: 600;">Rs. ${parseFloat(client.fee).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
            <td>${renderCycleBadge(m1, client.fee)}</td>
            <td>${renderCycleBadge(m2, client.fee)}</td>
            <td><span class="badge ${nextDueBadgeType}">${nextDueStr}</span></td>
            <td>
                <div class="action-buttons">
                    ${nextCycle ? `
                    <button class="btn-icon btn-icon-success" onclick="openRecordPaymentModal('${client.id}')" title="Log Payment">
                        <i data-lucide="banknote"></i>
                    </button>` : ''}
                    <button class="btn-icon" onclick="openEditClientModal('${client.id}')" title="Edit Client">
                        <i data-lucide="edit-3"></i>
                    </button>
                    <button class="btn-icon btn-icon-danger" onclick="deleteClient('${client.id}')" title="Delete Client">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    lucide.createIcons();
}

function renderCycleBadge(cycle, fee) {
    if (cycle.status === "Paid") {
        return `<span class="cycle-step paid" title="Paid Rs. ${cycle.amountPaid} on ${cycle.paidDate}"><i data-lucide="check" style="width:10px;height:10px;display:inline-block;vertical-align:-1px;"></i> Paid</span>`;
    } else {
        const daysLeft = getDaysBetween(cycle.dueDate, new Date().toISOString().split('T')[0]);
        if (daysLeft < 0) {
            return `<span class="cycle-step unpaid" title="Overdue by ${Math.abs(daysLeft)} days">Overdue</span>`;
        } else {
            return `<span class="cycle-step pending" title="Due in ${daysLeft} days">Pending</span>`;
        }
    }
}

// Client search listener
document.getElementById("client-search").addEventListener("input", function() {
    renderClients(this.value);
});

// Add/Edit Client Modals actions
const clientModal = document.getElementById("modal-client");
document.getElementById("btn-add-client").addEventListener("click", () => {
    document.getElementById("form-client").reset();
    document.getElementById("client-id").value = "";
    document.getElementById("client-modal-title").textContent = "Add New Client";
    clientModal.classList.add("active");
    // Pre-fill today as start date
    document.getElementById("client-start-date").value = new Date().toISOString().split('T')[0];
});

document.querySelectorAll(".btn-close-modal").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
    });
});

document.getElementById("form-client").addEventListener("submit", function(e) {
    e.preventDefault();
    const id = document.getElementById("client-id").value;
    const name = document.getElementById("client-name").value.trim();
    const category = document.getElementById("client-category").value;
    const startDate = document.getElementById("client-start-date").value;
    const fee = parseFloat(document.getElementById("client-fee").value);
    const email = document.getElementById("client-email").value.trim();
    
    if (id) {
        // Edit existing client
        const client = DB.clients.find(c => c.id === id);
        if (client) {
            client.name = name;
            client.category = category;
            client.email = email;
            
            // If fee has changed, update unpaid payment cycles
            if (client.fee !== fee) {
                client.fee = fee;
                client.payments.forEach(p => {
                    if (p.status === "Unpaid") {
                        // Keep track of new rate
                    }
                });
            }
            logActivity(`Updated client profile details for: ${name}`, "info");
        }
    } else {
        // Create new client
        const newClientId = "cli_" + Date.now();
        
        // Initial setup for Month 1 and Month 2 payment schedules
        const payments = [
            {
                cycleIndex: 1,
                dueDate: startDate,
                status: "Unpaid",
                paidDate: null,
                amountPaid: 0,
                method: ""
            },
            {
                cycleIndex: 2,
                dueDate: addMonths(startDate, 1),
                status: "Unpaid",
                paidDate: null,
                amountPaid: 0,
                method: ""
            }
        ];
        
        DB.clients.push({
            id: newClientId,
            name,
            category,
            startDate,
            fee,
            email,
            payments
        });
        logActivity(`Registered new client: ${name} with starting billing cycle starting ${startDate}`, "success");
    }
    
    saveDatabase();
    clientModal.classList.remove("active");
    renderClients();
});

window.openEditClientModal = function(id) {
    const client = DB.clients.find(c => c.id === id);
    if (!client) return;
    
    document.getElementById("client-id").value = client.id;
    document.getElementById("client-name").value = client.name;
    document.getElementById("client-category").value = client.category;
    document.getElementById("client-start-date").value = client.startDate;
    document.getElementById("client-fee").value = client.fee;
    document.getElementById("client-email").value = client.email;
    
    document.getElementById("client-modal-title").textContent = "Edit Client Details";
    clientModal.classList.add("active");
};

window.deleteClient = function(id) {
    const client = DB.clients.find(c => c.id === id);
    if (!client) return;
    
    if (confirm(`Are you sure you want to completely remove client "${client.name}" and all historical invoice data?`)) {
        DB.clients = DB.clients.filter(c => c.id !== id);
        logActivity(`Deleted client and billing ledger for: ${client.name}`, "danger");
        saveDatabase();
        renderClients();
    }
};

// Client payment recording
const paymentModal = document.getElementById("modal-client-payment");

window.openRecordPaymentModal = function(clientId) {
    const client = DB.clients.find(c => c.id === clientId);
    if (!client) return;
    
    const unpaidCycle = client.payments.find(p => p.status === "Unpaid");
    if (!unpaidCycle) {
        alert("This client has completed all currently generated monthly payments.");
        return;
    }
    
    document.getElementById("payment-client-id").value = clientId;
    document.getElementById("payment-client-name").textContent = client.name;
    document.getElementById("payment-client-rate").textContent = `Rs. ${parseFloat(client.fee).toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    document.getElementById("payment-client-cycle").textContent = `Billing Period Cycle: Month ${unpaidCycle.cycleIndex} (Due: ${unpaidCycle.dueDate})`;
    
    document.getElementById("payment-amount").value = client.fee;
    document.getElementById("payment-date").value = new Date().toISOString().split('T')[0];
    
    paymentModal.classList.add("active");
};

document.getElementById("form-client-payment").addEventListener("submit", function(e) {
    e.preventDefault();
    const clientId = document.getElementById("payment-client-id").value;
    const datePaid = document.getElementById("payment-date").value;
    const amountPaid = parseFloat(document.getElementById("payment-amount").value);
    const method = document.getElementById("payment-method").value;
    
    const client = DB.clients.find(c => c.id === clientId);
    if (!client) return;
    
    const unpaidCycle = client.payments.find(p => p.status === "Unpaid");
    if (unpaidCycle) {
        unpaidCycle.status = "Paid";
        unpaidCycle.paidDate = datePaid;
        unpaidCycle.amountPaid = amountPaid;
        unpaidCycle.method = method;
        
        // Log client invoice payment as ledger activity
        logActivity(`Received payment of Rs. ${amountPaid.toLocaleString()} from ${client.name} for Month ${unpaidCycle.cycleIndex}`, "success");
        
        // Check if Month 2 has been completed. If so, automatically generate next billing month Cycle (Month 3, 4...) 
        // to keep the recurring invoicing list up to date.
        const highestCycleIndex = Math.max(...client.payments.map(p => p.cycleIndex));
        
        // Auto-generate the next billing month to allow endless rolling calculations
        const nextCycleIndex = highestCycleIndex + 1;
        const nextDueDate = addMonths(client.startDate, nextCycleIndex - 1);
        
        client.payments.push({
            cycleIndex: nextCycleIndex,
            dueDate: nextDueDate,
            status: "Unpaid",
            paidDate: null,
            amountPaid: 0,
            method: ""
        });
        
        saveDatabase();
        paymentModal.classList.remove("active");
        renderClients();
    }
});


// --- EXPENSES MODULE LOGIC ---

function renderExpenses(searchQuery = "") {
    const tbody = document.getElementById("expenses-tbody");
    tbody.innerHTML = "";
    
    const query = searchQuery.toLowerCase().trim();
    // Sort expenses chronologically descending
    const sortedExpenses = [...DB.expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const filtered = sortedExpenses.filter(e => 
        e.desc.toLowerCase().includes(query) || 
        e.category.toLowerCase().includes(query) ||
        e.source.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No logged expenses found.</td></tr>`;
        return;
    }

    filtered.forEach(exp => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${exp.date}</td>
            <td><span class="badge ${getExpenseCategoryBadgeClass(exp.category)}">${escapeHtml(exp.category)}</span></td>
            <td>${escapeHtml(exp.desc)}</td>
            <td style="font-weight:600; color: var(--danger);">Rs. ${parseFloat(exp.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
            <td><span style="font-size: 0.8125rem; color: var(--text-secondary);">${escapeHtml(exp.source)}</span></td>
            <td>
                <button class="btn-icon btn-icon-danger" onclick="deleteExpense('${exp.id}')" title="Delete Expense">
                    <i data-lucide="trash-2"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    lucide.createIcons();
}

function getExpenseCategoryBadgeClass(cat) {
    if (cat.includes("Ad Spend")) return "badge-danger";
    if (cat.includes("Software")) return "badge-accent";
    if (cat.includes("Salaries")) return "badge-warning";
    if (cat.includes("Rent")) return "badge-info";
    return "badge-secondary";
}

// Expense search listener
document.getElementById("expense-search").addEventListener("input", function() {
    renderExpenses(this.value);
});

// Modal actions for Expense
const expenseModal = document.getElementById("modal-expense");
document.getElementById("btn-add-expense").addEventListener("click", () => {
    document.getElementById("form-expense").reset();
    document.getElementById("expense-date").value = new Date().toISOString().split('T')[0];
    expenseModal.classList.add("active");
});

document.getElementById("form-expense").addEventListener("submit", function(e) {
    e.preventDefault();
    const desc = document.getElementById("expense-desc").value.trim();
    const category = document.getElementById("expense-category").value;
    const date = document.getElementById("expense-date").value;
    const amount = parseFloat(document.getElementById("expense-amount").value);
    const source = document.getElementById("expense-source").value;
    
    const newExpId = "exp_" + Date.now();
    DB.expenses.push({
        id: newExpId,
        date,
        category,
        desc,
        amount,
        source
    });
    
    logActivity(`Logged agency expense: Rs. ${amount.toLocaleString()} on ${category} (${desc})`, "warning");
    saveDatabase();
    expenseModal.classList.remove("active");
    renderExpenses();
});

window.deleteExpense = function(id) {
    const exp = DB.expenses.find(e => e.id === id);
    if (!exp) return;
    
    if (confirm(`Are you sure you want to remove the expense ledger entry for "${exp.desc}" (Rs. ${exp.amount})?`)) {
        DB.expenses = DB.expenses.filter(e => e.id !== id);
        logActivity(`Deleted expense record: ${exp.desc}`, "info");
        saveDatabase();
        renderExpenses();
    }
};


// --- EMPLOYEE & PAYROLL MODULE LOGIC ---

function renderEmployees(searchQuery = "") {
    const tbody = document.getElementById("employees-tbody");
    tbody.innerHTML = "";
    
    const query = searchQuery.toLowerCase().trim();
    const filtered = DB.employees.filter(emp => 
        emp.name.toLowerCase().includes(query) || 
        emp.role.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No employees registered.</td></tr>`;
        return;
    }

    filtered.forEach(emp => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>
                <div style="font-weight: 600;">${escapeHtml(emp.name)}</div>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(emp.email)}</div>
            </td>
            <td>${escapeHtml(emp.role)}</td>
            <td style="font-weight: 600;">Rs. ${parseFloat(emp.salary).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
            <td><span class="badge badge-success">Active</span></td>
            <td>${emp.lastPaidDate || 'Never'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="openEditEmployeeModal('${emp.id}')" title="Edit Employee">
                        <i data-lucide="edit-3"></i>
                    </button>
                    <button class="btn-icon btn-icon-danger" onclick="deleteEmployee('${emp.id}')" title="Terminate Employee">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    renderPayrollLedger();
    lucide.createIcons();
}

function renderPayrollLedger() {
    const list = document.getElementById("payroll-feed-list");
    list.innerHTML = "";
    
    // Filter expenses that belong to Salaries
    const salaryExpenses = DB.expenses
        .filter(e => e.category === "Salaries & Bonuses")
        .sort((a, b) => new Date(b.date) - new Date(a.date));
        
    if (salaryExpenses.length === 0) {
        list.innerHTML = `<div class="text-center text-muted py-4">No payroll records logged.</div>`;
        return;
    }
    
    salaryExpenses.forEach(pay => {
        const div = document.createElement("div");
        div.className = "activity-item";
        div.innerHTML = `
            <div class="activity-icon-box bg-opacity-success text-success">
                <i data-lucide="banknote"></i>
            </div>
            <div class="activity-content">
                <div class="activity-text">
                    <strong>Payroll Disbursed</strong><br>
                    ${escapeHtml(pay.desc)}: <span class="text-danger">-Rs. ${parseFloat(pay.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                <div class="activity-time">${pay.date}</div>
            </div>
        `;
        list.appendChild(div);
    });
}

// Employee search listener
document.getElementById("employee-search").addEventListener("input", function() {
    renderEmployees(this.value);
});

// Employee modal actions
const employeeModal = document.getElementById("modal-employee");
document.getElementById("btn-add-employee").addEventListener("click", () => {
    document.getElementById("form-employee").reset();
    document.getElementById("employee-id").value = "";
    document.getElementById("employee-modal-title").textContent = "Register Employee";
    employeeModal.classList.add("active");
});

document.getElementById("form-employee").addEventListener("submit", function(e) {
    e.preventDefault();
    const id = document.getElementById("employee-id").value;
    const name = document.getElementById("employee-name").value.trim();
    const role = document.getElementById("employee-role").value.trim();
    const salary = parseFloat(document.getElementById("employee-salary").value);
    const email = document.getElementById("employee-email").value.trim();
    
    if (id) {
        const emp = DB.employees.find(e => e.id === id);
        if (emp) {
            emp.name = name;
            emp.role = role;
            emp.salary = salary;
            emp.email = email;
            logActivity(`Updated staff record for: ${name}`, "info");
        }
    } else {
        const newEmpId = "emp_" + Date.now();
        DB.employees.push({
            id: newEmpId,
            name,
            role,
            salary,
            email,
            lastPaidDate: ""
        });
        logActivity(`Registered new employee staff member: ${name} (${role})`, "success");
    }
    
    saveDatabase();
    employeeModal.classList.remove("active");
    renderEmployees();
});

window.openEditEmployeeModal = function(id) {
    const emp = DB.employees.find(e => e.id === id);
    if (!emp) return;
    
    document.getElementById("employee-id").value = emp.id;
    document.getElementById("employee-name").value = emp.name;
    document.getElementById("employee-role").value = emp.role;
    document.getElementById("employee-salary").value = emp.salary;
    document.getElementById("employee-email").value = emp.email;
    
    document.getElementById("employee-modal-title").textContent = "Edit Employee Details";
    employeeModal.classList.add("active");
};

window.deleteEmployee = function(id) {
    const emp = DB.employees.find(e => e.id === id);
    if (!emp) return;
    
    if (confirm(`Are you sure you want to remove employee "${emp.name}" from active staff roster? (This does not affect historical logs)`)) {
        DB.employees = DB.employees.filter(e => e.id !== id);
        logActivity(`Removed employee: ${emp.name} from payroll directory`, "danger");
        saveDatabase();
        renderEmployees();
    }
};

// Execute payroll modal
const payrollModal = document.getElementById("modal-payroll");
document.getElementById("btn-pay-salaries").addEventListener("click", () => {
    if (DB.employees.length === 0) {
        alert("Please register employees first before running monthly payroll.");
        return;
    }
    
    document.getElementById("payroll-date").value = new Date().toISOString().split('T')[0];
    document.getElementById("payroll-emp-count").textContent = DB.employees.length;
    document.getElementById("payroll-emp-due").textContent = DB.employees.length;
    
    const totalOutflow = DB.employees.reduce((acc, emp) => acc + parseFloat(emp.salary), 0);
    document.getElementById("payroll-total-outflow").textContent = `Rs. ${totalOutflow.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    
    payrollModal.classList.add("active");
});

document.getElementById("form-payroll").addEventListener("submit", function(e) {
    e.preventDefault();
    const date = document.getElementById("payroll-date").value;
    const account = document.getElementById("payroll-account").value;
    
    let totalOutflow = 0;
    
    // Log individual salaries as expense records
    DB.employees.forEach(emp => {
        const newExpId = "exp_sal_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
        DB.expenses.push({
            id: newExpId,
            date,
            category: "Salaries & Bonuses",
            desc: `Staff Payroll: ${emp.name} (${emp.role})`,
            amount: emp.salary,
            source: account
        });
        
        emp.lastPaidDate = date;
        totalOutflow += emp.salary;
    });
    
    logActivity(`Bulk Payroll Executed: Disbursed Rs. ${totalOutflow.toLocaleString()} to ${DB.employees.length} employees`, "success");
    saveDatabase();
    payrollModal.classList.remove("active");
    renderEmployees();
});


// --- ASSETS MODULE LOGIC ---

function renderAssets(searchQuery = "") {
    const tbody = document.getElementById("assets-tbody");
    tbody.innerHTML = "";
    
    const query = searchQuery.toLowerCase().trim();
    const filtered = DB.assets.filter(a => 
        a.name.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No capital assets added.</td></tr>`;
        return;
    }

    filtered.forEach(asset => {
        const { ageMonths, currentValue } = calculateAssetCurrentValue(asset);
        
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="font-weight: 600;">${escapeHtml(asset.name)}</td>
            <td>${asset.purchaseDate}</td>
            <td style="font-weight: 500;">Rs. ${parseFloat(asset.cost).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
            <td>${asset.depreciationRate}% / Yr</td>
            <td>${ageMonths} month${ageMonths !== 1 ? 's' : ''}</td>
            <td style="font-weight: 700; color: var(--info);">Rs. ${currentValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
            <td>
                <button class="btn-icon btn-icon-danger" onclick="deleteAsset('${asset.id}')" title="Delete Asset">
                    <i data-lucide="trash-2"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    lucide.createIcons();
}

const assetModal = document.getElementById("modal-asset");
document.getElementById("btn-add-asset").addEventListener("click", () => {
    document.getElementById("form-asset").reset();
    document.getElementById("asset-purchase-date").value = new Date().toISOString().split('T')[0];
    assetModal.classList.add("active");
});

document.getElementById("form-asset").addEventListener("submit", function(e) {
    e.preventDefault();
    const name = document.getElementById("asset-name").value.trim();
    const cost = parseFloat(document.getElementById("asset-cost").value);
    const depreciationRate = parseFloat(document.getElementById("asset-depreciation").value);
    const purchaseDate = document.getElementById("asset-purchase-date").value;
    
    const newAssetId = "ast_" + Date.now();
    DB.assets.push({
        id: newAssetId,
        name,
        cost,
        depreciationRate,
        purchaseDate
    });
    
    logActivity(`Added new capital asset: ${name} valued at Rs. ${cost.toLocaleString()}`, "info");
    saveDatabase();
    assetModal.classList.remove("active");
    renderAssets();
});

window.deleteAsset = function(id) {
    const asset = DB.assets.find(a => a.id === id);
    if (!asset) return;
    
    if (confirm(`Are you sure you want to remove asset "${asset.name}" from registry?`)) {
        DB.assets = DB.assets.filter(a => a.id !== id);
        logActivity(`Deleted asset record: ${asset.name}`, "info");
        saveDatabase();
        renderAssets();
};


// --- CAPITAL & INVESTMENTS MODULE LOGIC ---

function renderCapital(searchQuery = "") {
    // 1. Calculate stats
    const openingBalance = parseFloat(DB.openingBalance || 0);
    
    // Inward and Outward Investments
    let totalInward = 0;
    let totalOutward = 0;
    DB.investments.forEach(inv => {
        if (inv.type === "inward") {
            totalInward += parseFloat(inv.amount);
        } else if (inv.type === "outward") {
            totalOutward += parseFloat(inv.amount);
        }
    });
    
    const netCapitalBase = openingBalance + totalInward - totalOutward;
    
    // Revenue YTD
    let totalRevenue = 0;
    DB.clients.forEach(c => {
        c.payments.forEach(p => {
            if (p.status === "Paid") {
                totalRevenue += parseFloat(p.amountPaid);
            }
        });
    });
    
    // Expenses YTD
    const totalExpenses = DB.expenses.reduce((acc, e) => acc + parseFloat(e.amount), 0);
    
    const availableCashBalance = netCapitalBase + totalRevenue - totalExpenses;
    
    // 2. Render summary cards
    document.getElementById("cap-opening-val").textContent = `Rs. ${openingBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    document.getElementById("cap-injections-val").textContent = `Rs. ${totalInward.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    document.getElementById("cap-outward-val").textContent = `Rs. ${totalOutward.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    document.getElementById("cap-net-val").textContent = `Rs. ${netCapitalBase.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    
    // Equation breakdown
    document.getElementById("eq-opening").textContent = `Rs. ${openingBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    document.getElementById("eq-revenue").textContent = `+Rs. ${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    document.getElementById("eq-injections").textContent = `+Rs. ${totalInward.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    document.getElementById("eq-expenses").textContent = `-Rs. ${totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    document.getElementById("eq-outward").textContent = `-Rs. ${totalOutward.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    document.getElementById("eq-cash-balance").textContent = `Rs. ${availableCashBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    
    // 3. Render table
    const tbody = document.getElementById("capital-tbody");
    tbody.innerHTML = "";
    
    const query = searchQuery.toLowerCase().trim();
    const sortedInvestments = [...DB.investments].sort((a, b) => new Date(b.date) - new Date(a.date));
    const filtered = sortedInvestments.filter(inv => 
        inv.desc.toLowerCase().includes(query) || 
        inv.source.toLowerCase().includes(query)
    );
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No matching investment transactions logged.</td></tr>`;
        return;
    }
    
    filtered.forEach(inv => {
        const typeBadge = inv.type === "inward" 
            ? `<span class="badge badge-success">Capital Injection</span>`
            : `<span class="badge badge-danger">Corporate Investment</span>`;
            
        const amountColor = inv.type === "inward" ? "var(--success)" : "var(--danger)";
        const amountSign = inv.type === "inward" ? "+" : "-";
        
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${inv.date}</td>
            <td>${typeBadge}</td>
            <td>${escapeHtml(inv.desc)}</td>
            <td style="font-weight:600; color: ${amountColor};">${amountSign}Rs. ${parseFloat(inv.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
            <td><span style="font-size: 0.8125rem; color: var(--text-secondary);">${escapeHtml(inv.source)}</span></td>
            <td>
                <button class="btn-icon btn-icon-danger" onclick="deleteInvestment('${inv.id}')" title="Delete Log">
                    <i data-lucide="trash-2"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    lucide.createIcons();
}

// Search event listener for Capital
document.getElementById("capital-search").addEventListener("input", function() {
    renderCapital(this.value);
});

// Modals triggers
const openingBalanceModal = document.getElementById("modal-opening-balance");
const investmentModal = document.getElementById("modal-investment");

document.getElementById("btn-edit-opening-balance").addEventListener("click", () => {
    document.getElementById("opening-balance-val").value = DB.openingBalance || 0;
    openingBalanceModal.classList.add("active");
});

document.getElementById("btn-add-investment").addEventListener("click", () => {
    document.getElementById("form-investment").reset();
    document.getElementById("investment-date").value = new Date().toISOString().split('T')[0];
    investmentModal.classList.add("active");
});

// Forms submit handlers
document.getElementById("form-opening-balance").addEventListener("submit", function(e) {
    e.preventDefault();
    const newOpening = parseFloat(document.getElementById("opening-balance-val").value);
    DB.openingBalance = newOpening;
    
    logActivity(`Updated Opening Cash Balance to Rs. ${newOpening.toLocaleString()}`, "info");
    saveDatabase();
    openingBalanceModal.classList.remove("active");
    renderCapital();
});

document.getElementById("form-investment").addEventListener("submit", function(e) {
    e.preventDefault();
    const desc = document.getElementById("investment-desc").value.trim();
    const type = document.getElementById("investment-type").value;
    const date = document.getElementById("investment-date").value;
    const amount = parseFloat(document.getElementById("investment-amount").value);
    const source = document.getElementById("investment-source").value;
    
    const newInvId = "inv_" + Date.now();
    DB.investments.push({
        id: newInvId,
        date,
        type,
        desc,
        amount,
        source
    });
    
    const displayType = type === "inward" ? "Capital Contribution" : "Business Investment";
    logActivity(`Logged investment (${displayType}): Rs. ${amount.toLocaleString()} - ${desc}`, type === "inward" ? "success" : "warning");
    
    saveDatabase();
    investmentModal.classList.remove("active");
    renderCapital();
});

window.deleteInvestment = function(id) {
    const inv = DB.investments.find(i => i.id === id);
    if (!inv) return;
    
    const displayType = inv.type === "inward" ? "Capital Injection" : "Business Investment";
    if (confirm(`Are you sure you want to remove the investment log for "${inv.desc}" (Rs. ${inv.amount})?`)) {
        DB.investments = DB.investments.filter(i => i.id !== id);
        logActivity(`Deleted investment log: ${inv.desc} (${displayType})`, "info");
        saveDatabase();
        renderCapital();
    }
};


// --- BACKUP & RESTORE MODULE LOGIC ---

document.getElementById("btn-export-db").addEventListener("click", () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(DB, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute("download", `saro_accounting_backup_${timestamp}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    logActivity("Exported database system backup JSON.", "info");
});

document.getElementById("btn-trigger-upload").addEventListener("click", () => {
    document.getElementById("db-file-input").click();
});

document.getElementById("db-file-input").addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            const parsed = JSON.parse(evt.target.result);
            // Verify schema slightly
            if (parsed.clients && parsed.expenses && parsed.employees) {
                DB = parsed;
                saveDatabase();
                logActivity("Successfully restored accounting database state from JSON backup.", "success");
                alert("Database successfully restored! The system will reload.");
                window.location.reload();
            } else {
                alert("Error: Selected JSON file does not match agency accounting database format.");
            }
        } catch (err) {
            alert("Error parsing backup JSON file. Ensure it is a valid backup file.");
        }
    };
    reader.readAsText(file);
});


// --- DASHBOARD & ANALYTICS INTEGRATION ---

function initDashboard() {
    // 1. Calculate and update date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("header-date").textContent = new Date().toLocaleDateString("en-US", options);
    
    // 2. Compute financial metrics
    // Monthly Recurring Revenue = Sum of fees for all active clients
    const mrr = DB.clients.reduce((acc, c) => acc + parseFloat(c.fee), 0);
    document.getElementById("kpi-mrr").textContent = `Rs. ${mrr.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    
    // Total Revenue = Sum of all Paid invoices
    let totalRevenue = 0;
    DB.clients.forEach(c => {
        c.payments.forEach(p => {
            if (p.status === "Paid") {
                totalRevenue += parseFloat(p.amountPaid);
            }
        });
    });
    document.getElementById("kpi-revenue").textContent = `Rs. ${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    
    // Total Operating Costs = Sum of all logged expenses
    const totalExpenses = DB.expenses.reduce((acc, e) => acc + parseFloat(e.amount), 0);
    document.getElementById("kpi-expenses").textContent = `Rs. ${totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    
    // Net Asset Value = Sum of depreciated values
    let totalAssetsVal = 0;
    DB.assets.forEach(a => {
        const { currentValue } = calculateAssetCurrentValue(a);
        totalAssetsVal += currentValue;
    });
    document.getElementById("kpi-assets").textContent = `Rs. ${totalAssetsVal.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    
    // Available Cash Balance = Opening Balance + Total Revenue + Inward Investments - Total Expenses - Outward Investments
    const openingBalance = parseFloat(DB.openingBalance || 0);
    let totalInward = 0;
    let totalOutward = 0;
    (DB.investments || []).forEach(inv => {
        if (inv.type === "inward") {
            totalInward += parseFloat(inv.amount);
        } else if (inv.type === "outward") {
            totalOutward += parseFloat(inv.amount);
        }
    });
    const cashBalance = openingBalance + totalRevenue + totalInward - totalExpenses - totalOutward;
    document.getElementById("kpi-cash-balance").textContent = `Rs. ${cashBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    
    // 3. Render P&L margins
    const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;
    document.getElementById("pl-revenue-label").textContent = `Rs. ${Math.round(totalRevenue).toLocaleString()}`;
    document.getElementById("pl-expenses-label").textContent = `Rs. ${Math.round(totalExpenses).toLocaleString()}`;
    
    const marginBar = document.getElementById("pl-margin-bar");
    const marginPercentageLabel = document.getElementById("pl-margin-percentage");
    
    if (profitMargin >= 0) {
        marginBar.style.width = `${Math.min(100, profitMargin)}%`;
        marginPercentageLabel.textContent = `${profitMargin.toFixed(1)}% Net Margin (Profit)`;
        marginPercentageLabel.className = "pl-percentage text-success";
    } else {
        marginBar.style.width = `0%`;
        marginPercentageLabel.textContent = `${profitMargin.toFixed(1)}% Deficit Margin (Loss)`;
        marginPercentageLabel.className = "pl-percentage text-danger";
    }
    
    // 4. Render Invoice Alerts
    renderDashboardAlerts();
    
    // 5. Render Recent Activities
    renderRecentActivities();
    
    // 6. Draw Dashboard Charts
    renderCharts(totalRevenue, totalExpenses);
}

function renderDashboardAlerts() {
    const alertsTbody = document.getElementById("dashboard-alerts-tbody");
    alertsTbody.innerHTML = "";
    
    const today = new Date().toISOString().split('T')[0];
    const alerts = [];
    
    DB.clients.forEach(client => {
        // Find unpaid billing records
        client.payments.forEach(pay => {
            if (pay.status === "Unpaid") {
                const days = getDaysBetween(pay.dueDate, today);
                alerts.push({
                    client,
                    pay,
                    days
                });
            }
        });
    });
    
    // Sort alerts: oldest overdue first, then upcoming
    alerts.sort((a, b) => a.days - b.days);
    
    const alertBadge = document.getElementById("alert-count-badge");
    const overdueCount = alerts.filter(a => a.days < 0).length;
    alertBadge.textContent = `${alerts.length} Cycle Alert${alerts.length !== 1 ? 's' : ''}`;
    
    if (overdueCount > 0) {
        alertBadge.className = "badge badge-danger";
    } else if (alerts.length > 0) {
        alertBadge.className = "badge badge-warning";
    } else {
        alertBadge.className = "badge badge-success";
    }
    
    if (alerts.length === 0) {
        alertsTbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4"><i data-lucide="check-circle-2" style="display:inline-block; vertical-align:middle; width: 16px; margin-right:4px;"></i> All billing periods up to date!</td></tr>`;
        lucide.createIcons();
        return;
    }
    
    // Show top 5 warnings
    alerts.slice(0, 5).forEach(alert => {
        const { client, pay, days } = alert;
        let statusBadge = "";
        
        if (days < 0) {
            statusBadge = `<span class="badge badge-danger">Overdue by ${Math.abs(days)} days</span>`;
        } else if (days === 0) {
            statusBadge = `<span class="badge badge-warning">Due Today</span>`;
        } else {
            statusBadge = `<span class="badge badge-info">Due in ${days} days</span>`;
        }
        
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${escapeHtml(client.name)}</strong></td>
            <td>Month ${pay.cycleIndex}</td>
            <td style="font-weight:600;">Rs. ${parseFloat(client.fee).toLocaleString()}</td>
            <td>${pay.dueDate}</td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn btn-success btn-block" style="padding: 4px 10px; font-size: 0.75rem;" onclick="openRecordPaymentModal('${client.id}')">
                    <i data-lucide="credit-card" style="width:12px;height:12px;"></i> Pay
                </button>
            </td>
        `;
        alertsTbody.appendChild(tr);
    });
    
    lucide.createIcons();
}

function renderRecentActivities() {
    const list = document.getElementById("activity-feed-list");
    list.innerHTML = "";
    
    if (DB.activity.length === 0) {
        list.innerHTML = `<div class="text-center text-muted py-4">No recent activity logs.</div>`;
        return;
    }
    
    // Show top 5 logs
    DB.activity.slice(0, 5).forEach(act => {
        let icon = "info";
        let iconBgClass = "bg-opacity-info text-info";
        
        if (act.type === "success") {
            icon = "check-circle";
            iconBgClass = "bg-opacity-success text-success";
        } else if (act.type === "warning") {
            icon = "alert-triangle";
            iconBgClass = "bg-opacity-warning text-warning";
        } else if (act.type === "danger") {
            icon = "x-circle";
            iconBgClass = "bg-opacity-danger text-danger";
        }
        
        const timeFormatted = new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
                              " - " + new Date(act.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
        
        const div = document.createElement("div");
        div.className = "activity-item";
        div.innerHTML = `
            <div class="activity-icon-box ${iconBgClass}">
                <i data-lucide="${icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-text">${escapeHtml(act.text)}</div>
                <div class="activity-time">${timeFormatted}</div>
            </div>
        `;
        list.appendChild(div);
    });
    
    lucide.createIcons();
}

function renderCharts(totalRev, totalExp) {
    const isDark = !document.body.classList.contains("light-theme");
    const gridColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";
    const textColor = isDark ? "#94a3b8" : "#475569";
    
    // Destroy existing charts to reload them cleanly without hover artifacts
    if (plChartInstance) {
        plChartInstance.destroy();
    }
    if (expenseChartInstance) {
        expenseChartInstance.destroy();
    }
    
    // Chart 1: Profit and Loss Comparison (Bar chart)
    const ctxPl = document.getElementById("chart-pl-trend").getContext("2d");
    plChartInstance = new Chart(ctxPl, {
        type: 'bar',
        data: {
            labels: ['Revenue', 'Expenses'],
            datasets: [{
                label: 'Cashflow Volume',
                data: [totalRev, totalExp],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.75)', // green for revenue
                    'rgba(239, 68, 68, 0.75)'  // red for expenses
                ],
                borderColor: [
                    '#10b981',
                    '#ef4444'
                ],
                borderWidth: 1.5,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    titleColor: isDark ? '#f8fafc' : '#0f172a',
                    bodyColor: isDark ? '#f8fafc' : '#0f172a',
                    borderColor: gridColor,
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    grid: { color: gridColor },
                    ticks: {
                        color: textColor,
                        callback: function(value) { return 'Rs. ' + value.toLocaleString(); }
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: textColor }
                }
            }
        }
    });

    // Chart 2: Expenses Breakdown by Category (Doughnut Chart)
    const expenseCategories = {};
    DB.expenses.forEach(e => {
        expenseCategories[e.category] = (expenseCategories[e.category] || 0) + parseFloat(e.amount);
    });
    
    const doughnutLabels = Object.keys(expenseCategories);
    const doughnutData = Object.values(expenseCategories);
    
    const ctxExp = document.getElementById("chart-expenses-breakdown").getContext("2d");
    
    if (doughnutLabels.length === 0) {
        // Draw empty indicator placeholder
        expenseChartInstance = new Chart(ctxExp, {
            type: 'doughnut',
            data: {
                labels: ['No expense data'],
                datasets: [{
                    data: [1],
                    backgroundColor: [isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: textColor } } }
            }
        });
    } else {
        expenseChartInstance = new Chart(ctxExp, {
            type: 'doughnut',
            data: {
                labels: doughnutLabels,
                datasets: [{
                    data: doughnutData,
                    backgroundColor: [
                        '#ef4444', // Red for Ads
                        '#3b82f6', // Blue for SaaS
                        '#f59e0b', // Yellow for Salaries
                        '#06b6d4', // Cyan for Rent
                        '#8b5cf6', // Purple for marketing
                        '#10b981', // Green
                        '#64748b'  // Muted gray
                    ],
                    borderWidth: isDark ? 2 : 1,
                    borderColor: isDark ? '#0f172a' : '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: textColor,
                            boxWidth: 12,
                            padding: 15,
                            font: { size: 11 }
                        }
                    },
                    tooltip: {
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        titleColor: isDark ? '#f8fafc' : '#0f172a',
                        bodyColor: isDark ? '#f8fafc' : '#0f172a',
                        borderColor: gridColor,
                        borderWidth: 1,
                        callbacks: {
                            label: function(context) {
                                return ` ${context.label}: Rs. ${context.raw.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
                            }
                        }
                    }
                }
            }
        });
    }
}


// --- SECURITY INPUT SANITIZER ---
function escapeHtml(unsafe) {
    if (!unsafe) return "";
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}


// --- APP INITIALIZER RUN ---
window.addEventListener("DOMContentLoaded", () => {
    loadDatabase();
    checkAuth();
    lucide.createIcons();
});
