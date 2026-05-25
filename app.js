/* ──────────────────────────────────────────────
   API helper — tüm istekler /api/* üzerinden
────────────────────────────────────────────── */
async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('sp_token');
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

/* ──────────────────────────────────────────────
   Demo Mock Data
────────────────────────────────────────────── */
const DEMO_USER = { id: 'demo-user-1', name: 'Demo Kullanıcı', role: 'sales_rep', email: 'demo@salespulse.app' };

const DEMO_CUSTOMERS = [
  { id: 'c1',  company_name: 'Akçelik Demir Çelik A.Ş.', contact_name: 'Mehmet Akçelik',   phone: '+90 212 555 0101', email: 'info@akcelik.com',          sector: 'İmalat',   status: 'offer_sent',  city: 'İstanbul', last_contacted: new Date(Date.now()-86400000).toISOString() },
  { id: 'c2',  company_name: 'Güneş Plastik Sanayi',     contact_name: 'Ayşe Güneş',       phone: '+90 312 555 0102', email: 'aysegunes@gunesplastik.com', sector: 'Plastik',  status: 'interested',  city: 'Ankara',   last_contacted: new Date(Date.now()-172800000).toISOString() },
  { id: 'c3',  company_name: 'Marmara Tekstil Ltd.',      contact_name: 'Ali Kaya',         phone: '+90 216 555 0103', email: 'ali.kaya@marmaratekstil.com',sector: 'Tekstil',  status: 'new',         city: 'İstanbul', last_contacted: null },
  { id: 'c4',  company_name: 'Ege Kimya Ticaret',         contact_name: 'Zeynep Erdoğan',   phone: '+90 232 555 0104', email: 'zeynep@egekimya.com',        sector: 'Kimya',    status: 'to_call',     city: 'İzmir',    last_contacted: new Date(Date.now()-259200000).toISOString() },
  { id: 'c5',  company_name: 'Karadeniz Ahşap Mobilya',   contact_name: 'Hasan Demir',      phone: '+90 462 555 0105', email: 'hdemir@karadenizahsap.com',  sector: 'Mobilya',  status: 'contacted',   city: 'Trabzon',  last_contacted: new Date(Date.now()-43200000).toISOString() },
  { id: 'c6',  company_name: 'Boğaziçi İnşaat A.Ş.',     contact_name: 'Fatma Yıldız',     phone: '+90 212 555 0106', email: 'fyildiz@bogazici.com',       sector: 'İnşaat',   status: 'sold',        city: 'İstanbul', last_contacted: new Date(Date.now()-21600000).toISOString() },
  { id: 'c7',  company_name: 'Anadolu Gıda San.',          contact_name: 'Mustafa Çelik',   phone: '+90 332 555 0107', email: 'm.celik@anadolugida.com',    sector: 'Gıda',     status: 'negotiating', city: 'Konya',    last_contacted: new Date(Date.now()-14400000).toISOString() },
  { id: 'c8',  company_name: 'İstanbul Ambalaj Kağıt',    contact_name: 'Elif Şahin',       phone: '+90 212 555 0108', email: 'elif@istambalaj.com',        sector: 'Ambalaj',  status: 'lost',        city: 'İstanbul', last_contacted: new Date(Date.now()-432000000).toISOString() },
  { id: 'c9',  company_name: 'Türk Boya Kimya Ltd.',       contact_name: 'Kemal Arslan',    phone: '+90 264 555 0109', email: 'karslan@turkboya.com',       sector: 'Kimya',    status: 'to_call',     city: 'İzmit',    last_contacted: new Date(Date.now()-518400000).toISOString() },
  { id: 'c10', company_name: 'Delta Lojistik Hizm.',       contact_name: 'Selin Kılıç',     phone: '+90 212 555 0110', email: 'skilic@deltalojistik.com',   sector: 'Lojistik', status: 'interested',  city: 'İstanbul', last_contacted: new Date(Date.now()-7200000).toISOString() },
  { id: 'c11', company_name: 'Ufuk Makina İmalat',         contact_name: 'Onur Yılmaz',     phone: '+90 224 555 0111', email: 'oyilmaz@ufukmakina.com',     sector: 'Makina',   status: 'offer_sent',  city: 'Bursa',    last_contacted: new Date(Date.now()-10800000).toISOString() },
  { id: 'c12', company_name: 'Mavi Deniz Tur. Ltd.',       contact_name: 'Cansu Öztürk',    phone: '+90 252 555 0112', email: 'cozturk@mavideniz.com',      sector: 'Turizm',   status: 'new',         city: 'Bodrum',   last_contacted: null },
];

const DEMO_OFFERS = [
  { id: 'o1', customer_id: 'c1',  offer_number: 'TKL-001', product_name: 'ABS Granül',         quantity: 50,  unit_price: 1250, currency: 'USD', total_amount: 62500, status: 'sent',             valid_until: '2025-05-25', follow_up_date: '2025-05-14', company_name: 'Akçelik Demir Çelik A.Ş.' },
  { id: 'o2', customer_id: 'c11', offer_number: 'TKL-002', product_name: 'PP Granül',           quantity: 100, unit_price: 980,  currency: 'USD', total_amount: 98000, status: 'negotiating',      valid_until: '2025-05-20', follow_up_date: '2025-05-15', company_name: 'Ufuk Makina İmalat' },
  { id: 'o3', customer_id: 'c7',  offer_number: 'TKL-003', product_name: 'HDPE Boru Hattı',    quantity: 200, unit_price: 450,  currency: 'EUR', total_amount: 90000, status: 'followup_pending', valid_until: '2025-05-18', follow_up_date: '2025-05-13', company_name: 'Anadolu Gıda San.' },
  { id: 'o4', customer_id: 'c6',  offer_number: 'TKL-004', product_name: 'PVC Profil',          quantity: 500, unit_price: 85,   currency: 'TRY', total_amount: 42500, status: 'accepted',         valid_until: '2025-05-30', follow_up_date: null,         company_name: 'Boğaziçi İnşaat A.Ş.' },
  { id: 'o5', customer_id: 'c2',  offer_number: 'TKL-005', product_name: 'Masterbatch Pigment', quantity: 20,  unit_price: 3200, currency: 'USD', total_amount: 64000, status: 'viewed',           valid_until: '2025-05-22', follow_up_date: '2025-05-14', company_name: 'Güneş Plastik Sanayi' },
  { id: 'o6', customer_id: 'c8',  offer_number: 'TKL-006', product_name: 'PE Film Hammadde',    quantity: 75,  unit_price: 1100, currency: 'USD', total_amount: 82500, status: 'rejected',         valid_until: '2025-05-15', follow_up_date: null,         company_name: 'İstanbul Ambalaj Kağıt' },
];

const DEMO_ACTIVITIES = [
  { id: 'a1', customer_id: 'c1',  activity_type: 'call',            call_result: 'contacted', status: 'completed', note: 'Fiyat teklifi hakkında görüştük.',    completed_at: new Date(Date.now()-3600000).toISOString(),   company_name: 'Akçelik Demir Çelik A.Ş.' },
  { id: 'a2', customer_id: 'c3',  activity_type: 'call',            call_result: 'unreachable',status: 'completed', note: 'Ulaşılamadı.',                       completed_at: new Date(Date.now()-7200000).toISOString(),   company_name: 'Marmara Tekstil Ltd.' },
  { id: 'a3', customer_id: 'c6',  activity_type: 'whatsapp',        status: 'completed',      note: 'Fiyat listesi gönderildi.',                                completed_at: new Date(Date.now()-10800000).toISOString(),  company_name: 'Boğaziçi İnşaat A.Ş.' },
  { id: 'a4', customer_id: 'c5',  activity_type: 'offer_follow_up', status: 'overdue',        scheduled_at: new Date(Date.now()-86400000).toISOString(),  note: 'TKL-003 takibi', company_name: 'Karadeniz Ahşap Mobilya' },
  { id: 'a5', customer_id: 'c2',  activity_type: 'offer_follow_up', status: 'overdue',        scheduled_at: new Date(Date.now()-172800000).toISOString(), note: 'Teklif takibi',  company_name: 'Güneş Plastik Sanayi' },
  { id: 'a6', customer_id: 'c4',  activity_type: 'call',            status: 'pending',        scheduled_at: new Date(Date.now()+3600000).toISOString(),   note: 'Takip araması', company_name: 'Ege Kimya Ticaret' },
  { id: 'a7', customer_id: 'c9',  activity_type: 'whatsapp',        status: 'pending',        scheduled_at: new Date(Date.now()+7200000).toISOString(),   note: 'Fiyat gönder',  company_name: 'Türk Boya Kimya Ltd.' },
];

const DEMO_CAMPAIGNS = [
  { id: 'camp1', name: 'Mayıs Bahar Kampanyası', campaign_type: 'whatsapp', status: 'active', sent_count: 245, opened_count: 178, replied_count: 42, sold_count: 12, target_count: 300 },
  { id: 'camp2', name: 'Yeni Ürün Tanıtım',      campaign_type: 'email',    status: 'draft',  sent_count: 0,   opened_count: 0,   replied_count: 0,  sold_count: 0,  target_count: 150 },
];

/* ──────────────────────────────────────────────
   State
────────────────────────────────────────────── */
let state = {
  isDemoMode: false,
  currentUser: null,
  supabase: null,
  currentPage: 'dashboard',
  customerFilter: '',
  offerFilter: '',
  bulkStep: 1,
  bulkSelected: new Set(),
  bulkMessage: '',
  // Yüklenen veriler (cache)
  customers: [],
  offers: [],
  activities: [],
  // Session
  sessionActive: false,
  sessionSeconds: 0,
  sessionDone: 0,
  sessionIndex: 0,
  sessionCustomers: [],
  sessionInterval: null,
};

/* ──────────────────────────────────────────────
   Status helpers
────────────────────────────────────────────── */
const STATUS_CONFIG = {
  new:             { label: 'Yeni',              bg: '#EFF6FF', color: '#2563EB' },
  to_call:         { label: 'Aranacak',          bg: '#FFF7ED', color: '#EA580C' },
  contacted:       { label: 'Görüşüldü',         bg: '#F0FDF4', color: '#16A34A' },
  interested:      { label: 'İlgili',            bg: '#E0F2FE', color: '#0284C7' },
  offer_sent:      { label: 'Teklif Verildi',    bg: '#FAF5FF', color: '#9333EA' },
  negotiating:     { label: 'Müzakerede',        bg: '#FFFBEB', color: '#D97706' },
  sold:            { label: 'Satış',             bg: '#F0FDF4', color: '#15803D' },
  lost:            { label: 'Kaybedildi',        bg: '#FEF2F2', color: '#DC2626' },
  unreachable:     { label: 'Ulaşılamadı',       bg: '#F1F5F9', color: '#64748B' },
  call_later:      { label: 'Sonra Ara',         bg: '#FFFBEB', color: '#D97706' },
};

const OFFER_STATUS = {
  draft:            { label: 'Taslak',           bg: '#F1F5F9', color: '#64748B' },
  sent:             { label: 'Gönderildi',       bg: '#EFF6FF', color: '#2563EB' },
  viewed:           { label: 'Görüntülendi',     bg: '#EEF2FF', color: '#4F46E5' },
  followup_pending: { label: 'Takip Bekliyor',   bg: '#FFF7ED', color: '#EA580C' },
  negotiating:      { label: 'Müzakerede',       bg: '#FFFBEB', color: '#D97706' },
  accepted:         { label: 'Kabul Edildi',     bg: '#F0FDF4', color: '#15803D' },
  rejected:         { label: 'Reddedildi',       bg: '#FEF2F2', color: '#DC2626' },
};

const MSG_TEMPLATES = {
  price:   'Sayın {isim} Hanım/Bey,\n\nGüncel fiyat listemizi paylaşmak istedik. {firma} için özel olarak hazırladığımız teklifimizi en kısa sürede iletebiliriz.\n\nBaşarılar dileriz.',
  followup:'Sayın {isim} Hanım/Bey,\n\nDaha önce gönderdiğimiz teklifle ilgili görüş almak istedik. {firma} için hazırladığımız teklifi inceleme fırsatı buldunuz mu?\n\nİyi günler dileriz.',
  promo:   'Sayın {isim} Hanım/Bey,\n\nSınırlı süreli kampanyamızdan yararlanmak için son fırsat! {firma} için özel koşullarımızı görüşmek ister misiniz?\n\nSaygılarımızla.',
};

function statusPill(status, map) {
  const cfg = map[status] || { label: status, bg: '#F1F5F9', color: '#64748B' };
  return `<span class="status-pill" style="background:${cfg.bg};color:${cfg.color}">${cfg.label}</span>`;
}

function currencySymbol(c) { return c === 'USD' ? '$' : c === 'EUR' ? '€' : '₺'; }

function timeAgo(dateStr) {
  if (!dateStr) return '-';
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)    return 'Az önce';
  if (diff < 3600)  return `${Math.floor(diff/60)} dk önce`;
  if (diff < 86400) return `${Math.floor(diff/3600)} sa önce`;
  return `${Math.floor(diff/86400)} gün önce`;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Günaydın,';
  if (h < 17) return 'İyi öğleden sonralar,';
  if (h < 21) return 'İyi akşamlar,';
  return 'İyi geceler,';
}

function activityLabel(type) {
  const map = { call: 'Telefon Araması', whatsapp: 'WhatsApp Mesajı', email: 'E-posta', offer_follow_up: 'Teklif Takibi' };
  return map[type] || type;
}

function roleLabel(role) {
  const map = { sales_rep: 'Satış Temsilcisi', sales_manager: 'Satış Müdürü', super_admin: 'Süper Admin' };
  return map[role] || role;
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

/* ──────────────────────────────────────────────
   Init
────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Daha önce giriş yapılmışsa oturumu devam ettir
  const savedToken = localStorage.getItem('sp_token');
  const savedUser  = localStorage.getItem('sp_user');
  if (savedToken && savedUser) {
    try {
      state.currentUser = JSON.parse(savedUser);
      state.isDemoMode  = false;
      enterApp();
      return;
    } catch { localStorage.clear(); }
  }

  // Set today's date in hero
  const now = new Date();
  const dateEl = document.getElementById('hero-date');
  if (dateEl) {
    dateEl.innerHTML = now.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  // Login form
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await handleLogin(
      document.getElementById('login-email').value,
      document.getElementById('login-password').value
    );
  });

  // Demo button
  document.getElementById('demo-btn').addEventListener('click', enterDemoMode);

  // Logout
  document.getElementById('logout-btn').addEventListener('click', handleLogout);

  // Sidebar nav
  document.querySelectorAll('.sb-item').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(el.dataset.page);
      // Close sidebar on mobile
      document.getElementById('sidebar').classList.remove('open');
    });
  });

  // Topbar refresh
  document.getElementById('topbar-refresh').addEventListener('click', () => {
    if (state.currentPage === 'dashboard') renderDashboard();
    else if (state.currentPage === 'customers') renderCustomers();
    else if (state.currentPage === 'offers') renderOffers();
    else if (state.currentPage === 'calls') renderCalls();
  });

  // Mobile menu toggle
  document.getElementById('menu-toggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  // Customer filters
  document.getElementById('customer-filters').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    document.querySelectorAll('#customer-filters .chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    state.customerFilter = chip.dataset.status;
    renderCustomers();
  });

  // Customer search
  document.getElementById('customer-search').addEventListener('input', (e) => {
    renderCustomers(e.target.value);
  });

  // Offer filters
  document.getElementById('offer-filters').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    document.querySelectorAll('#offer-filters .chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    state.offerFilter = chip.dataset.status;
    renderOffers();
  });

  // Drawer close
  document.getElementById('drawer-close').addEventListener('click', closeDrawer);
  document.getElementById('drawer-backdrop').addEventListener('click', closeDrawer);

  // Session card
  document.getElementById('session-start-btn').addEventListener('click', toggleSession);
  document.getElementById('session-skip-btn').addEventListener('click', sessionSkip);

  // Bulk message modal
  document.getElementById('bulk-msg-btn').addEventListener('click', openBulkModal);
  document.getElementById('bulk-modal-close').addEventListener('click', closeBulkModal);
  document.getElementById('bulk-modal-backdrop').addEventListener('click', closeBulkModal);
  document.getElementById('bulk-next').addEventListener('click', bulkNext);
  document.getElementById('bulk-back').addEventListener('click', bulkBack);

  // Bulk select all
  document.getElementById('bulk-select-all').addEventListener('change', (e) => {
    const customers = state.isDemoMode ? DEMO_CUSTOMERS : state.customers;
    customers.forEach(c => {
      if (e.target.checked) state.bulkSelected.add(c.id);
      else state.bulkSelected.delete(c.id);
    });
    renderBulkCustomerList();
    updateBulkCount();
  });

  // Bulk status filter
  document.getElementById('bulk-status-filter').addEventListener('change', () => {
    renderBulkCustomerList();
  });

  // Template buttons
  document.querySelector('.template-btns').addEventListener('click', (e) => {
    const btn = e.target.closest('.tpl-btn');
    if (!btn) return;
    document.getElementById('bulk-message').value = MSG_TEMPLATES[btn.dataset.tpl] || '';
    updateBulkPreview();
  });

  // Variable buttons
  document.querySelector('.var-hints').addEventListener('click', (e) => {
    const btn = e.target.closest('.var-btn');
    if (!btn) return;
    const ta = document.getElementById('bulk-message');
    const pos = ta.selectionStart;
    const before = ta.value.substring(0, pos);
    const after  = ta.value.substring(pos);
    ta.value = before + btn.dataset.var + after;
    ta.focus();
    ta.selectionStart = ta.selectionEnd = pos + btn.dataset.var.length;
    updateBulkPreview();
  });

  // Message textarea live preview
  document.getElementById('bulk-message').addEventListener('input', updateBulkPreview);
});

/* ──────────────────────────────────────────────
   Auth
────────────────────────────────────────────── */
async function handleLogin(email, password) {
  const btn     = document.getElementById('login-btn');
  const btnText = document.getElementById('login-btn-text');
  const spinner = document.getElementById('login-spinner');
  const errEl   = document.getElementById('login-error');

  btnText.textContent = 'Giriş yapılıyor…';
  spinner.classList.remove('hidden');
  btn.disabled = true;
  errEl.classList.add('hidden');

  try {
    const data = await apiFetch('/api/auth', { method: 'POST', body: { email, password } });
    localStorage.setItem('sp_token', data.token);
    localStorage.setItem('sp_user', JSON.stringify(data.user));
    state.currentUser = data.user;
    state.isDemoMode  = false;
    enterApp();
  } catch (err) {
    errEl.textContent = err.message;
    errEl.classList.remove('hidden');
  } finally {
    btnText.textContent = 'Giriş Yap';
    spinner.classList.add('hidden');
    btn.disabled = false;
  }
}

function enterDemoMode() {
  state.isDemoMode = true;
  state.currentUser = DEMO_USER;
  enterApp();
}

function handleLogout() {
  localStorage.removeItem('sp_token');
  localStorage.removeItem('sp_user');
  state.currentUser = null;
  state.isDemoMode  = false;
  document.getElementById('app-screen').classList.remove('active');
  document.getElementById('app-screen').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('login-screen').classList.add('active');
}

function enterApp() {
  const u = state.currentUser;
  const initial = u.name[0].toUpperCase();

  document.getElementById('sb-user-name').textContent  = u.name;
  document.getElementById('sb-user-role').textContent  = roleLabel(u.role);
  document.getElementById('sb-avatar').textContent     = initial;
  document.getElementById('topbar-avatar').textContent = initial;
  document.getElementById('greeting-name').textContent = u.name;

  document.getElementById('login-screen').classList.remove('active');
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.remove('hidden');
  document.getElementById('app-screen').classList.add('active');

  navigateTo('dashboard');
}

/* ──────────────────────────────────────────────
   Navigation
────────────────────────────────────────────── */
const PAGE_TITLES = {
  dashboard: 'Dashboard',
  calls:     'Günlük Aramalar',
  customers: 'Müşteriler',
  offers:    'Teklifler',
  campaigns: 'Kampanyalar',
};

function navigateTo(page) {
  state.currentPage = page;

  document.querySelectorAll('.sb-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });

  document.querySelectorAll('.page').forEach(el => {
    const isActive = el.id === `page-${page}`;
    el.classList.toggle('active', isActive);
    el.classList.toggle('hidden', !isActive);
  });

  document.getElementById('topbar-title').textContent = PAGE_TITLES[page] || page;

  if (page === 'dashboard') renderDashboard();
  else if (page === 'customers') renderCustomers();
  else if (page === 'offers')    renderOffers();
  else if (page === 'calls')     renderCalls();
  else if (page === 'campaigns') renderCampaigns();
}

/* ──────────────────────────────────────────────
   Dashboard
────────────────────────────────────────────── */
async function renderDashboard() {
  document.getElementById('greeting-text').textContent = greeting();

  const activities = state.isDemoMode ? DEMO_ACTIVITIES : await fetchActivities();
  const offers     = state.isDemoMode ? DEMO_OFFERS     : await fetchOffers();
  const customers  = state.isDemoMode ? DEMO_CUSTOMERS  : await fetchCustomers();

  // State'e cache'le — session kartı ve diğer yerler buradan okur
  state.customers   = customers;
  state.offers      = offers;
  state.activities  = activities;

  const completed = activities.filter(a => a.status === 'completed');
  const calls     = completed.filter(a => a.activity_type === 'call').length;
  const wa        = completed.filter(a => a.activity_type === 'whatsapp').length;
  const email     = completed.filter(a => a.activity_type === 'email').length;

  const dueOffers = offers.filter(o => ['sent','viewed','followup_pending','negotiating'].includes(o.status));
  const overdue   = activities.filter(a => a.status === 'overdue');
  const pending   = activities.filter(a => a.status === 'pending');
  const callList  = customers.filter(c => ['new','to_call','unreachable','call_later'].includes(c.status));

  const DAILY_GOAL = 20;

  // KPI values
  document.getElementById('kpi-calls').textContent  = calls;
  document.getElementById('kpi-wa').textContent     = wa;
  document.getElementById('kpi-email').textContent  = email;
  document.getElementById('kpi-offers').textContent = dueOffers.length;

  // KPI bars
  setBar('kpi-calls',  calls,             DAILY_GOAL,  '#3B82F6');
  setBar('kpi-wa',     wa,                10,           '#22C55E');
  setBar('kpi-email',  email,             10,           '#F97316');
  setBar('kpi-offers', dueOffers.length,  10,           '#A855F7');

  // Pill counts
  document.getElementById('d-offers-count').textContent  = dueOffers.length;
  document.getElementById('d-overdue-count').textContent = overdue.length;
  document.getElementById('d-pending-count').textContent = pending.length;

  // Feed lists
  renderFeed('d-offers-list',  dueOffers, renderOfferFeedItem,   'Takip edilecek teklif yok');
  renderFeed('d-overdue-list', overdue,   renderActivityFeedItem,'Geciken görev yok');
  renderFeed('d-pending-list', pending,   renderActivityFeedItem,'Bekleyen takip yok');
  renderFeed('d-calls-list',   callList.slice(0,5), renderCallFeedItem, 'Aranacak müşteri yok');
}

function setBar(kpiId, val, max, color) {
  const card = document.getElementById(kpiId).closest('.kpi-card');
  const fill = card.querySelector('.kpi-bar-fill');
  if (fill) {
    fill.style.width  = Math.min(100, Math.round((val / Math.max(max,1)) * 100)) + '%';
    fill.style.background = color;
  }
}

function renderFeed(containerId, items, itemFn, emptyMsg) {
  const el = document.getElementById(containerId);
  if (!items.length) {
    el.innerHTML = `<div class="empty-feed">${emptyMsg}</div>`;
    return;
  }
  el.innerHTML = items.slice(0,5).map(itemFn).join('');
}

function renderOfferFeedItem(o) {
  const cfg = OFFER_STATUS[o.status] || { bg:'#F1F5F9', color:'#64748B', label: o.status };
  return `
    <div class="feed-item">
      <div class="feed-dot" style="background:#FAF5FF">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9333EA" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      </div>
      <div class="feed-info">
        <div class="feed-name">${o.company_name || '–'}</div>
        <div class="feed-sub">${o.offer_number} · ${currencySymbol(o.currency)}${o.total_amount.toLocaleString()}</div>
      </div>
      <span class="status-pill" style="background:${cfg.bg};color:${cfg.color}">${cfg.label}</span>
    </div>`;
}

function renderActivityFeedItem(a) {
  const isOverdue = a.status === 'overdue';
  const dotBg = isOverdue ? '#FEF2F2' : '#EFF6FF';
  const dotColor = isOverdue ? '#DC2626' : '#2563EB';
  return `
    <div class="feed-item">
      <div class="feed-dot" style="background:${dotBg}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${dotColor}" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      </div>
      <div class="feed-info">
        <div class="feed-name">${a.company_name || '–'}</div>
        <div class="feed-sub">${activityLabel(a.activity_type)}</div>
      </div>
      ${a.scheduled_at ? `<span class="feed-meta">${timeAgo(a.scheduled_at)}</span>` : ''}
    </div>`;
}

function renderCallFeedItem(c) {
  const cfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.new;
  return `
    <div class="feed-item" onclick="showCustomerDrawer('${c.id}')">
      <div class="feed-dot" style="background:#F0FDF4">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.06 1.18 2 2 0 012.03 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
      </div>
      <div class="feed-info">
        <div class="feed-name">${c.company_name}</div>
        <div class="feed-sub">${c.contact_name} · ${c.phone || ''}</div>
      </div>
      <span class="status-pill" style="background:${cfg.bg};color:${cfg.color}">${cfg.label}</span>
    </div>`;
}

/* ──────────────────────────────────────────────
   Customers
────────────────────────────────────────────── */
async function renderCustomers(search = document.getElementById('customer-search').value) {
  const all = state.isDemoMode ? DEMO_CUSTOMERS : await fetchCustomers();
  state.customers = all; // cache'le
  let items = all;
  if (state.customerFilter) items = items.filter(c => c.status === state.customerFilter);
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(c =>
      c.company_name.toLowerCase().includes(q) ||
      c.contact_name.toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').includes(q)
    );
  }

  document.getElementById('customers-count-text').textContent = `${items.length} müşteri`;

  const tbody = document.getElementById('customers-tbody');
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="table-empty">Müşteri bulunamadı</td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(c => {
    const cfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.new;
    const initials = c.company_name.substring(0,2).toUpperCase();
    return `
      <tr onclick="showCustomerDrawer('${c.id}')">
        <td>
          <div class="company-cell">
            <div class="company-initials" style="background:${cfg.bg};color:${cfg.color}">${initials}</div>
            <div>
              <div class="company-main">${c.company_name}</div>
            </div>
          </div>
        </td>
        <td>${c.contact_name}</td>
        <td>${c.phone || '-'}</td>
        <td>${c.sector || '-'}</td>
        <td>${c.city || '-'}</td>
        <td>${statusPill(c.status, STATUS_CONFIG)}</td>
        <td style="color:var(--text-secondary);font-size:12px">${timeAgo(c.last_contacted)}</td>
        <td>
          <button class="table-action-btn" onclick="event.stopPropagation();showCustomerDrawer('${c.id}')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Detay
          </button>
        </td>
      </tr>`;
  }).join('');
}

/* ──────────────────────────────────────────────
   Offers
────────────────────────────────────────────── */
async function renderOffers() {
  const all   = state.isDemoMode ? DEMO_OFFERS : await fetchOffers();
  const items = state.offerFilter ? all.filter(o => o.status === state.offerFilter) : all;

  document.getElementById('offers-count-text').textContent = `${items.length} teklif`;

  const tbody = document.getElementById('offers-tbody');
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="table-empty">Teklif bulunamadı</td></tr>`;
    return;
  }

  tbody.innerHTML = items.map(o => `
    <tr>
      <td><span style="font-weight:600;color:var(--accent)">${o.offer_number}</span></td>
      <td>
        <div class="company-cell">
          <div class="company-initials" style="background:#FAF5FF;color:#9333EA">${(o.company_name||'?').substring(0,2).toUpperCase()}</div>
          <span class="company-main">${o.company_name || '–'}</span>
        </div>
      </td>
      <td>${o.product_name}</td>
      <td>${o.quantity}</td>
      <td style="font-weight:700">${currencySymbol(o.currency)}${o.total_amount.toLocaleString()}</td>
      <td style="font-size:12px;color:var(--text-secondary)">${formatDate(o.valid_until)}</td>
      <td style="font-size:12px;color:${o.follow_up_date ? 'var(--orange)':'var(--text-secondary)'}">${formatDate(o.follow_up_date)}</td>
      <td>${statusPill(o.status, OFFER_STATUS)}</td>
    </tr>`).join('');
}

/* ──────────────────────────────────────────────
   Calls
────────────────────────────────────────────── */
async function renderCalls() {
  const customers = state.isDemoMode ? DEMO_CUSTOMERS : await fetchCustomers();
  const callList  = customers.filter(c => ['new','to_call','unreachable','call_later'].includes(c.status));
  const done      = (state.isDemoMode ? DEMO_ACTIVITIES : []).filter(a => a.activity_type === 'call' && a.status === 'completed').length;
  const total     = callList.length + done;
  const pct       = total > 0 ? Math.round((done / total) * 100) : 0;

  document.getElementById('calls-done').textContent  = done;
  document.getElementById('calls-total').textContent = total;
  document.getElementById('pb-pct').textContent      = pct + '%';
  document.getElementById('pb-fill').style.width     = pct + '%';

  // SVG ring (r=32, circumference ~201)
  const circumference = 2 * Math.PI * 32;
  const offset = circumference - (pct / 100) * circumference;
  document.getElementById('pb-ring').style.strokeDashoffset = offset;

  const tbody = document.getElementById('calls-tbody');
  if (!callList.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="table-empty">Aranacak müşteri yok 🎉</td></tr>`;
    return;
  }

  tbody.innerHTML = callList.map((c, i) => {
    const cfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.new;
    const initials = c.company_name.substring(0,2).toUpperCase();
    return `
      <tr onclick="showCustomerDrawer('${c.id}')">
        <td style="color:var(--text-tertiary);font-weight:600">${i+1}</td>
        <td>
          <div class="company-cell">
            <div class="company-initials" style="background:${cfg.bg};color:${cfg.color}">${initials}</div>
            <div class="company-main">${c.company_name}</div>
          </div>
        </td>
        <td>${c.contact_name}</td>
        <td>${c.phone || '-'}</td>
        <td>${statusPill(c.status, STATUS_CONFIG)}</td>
        <td style="font-size:12px;color:var(--text-secondary)">${timeAgo(c.last_contacted)}</td>
        <td>
          <button class="table-action-btn" onclick="event.stopPropagation();logCall('${c.id}')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.06 1.18 2 2 0 012.03 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91A16 16 0 0016.09 17.91l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
            Ara
          </button>
        </td>
      </tr>`;
  }).join('');
}

function logCall(customerId) {
  const c = DEMO_CUSTOMERS.find(x => x.id === customerId);
  if (c) {
    if (confirm(`${c.company_name} için aramayı kaydet?`)) {
      alert(`✓ ${c.company_name} araması kaydedildi.`);
    }
  }
}

/* ──────────────────────────────────────────────
   Campaigns
────────────────────────────────────────────── */
async function renderCampaigns() {
  const campaigns = state.isDemoMode ? DEMO_CAMPAIGNS : await fetchCampaigns();
  const container = document.getElementById('campaigns-container');

  if (!campaigns.length) {
    container.innerHTML = '<div style="text-align:center;padding:48px;color:var(--text-tertiary)">Henüz kampanya yok</div>';
    return;
  }

  container.innerHTML = `<div class="campaigns-grid">${campaigns.map(camp => {
    const statusCfg = camp.status === 'active'
      ? { bg: '#F0FDF4', color: '#15803D', label: 'Aktif' }
      : { bg: '#F1F5F9', color: '#64748B', label: 'Taslak' };
    const openRate  = camp.sent_count ? Math.round(camp.opened_count  / camp.sent_count * 100) : 0;
    const replyRate = camp.sent_count ? Math.round(camp.replied_count / camp.sent_count * 100) : 0;

    return `
      <div class="campaign-card">
        <div class="campaign-header">
          <div>
            <div class="campaign-name">${camp.name}</div>
            <div class="campaign-type">${camp.campaign_type === 'whatsapp' ? '💬 WhatsApp' : '📧 E-posta'} Kampanyası</div>
          </div>
          <span class="status-pill" style="background:${statusCfg.bg};color:${statusCfg.color}">${statusCfg.label}</span>
        </div>
        <div class="campaign-stats">
          <div>
            <div class="campaign-stat-value" style="color:var(--accent)">${camp.sent_count}</div>
            <div class="campaign-stat-label">Gönderildi</div>
          </div>
          <div>
            <div class="campaign-stat-value" style="color:var(--purple)">${openRate}%</div>
            <div class="campaign-stat-label">Açılma</div>
          </div>
          <div>
            <div class="campaign-stat-value" style="color:var(--orange)">${replyRate}%</div>
            <div class="campaign-stat-label">Yanıt</div>
          </div>
          <div>
            <div class="campaign-stat-value" style="color:var(--green)">${camp.sold_count}</div>
            <div class="campaign-stat-label">Satış</div>
          </div>
        </div>
      </div>`;
  }).join('')}</div>`;
}

/* ──────────────────────────────────────────────
   Customer Detail Drawer
────────────────────────────────────────────── */
function showCustomerDrawer(id) {
  const c = DEMO_CUSTOMERS.find(x => x.id === id);
  if (!c) return;

  const cfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.new;
  const initials = c.company_name.substring(0,2).toUpperCase();

  document.getElementById('drawer-avatar').textContent = initials;
  document.getElementById('drawer-avatar').style.background = cfg.bg;
  document.getElementById('drawer-avatar').style.color = cfg.color;
  document.getElementById('drawer-company').textContent = c.company_name;
  document.getElementById('drawer-contact').textContent = c.contact_name;

  // Related offers
  const custOffers = DEMO_OFFERS.filter(o => o.customer_id === id);
  const offersHtml = custOffers.length
    ? custOffers.map(o => `
        <div class="drawer-row">
          <span class="drawer-row-label">${o.offer_number}</span>
          <div style="display:flex;align-items:center;gap:8px">
            <span>${currencySymbol(o.currency)}${o.total_amount.toLocaleString()}</span>
            ${statusPill(o.status, OFFER_STATUS)}
          </div>
        </div>`).join('')
    : '<div style="color:var(--text-tertiary);font-size:13px;padding:4px 0">Teklif yok</div>';

  document.getElementById('drawer-body').innerHTML = `
    <div class="drawer-section">
      <div class="drawer-section-title">İletişim</div>
      <div class="drawer-row"><span class="drawer-row-label">Telefon</span><span class="drawer-row-value">${c.phone||'-'}</span></div>
      <div class="drawer-row"><span class="drawer-row-label">E-posta</span><span class="drawer-row-value" style="font-size:12px">${c.email||'-'}</span></div>
      <div class="drawer-row"><span class="drawer-row-label">WhatsApp</span><span class="drawer-row-value">${c.phone||'-'}</span></div>
    </div>
    <div class="drawer-section">
      <div class="drawer-section-title">Bilgiler</div>
      <div class="drawer-row"><span class="drawer-row-label">Durum</span><span>${statusPill(c.status, STATUS_CONFIG)}</span></div>
      <div class="drawer-row"><span class="drawer-row-label">Sektör</span><span class="drawer-row-value">${c.sector||'-'}</span></div>
      <div class="drawer-row"><span class="drawer-row-label">Şehir</span><span class="drawer-row-value">${c.city||'-'}</span></div>
      <div class="drawer-row"><span class="drawer-row-label">Son Görüşme</span><span class="drawer-row-value">${timeAgo(c.last_contacted)}</span></div>
    </div>
    <div class="drawer-section">
      <div class="drawer-section-title">Teklifler (${custOffers.length})</div>
      ${offersHtml}
    </div>
    <div class="drawer-section" style="display:flex;gap:8px;flex-wrap:wrap">
      ${c.phone ? `<a href="tel:${c.phone.replace(/\s/g,'')}" class="btn-primary" style="font-size:12px;padding:7px 14px">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.06 1.18 2 2 0 012.03 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
        Ara
      </a>` : ''}
      ${c.email ? `<a href="mailto:${c.email}" class="btn-ghost" style="font-size:12px;padding:7px 14px">E-posta</a>` : ''}
    </div>`;

  document.getElementById('drawer-backdrop').classList.remove('hidden');
  document.getElementById('customer-drawer').classList.remove('hidden');
}

function closeDrawer() {
  document.getElementById('drawer-backdrop').classList.add('hidden');
  document.getElementById('customer-drawer').classList.add('hidden');
}

/* ──────────────────────────────────────────────
   Bulk Message Modal
────────────────────────────────────────────── */
function openBulkModal() {
  state.bulkStep = 1;
  state.bulkSelected = new Set();
  state.bulkMessage  = '';
  document.getElementById('bulk-message').value = '';
  document.getElementById('bulk-preview').textContent = 'Mesaj giriniz…';
  document.getElementById('bulk-select-all').checked = false;

  renderBulkCustomerList();
  updateBulkCount();
  setBulkStep(1);

  document.getElementById('bulk-modal-backdrop').classList.remove('hidden');
  document.getElementById('bulk-modal').classList.remove('hidden');
}

function closeBulkModal() {
  document.getElementById('bulk-modal-backdrop').classList.add('hidden');
  document.getElementById('bulk-modal').classList.add('hidden');
}

function setBulkStep(step) {
  state.bulkStep = step;

  // Update step dots
  [1,2,3].forEach(n => {
    const el = document.getElementById(`step-${n}-dot`);
    el.className = 'step' + (n === step ? ' active' : n < step ? ' done' : '');
  });

  // Show/hide step panels
  document.getElementById('bulk-step-1').classList.toggle('hidden', step !== 1);
  document.getElementById('bulk-step-2').classList.toggle('hidden', step !== 2);
  document.getElementById('bulk-step-3').classList.toggle('hidden', step !== 3);

  // Footer buttons
  const backBtn = document.getElementById('bulk-back');
  const nextBtn = document.getElementById('bulk-next');
  backBtn.classList.toggle('hidden', step === 1);
  nextBtn.textContent = step === 3 ? 'Gönder' : 'Devam Et →';

  if (step === 3) {
    document.getElementById('bulk-confirm').classList.remove('hidden');
    document.getElementById('bulk-sending').classList.add('hidden');
    document.getElementById('bulk-done').classList.add('hidden');
    document.getElementById('confirm-count').textContent = state.bulkSelected.size;
    document.getElementById('confirm-msg-preview').textContent = state.bulkMessage || '(Mesaj girilmedi)';
    nextBtn.disabled = state.bulkSelected.size === 0 || !state.bulkMessage.trim();
  } else {
    nextBtn.disabled = false;
  }
}

function bulkNext() {
  if (state.bulkStep === 1) {
    if (state.bulkSelected.size === 0) { alert('Lütfen en az bir müşteri seçin.'); return; }
    setBulkStep(2);
  } else if (state.bulkStep === 2) {
    state.bulkMessage = document.getElementById('bulk-message').value;
    if (!state.bulkMessage.trim()) { alert('Lütfen bir mesaj girin.'); return; }
    setBulkStep(3);
  } else if (state.bulkStep === 3) {
    startBulkSend();
  }
}

function bulkBack() {
  if (state.bulkStep > 1) setBulkStep(state.bulkStep - 1);
}

async function startBulkSend() {
  const total = state.bulkSelected.size;
  document.getElementById('bulk-confirm').classList.add('hidden');
  document.getElementById('bulk-sending').classList.remove('hidden');
  document.getElementById('bulk-done').classList.add('hidden');
  document.getElementById('bulk-total-n').textContent = total;
  document.getElementById('bulk-sent-n').textContent  = 0;
  document.getElementById('bulk-progress').style.width = '0%';
  document.getElementById('bulk-next').disabled = true;
  document.getElementById('bulk-back').disabled = true;

  let sent = 0;
  for (const id of state.bulkSelected) {
    await delay(80);
    sent++;
    document.getElementById('bulk-sent-n').textContent = sent;
    document.getElementById('bulk-progress').style.width = Math.round((sent/total)*100) + '%';
  }

  document.getElementById('bulk-sending').classList.add('hidden');
  document.getElementById('bulk-done').classList.remove('hidden');
  document.getElementById('done-sent').textContent   = sent;
  document.getElementById('done-failed').textContent = 0;
  document.getElementById('bulk-next').textContent   = 'Kapat';
  document.getElementById('bulk-next').disabled      = false;
  document.getElementById('bulk-next').onclick = closeBulkModal;
}

function renderBulkCustomerList() {
  const statusFilter = document.getElementById('bulk-status-filter').value;
  const customers = (state.isDemoMode ? DEMO_CUSTOMERS : state.customers)
    .filter(c => !statusFilter || c.status === statusFilter);

  const list = document.getElementById('bulk-customer-list');
  list.innerHTML = customers.map(c => `
    <label class="bulk-customer-row ${state.bulkSelected.has(c.id) ? 'selected' : ''}">
      <input type="checkbox" ${state.bulkSelected.has(c.id) ? 'checked' : ''}
        onchange="toggleBulkCustomer('${c.id}', this.checked)"/>
      <span class="bulk-row-name">${c.company_name}</span>
      <span class="bulk-row-phone">${c.phone || ''}</span>
    </label>`).join('');
}

function toggleBulkCustomer(id, checked) {
  if (checked) state.bulkSelected.add(id);
  else state.bulkSelected.delete(id);
  // Update row style
  renderBulkCustomerList();
  updateBulkCount();
}

function updateBulkCount() {
  document.getElementById('bulk-selected-count').textContent = state.bulkSelected.size;
}

function updateBulkPreview() {
  const msg = document.getElementById('bulk-message').value;
  const firstId = [...state.bulkSelected][0];
  const first   = DEMO_CUSTOMERS.find(c => c.id === firstId) || DEMO_CUSTOMERS[0];
  if (first && msg) {
    document.getElementById('bulk-preview').textContent = substituteVars(msg, first);
  } else {
    document.getElementById('bulk-preview').textContent = msg || 'Mesaj giriniz…';
  }
}

function substituteVars(template, customer) {
  return template
    .replace(/\{isim\}/g,  customer.contact_name.split(' ')[0])
    .replace(/\{firma\}/g, customer.company_name);
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ──────────────────────────────────────────────
   Call Session (countdown per customer)
────────────────────────────────────────────── */
function toggleSession() {
  if (state.sessionActive) stopSession();
  else startSession();
}

function getSessionDuration() {
  return parseInt(document.getElementById('session-duration').value, 10) || 300;
}

function startSession() {
  // Demo modda DEMO_CUSTOMERS, gerçek modda state.customers cache'ini kullan
  const all = state.isDemoMode ? DEMO_CUSTOMERS : state.customers;
  state.sessionCustomers = all.filter(c =>
    ['new','to_call','unreachable','call_later','contacted', 'new'].includes(c.status)
  );
  // Hiç müşteri yoksa hepsini al (yeni import edilmiş olabilir)
  if (state.sessionCustomers.length === 0) state.sessionCustomers = [...all];
  state.sessionActive   = true;
  state.sessionSeconds  = getSessionDuration(); // countdown from chosen duration
  state.sessionDone     = 0;
  state.sessionIndex    = 0;

  document.getElementById('session-total-count').textContent = state.sessionCustomers.length;
  document.getElementById('session-done-count').textContent  = 0;
  document.getElementById('session-duration').disabled       = true;

  const btn = document.getElementById('session-start-btn');
  btn.classList.add('running');
  btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Durdur`;

  document.getElementById('session-badge').classList.add('active');
  document.getElementById('session-badge-text').textContent = 'Aktif';

  updateSessionCustomer();
  updateTimerDisplay();

  state.sessionInterval = setInterval(sessionTick, 1000);
}

function sessionTick() {
  if (!state.sessionActive) return;

  if (state.sessionSeconds > 0) {
    state.sessionSeconds--;
    updateTimerDisplay();
  } else {
    // Countdown expired — warn + auto-advance
    onSessionCountdownExpired();
  }
}

function onSessionCountdownExpired() {
  clearInterval(state.sessionInterval);
  state.sessionInterval = null;

  // Visual warning
  document.getElementById('session-expired-toast').classList.add('visible');
  document.getElementById('session-badge-text').textContent = 'Süre Doldu!';

  // Audio alert (3 beeps)
  playAlertBeeps();

  // Auto-advance after 2.5s
  setTimeout(() => {
    if (!state.sessionActive) return;
    document.getElementById('session-expired-toast').classList.remove('visible');
    state.sessionDone++;
    state.sessionIndex++;
    state.sessionSeconds = getSessionDuration();
    document.getElementById('session-done-count').textContent = state.sessionDone;
    document.getElementById('session-badge-text').textContent = 'Aktif';
    updateSessionCustomer();
    updateTimerDisplay();
    // Restart ticker
    state.sessionInterval = setInterval(sessionTick, 1000);
  }, 2500);
}

function stopSession() {
  clearInterval(state.sessionInterval);
  state.sessionInterval = null;
  state.sessionActive   = false;

  document.getElementById('session-duration').disabled = false;
  document.getElementById('session-expired-toast').classList.remove('visible');

  const btn = document.getElementById('session-start-btn');
  btn.classList.remove('running');
  btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Başlat`;

  document.getElementById('session-badge').classList.remove('active');
  document.getElementById('session-badge-text').textContent = 'Hazır';
  document.getElementById('session-customer').classList.remove('visible');

  // Reset timer display to chosen duration
  state.sessionSeconds = getSessionDuration();
  updateTimerDisplay();
}

function sessionSkip() {
  if (!state.sessionActive) return;
  clearInterval(state.sessionInterval);
  document.getElementById('session-expired-toast').classList.remove('visible');

  state.sessionDone++;
  state.sessionIndex++;
  state.sessionSeconds = getSessionDuration();
  document.getElementById('session-done-count').textContent = state.sessionDone;
  document.getElementById('session-badge-text').textContent = 'Aktif';

  updateSessionCustomer();
  updateTimerDisplay();
  state.sessionInterval = setInterval(sessionTick, 1000);
}

function updateTimerDisplay() {
  const remaining = state.sessionSeconds;
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const timerEl = document.getElementById('session-timer');
  timerEl.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;

  // Color coding
  timerEl.className = 'session-timer';
  if (remaining <= 30)  timerEl.classList.add('urgent');
  else if (remaining <= 60) timerEl.classList.add('warning');
}

function updateSessionCustomer() {
  const customers = state.sessionCustomers;
  if (!customers.length) {
    document.getElementById('session-customer').classList.remove('visible');
    return;
  }
  const c = customers[state.sessionIndex % customers.length];
  document.getElementById('session-customer-avatar').textContent = c.company_name.substring(0,1).toUpperCase();
  document.getElementById('session-customer-name').textContent   = c.company_name;
  document.getElementById('session-customer-phone').textContent  = c.contact_name + (c.phone ? ' · ' + c.phone : '');
  document.getElementById('session-customer').classList.add('visible');
}

function playAlertBeeps() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.18, 0.36].forEach(delay => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.14);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.15);
    });
  } catch(e) { /* AudioContext not available */ }
}

/* ──────────────────────────────────────────────
   Data Fetchers  (demo → mock data, gerçek → /api)
────────────────────────────────────────────── */
async function fetchCustomers() {
  if (state.isDemoMode) return DEMO_CUSTOMERS;
  try { return await apiFetch('/api/customers'); }
  catch { return []; }
}

async function fetchOffers() {
  if (state.isDemoMode) return DEMO_OFFERS;
  try { return await apiFetch('/api/offers'); }
  catch { return []; }
}

async function fetchActivities() {
  if (state.isDemoMode) return DEMO_ACTIVITIES;
  try { return await apiFetch('/api/activities'); }
  catch { return []; }
}

async function fetchCampaigns() {
  if (state.isDemoMode) return DEMO_CAMPAIGNS;
  try { return await apiFetch('/api/campaigns'); }
  catch { return []; }
}
