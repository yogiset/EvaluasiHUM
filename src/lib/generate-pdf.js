import { jsPDF } from "jspdf";
import mainBg from "@/assets/pdf-bg.png";

export function generatePdf({
  nik,
  nama,
  divisi,
  jabatan,
  email,
  tanggal_masuk,
  masa_kerja,
  tingkatan,
  tanggal_evaluasi,
  hasilEvaluasi,
  perluDitingkatkan,
}) {
  const img = new Image();
  img.src = mainBg; // Use the imported image

  const doc = new jsPDF();

  doc.addImage(
    img,
    "PNG",
    0,
    0,
    doc.internal.pageSize.width,
    doc.internal.pageSize.height
  );

  // User info
  doc.setFontSize(14).setFont(undefined, "bold");
  doc.text("NIK: " + nik, 10, 80, {
    maxWidth: doc.internal.pageSize.width - 10,
  });
  doc.text("Nama: " + nama, 10, 87, {
    maxWidth: doc.internal.pageSize.width - 10,
  });
  doc.text("Divisi: " + divisi, 10, 94, {
    maxWidth: doc.internal.pageSize.width - 10,
  });
  doc.text("Jabatan: " + jabatan, 10, 101, {
    maxWidth: doc.internal.pageSize.width - 10,
  });
  doc.text("Email: " + email, 10, 108, {
    maxWidth: doc.internal.pageSize.width - 10,
  });
  doc.text("Tanggal Masuk: " + tanggal_masuk, 10, 115, {
    maxWidth: doc.internal.pageSize.width - 10,
  });
  doc.text("Masa kerja: " + masa_kerja, 10, 122, {
    maxWidth: doc.internal.pageSize.width - 10,
  });
  doc.text("Tingkatan: " + tingkatan, 10, 129, {
    maxWidth: doc.internal.pageSize.width - 10,
  });
  doc.text("Tanggal Evaluasi: " + tanggal_evaluasi, 10, 136, {
    maxWidth: doc.internal.pageSize.width - 10,
  });

  // Evaluation result
  doc.setFontSize(14).setFont(undefined, "bold");
  doc.text("Hasil evaluasi:", 10, 150);
  doc.setFontSize(12).setFont(undefined, "normal");
  doc.text(hasilEvaluasi, 10, 157, {
    maxWidth: doc.internal.pageSize.width - 10,
    lineHeightFactor: 1.5,
  });

  // Improvement
  doc.setFontSize(14).setFont(undefined, "bold");
  doc.text("Perlu ditingkatkan:", 10, 171);
  doc.setFontSize(12).setFont(undefined, "normal");
  doc.text(perluDitingkatkan, 10, 178, {
    maxWidth: doc.internal.pageSize.width - 20,
    lineHeightFactor: 1.5,
  });

  doc.save(nama + " evaluation");
}
