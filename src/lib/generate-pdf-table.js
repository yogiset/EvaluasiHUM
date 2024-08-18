import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import mainBg from "@/assets/pdf-bg.png";
import plainBg from "@/assets/plain-pdf-bg.png";

const firstPageBackground = new Image();
const subsequentPageBackground = new Image();
firstPageBackground.src = mainBg; // Use the imported image
subsequentPageBackground.src = plainBg; // Use the imported image

export const generatePDFTable = (data, columns, docName) => {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  autoTable(doc, {
    styles: { halign: "center" },
    theme: "grid",
    head: [columns], // Dynamic columns
    headStyles: {
      fillColor: "#bae6fd",
      textColor: "black",
      lineWidth: 0.2,
      lineColor: "#a1a1aa",
    },
    body: data,
    columnStyles: {
      1: { halign: "left" },
    },
    margin: { top: 15, bottom: 30 },
    startY: 80,
    willDrawPage: () => {
      const pageCount = doc.internal.getNumberOfPages();

      // Add different background images based on the page number
      if (pageCount === 1) {
        doc.addImage(firstPageBackground, "PNG", 0, 0, pageWidth, pageHeight);
      } else {
        doc.addImage(
          subsequentPageBackground,
          "PNG",
          0,
          0,
          pageWidth,
          pageHeight
        );
      }
    },
  });

  doc.save(`${docName}.pdf`);
};
