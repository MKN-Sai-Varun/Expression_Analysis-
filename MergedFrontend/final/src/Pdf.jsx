import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import images from "./image.js";
const Pdf = () => {
  const downloadPartialPDF = () => {
    const content = document.getElementById("pdfpart"); // Target specific element

    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4"); // Create PDF in portrait mode, A4 size

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight); // Add the canvas as an image
      pdf.save("Analysis.pdf"); // Save the PDF
    });
  };

  return (
    <button type="button" className="Download"><span>Download PDF</span><img src={images.Download} style={{height:"100%"}}></img></button>
    // <button onClick={downloadPartialPDF} type="button" class="btn btn-primary">
    //   <i className="fas fa-print"></i>
    //   PDF
    // </button>
  );
};

export default Pdf;