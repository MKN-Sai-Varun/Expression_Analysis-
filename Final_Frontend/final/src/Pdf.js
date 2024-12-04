import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import './Pdf.css';

const Pdf = () => {
  const downloadPartialPDF = () => {
    const content = document.getElementById("pdf"); // Target specific element

    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4"); // Create PDF in portrait mode, A4 size

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight); // Add the canvas as an image
      pdf.save("analysis.pdf"); // Save the PDF
    });
  };

  return (
    <button onClick={downloadPartialPDF} style={{ marginTop: "20px" }}>
      <i className="fas fa-print"></i>
      Download Analysis as PDF
    </button>
  );
};

export default Pdf;
