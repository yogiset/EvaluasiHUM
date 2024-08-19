import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import mainBg from "@/assets/pdf-bg2.png";
import plainBg from "@/assets/plain-pdf-bg2.png";

const firstPageBackground = new Image();
const subsequentPageBackground = new Image();
firstPageBackground.src = mainBg;
subsequentPageBackground.src = plainBg;

export const generatePDFTable = (data, columns, docName) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
    compress: true,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  autoTable(doc, {
    styles: { halign: "center", fontSize: 10 },
    theme: "grid",
    head: [columns],
    headStyles: {
      fillColor: "#bae6fd",
      textColor: "black",
      lineWidth: 0.1,
      lineColor: "#a1a1aa",
    },
    body: data,
    columnStyles: {
      1: { halign: "left" },
    },
    margin: { top: 15, bottom: 80 },
    startY: 210, 
    willDrawPage: () => {
      const pageCount = doc.internal.getNumberOfPages();

      // Add the background image
      if (pageCount === 1) {
        doc.addImage(firstPageBackground, "PNG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
      } else {
        doc.addImage(subsequentPageBackground, "PNG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
      }
    },
  });

  doc.save(`${docName}.pdf`);
};
