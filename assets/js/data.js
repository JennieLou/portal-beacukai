const AppData = {
  currentUser: {
    employeeId: "EMP-BC-0001",
    employeeCode: "BC-01",
    firstName: "Bea",
    lastName: "Cukai User",
    username: "BC-USER-01"
  },
  warehouses: [
    "JP-FG002 - JEPARA - FINISHED GOODS (NON KABER)",
    "JP-MT002 - JEPARA - MATERIAL (NON KABER)",
    "JP-SF002 - JEPARA - SEMI FINISHED GOODS (NON KABER)",
    "JP-WP002 - JEPARA - WIP (NON KABER)"
  ],
  authorizations: [
    "Pemasukan Barang",
    "Pengeluaran Barang",
    "Mutasi Barang Bahan Baku",
    "Mutasi Barang Jadi",
    "Mutasi Scrap",
    "Posisi WIP",
    "Mutasi Barang Modal dan Barang Lain",
    "Log History User"
  ].map((name) => ({ name, access: "View, Export" })),
  reports: {
    pemasukanBarang: [
      ["1", "BC 2.3", "AJU-230001", "000123/BC/2026", "2026-05-01", "GRPO-260501", "2026-05-01", "PT Sumber Material Nusantara", "RM-FAB-001", "Fabric Cotton Twill", "MTR", "1,250", "USD", "8,750.00"],
      ["2", "BC 4.0", "AJU-400114", "000782/BC/2026", "2026-05-03", "GRPO-260533", "2026-05-03", "PT Kimia Tekstil Jaya", "RM-DYE-014", "Reactive Dye Navy", "KG", "340", "IDR", "42,500,000"],
      ["3", "BC 2.7", "AJU-270088", "000991/BC/2026", "2026-05-05", "GRPO-260552", "2026-05-05", "CV Packing Prima", "PM-BOX-022", "Export Carton Box", "PCS", "6,000", "IDR", "18,900,000"]
    ],
    pengeluaranBarang: [
      ["1", "BC 2.5", "AJU-250077", "001102/BC/2026", "2026-05-02", "DLV-260512", "2026-05-02", "Global Apparel Pte Ltd", "FG-SHIRT-100", "Men Shirt Oxford", "PCS", "480", "USD", "6,240.00", "trace"],
      ["2", "BC 4.1", "AJU-410041", "001210/BC/2026", "2026-05-06", "DLV-260566", "2026-05-06", "PT Retail Sandang Indonesia", "FG-PANT-220", "Chino Pants Khaki", "PCS", "320", "IDR", "86,400,000", "trace"],
      ["3", "BC 2.7", "AJU-270097", "001325/BC/2026", "2026-05-09", "DLV-260591", "2026-05-09", "Kawasan Berikat Mitra", "SF-CUT-030", "Cut Panel Set", "SET", "700", "IDR", "31,500,000", "trace"]
    ],
    mutasiBahanBaku: [
      ["1", "RM-FAB-001", "Fabric Cotton Twill", "MTR", "4,000", "1,250", "1,700", "0", "3,550", "3,540", "-10", "Selisih minor opname"],
      ["2", "RM-DYE-014", "Reactive Dye Navy", "KG", "890", "340", "215", "0", "1,015", "1,015", "0", "Sesuai"],
      ["3", "PM-BOX-022", "Export Carton Box", "PCS", "9,000", "6,000", "4,200", "50", "10,850", "10,850", "0", "Sesuai"]
    ],
    mutasiBarangJadi: [
      ["1", "FG-SHIRT-100", "Men Shirt Oxford", "PCS", "1,120", "610", "480", "0", "1,250", "1,250", "0", "Sesuai"],
      ["2", "FG-PANT-220", "Chino Pants Khaki", "PCS", "870", "420", "320", "0", "970", "965", "-5", "Perlu verifikasi"],
      ["3", "FG-JACKET-330", "Work Jacket Navy", "PCS", "240", "160", "0", "0", "400", "400", "0", "Sesuai"]
    ],
    mutasiScrap: [
      ["1", "SC-FAB-001", "Scrap Fabric Mixed", "KG", "210", "42", "70", "0", "182", "182", "0", "Sesuai"],
      ["2", "SC-PACK-002", "Scrap Carton", "KG", "95", "18", "30", "0", "83", "80", "-3", "Selisih opname"]
    ],
    posisiWip: [
      ["1", "WIP-260501-01", "SF-CUT-030", "Cut Panel Set", "SET", "700", "Warehouse JP-WP002"],
      ["2", "WIP-260503-02", "SF-SEW-044", "Sewing Assembly", "PCS", "360", "Line sewing in process"],
      ["3", "WIP-260508-03", "SF-WASH-011", "Garment Washing Batch", "BATCH", "12", "Waiting QC"]
    ],
    mutasiBarangModal: [
      ["1", "AST-SEW-100", "High Speed Sewing Machine", "UNIT", "24", "0", "0", "0", "24", "24", "0", "Aktif"],
      ["2", "AST-CUT-020", "Auto Cutting Machine", "UNIT", "2", "1", "0", "0", "3", "3", "0", "Penambahan investasi"],
      ["3", "OTH-RACK-018", "Storage Rack Heavy Duty", "UNIT", "80", "0", "4", "0", "76", "76", "0", "Transfer lokasi"]
    ],
    logHistoryUser: [
      ["1", "2026-05-13 08:02:11", "BC-USER-01", "Bea Cukai User", "Login Success", "10.10.1.24"],
      ["2", "2026-05-13 08:45:19", "BC-USER-01", "Bea Cukai User", "Export Pemasukan Barang", "10.10.1.24"],
      ["3", "2026-05-12 17:14:02", "BC-USER-02", "Supervisor BC", "Logout", "10.10.1.31"],
      ["4", "2026-05-12 07:58:43", "BC-USER-03", "Audit BC", "Login Failed", "10.10.1.44"]
    ]
  },
  modalRows: {
    pemasukan: [
      ["BC 2.3 - 000123/BC/2026", "2026-05-01", "PT Sumber Material Nusantara", "1,250", "MTR", "USD", "8,750.00"],
      ["BC 4.0 - 000782/BC/2026", "2026-05-03", "PT Kimia Tekstil Jaya", "340", "KG", "IDR", "42,500,000"]
    ],
    pengeluaran: [
      ["BC 2.5 - 001102/BC/2026", "2026-05-02", "Global Apparel Pte Ltd", "480", "PCS", "USD", "6,240.00"],
      ["BC 4.1 - 001210/BC/2026", "2026-05-06", "PT Retail Sandang Indonesia", "320", "PCS", "IDR", "86,400,000"]
    ]
  }
};
