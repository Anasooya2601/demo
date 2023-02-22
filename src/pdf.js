import pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc =
  "//mozilla.github.io/pdf.js/build/pdf.worker.js";

const loadPdf = async (url) => {
  const loadingTask = pdfjs.getDocument(url);
  const pdf = await loadingTask.promise;
  return pdf;
};
const searchPdf = async (pdf, keywords) => {
  const results = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str).join("");
    if (text.includes(keywords)) {
      results.push({
        page: i,
        text
      });
    }
  }
  return results;
};
