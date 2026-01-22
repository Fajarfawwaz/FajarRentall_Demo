// --- DATABASE (Simulasi MySQL) ---
let db_mobil = JSON.parse(localStorage.getItem('db_mobil')) || [
    { id: 1, nama: 'Toyota Avanza', harga: 450000 },
    { id: 2, nama: 'Honda Brio', harga: 350000 }
];
let db_trx = JSON.parse(localStorage.getItem('db_trx')) || [];

function updateDB() {
    localStorage.setItem('db_mobil', JSON.stringify(db_mobil));
    localStorage.setItem('db_trx', JSON.stringify(db_trx));
}

// --- ROUTING ENGINE ---
function route(pageId) {
    // Sembunyikan semua section utama
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    
    // Logika Routing
    if (pageId === 'login') document.getElementById('page-login').classList.remove('hidden');
    if (pageId === 'user') {
        document.getElementById('page-user').classList.remove('hidden');
        renderKatalog();
    }
    if (pageId === 'admin') {
        document.getElementById('page-admin').classList.remove('hidden');
        renderAdmin();
    }

    // Sub-menu Admin
    if (pageId === 'admin-crud') {
        document.getElementById('sub-admin-crud').classList.remove('hidden');
        document.getElementById('sub-admin-kas').classList.add('hidden');
    }
    if (pageId === 'admin-kas') {
        document.getElementById('sub-admin-crud').classList.add('hidden');
        document.getElementById('sub-admin-kas').classList.remove('hidden');
    }
}

// --- FUNGSI AUTH (Simulasi session_start) ---
function authLogin() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;

    if (u === 'admin' && p === '123') {
        localStorage.setItem('session_role', 'admin');
        route('admin');
    } else if (u === 'user' && p === '123') {
        localStorage.setItem('session_role', 'user');
        route('user');
    } else {
        alert("Username atau Password Salah!");
    }
}

function authLogout() {
    localStorage.removeItem('session_role');
    location.reload();
}

// --- FITUR USER (Transaksi) ---
function renderKatalog() {
    const container = document.getElementById('katalog-list');
    container.innerHTML = '';
    db_mobil.forEach(m => {
        container.innerHTML += `
            <div class="bg-white p-6 rounded-[30px] border shadow-sm">
                <h3 class="font-black text-xl uppercase italic">${m.nama}</h3>
                <p class="text-blue-600 font-black text-2xl my-4">Rp ${m.harga.toLocaleString()}</p>
                <div class="flex gap-2">
                    <button onclick="checkout('${m.nama}', ${m.harga}, 'DANA')" class="flex-1 bg-blue-500 text-white py-2 rounded-xl font-bold text-[10px]">DANA</button>
                    <button onclick="checkout('${m.nama}', ${m.harga}, 'BANK')" class="flex-1 bg-slate-800 text-white py-2 rounded-xl font-bold text-[10px]">BANK</button>
                </div>
            </div>`;
    });
}

function checkout(nama, harga, metode) {
    db_trx.push({ nama, harga, metode, tgl: new Date().toLocaleDateString() });
    updateDB();
    
    document.getElementById('st-mobil').innerText = nama;
    document.getElementById('st-metode').innerText = metode;
    document.getElementById('st-total').innerText = "Rp " + harga.toLocaleString();
    document.getElementById('modal-struk').classList.remove('hidden');
}

function tutupStruk() { document.getElementById('modal-struk').classList.add('hidden'); }

// --- FITUR ADMIN (CRUD) ---
function renderAdmin() {
    const tableMobil = document.getElementById('table-mobil');
    tableMobil.innerHTML = '';
    db_mobil.forEach((m, i) => {
        tableMobil.innerHTML += `
            <tr>
                <td class="p-4 font-bold text-sm uppercase">${m.nama}</td>
                <td class="p-4 font-black">Rp ${m.harga.toLocaleString()}</td>
                <td class="p-4"><button onclick="crudHapus(${i})" class="text-red-500 font-bold text-xs uppercase">Hapus</button></td>
            </tr>`;
    });

    const tableKas = document.getElementById('table-kas');
    tableKas.innerHTML = '';
    let total = 0;
    db_trx.forEach(t => {
        total += t.harga;
        tableKas.innerHTML += `<tr class="text-sm"><td class="p-4 font-bold">${t.nama}</td><td class="p-4 text-blue-500 font-bold">${t.metode}</td><td class="p-4 font-black">Rp ${t.harga.toLocaleString()}</td></tr>`;
    });
    document.getElementById('total-kas').innerText = "Rp " + total.toLocaleString();
}

function crudTambah() {
    const n = document.getElementById('inp-nama').value;
    const h = parseInt(document.getElementById('inp-harga').value);
    if(n && h) {
        db_mobil.push({ id: Date.now(), nama: n, harga: h });
        updateDB(); renderAdmin();
        document.getElementById('inp-nama').value = '';
        document.getElementById('inp-harga').value = '';
    }
}

function crudHapus(i) {
    db_mobil.splice(i, 1);
    updateDB(); renderAdmin();
}

// --- INITIAL LOAD (Simulasi Check Session) ---
window.onload = () => {
    const session = localStorage.getItem('session_role');
    if (session === 'admin') route('admin');
    else if (session === 'user') route('user');
    else route('login');
};