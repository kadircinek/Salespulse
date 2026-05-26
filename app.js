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
  { id: 'c1',  company_name: 'Akçelik Demir Çelik A.Ş.', contact_name: 'Mehmet Akçelik',   phone: '+90 212 555 0101', email: 'info@akcelik.com',          sector: 'İmalat',   status: 'offer_sent',  city: 'İstanbul', last_contacted: new Date(Date.now()-86400000).toISOString(),   created_at: new Date(Date.now()-7*86400000).toISOString() },
  { id: 'c2',  company_name: 'Güneş Plastik Sanayi',     contact_name: 'Ayşe Güneş',       phone: '+90 312 555 0102', email: 'aysegunes@gunesplastik.com', sector: 'Plastik',  status: 'interested',  city: 'Ankara',   last_contacted: new Date(Date.now()-172800000).toISOString(),  created_at: new Date(Date.now()-5*86400000).toISOString() },
  { id: 'c3',  company_name: 'Marmara Tekstil Ltd.',      contact_name: 'Ali Kaya',         phone: '+90 216 555 0103', email: 'ali.kaya@marmaratekstil.com',sector: 'Tekstil',  status: 'new',         city: 'İstanbul', last_contacted: null,                                          created_at: new Date(Date.now()-2*86400000).toISOString() },
  { id: 'c4',  company_name: 'Ege Kimya Ticaret',         contact_name: 'Zeynep Erdoğan',   phone: '+90 232 555 0104', email: 'zeynep@egekimya.com',        sector: 'Kimya',    status: 'to_call',     city: 'İzmir',    last_contacted: new Date(Date.now()-259200000).toISOString(),  created_at: new Date(Date.now()-3*86400000).toISOString() },
  { id: 'c5',  company_name: 'Karadeniz Ahşap Mobilya',   contact_name: 'Hasan Demir',      phone: '+90 462 555 0105', email: 'hdemir@karadenizahsap.com',  sector: 'Mobilya',  status: 'contacted',   city: 'Trabzon',  last_contacted: new Date(Date.now()-43200000).toISOString(),   created_at: new Date(Date.now()-10*86400000).toISOString() },
  { id: 'c6',  company_name: 'Boğaziçi İnşaat A.Ş.',     contact_name: 'Fatma Yıldız',     phone: '+90 212 555 0106', email: 'fyildiz@bogazici.com',       sector: 'İnşaat',   status: 'sold',        city: 'İstanbul', last_contacted: new Date(Date.now()-21600000).toISOString(),   created_at: new Date(Date.now()-14*86400000).toISOString() },
  { id: 'c7',  company_name: 'Anadolu Gıda San.',          contact_name: 'Mustafa Çelik',   phone: '+90 332 555 0107', email: 'm.celik@anadolugida.com',    sector: 'Gıda',     status: 'negotiating', city: 'Konya',    last_contacted: new Date(Date.now()-14400000).toISOString(),   created_at: new Date(Date.now()-1*86400000).toISOString() },
  { id: 'c8',  company_name: 'İstanbul Ambalaj Kağıt',    contact_name: 'Elif Şahin',       phone: '+90 212 555 0108', email: 'elif@istambalaj.com',        sector: 'Ambalaj',  status: 'lost',        city: 'İstanbul', last_contacted: new Date(Date.now()-432000000).toISOString(),  created_at: new Date(Date.now()-20*86400000).toISOString() },
  { id: 'c9',  company_name: 'Türk Boya Kimya Ltd.',       contact_name: 'Kemal Arslan',    phone: '+90 264 555 0109', email: 'karslan@turkboya.com',       sector: 'Kimya',    status: 'to_call',     city: 'İzmit',    last_contacted: new Date(Date.now()-518400000).toISOString(),  created_at: new Date(Date.now()-4*86400000).toISOString() },
  { id: 'c10', company_name: 'Delta Lojistik Hizm.',       contact_name: 'Selin Kılıç',     phone: '+90 212 555 0110', email: 'skilic@deltalojistik.com',   sector: 'Lojistik', status: 'interested',  city: 'İstanbul', last_contacted: new Date(Date.now()-7200000).toISOString(),    created_at: new Date(Date.now()-6*86400000).toISOString() },
  { id: 'c11', company_name: 'Ufuk Makina İmalat',         contact_name: 'Onur Yılmaz',     phone: '+90 224 555 0111', email: 'oyilmaz@ufukmakina.com',     sector: 'Makina',   status: 'offer_sent',  city: 'Bursa',    last_contacted: new Date(Date.now()-10800000).toISOString(),   created_at: new Date(Date.now()-8*86400000).toISOString() },
  { id: 'c12', company_name: 'Mavi Deniz Tur. Ltd.',       contact_name: 'Cansu Öztürk',    phone: '+90 252 555 0112', email: 'cozturk@mavideniz.com',      sector: 'Turizm',   status: 'new',         city: 'Bodrum',   last_contacted: null,                                          created_at: new Date(Date.now()-3600000).toISOString() },
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
  customerSectorFilter: '',
  customerCityFilter: '',
  offerFilter: '',
  bulkStep: 1,
  bulkSelected: new Set(),
  bulkMessage: '',
  // Yüklenen veriler (cache)
  customers: [],
  offers: [],
  activities: [],
  users: [],
  stats: null,
  // Session
  sessionActive: false,
  sessionSeconds: 0,
  sessionDone: 0,
  sessionIndex: 0,
  sessionCustomers: [],
  sessionInterval: null,
  sessionResult: null,
  sessionFollowUpDate: null,
  // Bildirim
  newCustomersBannerShown: false,
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

function formatWhatsApp(phone) {
  if (!phone) return '';
  let p = phone.replace(/\s|\-|\(|\)/g, '');
  if (p.startsWith('+')) p = p.slice(1);
  if (p.startsWith('0')) p = '90' + p.slice(1);
  if (!p.startsWith('90') && p.length === 10) p = '90' + p;
  return p;
}

function addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function motivationMessage(done, target) {
  const pct = target > 0 ? Math.round((done/target)*100) : 0;
  if (done === 0)        return { emoji: '🎯', msg: `Haydi başla! Hedef: ${target} arama` };
  if (pct < 25)         return { emoji: '💪', msg: `İyi başlangıç! ${target - done} arama kaldı` };
  if (pct < 50)         return { emoji: '🔥', msg: `Harika gidiyor! Devam et` };
  if (pct < 75)         return { emoji: '⚡', msg: `Yarısını geçtin, ${target - done} tane daha!` };
  if (pct < 100)        return { emoji: '🚀', msg: `Neredeyse bitti! Sadece ${target - done} kaldı` };
  return                       { emoji: '🏆', msg: `Günlük hedefe ulaştın! Muhteşem!` };
}

/* ──────────────────────────────────────────────
   Init
────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

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

  // Sektör / Şehir filtre dropdown'ları
  document.getElementById('customer-sector-filter').addEventListener('change', (e) => {
    state.customerSectorFilter = e.target.value;
    renderCustomers();
  });
  document.getElementById('customer-city-filter').addEventListener('change', (e) => {
    state.customerCityFilter = e.target.value;
    renderCustomers();
  });
  document.getElementById('customer-filter-reset').addEventListener('click', () => {
    state.customerSectorFilter = '';
    state.customerCityFilter   = '';
    document.getElementById('customer-sector-filter').value = '';
    document.getElementById('customer-city-filter').value   = '';
    renderCustomers();
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
  document.getElementById('session-save-btn').addEventListener('click', sessionSaveAndNext);

  // Sonuç butonları (result-btn)
  document.getElementById('session-result-btns').addEventListener('click', (e) => {
    const btn = e.target.closest('.result-btn');
    if (!btn) return;
    document.querySelectorAll('.result-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    state.sessionResult = btn.dataset.result;
    document.getElementById('session-save-btn').disabled = false;

    // Feature 2: Takip tarihi picker'ı göster/gizle
    const picker = document.getElementById('followup-picker');
    if (state.sessionResult === 'takip_gerekiyor') {
      picker.classList.remove('hidden');
      // Default: 3 gün seç
      state.sessionFollowUpDate = addDays(3);
      document.getElementById('followup-custom-date').value = state.sessionFollowUpDate;
      document.querySelectorAll('.fu-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.days === '3');
      });
    } else {
      picker.classList.add('hidden');
      state.sessionFollowUpDate = null;
    }
  });

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

  // ── Yeni müşteri banner (Feature 1) ──
  document.getElementById('ncb-close').addEventListener('click', () => {
    document.getElementById('new-customers-banner').classList.add('hidden');
  });
  document.getElementById('ncb-action').addEventListener('click', () => {
    document.getElementById('new-customers-banner').classList.add('hidden');
    navigateTo('calls');
  });

  // ── Takip tarihi (Feature 2) ──
  document.getElementById('followup-picker').addEventListener('click', (e) => {
    const btn = e.target.closest('.fu-btn');
    if (!btn) return;
    document.querySelectorAll('.fu-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.sessionFollowUpDate = addDays(parseInt(btn.dataset.days));
    document.getElementById('followup-custom-date').value = state.sessionFollowUpDate;
  });
  document.getElementById('followup-custom-date').addEventListener('change', (e) => {
    if (e.target.value) {
      document.querySelectorAll('.fu-btn').forEach(b => b.classList.remove('active'));
      state.sessionFollowUpDate = e.target.value;
    }
  });

  // ── Müşteri ekle / düzenle modal ──
  document.getElementById('add-customer-btn').addEventListener('click', () => openCustomerModal('add'));
  document.getElementById('customer-modal-close').addEventListener('click', closeCustomerModal);
  document.getElementById('customer-modal-cancel').addEventListener('click', closeCustomerModal);
  document.getElementById('customer-modal-backdrop').addEventListener('click', closeCustomerModal);
  document.getElementById('customer-modal-submit').addEventListener('click', submitCustomerModal);
  document.getElementById('drawer-edit-btn').addEventListener('click', () => {
    const id = document.getElementById('drawer-edit-btn').dataset.customerId;
    if (id) { closeDrawer(); openCustomerModal('edit', id); }
  });

  // ── Excel import modal ──
  document.getElementById('excel-import-btn').addEventListener('click', openExcelImport);
  document.getElementById('excel-import-close').addEventListener('click', closeExcelImport);
  document.getElementById('excel-import-cancel').addEventListener('click', closeExcelImport);
  document.getElementById('excel-import-backdrop').addEventListener('click', closeExcelImport);
  document.getElementById('xi-browse-btn').addEventListener('click', () => document.getElementById('xi-file-input').click());
  document.getElementById('xi-file-input').addEventListener('change', e => { if (e.target.files[0]) handleExcelFile(e.target.files[0]); });
  document.getElementById('xi-back-btn').addEventListener('click', xiResetToUpload);
  document.getElementById('xi-import-btn').addEventListener('click', submitExcelImport);
  document.getElementById('xi-done-btn').addEventListener('click', closeExcelImport);
  document.getElementById('xi-download-template').addEventListener('click', downloadExcelTemplate);
  document.getElementById('xi-sheet-parse-btn').addEventListener('click', () => {
    const sel = document.getElementById('xi-sheet-select');
    const sheetName = _xiWorkbook?.SheetNames[parseInt(sel.value)];
    if (sheetName) xiParseSheet(sheetName);
  });

  // Drag & Drop
  const dz = document.getElementById('xi-dropzone');
  dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag-over'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));
  dz.addEventListener('drop', e => {
    e.preventDefault();
    dz.classList.remove('drag-over');
    const f = e.dataTransfer.files[0];
    if (f) handleExcelFile(f);
  });

  // ── Quick add modal (Feature 7) ──
  document.getElementById('quick-add-btn').addEventListener('click', openQuickAdd);
  document.getElementById('quick-add-close').addEventListener('click', closeQuickAdd);
  document.getElementById('quick-add-cancel').addEventListener('click', closeQuickAdd);
  document.getElementById('quick-add-backdrop').addEventListener('click', closeQuickAdd);
  document.getElementById('quick-add-submit').addEventListener('click', submitQuickAdd);
  document.getElementById('qa-add-another').addEventListener('click', resetQuickAdd);

  // ── Oturum devam kontrolü (tüm listener'lar kurulduktan SONRA) ──
  const savedToken = localStorage.getItem('sp_token');
  const savedUser  = localStorage.getItem('sp_user');
  if (savedToken && savedUser) {
    try {
      state.currentUser = JSON.parse(savedUser);
      state.isDemoMode  = false;
      enterApp();
    } catch { localStorage.clear(); }
  }
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

  // Kullanıcıları yükle (temsilci atama için)
  if (!state.isDemoMode) {
    fetchUsers().then(users => { state.users = users; });
  }

  navigateTo('dashboard');
}

/* ──────────────────────────────────────────────
   Navigation
────────────────────────────────────────────── */
const PAGE_TITLES = {
  dashboard:   'Dashboard',
  calls:       'Günlük Aramalar',
  customers:   'Müşteriler',
  offers:      'Teklifler',
  performance: 'Performans',
  campaigns:   'Kampanyalar',
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

  if (page === 'dashboard')    renderDashboard();
  else if (page === 'customers')   renderCustomers();
  else if (page === 'offers')      renderOffers();
  else if (page === 'calls')       renderCalls();
  else if (page === 'performance') renderPerformance();
  else if (page === 'campaigns')   renderCampaigns();
}

/* ──────────────────────────────────────────────
   Dashboard
────────────────────────────────────────────── */
async function renderDashboard() {
  document.getElementById('greeting-text').textContent = greeting();

  const activities = state.isDemoMode ? DEMO_ACTIVITIES : await fetchActivities();
  const offers     = state.isDemoMode ? DEMO_OFFERS     : await fetchOffers();
  const customers  = state.isDemoMode ? DEMO_CUSTOMERS  : await fetchCustomers();

  // State'e cache'le
  state.customers  = customers;
  state.offers     = offers;
  state.activities = activities;

  // Feature 1: Yeni müşteri bildirimi
  if (!state.isDemoMode) checkNewCustomers(customers);

  const completed = activities.filter(a => a.status === 'completed');
  // Gerçek modda bugünkü aktiviteler API'den gelir
  const todayActs = state.isDemoMode
    ? completed
    : activities.filter(a => {
        const d = new Date(a.created_at);
        const today = new Date();
        return d.toDateString() === today.toDateString();
      });

  const calls = todayActs.filter(a => a.result !== undefined).length || completed.filter(a => a.activity_type === 'call').length;
  const wa    = completed.filter(a => a.activity_type === 'whatsapp').length;
  const email = completed.filter(a => a.activity_type === 'email').length;

  const dueOffers = offers.filter(o => ['sent','viewed','followup_pending','negotiating'].includes(o.status));
  const overdue   = activities.filter(a => a.status === 'overdue');
  const pending   = activities.filter(a => a.status === 'pending');
  const callList  = customers.filter(c => ['new','to_call','unreachable','call_later'].includes(c.status));

  // Feature 8: Günlük hedef
  const DAILY_GOAL = state.currentUser?.daily_target || 20;
  const todayCallCount = state.isDemoMode ? calls : activities.length;

  // KPI values
  document.getElementById('kpi-calls').textContent  = state.isDemoMode ? calls : todayCallCount;
  document.getElementById('kpi-wa').textContent     = wa;
  document.getElementById('kpi-email').textContent  = email;
  document.getElementById('kpi-offers').textContent = dueOffers.length;

  // Update KPI sub label with target progress
  const callsCard = document.getElementById('kpi-calls').closest('.kpi-card');
  const subEl = callsCard.querySelector('.kpi-sub');
  if (subEl) subEl.textContent = `Hedef: ${DAILY_GOAL}`;

  // KPI bars
  setBar('kpi-calls',  state.isDemoMode ? calls : todayCallCount, DAILY_GOAL,  '#3B82F6');
  setBar('kpi-wa',     wa,                10,           '#22C55E');
  setBar('kpi-email',  email,             10,           '#F97316');
  setBar('kpi-offers', dueOffers.length,  10,           '#A855F7');

  // Pill counts
  document.getElementById('d-offers-count').textContent  = dueOffers.length;
  document.getElementById('d-overdue-count').textContent = overdue.length;
  document.getElementById('d-pending-count').textContent = pending.length;

  // Feature 3: Takip tarihi geçmiş müşteriler için badge
  const overdueFollowups = customers.filter(c => {
    if (!c.follow_up_date) return false;
    return new Date(c.follow_up_date) <= new Date();
  });
  if (overdueFollowups.length > 0) {
    const badge = document.getElementById('sb-badge-calls');
    if (badge) { badge.textContent = overdueFollowups.length; badge.style.display = 'flex'; }
  }

  // Feed lists
  renderFeed('d-offers-list',  dueOffers, renderOfferFeedItem,   'Takip edilecek teklif yok');
  renderFeed('d-overdue-list', overdue,   renderActivityFeedItem,'Geciken görev yok');
  renderFeed('d-pending-list', pending,   renderActivityFeedItem,'Bekleyen takip yok');
  renderFeed('d-calls-list',   callList.slice(0,5), renderCallFeedItem, 'Aranacak müşteri yok');
}

// Feature 1: Yeni müşteri bildirimi
function checkNewCustomers(customers) {
  if (state.newCustomersBannerShown) return;
  const lastSeen  = parseInt(localStorage.getItem('sp_last_customer_check') || '0');
  const now       = Date.now();
  const cutoff    = new Date(lastSeen || now - 24 * 3600 * 1000);
  const newOnes   = customers.filter(c => c.created_at && new Date(c.created_at) > cutoff);

  if (newOnes.length > 0 && lastSeen > 0) {
    document.getElementById('ncb-text').textContent =
      `🆕 ${newOnes.length} yeni müşteri eklendi! Hemen arayabilirsiniz.`;
    document.getElementById('new-customers-banner').classList.remove('hidden');
    state.newCustomersBannerShown = true;

    // Sidebar badge
    const badge = document.getElementById('sb-badge-customers');
    if (badge) { badge.textContent = newOnes.length; badge.style.display = 'flex'; }
  }
  localStorage.setItem('sp_last_customer_check', now.toString());
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
  // Demo modda: state.customers zaten set edilmişse (ör. Excel import) onu kullan,
  // aksi hâlde DEMO_CUSTOMERS'dan al
  const all = state.isDemoMode
    ? (state.customers.length ? state.customers : DEMO_CUSTOMERS)
    : await fetchCustomers();
  state.customers = all; // cache'le
  let items = all;
  if (state.customerFilter)       items = items.filter(c => c.status === state.customerFilter);
  if (state.customerSectorFilter) items = items.filter(c => (c.sector||'') === state.customerSectorFilter);
  if (state.customerCityFilter)   items = items.filter(c => (c.city||'')   === state.customerCityFilter);
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(c =>
      (c.company_name||'').toLowerCase().includes(q) ||
      (c.contact_name||'').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').includes(q) ||
      (c.sector||'').toLowerCase().includes(q) ||
      (c.city||'').toLowerCase().includes(q)
    );
  }

  // Sektör ve Şehir dropdown'larını doldur (tüm müşterilerden benzersiz değerler)
  xiPopulateFilterDropdown('customer-sector-filter', all, 'sector', state.customerSectorFilter);
  xiPopulateFilterDropdown('customer-city-filter',   all, 'city',   state.customerCityFilter);

  // Aktif filtre badge'i
  const activeFilters = [state.customerSectorFilter, state.customerCityFilter].filter(Boolean).length;
  const resetBtn = document.getElementById('customer-filter-reset');
  if (resetBtn) resetBtn.style.display = activeFilters ? 'inline-flex' : 'none';

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
        <td>${c.created_at ? `<div class="added-date">${formatDate(c.created_at)}</div><div class="added-ago">${timeAgo(c.created_at)}</div>` : '<span style="color:var(--text-tertiary)">–</span>'}</td>
        <td class="table-actions-cell">
          <button class="table-action-btn" onclick="event.stopPropagation();showCustomerDrawer('${c.id}')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Detay
          </button>
          <button class="table-action-btn table-edit-btn" onclick="event.stopPropagation();openCustomerModal('edit','${c.id}')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Düzenle
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
   Customer Detail Drawer (Feature 4, 6, 9)
────────────────────────────────────────────── */
async function showCustomerDrawer(id) {
  const all = state.isDemoMode ? DEMO_CUSTOMERS : state.customers;
  const c   = all.find(x => x.id === id);
  if (!c) return;

  const cfg      = STATUS_CONFIG[c.status] || STATUS_CONFIG.new;
  const initials = c.company_name.substring(0,2).toUpperCase();

  document.getElementById('drawer-avatar').textContent       = initials;
  document.getElementById('drawer-avatar').style.background  = cfg.bg;
  document.getElementById('drawer-avatar').style.color       = cfg.color;
  document.getElementById('drawer-company').textContent      = c.company_name;
  document.getElementById('drawer-contact').textContent      = c.contact_name || '-';
  // Düzenle butonuna customer ID bağla
  document.getElementById('drawer-edit-btn').dataset.customerId = id;

  // Show drawer immediately with loading state
  document.getElementById('drawer-body').innerHTML = '<div style="padding:24px;text-align:center;color:var(--text-tertiary)">Yükleniyor…</div>';
  document.getElementById('drawer-backdrop').classList.remove('hidden');
  document.getElementById('customer-drawer').classList.remove('hidden');

  // Fetch activities (Feature 6: Zaman çizelgesi)
  let custActivities = [];
  if (!state.isDemoMode && c.id) {
    try { custActivities = await apiFetch(`/api/activities?customer_id=${c.id}`); }
    catch { custActivities = []; }
  } else {
    custActivities = DEMO_ACTIVITIES.filter(a => a.customer_id === id);
  }

  // Related offers
  const custOffers = state.isDemoMode
    ? DEMO_OFFERS.filter(o => o.customer_id === id)
    : state.offers.filter(o => o.customer_id === id);

  const offersHtml = custOffers.length
    ? custOffers.map(o => `
        <div class="drawer-row">
          <span class="drawer-row-label">${o.offer_number}</span>
          <div style="display:flex;align-items:center;gap:8px">
            <span>${currencySymbol(o.currency)}${Number(o.total_amount).toLocaleString()}</span>
            ${statusPill(o.status, OFFER_STATUS)}
          </div>
        </div>`).join('')
    : '<div style="color:var(--text-tertiary);font-size:13px;padding:4px 0">Teklif yok</div>';

  // Feature 6: Aktivite zaman çizelgesi
  const timelineHtml = custActivities.length
    ? `<div class="timeline">${custActivities.map(a => {
        const resultLabels = {
          'görüşüldü':'✅ Görüşüldü','mail_atıldı':'📧 Mail Atıldı',
          'ulaşılamadı':'📵 Ulaşılamadı','ziyaret_planlandı':'📅 Ziyaret Planlandı',
          'takip_gerekiyor':'🔄 Takip Gerekiyor'
        };
        const resultLabel = resultLabels[a.result] || a.result || '–';
        const who = a.created_by_name ? `· ${a.created_by_name}` : '';
        return `
          <div class="tl-item">
            <div class="tl-dot"></div>
            <div class="tl-content">
              <div class="tl-result">${resultLabel}</div>
              ${a.note ? `<div class="tl-note">${a.note}</div>` : ''}
              <div class="tl-meta">${formatDate(a.created_at)} ${who}</div>
            </div>
          </div>`;
      }).join('')}</div>`
    : '<div style="color:var(--text-tertiary);font-size:13px;padding:4px 0">Henüz görüşme kaydı yok</div>';

  // Feature 4: Temsilci atama dropdown
  const usersOptions = state.users.map(u =>
    `<option value="${u.id}" ${c.assigned_user_id === u.id ? 'selected' : ''}>${u.name}</option>`
  ).join('');
  const assignHtml = state.isDemoMode ? '' : `
    <div class="drawer-section">
      <div class="drawer-section-title">Temsilci Atama</div>
      <div class="drawer-row">
        <span class="drawer-row-label">Atanan</span>
        <select class="drawer-select" id="drawer-assign-select" onchange="assignCustomer('${c.id}', this.value)">
          <option value="">— Atanmamış —</option>
          ${usersOptions}
        </select>
      </div>
      ${c.follow_up_date ? `<div class="drawer-row"><span class="drawer-row-label">Takip Tarihi</span><span class="drawer-row-value followup-badge">📅 ${formatDate(c.follow_up_date)}</span></div>` : ''}
    </div>`;

  // Feature 9: WhatsApp / Ara / Mail butonları
  const waNum = c.phone ? formatWhatsApp(c.phone) : '';
  const contactBtns = `
    <div class="drawer-section" style="display:flex;gap:8px;flex-wrap:wrap">
      ${c.phone ? `
        <a href="tel:${c.phone.replace(/\s/g,'')}" class="btn-primary" style="font-size:12px;padding:7px 14px">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.06 1.18 2 2 0 012.03 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006.29 6.29l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          Ara
        </a>
        <a href="https://wa.me/${waNum}" target="_blank" class="btn-wa" style="font-size:12px;padding:7px 14px">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.998 0C5.373 0 0 5.373 0 12c0 2.126.554 4.122 1.523 5.858L.054 23.276a.5.5 0 00.611.639l5.565-1.456A11.945 11.945 0 0011.998 24C18.625 24 24 18.627 24 12S18.625 0 11.998 0zm0 21.818a9.823 9.823 0 01-5.001-1.368l-.358-.213-3.708.972.988-3.613-.233-.372A9.816 9.816 0 012.181 12c0-5.418 4.399-9.818 9.817-9.818 5.418 0 9.818 4.4 9.818 9.818 0 5.419-4.4 9.818-9.818 9.818z"/></svg>
          WhatsApp
        </a>` : ''}
      ${c.email ? `<a href="mailto:${c.email}" class="btn-ghost" style="font-size:12px;padding:7px 14px">📧 Mail</a>` : ''}
    </div>`;

  document.getElementById('drawer-body').innerHTML = `
    ${contactBtns}
    ${assignHtml}
    <div class="drawer-section">
      <div class="drawer-section-title">Bilgiler</div>
      <div class="drawer-row"><span class="drawer-row-label">Durum</span><span>${statusPill(c.status, STATUS_CONFIG)}</span></div>
      <div class="drawer-row"><span class="drawer-row-label">Sektör</span><span class="drawer-row-value">${c.sector||'-'}</span></div>
      <div class="drawer-row"><span class="drawer-row-label">Şehir</span><span class="drawer-row-value">${c.city||'-'}</span></div>
      <div class="drawer-row"><span class="drawer-row-label">Son Görüşme</span><span class="drawer-row-value">${timeAgo(c.last_contacted)}</span></div>
      ${c.website ? `<div class="drawer-row"><span class="drawer-row-label">Web</span><a href="${c.website}" target="_blank" class="drawer-row-value" style="color:var(--accent);font-size:12px">${c.website}</a></div>` : ''}
    </div>
    <div class="drawer-section">
      <div class="drawer-section-title">Teklifler (${custOffers.length})</div>
      ${offersHtml}
    </div>
    <div class="drawer-section">
      <div class="drawer-section-title">Görüşme Geçmişi (${custActivities.length})</div>
      ${timelineHtml}
    </div>`;
}

// Feature 4: Temsilci atama
async function assignCustomer(customerId, userId) {
  try {
    await apiFetch(`/api/customers?id=${customerId}`, {
      method: 'PUT',
      body: { assigned_user_id: userId || null },
    });
    const idx = state.customers.findIndex(c => c.id === customerId);
    if (idx !== -1) {
      state.customers[idx].assigned_user_id = userId || null;
      const user = state.users.find(u => u.id === userId);
      state.customers[idx].assigned_user_name = user?.name || null;
    }
  } catch (e) { console.error('Atama hatası:', e); }
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

  // Feature 3: Öncelikli kuyruk sıralaması
  const today = new Date().toISOString().split('T')[0];
  const callable = all.filter(c =>
    ['new','to_call','unreachable','call_later','contacted'].includes(c.status)
  );

  callable.sort((a, b) => {
    // ── KURAL 1: Bugün zaten aranmışsa en sona at ──────────────────────────
    // Not: null && expr → null (not false), so use ternary for strict boolean
    const aToday = a.last_contacted ? a.last_contacted.slice(0, 10) === today : false;
    const bToday = b.last_contacted ? b.last_contacted.slice(0, 10) === today : false;
    if (aToday !== bToday) return aToday ? 1 : -1;

    // ── KURAL 2: Öncelik tieri ─────────────────────────────────────────────
    const priorityOf = (c) => {
      if (c.status === 'new' && !c.last_contacted) return 0; // Hiç aranmamış yeni
      if (c.follow_up_date && c.follow_up_date <= today)     return 1; // Takip zamanı geldi
      if (c.status === 'to_call')                            return 2;
      if (c.status === 'call_later')                         return 3;
      return 4;
    };
    const pa = priorityOf(a), pb = priorityOf(b);
    if (pa !== pb) return pa - pb;

    // ── KURAL 3: Aynı tier içinde en uzun süre aranmayanı öne al ──────────
    // last_contacted null → en önce (hiç aranmamış)
    const aTs = a.last_contacted ? new Date(a.last_contacted).getTime() : 0;
    const bTs = b.last_contacted ? new Date(b.last_contacted).getTime() : 0;
    if (aTs !== bTs) return aTs - bTs; // eskiden yeniye → en eski önce

    // ── KURAL 4: Son olarak fit_score ─────────────────────────────────────
    return (b.fit_score || 0) - (a.fit_score || 0);
  });

  state.sessionCustomers = callable;
  // Hiç müşteri yoksa hepsini al
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
  document.getElementById('session-result-panel').classList.remove('visible');

  state.sessionSeconds = getSessionDuration();
  updateTimerDisplay();
  resetResultPanel();
}

function resetResultPanel() {
  state.sessionResult = null;
  state.sessionFollowUpDate = null;
  document.querySelectorAll('.result-btn').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.fu-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('session-note').value = '';
  document.getElementById('session-save-btn').disabled = true;
  document.getElementById('followup-custom-date').value = '';
  document.getElementById('followup-picker').classList.add('hidden');
}

function sessionSkip() {
  if (!state.sessionActive) return;
  clearInterval(state.sessionInterval);
  document.getElementById('session-expired-toast').classList.remove('visible');
  resetResultPanel();

  state.sessionDone++;
  state.sessionIndex++;
  state.sessionSeconds = getSessionDuration();
  document.getElementById('session-done-count').textContent = state.sessionDone;
  document.getElementById('session-badge-text').textContent = 'Aktif';

  updateSessionCustomer();
  updateTimerDisplay();
  state.sessionInterval = setInterval(sessionTick, 1000);
}

async function sessionSaveAndNext() {
  if (!state.sessionResult) return;
  const customer = state.sessionCustomers[state.sessionIndex % state.sessionCustomers.length];
  if (!customer) { sessionSkip(); return; }

  const note = document.getElementById('session-note').value.trim();

  // Demo modda sadece UI güncelle, gerçek modda API'ye kaydet
  if (!state.isDemoMode && customer.id) {
    try {
      // Feature 2: follow_up_date'i de gönder
      await apiFetch('/api/activities', {
        method: 'POST',
        body: {
          customer_id:    customer.id,
          result:         state.sessionResult,
          note,
          follow_up_date: state.sessionFollowUpDate || null,
        },
      });
      // Cached customer'ı güncelle
      const idx = state.customers.findIndex(c => c.id === customer.id);
      if (idx !== -1) {
        const statusMap = {
          'görüşüldü': 'contacted', 'mail_atıldı': 'contacted',
          'ziyaret_planlandı': 'contacted', 'takip_gerekiyor': 'call_later',
          'ulaşılamadı': 'unreachable'
        };
        state.customers[idx].status         = statusMap[state.sessionResult] || state.customers[idx].status;
        state.customers[idx].last_contacted = new Date().toISOString();
        state.customers[idx].follow_up_date = state.sessionFollowUpDate || null;
      }
    } catch (e) { console.error('Kayıt hatası:', e); }
  }

  // Sonraki müşteriye geç
  clearInterval(state.sessionInterval);
  document.getElementById('session-expired-toast').classList.remove('visible');
  resetResultPanel();

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
    document.getElementById('session-result-panel').classList.remove('visible');
    return;
  }
  const c = customers[state.sessionIndex % customers.length];
  document.getElementById('session-customer-avatar').textContent = c.company_name.substring(0,2).toUpperCase();
  document.getElementById('session-customer-name').textContent   = c.company_name;
  document.getElementById('session-customer-phone').textContent  =
    (c.contact_name || '') + (c.phone ? ' · ' + c.phone : '');

  // Feature 9: WhatsApp / Call / Mail kısayolları
  const sqCall = document.getElementById('sq-call');
  const sqWa   = document.getElementById('sq-wa');
  const sqMail = document.getElementById('sq-mail');

  if (c.phone) {
    sqCall.href = `tel:${c.phone.replace(/\s/g,'')}`;
    sqCall.style.display = 'flex';
    const wpNum = formatWhatsApp(c.phone);
    sqWa.href = `https://wa.me/${wpNum}`;
    sqWa.style.display = 'flex';
  } else {
    sqCall.style.display = 'none';
    sqWa.style.display   = 'none';
  }
  if (c.email) {
    sqMail.href = `mailto:${c.email}`;
    sqMail.style.display = 'flex';
  } else {
    sqMail.style.display = 'none';
  }

  document.getElementById('session-customer').classList.add('visible');
  document.getElementById('session-result-panel').classList.add('visible');
  resetResultPanel();
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
   Performance Page (Feature 5 + 8)
────────────────────────────────────────────── */
async function renderPerformance() {
  // Demo mod için simüle edilmiş stats
  let stats;
  if (state.isDemoMode) {
    stats = {
      today: {
        total: 8, target: 20,
        byResult: { 'görüşüldü': 3, 'ulaşılamadı': 2, 'mail_atıldı': 2, 'takip_gerekiyor': 1 }
      },
      weekly: [
        { day: '2026-05-20', total: 12 }, { day: '2026-05-21', total: 18 },
        { day: '2026-05-22', total: 7  }, { day: '2026-05-23', total: 15 },
        { day: '2026-05-24', total: 0  }, { day: '2026-05-25', total: 0  },
        { day: '2026-05-26', total: 8  },
      ],
      newCustomers24h: 3,
      overdueFollowups: 2,
      team: [
        { name: 'Demo Kullanıcı', call_count: 8, daily_target: 20 },
      ],
    };
  } else {
    try { stats = await apiFetch('/api/stats'); }
    catch { stats = null; }
  }

  if (!stats) {
    document.getElementById('perf-target-card').innerHTML = '<div style="padding:16px;color:var(--text-tertiary)">Veriler yüklenemedi.</div>';
    return;
  }

  // Feature 8: Günlük hedef kartı
  const done   = stats.today.total;
  const target = stats.today.target || 20;
  const pct    = Math.min(100, Math.round((done / target) * 100));
  const motiv  = motivationMessage(done, target);

  document.getElementById('ptc-emoji').textContent    = motiv.emoji;
  document.getElementById('ptc-title').textContent    = 'Bugünkü Hedef';
  document.getElementById('ptc-sub').textContent      = motiv.msg;
  document.getElementById('ptc-bar-fill').style.width = pct + '%';
  document.getElementById('ptc-bar-fill').style.background = pct >= 100 ? '#22C55E' : pct >= 50 ? '#3B82F6' : '#F97316';
  document.getElementById('ptc-pct').textContent      = pct + '%';
  document.getElementById('ptc-done').textContent     = done;
  document.getElementById('ptc-target').textContent   = target;

  // Bugünkü sonuç dağılımı
  const resultEmojis = {
    'görüşüldü':'✅','mail_atıldı':'📧','ulaşılamadı':'📵',
    'ziyaret_planlandı':'📅','takip_gerekiyor':'🔄'
  };
  const resultLabels = {
    'görüşüldü':'Görüşüldü','mail_atıldı':'Mail Atıldı','ulaşılamadı':'Ulaşılamadı',
    'ziyaret_planlandı':'Ziyaret Planlandı','takip_gerekiyor':'Takip Gerekiyor'
  };
  const byResult = stats.today.byResult || {};
  const totalResults = Object.values(byResult).reduce((s,v) => s + v, 0);
  const resultsHtml = Object.entries(byResult).length
    ? Object.entries(byResult).map(([key, count]) => {
        const barPct = totalResults > 0 ? Math.round((count/totalResults)*100) : 0;
        return `
          <div class="perf-result-row">
            <span class="perf-result-label">${resultEmojis[key]||'•'} ${resultLabels[key]||key}</span>
            <div class="perf-result-bar-wrap">
              <div class="perf-result-bar" style="width:${barPct}%"></div>
            </div>
            <span class="perf-result-count">${count}</span>
          </div>`;
      }).join('')
    : '<div style="color:var(--text-tertiary);font-size:13px">Bugün henüz sonuç kaydedilmedi</div>';
  document.getElementById('perf-results-list').innerHTML = resultsHtml;

  // Haftalık chart
  const maxVal = Math.max(...stats.weekly.map(d => d.total), 1);
  const dayNames = ['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'];
  const weeklyHtml = stats.weekly.map(d => {
    const h    = Math.max(4, Math.round((d.total / maxVal) * 80));
    const day  = new Date(d.day);
    const name = dayNames[day.getDay()];
    const isToday = d.day === new Date().toISOString().split('T')[0];
    return `
      <div class="weekly-bar-wrap ${isToday ? 'today' : ''}">
        <div class="weekly-bar-val">${d.total || ''}</div>
        <div class="weekly-bar" style="height:${h}px;background:${isToday ? '#3B82F6' : '#CBD5E1'}"></div>
        <div class="weekly-bar-label">${name}</div>
      </div>`;
  }).join('');
  document.getElementById('perf-weekly-chart').innerHTML = `<div class="weekly-bars">${weeklyHtml}</div>`;

  // Ekip sıralaması
  const teamHtml = (stats.team || []).map((member, i) => {
    const memberPct = Math.min(100, Math.round((member.call_count / (member.daily_target||20)) * 100));
    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
    return `
      <div class="team-row">
        <div class="team-rank">${medal}</div>
        <div class="team-name">${member.name}</div>
        <div class="team-bar-wrap">
          <div class="team-bar-fill" style="width:${memberPct}%;background:${memberPct>=100?'#22C55E':'#3B82F6'}"></div>
        </div>
        <div class="team-count">${member.call_count} / ${member.daily_target||20}</div>
      </div>`;
  }).join('');
  document.getElementById('perf-team-list').innerHTML = teamHtml || '<div style="color:var(--text-tertiary);font-size:13px">Ekip verisi yok</div>';

  // Takip gereken müşteriler
  const today = new Date().toISOString().split('T')[0];
  const followups = state.customers.filter(c =>
    c.follow_up_date && c.follow_up_date <= today && !['sold','lost'].includes(c.status)
  );
  document.getElementById('perf-followup-count').textContent = followups.length;
  const followupHtml = followups.length
    ? followups.map(c => `
        <div class="followup-item" onclick="showCustomerDrawer('${c.id}')">
          <div class="followup-avatar">${c.company_name.substring(0,2).toUpperCase()}</div>
          <div class="followup-info">
            <div class="followup-name">${c.company_name}</div>
            <div class="followup-sub">${c.contact_name||''} ${c.phone ? '· '+c.phone : ''}</div>
          </div>
          <div class="followup-date ${new Date(c.follow_up_date) < new Date() ? 'overdue' : ''}">
            📅 ${formatDate(c.follow_up_date)}
          </div>
        </div>`).join('')
    : '<div style="color:var(--text-tertiary);font-size:13px;padding:12px 0">Bugün takip edilecek müşteri yok 🎉</div>';
  document.getElementById('perf-followup-list').innerHTML = followupHtml;

  // Yeni müşteri banner
  if (stats.newCustomers24h > 0) {
    document.getElementById('ncb-text').textContent =
      `🆕 Son 24 saatte ${stats.newCustomers24h} yeni müşteri eklendi!`;
    document.getElementById('new-customers-banner').classList.remove('hidden');
  }
}

/* ──────────────────────────────────────────────
   Müşteri Ekle / Düzenle Modal
────────────────────────────────────────────── */
let _customerModalMode = 'add';   // 'add' | 'edit'
let _customerModalId   = null;

function openCustomerModal(mode, customerId) {
  _customerModalMode = mode;
  _customerModalId   = customerId || null;

  // Başlık ve buton metni
  document.getElementById('customer-modal-title').textContent =
    mode === 'edit' ? '✏️ Müşteriyi Düzenle' : '➕ Yeni Müşteri';
  document.getElementById('customer-modal-submit-text').textContent =
    mode === 'edit' ? 'Güncelle' : 'Kaydet';

  // Formu sıfırla
  const fields = ['cm-company','cm-sector','cm-city','cm-website','cm-fitscore',
                   'cm-contact','cm-title','cm-phone','cm-email','cm-notes'];
  fields.forEach(id => { document.getElementById(id).value = ''; });
  document.getElementById('cm-status').value   = 'new';
  document.getElementById('cm-assigned').value = '';
  document.getElementById('customer-modal-error').classList.add('hidden');

  // Temsilci dropdown'ını doldur
  const assignSel = document.getElementById('cm-assigned');
  assignSel.innerHTML = '<option value="">— Atanmamış —</option>' +
    state.users.map(u => `<option value="${u.id}">${u.name}</option>`).join('');

  // Edit modunda mevcut değerleri doldur
  if (mode === 'edit' && customerId) {
    const all = state.isDemoMode ? DEMO_CUSTOMERS : state.customers;
    const c   = all.find(x => x.id === customerId);
    if (c) {
      document.getElementById('cm-company').value  = c.company_name  || '';
      document.getElementById('cm-sector').value   = c.sector        || '';
      document.getElementById('cm-city').value     = c.city          || '';
      document.getElementById('cm-website').value  = c.website       || '';
      document.getElementById('cm-fitscore').value = c.fit_score     || '';
      document.getElementById('cm-contact').value  = c.contact_name  || '';
      document.getElementById('cm-title').value    = c.title         || '';
      document.getElementById('cm-phone').value    = c.phone         || '';
      document.getElementById('cm-email').value    = c.email         || '';
      document.getElementById('cm-notes').value    = c.notes         || '';
      document.getElementById('cm-status').value   = c.status        || 'new';
      if (c.assigned_user_id) document.getElementById('cm-assigned').value = c.assigned_user_id;
    }
  }

  document.getElementById('customer-modal-backdrop').classList.remove('hidden');
  document.getElementById('customer-modal').classList.remove('hidden');
  document.getElementById('cm-company').focus();
}

function closeCustomerModal() {
  document.getElementById('customer-modal-backdrop').classList.add('hidden');
  document.getElementById('customer-modal').classList.add('hidden');
}

async function submitCustomerModal() {
  const company = document.getElementById('cm-company').value.trim();
  const errEl   = document.getElementById('customer-modal-error');
  errEl.classList.add('hidden');

  if (!company) {
    errEl.textContent = 'Firma adı zorunludur.';
    errEl.classList.remove('hidden');
    return;
  }

  const submitBtn  = document.getElementById('customer-modal-submit');
  const submitText = document.getElementById('customer-modal-submit-text');
  submitBtn.disabled = true;
  submitText.textContent = 'Kaydediliyor…';

  const body = {
    company_name:     company,
    sector:           document.getElementById('cm-sector').value.trim(),
    city:             document.getElementById('cm-city').value.trim(),
    website:          document.getElementById('cm-website').value.trim(),
    fit_score:        parseInt(document.getElementById('cm-fitscore').value) || null,
    contact_name:     document.getElementById('cm-contact').value.trim(),
    title:            document.getElementById('cm-title').value.trim(),
    phone:            document.getElementById('cm-phone').value.trim(),
    email:            document.getElementById('cm-email').value.trim().toLowerCase(),
    notes:            document.getElementById('cm-notes').value.trim(),
    status:           document.getElementById('cm-status').value,
    assigned_user_id: document.getElementById('cm-assigned').value || null,
  };

  try {
    if (state.isDemoMode) {
      // Demo modda cache'i güncelle
      if (_customerModalMode === 'add') {
        const newC = { ...body, id: 'demo-' + Date.now(), last_contacted: null, created_at: new Date().toISOString() };
        DEMO_CUSTOMERS.unshift(newC);
        state.customers = [...DEMO_CUSTOMERS];
      } else {
        const idx = DEMO_CUSTOMERS.findIndex(c => c.id === _customerModalId);
        if (idx !== -1) Object.assign(DEMO_CUSTOMERS[idx], body);
        state.customers = [...DEMO_CUSTOMERS];
      }
    } else {
      if (_customerModalMode === 'add') {
        const newC = await apiFetch('/api/customers', { method: 'POST', body });
        state.customers.unshift(newC);
      } else {
        const updated = await apiFetch(`/api/customers?id=${_customerModalId}`, { method: 'PUT', body });
        const idx = state.customers.findIndex(c => c.id === _customerModalId);
        if (idx !== -1) state.customers[idx] = { ...state.customers[idx], ...updated };
      }
    }

    closeCustomerModal();
    // Sayfayı yenile
    if (state.currentPage === 'customers') renderCustomers();
    else if (state.currentPage === 'dashboard') renderDashboard();

    showToast(
      _customerModalMode === 'add'
        ? `✅ ${company} müşteri listesine eklendi`
        : `✅ ${company} güncellendi`,
      2500
    );
  } catch (e) {
    errEl.textContent = e.message || 'Bir hata oluştu.';
    errEl.classList.remove('hidden');
  } finally {
    submitBtn.disabled = false;
    submitText.textContent = _customerModalMode === 'edit' ? 'Güncelle' : 'Kaydet';
  }
}

// Basit toast bildirimi
function showToast(msg, duration = 2000) {
  let toast = document.getElementById('sp-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'sp-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = 'sp-toast visible';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.className = 'sp-toast'; }, duration);
}

/* ──────────────────────────────────────────────
   Quick Add Modal (Feature 7)
────────────────────────────────────────────── */
function openQuickAdd() {
  resetQuickAdd();
  document.getElementById('quick-add-backdrop').classList.remove('hidden');
  document.getElementById('quick-add-modal').classList.remove('hidden');
  document.getElementById('qa-company').focus();
}

function closeQuickAdd() {
  document.getElementById('quick-add-backdrop').classList.add('hidden');
  document.getElementById('quick-add-modal').classList.add('hidden');
}

function resetQuickAdd() {
  ['qa-company','qa-sector','qa-contact','qa-phone','qa-email','qa-city']
    .forEach(id => { document.getElementById(id).value = ''; });
  document.getElementById('quick-add-error').classList.add('hidden');
  document.getElementById('quick-add-success').classList.add('hidden');
  document.getElementById('quick-add-form-wrap').classList.remove('hidden');
  document.getElementById('qa-footer').classList.remove('hidden');
}

async function submitQuickAdd() {
  const company = document.getElementById('qa-company').value.trim();
  if (!company) {
    const errEl = document.getElementById('quick-add-error');
    errEl.textContent = 'Firma adı zorunludur.';
    errEl.classList.remove('hidden');
    return;
  }

  const btn = document.getElementById('quick-add-submit');
  btn.disabled = true;
  btn.textContent = 'Kaydediliyor…';

  try {
    if (!state.isDemoMode) {
      await apiFetch('/api/customers', {
        method: 'POST',
        body: {
          company_name: company,
          sector:       document.getElementById('qa-sector').value.trim(),
          contact_name: document.getElementById('qa-contact').value.trim(),
          phone:        document.getElementById('qa-phone').value.trim(),
          email:        document.getElementById('qa-email').value.trim().toLowerCase(),
          city:         document.getElementById('qa-city').value.trim(),
          status:       'new',
        },
      });
      // Refresh cache
      state.customers = await fetchCustomers();
    } else {
      // Demo: just show success
    }

    document.getElementById('qa-success-name').textContent = company + ' başarıyla eklendi.';
    document.getElementById('quick-add-form-wrap').classList.add('hidden');
    document.getElementById('qa-footer').classList.add('hidden');
    document.getElementById('quick-add-success').classList.remove('hidden');

    // Badge güncelle
    const badge = document.getElementById('sb-badge-customers');
    if (badge) {
      const cur = parseInt(badge.textContent || '0') + 1;
      badge.textContent = cur; badge.style.display = 'flex';
    }
  } catch (e) {
    const errEl = document.getElementById('quick-add-error');
    errEl.textContent = e.message || 'Kaydetme hatası.';
    errEl.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Kaydet';
  }
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

async function fetchUsers() {
  if (state.isDemoMode) return [DEMO_USER];
  try { return await apiFetch('/api/users'); }
  catch { return []; }
}

async function fetchStats() {
  if (state.isDemoMode) return null;
  try { return await apiFetch('/api/stats'); }
  catch { return null; }
}

// ═══════════════════════════════════════════════════════════════
//  EXCEL IMPORT
// ═══════════════════════════════════════════════════════════════

// Türkçe/İngilizce sütun başlıklarını DB alanlarına eşle
const XI_COLUMN_MAP = {
  // company_name
  'firma adı':      'company_name', 'firma adi':     'company_name',
  'şirket adı':     'company_name', 'sirket adi':    'company_name',
  'firma':          'company_name', 'şirket':        'company_name',
  'company name':   'company_name', 'company':       'company_name',
  'company_name':   'company_name',
  // contact_name
  'yetkili adı':    'contact_name', 'yetkili adi':   'contact_name',
  'yetkili':        'contact_name', 'iletişim kişisi': 'contact_name',
  'iletisim kisisi':'contact_name', 'kişi':          'contact_name',
  'contact name':   'contact_name', 'contact':       'contact_name',
  'contact_name':   'contact_name',
  // phone
  'telefon':        'phone', 'tel':              'phone',
  'phone':          'phone', 'mobile':           'phone', 'gsm': 'phone',
  // email
  'e-posta':        'email', 'eposta':           'email',
  'email':          'email', 'mail':             'email', 'e mail': 'email',
  // sector
  'sektör':         'sector', 'sektor':           'sector',
  'sector':         'sector', 'industry':         'sector',
  // city
  'şehir':          'city', 'sehir':             'city',
  'il':             'city', 'city':              'city',
  // title
  'unvan':          'title', 'pozisyon':          'title',
  'title':          'title', 'position':          'title', 'jabatan': 'title',
  // status — "Statu" buteo formatı dahil
  'durum':          'status', 'status':   'status',
  'statu':          'status', 'statü':    'status', 'statü': 'status',
  // notes
  'notlar':         'notes', 'not':       'notes',
  'notes':          'notes', 'note':      'notes', 'açıklama': 'notes',
  'son guncelleme': null,   // tarih sütunu — yoksay
  'web sitesi':     null,   // yoksay
  '#':              null,   // sıra no — yoksay
  // fit_score — "Fit" buteo formatı
  'fit':            'fit_score',
  'uyum skoru':     'fit_score', 'skor':   'fit_score',
  'fit score':      'fit_score', 'fit_score':'fit_score', 'score': 'fit_score',
  // confidence — "Guven" buteo formatı
  'güven':          'confidence', 'guven': 'confidence',
  'confidence':     'confidence',
  // linkedin_url
  'linkedin':       'linkedin_url', 'linkedin url': 'linkedin_url',
  'linkedin_url':   'linkedin_url',
};

// Durum eşlemesi (Türkçe/İngilizce metin + Buteo Sales formatı → DB değeri)
const XI_STATUS_MAP = {
  'yeni': 'new', 'new': 'new',
  'aranacak': 'to_call', 'to_call': 'to_call', 'to call': 'to_call',
  'sonra ara': 'call_later', 'call_later': 'call_later',
  'görüşüldü': 'contacted', 'gorusuldu': 'contacted', 'contacted': 'contacted',
  'contact found': 'contacted', 'ulaşıldı': 'contacted',
  'ilgili': 'interested', 'interested': 'interested',
  'researched': 'to_call',      // Buteo: araştırıldı → aranacak
  'teklif gönderildi': 'offer_sent', 'teklif gonderildi': 'offer_sent', 'offer_sent': 'offer_sent', 'offer sent': 'offer_sent',
  'pazarlıkta': 'negotiating', 'pazarlikta': 'negotiating', 'negotiating': 'negotiating',
  'satış yapıldı': 'sold', 'satis yapildi': 'sold', 'satıldı': 'sold', 'sold': 'sold',
  'kaybedildi': 'lost', 'lost': 'lost',
  'ulaşılamadı': 'unreachable', 'ulasilamadi': 'unreachable', 'unreachable': 'unreachable',
};

let _xiParsedRows = []; // parse edilmiş satırlar
let _xiMappedHeaders = []; // {label, field} dizisi
let _xiWorkbook = null; // yüklenen workbook (sheet seçimi için)

function openExcelImport() {
  _xiParsedRows = [];
  _xiMappedHeaders = [];
  _xiWorkbook = null;
  xiResetToUpload();
  document.getElementById('excel-import-modal').classList.remove('hidden');
  document.getElementById('excel-import-backdrop').classList.remove('hidden');
}

function closeExcelImport() {
  document.getElementById('excel-import-modal').classList.add('hidden');
  document.getElementById('excel-import-backdrop').classList.add('hidden');
  // Müşteri listesini yenile (import sonrası)
  if (!state.isDemoMode) loadCustomers();
}

function xiResetToUpload() {
  document.getElementById('xi-step-upload').classList.remove('hidden');
  document.getElementById('xi-step-preview').classList.add('hidden');
  document.getElementById('xi-step-result').classList.add('hidden');
  document.getElementById('xi-import-btn').classList.add('hidden');
  document.getElementById('xi-done-btn').classList.add('hidden');
  document.getElementById('excel-import-cancel').classList.remove('hidden');
  document.getElementById('xi-parse-error').classList.add('hidden');
  document.getElementById('xi-sheet-selector-wrap').classList.add('hidden');
  document.getElementById('xi-file-input').value = '';
  _xiParsedRows = [];
  _xiWorkbook = null;
}

function handleExcelFile(file) {
  const allowed = ['.xlsx', '.xls', '.csv'];
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  if (!allowed.includes(ext)) {
    xiShowParseError('Desteklenmeyen dosya türü. Lütfen .xlsx, .xls veya .csv yükleyin.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      _xiWorkbook = XLSX.read(data, { type: 'array' });

      if (_xiWorkbook.SheetNames.length > 1) {
        // Birden fazla sayfa varsa sayfa seçici göster
        xiShowSheetSelector(_xiWorkbook.SheetNames);
      } else {
        xiParseSheet(_xiWorkbook.SheetNames[0]);
      }
    } catch (err) {
      xiShowParseError('Dosya okunamadı: ' + err.message);
    }
  };
  reader.onerror = () => xiShowParseError('Dosya okunurken hata oluştu.');
  reader.readAsArrayBuffer(file);
}

function xiShowSheetSelector(sheetNames) {
  const wrap = document.getElementById('xi-sheet-selector-wrap');
  const sel  = document.getElementById('xi-sheet-select');
  sel.innerHTML = sheetNames.map((s,i) => `<option value="${i}">${s}</option>`).join('');
  wrap.classList.remove('hidden');
  document.getElementById('xi-parse-error').classList.add('hidden');

  // Otomatik en iyi sayfayı seç: "firma" veya "arama" içeren sayfa adını
  // Önce "firma bilgi" veya "customer" içereni seç; yoksa "arama listesi"; yoksa ilk sayfayı al
  let bestIdx = sheetNames.findIndex(s => /firma.*(bilgi|kart)|customer.*list/i.test(s));
  if (bestIdx < 0) bestIdx = sheetNames.findIndex(s => /firma|musteri|customer/i.test(s));
  if (bestIdx < 0) bestIdx = sheetNames.findIndex(s => /arama|list|liste/i.test(s));
  if (bestIdx >= 0) sel.value = bestIdx;
}

function xiParseSheet(sheetName) {
  document.getElementById('xi-sheet-selector-wrap').classList.add('hidden');
  document.getElementById('xi-parse-error').classList.add('hidden');

  const ws  = _xiWorkbook.Sheets[sheetName];
  const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

  // Başlık satırını bul (ilk satırda sütun tanımlayıcı varsa 0, yoksa sonraki satır)
  let headerRowIdx = 0;
  // Bazı dosyalarda ilk satır bölüm başlığı olabilir
  for (let i = 0; i < Math.min(raw.length, 3); i++) {
    const row = raw[i];
    const mapped = row.filter(h => h && XI_COLUMN_MAP[h.toString().trim().toLowerCase()] === 'company_name');
    if (mapped.length > 0) { headerRowIdx = i; break; }
  }

  if (raw.length < headerRowIdx + 2) {
    xiShowParseError('Seçilen sayfada yeterli veri bulunamadı.');
    return;
  }

  // Başlık satırını normalize et
  const headers = raw[headerRowIdx].map(h => (h||'').toString().trim());
  _xiMappedHeaders = headers.map(h => ({
    label: h,
    field: XI_COLUMN_MAP[h.toLowerCase()] !== undefined ? XI_COLUMN_MAP[h.toLowerCase()] : null,
  }));

  const companyCol = _xiMappedHeaders.findIndex(h => h.field === 'company_name');
  if (companyCol === -1) {
    xiShowParseError(`"${sheetName}" sayfasında Firma Adı sütunu bulunamadı. Lütfen başka bir sayfa seçin.`);
    document.getElementById('xi-sheet-selector-wrap').classList.remove('hidden');
    return;
  }

  // Veri satırlarını parse et (max 500)
  _xiParsedRows = [];
  for (let i = headerRowIdx + 1; i < Math.min(raw.length, headerRowIdx + 501); i++) {
    const row = raw[i];
    if (row.every(cell => !cell && cell !== 0)) continue;
    const obj = {};
    _xiMappedHeaders.forEach((h, idx) => {
      if (h.field) {
        let val = (row[idx] || '').toString().trim();
        if (h.field === 'status') val = XI_STATUS_MAP[val.toLowerCase()] || 'new';
        obj[h.field] = val;
      }
    });
    // Sektör içindeki alt çizgileri boşluğa çevir (savunma_sanayii → savunma sanayii)
    if (obj.sector) obj.sector = obj.sector.replace(/_/g, ' ');
    _xiParsedRows.push({ _rowNum: i + 1, ...obj });
  }

  if (_xiParsedRows.length === 0) {
    xiShowParseError('Seçilen sayfada veri satırı bulunamadı.');
    return;
  }

  xiShowPreview();
}

function xiShowParseError(msg) {
  const el = document.getElementById('xi-parse-error');
  el.textContent = '⚠ ' + msg;
  el.classList.remove('hidden');
}

function xiShowPreview() {
  document.getElementById('xi-step-upload').classList.add('hidden');
  document.getElementById('xi-step-preview').classList.remove('hidden');
  document.getElementById('xi-import-btn').classList.remove('hidden');
  document.getElementById('xi-import-btn-text').textContent = `İçe Aktar (${_xiParsedRows.length} müşteri)`;

  // Özet
  const mappedCount = _xiMappedHeaders.filter(h => h.field).length;
  const skippedCols = _xiMappedHeaders.filter(h => !h.field && h.label).map(h => h.label);
  let summaryHtml = `<strong>${_xiParsedRows.length}</strong> satır hazır &nbsp;·&nbsp; <strong>${mappedCount}</strong> sütun eşlendi`;
  if (skippedCols.length) summaryHtml += ` &nbsp;·&nbsp; <span style="color:#ef4444">Tanınmayan: ${skippedCols.join(', ')}</span>`;
  document.getElementById('xi-preview-summary').innerHTML = summaryHtml;

  // Önizleme tablosu başlıkları
  const thead = document.getElementById('xi-preview-thead');
  const SHOW_FIELDS = ['company_name','contact_name','phone','email','sector','city','status'];
  thead.innerHTML = '<tr>' + SHOW_FIELDS.map(f => `<th>${xiFieldLabel(f)}</th>`).join('') + '<th>Satır</th></tr>';

  // İlk 20 satır önizleme
  const tbody = document.getElementById('xi-preview-tbody');
  const preview = _xiParsedRows.slice(0, 20);
  tbody.innerHTML = preview.map(row => {
    const missing = !row.company_name;
    const cls = missing ? ' class="xi-row-error"' : '';
    const cells = SHOW_FIELDS.map(f => `<td>${row[f] || '<span style="color:#d1d5db">—</span>'}</td>`).join('');
    return `<tr${cls}>${cells}<td style="color:#9ca3af;font-size:11px">${row._rowNum}</td></tr>`;
  }).join('');
  if (_xiParsedRows.length > 20) {
    tbody.innerHTML += `<tr><td colspan="${SHOW_FIELDS.length+1}" style="text-align:center;color:#9ca3af;padding:12px;font-size:12px">… ve ${_xiParsedRows.length - 20} satır daha</td></tr>`;
  }
}

function xiFieldLabel(field) {
  const m = { company_name:'Firma', contact_name:'Yetkili', phone:'Telefon', email:'E-posta', sector:'Sektör', city:'Şehir', status:'Durum' };
  return m[field] || field;
}

async function submitExcelImport() {
  const btn = document.getElementById('xi-import-btn');
  const errEl = document.getElementById('xi-import-error');
  errEl.classList.add('hidden');

  btn.disabled = true;
  document.getElementById('xi-import-btn-text').textContent = 'Aktarılıyor…';

  // Demo modda simüle et
  if (state.isDemoMode) {
    const now = new Date().toISOString();
    const added = _xiParsedRows.filter(r => r.company_name).map(r => ({
      ...r, id: 'xi-' + Math.random().toString(36).slice(2),
      created_at: now, last_contacted: null, status: r.status || 'new',
    }));
    state.customers = [...added, ...state.customers];
    xiShowResult(added.length, 0, []);
    btn.disabled = false;
    return;
  }

  // Real API
  const payload = _xiParsedRows.map(({ _rowNum, ...rest }) => rest);
  try {
    const result = await apiFetch('/api/bulk-import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customers: payload }),
    });
    xiShowResult(result.inserted, result.skipped || 0, result.errors || []);
  } catch (err) {
    errEl.textContent = '⚠ Hata: ' + err.message;
    errEl.classList.remove('hidden');
    document.getElementById('xi-import-btn-text').textContent = `İçe Aktar (${_xiParsedRows.length} müşteri)`;
  }
  btn.disabled = false;
}

function xiShowResult(inserted, skipped, errors) {
  document.getElementById('xi-step-preview').classList.add('hidden');
  document.getElementById('xi-import-btn').classList.add('hidden');
  document.getElementById('excel-import-cancel').classList.add('hidden');
  document.getElementById('xi-step-result').classList.remove('hidden');
  document.getElementById('xi-done-btn').classList.remove('hidden');

  const allOk = errors.length === 0;
  document.getElementById('xi-result-icon').textContent = allOk ? '✅' : '⚠️';
  document.getElementById('xi-result-title').textContent = allOk ? 'İçe Aktarma Tamamlandı' : 'Aktarma Tamamlandı (bazı hatalar)';

  let statsHtml = `<span class="xi-stat xi-stat-ok"><strong>${inserted}</strong> müşteri eklendi</span>`;
  if (errors.length) statsHtml += ` <span class="xi-stat xi-stat-err"><strong>${errors.length}</strong> satır atlandı</span>`;
  document.getElementById('xi-result-stats').innerHTML = statsHtml;

  if (errors.length) {
    const errEl = document.getElementById('xi-result-errors');
    errEl.innerHTML = '<div class="xi-err-title">Atlanan satırlar:</div>' +
      errors.slice(0, 10).map(e => `<div class="xi-err-row">Satır ${e.row}: ${e.reason}</div>`).join('') +
      (errors.length > 10 ? `<div class="xi-err-row">… ve ${errors.length-10} hata daha</div>` : '');
    errEl.classList.remove('hidden');
  }

  // Müşteri listesini yenile (renderCustomers search string alır, dizi değil)
  if (!state.isDemoMode) {
    loadCustomers().then(() => renderCustomers(''));
  } else {
    renderCustomers('');
  }
  showToast(`✅ ${inserted} müşteri başarıyla eklendi!`, 3000);
}

// Örnek şablon indir (SheetJS ile client-side .xlsx oluştur)
function downloadExcelTemplate() {
  const headers = ['Firma Adı', 'Yetkili', 'Telefon', 'E-posta', 'Sektör', 'Şehir', 'Unvan', 'Durum', 'Notlar', 'Uyum Skoru', 'LinkedIn'];
  const example = ['Örnek Şirket A.Ş.', 'Ahmet Yılmaz', '+90 212 555 0001', 'info@ornek.com', 'Teknoloji', 'İstanbul', 'Satış Müdürü', 'new', 'Yüksek potansiyel', '85', 'https://linkedin.com/in/ahmet'];
  const ws = XLSX.utils.aoa_to_sheet([headers, example]);

  // Sütun genişlikleri
  ws['!cols'] = [20,16,16,24,14,12,16,12,20,12,30].map(w => ({ wch: w }));

  // Başlık satırı için stil (SheetJS community edition'da sınırlı)
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Müşteriler');
  XLSX.writeFile(wb, 'salespulse_musteri_sablonu.xlsx');
}

// ─── Filtre dropdown yardımcısı ───────────────────────────────────────────────
function xiPopulateFilterDropdown(elId, items, field, currentVal) {
  const el = document.getElementById(elId);
  if (!el) return;
  const vals = [...new Set(items.map(c => (c[field]||'').trim()).filter(Boolean))].sort();
  const prev = el.value || currentVal;
  el.innerHTML = `<option value="">Tümü</option>` +
    vals.map(v => `<option value="${v}"${v===prev?' selected':''}>${v}</option>`).join('');
}
