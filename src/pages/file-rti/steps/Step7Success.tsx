import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Copy, Download, ArrowRight } from 'lucide-react';
import { RtiDraft } from '../../../types';
import jsPDF from 'jspdf';


import { generatePdfFromElement } from '../../../utils/pdfGenerator';

interface Props {

  draft: RtiDraft;
  registrationId: string;
}

export const Step7Success = ({ draft, registrationId }: Props) => {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const date = new Date().toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(registrationId);
    setCopiedId(registrationId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadApplication = async () => {
    await generatePdfFromElement('application-template', `RTI_Application_${registrationId}.pdf`);
  };

  const handleDownloadReceipt = async () => {
    await generatePdfFromElement('receipt-template', `RTI_Receipt_${registrationId}.pdf`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-8">
      
      <div className="relative mb-8 w-24 h-24 mx-auto">
         <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-70"></div>
         <div className="absolute inset-0 bg-emerald-500 rounded-full flex items-center justify-center z-10 shadow-lg shadow-emerald-500/30">
           <Check className="w-12 h-12 text-white stroke-[3]" />
         </div>
      </div>
      
      <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Application Submitted!</h2>
      <p className="text-slate-600 mb-8 max-w-md">Your RTI application has been successfully submitted to the respective Public Authority.</p>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 w-full max-w-md text-left relative overflow-hidden">
         <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
         
         <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Registration Number</p>
         <div className="flex items-start sm:items-center justify-between mb-6 gap-4">
           <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-wider break-all flex-1 min-w-0">{registrationId}</span>
           <div className="flex items-center gap-2 mt-1 sm:mt-0">
             <button 
                onClick={copyToClipboard}
                className={`p-1.5 rounded-md transition-all flex items-center justify-center gap-1.5 flex-shrink-0 ${copiedId === registrationId ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:text-[#06038D] hover:bg-slate-100 cursor-pointer'}`}
                title="Copy Registration Number"
              >
                {copiedId === registrationId ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
              {copiedId === registrationId && (
                <span className="text-xs font-medium text-emerald-600 animate-in fade-in slide-in-from-left-2 duration-200">
                  Copied!
                </span>
              )}
           </div>
         </div>

         <div className="space-y-4 text-sm">
           <div>
             <p className="text-slate-500">Date & Time</p>
             <p className="font-medium text-slate-900">{date}</p>
           </div>
           <div>
             <p className="text-slate-500">Public Authority</p>
             <p className="font-medium text-slate-900">{draft.authority?.name}</p>
             <p className="text-slate-600">{draft.authority?.ministry}</p>
           </div>
         </div>
      </div>

      
      <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button 
          onClick={handleDownloadApplication}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Download className="w-4 h-4" /> Download Application
        </button>
        <button 
          onClick={handleDownloadReceipt}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Download className="w-4 h-4" /> Download Receipt
        </button>
      </div>
      <div className="mt-4 w-full max-w-md">
        <button 
          onClick={() => {
            sessionStorage.removeItem('rti_wizard_draft');
            sessionStorage.removeItem('rti_wizard_step');
            sessionStorage.removeItem('rti_wizard_guidelines');
            sessionStorage.removeItem('rti_wizard_mob_verified');
            sessionStorage.removeItem('rti_wizard_email_verified');
            navigate('/dashboard');
          }}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors shadow-md"
        >
          Go to My RTIs <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Hidden Templates for PDF Generation */}
      <div className="hidden">
        {/* Receipt Template */}
        <div id="receipt-template" className="w-[800px] bg-white p-12 text-slate-900 font-sans">
          <div className="border-b-2 border-orange-500 pb-6 mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-[#06038D] mb-1">RTI Application Receipt</h1>
              <p className="text-slate-500 font-medium">Government of India - RTI Online Portal</p>
            </div>
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <p className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-1">Registration Number</p>
              <p className="text-2xl font-bold text-slate-900">{registrationId}</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <p className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-1">Date of Filing</p>
              <p className="text-xl font-bold text-slate-900">{date}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-emerald-700 border-b border-emerald-100 pb-2 mb-4">Applicant Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-slate-500">Name:</span> <span className="font-medium">{draft.applicant?.fullName || 'N/A'}</span></div>
              <div><span className="text-slate-500">Email:</span> <span className="font-medium">{draft.applicant?.email || 'N/A'}</span></div>
              <div><span className="text-slate-500">Mobile:</span> <span className="font-medium">{draft.applicant?.mobile || 'N/A'}</span></div>
              <div><span className="text-slate-500">BPL Status:</span> <span className="font-medium">{draft.applicant?.isBpl ? 'Yes (Exempt)' : 'No (Paid)'}</span></div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-blue-700 border-b border-blue-100 pb-2 mb-4">Public Authority Details</h3>
            <div className="grid grid-cols-1 gap-4">
              <div><span className="text-slate-500">Ministry/Department:</span> <span className="font-medium">{draft.authority?.ministry || 'N/A'}</span></div>
              <div><span className="text-slate-500">Public Authority:</span> <span className="font-medium">{draft.authority?.name || 'N/A'}</span></div>
            </div>
          </div>
          
          <div className="text-center mt-12 text-sm text-slate-500">
            <p>This is a computer-generated receipt and does not require a signature.</p>
          </div>
        </div>

        {/* Application Template */}
        <div id="application-template" className="w-[800px] bg-white p-12 text-slate-900 font-sans">
          <div className="border-b-2 border-[#06038D] pb-6 mb-8 text-center">
            <h1 className="text-3xl font-bold text-[#06038D] mb-2">RTI Application Form</h1>
            <p className="text-slate-600 font-medium">Under Right to Information Act, 2005</p>
          </div>
          
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-200 mb-8">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Registration No.</p>
              <p className="text-lg font-bold">{registrationId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Date of Filing</p>
              <p className="text-lg font-bold">{date}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-md font-bold text-slate-800 bg-slate-100 p-2 px-4 rounded mb-4">1. Applicant Details</h3>
            <div className="grid grid-cols-2 gap-4 px-4 text-sm">
              <div><span className="text-slate-500 block mb-1">Full Name</span> <span className="font-medium text-base">{draft.applicant?.fullName || 'N/A'}</span></div>
              <div><span className="text-slate-500 block mb-1">Gender</span> <span className="font-medium text-base">{draft.applicant?.gender || 'N/A'}</span></div>
              <div><span className="text-slate-500 block mb-1">Email ID</span> <span className="font-medium text-base">{draft.applicant?.email || 'N/A'}</span></div>
              <div><span className="text-slate-500 block mb-1">Mobile No.</span> <span className="font-medium text-base">{draft.applicant?.mobile || 'N/A'}</span></div>
              <div className="col-span-2"><span className="text-slate-500 block mb-1">Address</span> <span className="font-medium text-base">{draft.applicant?.address || 'N/A'}, {draft.applicant?.pinCode}, {draft.applicant?.state}, {draft.applicant?.country}</span></div>
              <div><span className="text-slate-500 block mb-1">Educational Status</span> <span className="font-medium text-base">{draft.applicant?.educationalStatus || 'N/A'}</span></div>
              <div><span className="text-slate-500 block mb-1">Citizenship</span> <span className="font-medium text-base">Indian</span></div>
              <div><span className="text-slate-500 block mb-1">Is the applicant below poverty line?</span> <span className="font-medium text-base">{draft.applicant?.isBpl ? 'Yes' : 'No'}</span></div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-md font-bold text-slate-800 bg-slate-100 p-2 px-4 rounded mb-4">2. Public Authority Details</h3>
            <div className="grid grid-cols-1 gap-4 px-4 text-sm">
              <div><span className="text-slate-500 block mb-1">Ministry/Department/Apex Body</span> <span className="font-medium text-base">{draft.authority?.ministry || 'N/A'}</span></div>
              <div><span className="text-slate-500 block mb-1">Public Authority</span> <span className="font-medium text-base">{draft.authority?.name || 'N/A'}</span></div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-md font-bold text-slate-800 bg-slate-100 p-2 px-4 rounded mb-4">3. Information Requested</h3>
            <div className="px-4 text-sm">
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 whitespace-pre-wrap font-medium">
                {draft.question || 'N/A'}
              </div>
              {draft.supportingDocument && (
                <div className="mt-4 text-slate-600">
                  <span className="font-bold">Supporting Document Attached:</span> Yes
                </div>
              )}
            </div>
          </div>
          
          <div className="text-center mt-12 text-sm text-slate-500 border-t border-slate-200 pt-6">
            <p>This application was electronically filed on the RTI Online Portal.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

