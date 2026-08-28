import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

export const generatePdfFromElement = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.position = 'fixed';
  clone.style.top = '0';
  clone.style.left = '0';
  clone.style.zIndex = '-9999';
  clone.style.width = '800px';
  clone.style.backgroundColor = '#ffffff';
  clone.style.setProperty('display', 'block', 'important');
  clone.classList.remove('hidden');
  document.body.appendChild(clone);
  
  try {
    const dataUrl = await toPng(clone, { 
      pixelRatio: 2, 
      backgroundColor: '#ffffff'
    });
    
    // Calculate dimensions from the clone element directly instead of a canvas
    const rect = clone.getBoundingClientRect();
    const width = rect.width * 2;
    const height = rect.height * 2;
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (height * pdfWidth) / width;
    
    if (pdfHeight > 297) {
       let heightLeft = pdfHeight;
       let position = 0;
       
       pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
       heightLeft -= 297;
       
       while (heightLeft >= 0) {
         position = heightLeft - pdfHeight;
         pdf.addPage();
         pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
         heightLeft -= 297;
       }
    } else {
       pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
    }
    
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    document.body.removeChild(clone);
  }
};
