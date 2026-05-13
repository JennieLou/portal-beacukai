const routes = {
  "home": { title: "Home", file: "pages/home.html", crumb: ["Home"], init: initHome },
  "profile": { title: "Profile", file: "pages/profile.html", crumb: ["Profile"], init: initProfile },
  "ceisa": { title: "CEISA Submission", file: "pages/ceisa.html", crumb: ["CEISA Submission"], init: null },
  "reports/pemasukan-barang": { title: "Pemasukan Barang", file: "pages/reports/pemasukan-barang.html", crumb: ["Report", "Pemasukan Barang"], init: () => initReport("pemasukanBarang") },
  "reports/pengeluaran-barang": { title: "Pengeluaran Barang", file: "pages/reports/pengeluaran-barang.html", crumb: ["Report", "Pengeluaran Barang"], init: () => initReport("pengeluaranBarang") },
  "reports/mutasi-bahan-baku": { title: "Mutasi Barang Bahan Baku", file: "pages/reports/mutasi-bahan-baku.html", crumb: ["Report", "Mutasi Barang Bahan Baku"], init: () => initReport("mutasiBahanBaku") },
  "reports/mutasi-barang-jadi": { title: "Mutasi Barang Jadi", file: "pages/reports/mutasi-barang-jadi.html", crumb: ["Report", "Mutasi Barang Jadi"], init: () => initReport("mutasiBarangJadi") },
  "reports/mutasi-scrap": { title: "Mutasi Scrap", file: "pages/reports/mutasi-scrap.html", crumb: ["Report", "Mutasi Scrap"], init: () => initReport("mutasiScrap") },
  "reports/posisi-wip": { title: "Posisi WIP", file: "pages/reports/posisi-wip.html", crumb: ["Report", "Posisi WIP"], init: () => initReport("posisiWip") },
  "reports/mutasi-barang-modal": { title: "Mutasi Barang Modal dan Barang Lain", file: "pages/reports/mutasi-barang-modal.html", crumb: ["Report", "Mutasi Barang Modal dan Barang Lain"], init: () => initReport("mutasiBarangModal") },
  "reports/log-history-user": { title: "Log History User", file: "pages/reports/log-history-user.html", crumb: ["Report", "Log History User"], init: () => initReport("logHistoryUser") }
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("sidebarToggle").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("show");
  });
  window.addEventListener("hashchange", loadRoute);
  if (!location.hash) location.hash = "#/home";
  loadRoute();
});

function getRouteKey() {
  return location.hash.replace(/^#\/?/, "") || "home";
}

async function loadRoute() {
  const key = getRouteKey();
  const route = routes[key] || routes.home;
  setActiveNav(key);
  setBreadcrumb(route.crumb);
  document.title = `${route.title} - Web Portal Bea Cukai`;
  const container = document.getElementById("page-content");
  container.innerHTML = `<div class="loading-panel"><div class="spinner-border text-primary" role="status"></div><span>Loading page...</span></div>`;
  try {
    const response = await fetch(route.file);
    container.innerHTML = await response.text();
    if (route.init) route.init();
  } catch (error) {
    container.innerHTML = `<div class="content-card empty-state"><i class="fa-solid fa-triangle-exclamation fa-2x mb-3"></i><h2>Page not available</h2><p>${route.file}</p></div>`;
  }
}

function setActiveNav(key) {
  document.querySelectorAll(".sidebar .nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.route === key);
  });
}

function setBreadcrumb(items) {
  document.getElementById("breadcrumb").innerHTML = [
    `<li class="breadcrumb-item"><a href="#/home">Web Portal</a></li>`,
    ...items.map((item, index) => {
      const isLast = index === items.length - 1;
      return `<li class="breadcrumb-item ${isLast ? "active" : ""}" ${isLast ? 'aria-current="page"' : ""}>${item}</li>`;
    })
  ].join("");
}

function initHome() {
  document.querySelectorAll("[data-shortcut]").forEach((item) => {
    item.addEventListener("click", () => location.hash = item.dataset.shortcut);
  });
}

function initProfile() {
  const user = AppData.currentUser;
  Object.entries(user).forEach(([key, value]) => {
    const field = document.querySelector(`[data-profile="${key}"]`);
    if (field) field.value = value;
  });
  document.getElementById("authorizationList").innerHTML = AppData.authorizations.map((item) => (
    `<li><span>${item.name}</span><span class="badge-soft"><i class="fa-solid fa-eye"></i>${item.access}</span></li>`
  )).join("");
  document.getElementById("warehouseList").innerHTML = AppData.warehouses.map((item) => (
    `<li><span>${item}</span><span class="badge-soft">Assigned</span></li>`
  )).join("");
  document.getElementById("changePasswordForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const message = document.getElementById("passwordMessage");
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const ok = newPassword && newPassword === confirmPassword;
    message.className = `alert mt-3 ${ok ? "alert-success" : "alert-danger"}`;
    message.textContent = ok ? "Password changed successfully in dummy frontend session." : "New password and confirmation must match.";
    message.classList.remove("d-none");
  });
}

function initReport(reportKey) {
  setupToolbar(reportKey);
  const table = $(`#${reportKey}Table`).DataTable({
    data: decorateRows(reportKey, AppData.reports[reportKey]),
    scrollX: true,
    pageLength: 10,
    lengthMenu: [5, 10, 25, 50],
    order: [],
    language: {
      emptyTable: "No data available for selected filter.",
      search: "Search:",
      lengthMenu: "Show _MENU_ entries",
      info: "Showing _START_ to _END_ of _TOTAL_ entries"
    },
    columnDefs: [{ targets: "_all", className: "align-middle" }]
  });
  document.querySelectorAll("[data-filter-action]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.filterAction === "reset") {
        button.closest("form").reset();
        table.search("").columns().search("").draw();
      }
    });
  });
}

function decorateRows(reportKey, rows) {
  if (reportKey === "pengeluaranBarang") {
    return rows.map((row) => row.map((cell, index) => index === row.length - 1
      ? `<button class="btn btn-sm btn-outline-primary" onclick="showTraceability()"><i class="fa-solid fa-route me-1"></i>View Traceability</button>`
      : cell
    ));
  }
  if (reportKey === "mutasiBahanBaku") {
    return rows.map((row) => row.map((cell, index) => index === 5 && parseFloat(cell.replaceAll(",", "")) > 0
      ? `<button class="clickable-value" onclick="showMovementModal('pemasukan','${row[1]}','${row[2]}')">${cell}</button>`
      : cell
    ));
  }
  if (reportKey === "mutasiBarangJadi") {
    return rows.map((row) => row.map((cell, index) => index === 6 && parseFloat(cell.replaceAll(",", "")) > 0
      ? `<button class="clickable-value" onclick="showMovementModal('pengeluaran','${row[1]}','${row[2]}')">${cell}</button>`
      : cell
    ));
  }
  return rows;
}

function setupToolbar(reportKey) {
  document.querySelectorAll("[data-report-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.reportAction;
      if (action === "copy") copyTable(reportKey);
      if (action === "clear") $(`#${reportKey}Table`).DataTable().search("").columns().search("").draw();
      if (action === "columns") alert("Column Settings placeholder for future saved preferences.");
      if (action === "reset-columns") alert("Column layout has been reset in this mockup.");
      if (action === "excel" || action === "pdf") alert(`Dummy ${action.toUpperCase()} export for View/Export user.`);
    });
  });
}

function copyTable(reportKey) {
  const rows = AppData.reports[reportKey].map((row) => row.join("\t")).join("\n");
  navigator.clipboard?.writeText(rows);
  alert("Table data copied to clipboard.");
}

function showTraceability() {
  showModal("Traceability View", `
    <div class="row g-3">
      <div class="col-md-4"><div class="content-card"><h3>Document Info</h3><p>BC document, delivery reference, and AJU trace placeholder.</p></div></div>
      <div class="col-md-4"><div class="content-card"><h3>Item Info</h3><p>Finished goods item, quantity, unit, and valuation placeholder.</p></div></div>
      <div class="col-md-4"><div class="content-card"><h3>Transaction Flow</h3><p>SAP Business One flow visualization will be added in a later phase.</p></div></div>
    </div>
  `);
}

function showMovementModal(type, code, name) {
  const isPemasukan = type === "pemasukan";
  const title = isPemasukan ? "Pemasukan View" : "Pengeluaran View";
  const partnerHeader = isPemasukan ? "Pemasok" : "Pembeli / Penerima";
  const rows = AppData.modalRows[type].map((row) => `
    <tr>
      <td>${isPemasukan ? row[0] : `<button class="clickable-value">${row[0]}</button>`}</td>
      ${row.slice(1).map((cell) => `<td>${cell}</td>`).join("")}
    </tr>
  `).join("");
  showModal(title, `
    <div class="row g-3 mb-3">
      <div class="col-md-4"><strong>Kode Barang</strong><div>${code}</div></div>
      <div class="col-md-4"><strong>Nama Barang</strong><div>${name}</div></div>
      <div class="col-md-4"><strong>Periode</strong><div>2026-05-01 s/d 2026-05-31</div></div>
    </div>
    <div class="table-responsive">
      <table class="table table-bordered table-sm">
        <thead><tr><th>Dok. Pabean</th><th>Tanggal</th><th>${partnerHeader}</th><th>Jumlah</th><th>Satuan</th><th>Mata Uang</th><th>Nilai Barang</th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr><th colspan="3">Total</th><th>${isPemasukan ? "1,590" : "800"}</th><th colspan="3"></th></tr></tfoot>
      </table>
    </div>
  `);
}

function showModal(title, body) {
  document.getElementById("appModalTitle").textContent = title;
  document.getElementById("appModalBody").innerHTML = body;
  bootstrap.Modal.getOrCreateInstance(document.getElementById("appModal")).show();
}
