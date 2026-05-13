const routes = {
  "home": { title: "Home", file: "pages/home.html", crumb: ["Home"], init: initHome },
  "profile": { title: "Profile", file: "pages/profile.html", crumb: ["Profile"], init: initProfile },
  "ceisa": { title: "CEISA Submission", file: "pages/ceisa.html", crumb: ["CEISA Submission"], init: initCeisaList },
  "ceisa/new": { title: "New Submission", file: "pages/ceisa-new.html", crumb: ["CEISA Submission", "New Submission"], init: initCeisaNew },
  "ceisa/validation": { title: "Validation Result", file: "pages/ceisa-validation.html", crumb: ["CEISA Submission", "Validation Result"], init: initCeisaValidation },
  "ceisa/result": { title: "Submission Result", file: "pages/ceisa-result.html", crumb: ["CEISA Submission", "Submission Result"], init: initCeisaResult },
  "ceisa/detail": { title: "Submission Detail", file: "pages/ceisa-detail.html", crumb: ["CEISA Submission", "Submission Detail"], init: initCeisaDetail },
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
    const route = link.dataset.route;
    link.classList.toggle("active", route === key || (route === "ceisa" && key.startsWith("ceisa/")));
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

function initDataTable(tableId, rows, options = {}) {
  return $(`#${tableId}`).DataTable({
    data: rows,
    scrollX: true,
    pageLength: options.pageLength || 10,
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
}

function initCeisaList() {
  const rows = AppData.ceisa.submissions.map((item, index) => [
    index + 1,
    item.noAju,
    item.bcType,
    item.documentType,
    item.sapDocNum,
    item.businessPartner,
    item.nomorDaftar || "-",
    item.tanggalDaftar || "-",
    ceisaStatusBadge(item.statusCode, item.statusName),
    item.remarks,
    item.lastSync,
    ceisaListActions(item)
  ]);
  initDataTable("ceisaSubmissionTable", rows);
  initTooltips();
}

function initCeisaNew() {
  const rows = AppData.ceisa.eligibleDocuments.map((item, index) => [
    `<input class="form-check-input ceisa-doc-check" type="checkbox" value="${index}" ${index < 3 ? "checked" : ""}>`,
    item.documentType,
    item.docNo,
    item.postingDate,
    item.businessPartner,
    item.totalQty,
    item.totalAmount,
    item.currency,
    item.remarks,
    `<button class="btn btn-sm btn-outline-primary" onclick="showSapDocumentDetail(${index})"><i class="fa-solid fa-eye me-1"></i>View Detail Document</button>`
  ]);
  initDataTable("eligibleSapTable", rows);
  document.getElementById("validateSelectedBtn").addEventListener("click", () => {
    const checked = document.querySelectorAll(".ceisa-doc-check:checked").length;
    if (!checked) {
      alert("Please select at least one SAP document.");
      return;
    }
    location.hash = "#/ceisa/validation";
  });
}

function initCeisaValidation() {
  const docs = AppData.ceisa.eligibleDocuments;
  const successDocs = docs.filter((item) => item.valid);
  const errorDocs = docs.filter((item) => !item.valid);
  document.getElementById("totalSelected").textContent = docs.length;
  document.getElementById("validationSuccess").textContent = successDocs.length;
  document.getElementById("validationError").textContent = errorDocs.length;
  const successTable = initDataTable("validationSuccessTable", successDocs.map((item, index) => [
    index + 1,
    item.documentType,
    item.docNo,
    item.businessPartner,
    "JSON Schema Valid",
    "Ready to submit"
  ]), { pageLength: 5 });
  const errorTable = initDataTable("validationErrorTable", errorDocs.map((item, index) => [
    index + 1,
    item.documentType,
    item.docNo,
    item.businessPartner,
    item.error || "Missing mandatory field",
    item.remarks
  ]), { pageLength: 5 });
  document.querySelectorAll('[data-bs-toggle="tab"]').forEach((tab) => {
    tab.addEventListener("shown.bs.tab", () => {
      successTable.columns.adjust();
      errorTable.columns.adjust();
    });
  });
}

function initCeisaResult() {
  const successDocs = AppData.ceisa.eligibleDocuments.filter((item) => item.valid);
  document.getElementById("totalValidDocs").textContent = successDocs.length;
  document.getElementById("successSubmitted").textContent = successDocs.length;
  document.getElementById("failedSubmitted").textContent = "0";
  initDataTable("submissionResultTable", successDocs.map((item, index) => [
    index + 1,
    item.documentType,
    item.docNo,
    item.businessPartner,
    `AJU-DUMMY-${String(index + 1).padStart(4, "0")}`,
    `<span class="badge text-bg-success">Success</span>`,
    "Submitted to CEISA successfully"
  ]), { pageLength: 5 });
}

function initCeisaDetail() {
  const item = AppData.ceisa.submissions[0];
  document.querySelectorAll("[data-ceisa-field]").forEach((field) => {
    const key = field.dataset.ceisaField;
    field.innerHTML = key === "status"
      ? ceisaStatusBadge(item.statusCode, item.statusName)
      : (item[key] || "-");
  });
  const source = AppData.ceisa.eligibleDocuments[0];
  document.querySelectorAll("[data-source-field]").forEach((field) => {
    field.textContent = source[field.dataset.sourceField] || "-";
  });
  document.getElementById("ceisaItemDetailRows").innerHTML = AppData.ceisa.sapItems.map((row) => (
    `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td><td>${row[5]}</td><td>${row[6]}</td></tr>`
  )).join("");
}

function ceisaStatusBadge(code, name) {
  return `<span class="status-badge status-${code}">[${code}] ${name}</span>`;
}

function ceisaListActions(item) {
  const canDownload = item.pdfAvailable && (item.nomorDaftar || item.statusCode === "800");
  const download = canDownload
    ? `<button class="btn btn-sm btn-outline-secondary" onclick="alert('Dummy CEISA PDF download.')"><i class="fa-solid fa-file-pdf me-1"></i>Download CEISA PDF</button>`
    : `<button class="btn btn-sm btn-outline-secondary" disabled data-bs-toggle="tooltip" data-bs-title="PDF belum tersedia dari CEISA"><i class="fa-solid fa-file-pdf me-1"></i>Download CEISA PDF</button>`;
  return `<div class="d-flex gap-2"><a class="btn btn-sm btn-outline-primary" href="#/ceisa/detail"><i class="fa-solid fa-eye me-1"></i>View</a>${download}</div>`;
}

function initTooltips() {
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
    bootstrap.Tooltip.getOrCreateInstance(element);
  });
}

function showSapDocumentDetail(index) {
  const doc = AppData.ceisa.eligibleDocuments[index];
  const itemRows = AppData.ceisa.sapItems.map((row) => (
    `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`
  )).join("");
  showModal("SAP Document Detail", `
    <div class="detail-grid mb-3">
      <div class="detail-field"><span>Document Type</span><strong>${doc.documentType}</strong></div>
      <div class="detail-field"><span>Doc No</span><strong>${doc.docNo}</strong></div>
      <div class="detail-field"><span>Posting Date</span><strong>${doc.postingDate}</strong></div>
      <div class="detail-field"><span>Business Partner</span><strong>${doc.businessPartner}</strong></div>
      <div class="detail-field"><span>Warehouse</span><strong>${doc.warehouse}</strong></div>
      <div class="detail-field"><span>Currency</span><strong>${doc.currency}</strong></div>
      <div class="detail-field"><span>Total Amount</span><strong>${doc.totalAmount}</strong></div>
    </div>
    <div class="card-title-line"><h3>Item Lines</h3></div>
    <div class="table-responsive">
      <table class="table table-bordered table-sm compact-table">
        <thead><tr><th>Item Code</th><th>Item Name</th><th>Quantity</th><th>UoM</th><th>Unit Price</th><th>Line Total</th><th>Remarks</th></tr></thead>
        <tbody>${itemRows}</tbody>
      </table>
    </div>
  `);
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
