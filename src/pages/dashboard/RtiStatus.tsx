import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { generatePdfFromElement } from '../../utils/pdfGenerator';
import { Download, Copy } from 'lucide-react';
import { useRtiContext } from '../../store/RtiContext';
import { CustomSelect } from '../../components/ui/CustomSelect';
import { ArrowLeft, CheckCircle, Clock, File, FileText, Upload, ChevronRight, Check } from 'lucide-react';

export const RtiStatus = () => {
  const { id } = useParams<{ id: string }>();
  const originalId = id?.replace(/-/g, '/');
  const { getApplicationById, updateApplicationStatus, addApplication } = useRtiContext();
  const app = originalId ? getApplicationById(originalId) : undefined;
  
  const [showAppealForm, setShowAppealForm] = useState(false);
  const [appealReason, setAppealReason] = useState('Incomplete or misleading information');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!app) {
    return <div className="p-12 text-center">Application not found</div>;
  }

  const timelineSteps = [
    { key: 'Submitted', label: 'Submitted' },
    { key: 'Received', label: 'Received' },
    { key: 'Under Process', label: 'Under Process' },
    { key: 'Response Due', label: 'Response' }
  ];

  // Helper to determine step status
  const getStepStatus = (stepKey: string, index: number) => {
    const hasPassed = app.timeline.some(t => {
       if (stepKey === 'Response Due') return ['Response Received', 'Closed'].includes(t.status);
       return t.status === stepKey || 
              (t.status === 'Response Received' && index < 3) ||
              (t.status === 'Under Process' && index < 2);
    });
    
    const isCurrent = app.status === stepKey || 
                      (stepKey === 'Response Due' && ['Response Received', 'Closed'].includes(app.status)) ||
                      (stepKey === 'Under Process' && ['Additional Fee Required', 'Supporting Document Requested', 'Transferred'].includes(app.status));
                      
    if (hasPassed) return 'completed';
    if (isCurrent && !hasPassed) return 'current';
    return 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Response Received': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'First Appeal Filed': return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Additional Fee Required':
      case 'Supporting Document Requested': return 'text-amber-700 bg-amber-50 border-amber-200';
      default: return 'text-blue-700 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex justify-between items-center mb-6">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to My RTIs
        </Link>
        <button 
          onClick={async () => {
            await generatePdfFromElement('app-copy-template', `Application_${app.id.replace(/\//g, '_')}.pdf`);
          }}
          className="flex items-center gap-2 text-sm text-[#06038D] font-medium hover:bg-blue-100 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" /> Download Application
        </button>
      </div>

      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{app.id}</h1>
            <div className="flex items-center ml-2">
              <button 
                onClick={() => handleCopy(app.id)}
                className={`p-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${copiedId === app.id ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:text-[#06038D] hover:bg-slate-100 cursor-pointer'}`}
                title="Copy Registration Number"
              >
                {copiedId === app.id ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
              {copiedId === app.id && (
                <span className="text-sm font-medium text-emerald-600 ml-2 animate-in fade-in slide-in-from-left-2 duration-200">
                  Copied successfully!
                </span>
              )}
            </div>
          </div>
          <p className="text-slate-600 mt-1 font-medium">{app.subject}</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className={`px-4 py-1.5 rounded-full border text-sm font-bold ${getStatusColor(app.status)}`}>
            {app.status}
          </div>        </div>
      </div>


      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 shadow-sm mb-8">
        
        {/* Visual Timeline */}
        <div className="relative mb-16 px-4 md:px-0">
           {/* Progress Bar (Desktop) */}
           <div className="absolute top-5 left-10 right-10 h-[2px] bg-slate-200 z-0 hidden md:block">
             <div 
               className="absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-500 ease-in-out"
               style={{ width: `${(timelineSteps.reduce((acc, step, idx) => ['completed', 'current'].includes(getStepStatus(step.key, idx)) ? idx : acc, 0) / (timelineSteps.length - 1)) * 100}%` }}
             ></div>
           </div>

           {/* Progress Bar (Mobile) */}
           <div className="absolute top-5 bottom-[10%] left-[35px] w-[2px] bg-slate-200 z-0 md:hidden">
             <div 
               className="absolute top-0 left-0 w-full bg-emerald-500 transition-all duration-500 ease-in-out"
               style={{ height: `${(timelineSteps.reduce((acc, step, idx) => ['completed', 'current'].includes(getStepStatus(step.key, idx)) ? idx : acc, 0) / (timelineSteps.length - 1)) * 100}%` }}
             ></div>
           </div>
               
           <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-0 relative">
             {timelineSteps.map((step, idx) => {
               const status = getStepStatus(step.key, idx);
               const isPast = status === 'completed';
               const isActive = status === 'current';
               const matchingEvent = app.timeline.find(t => 
                 t.status === step.key || 
                 (step.key === 'Response Due' && t.status === 'Response Received') ||
                 (step.key === 'Under Process' && ['Additional Fee Required', 'Supporting Document Requested'].includes(t.status) && idx === 2)
               );
                   
               return (
                 <div key={step.key} className="flex flex-row md:flex-col items-center gap-4 md:gap-3 z-10 bg-white md:bg-transparent">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-sm font-semibold shrink-0 transition-colors duration-300 ${
                     isPast ? 'bg-emerald-500 border-emerald-500 text-white' :
                     isActive ? 'bg-white border-emerald-500 text-emerald-600' :
                     'bg-white border-slate-300 text-slate-400'
                   }`}>
                     {isPast ? <Check size={18} /> : (idx + 1)}
                   </div>
                   <div className="text-left md:text-center bg-white md:bg-transparent py-1 pr-2">
                     <p className={`text-sm font-bold ${isActive || isPast ? 'text-slate-800' : 'text-slate-400'}`}>{step.label}</p>
                     {matchingEvent ? (
                       <p className="text-xs text-slate-500 mt-0.5 font-medium">{new Date(matchingEvent.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                     ) : (
                       <p className="text-xs text-slate-400 mt-0.5 font-medium">Pending</p>
                     )}
                   </div>
                 </div>
               );
             })}
           </div>
        </div>
        <hr className="border-slate-100 my-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Action / Context Area based on Status */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">What's happening?</h3>
            
            {app.status === 'Under Process' && (
              <p className="text-slate-600 leading-relaxed">
                Your application has been received by the Nodal Officer and forwarded to the concerned Central Public Information Officer (CPIO). They are currently gathering the requested information.
              </p>
            )}

            {app.status === 'Response Received' && (
              <div>
                <p className="text-slate-600 leading-relaxed mb-6">
                  The public authority has provided a response to your RTI request. Please review the documents attached.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Response from CPIO:</h4>
                  <p className="text-sm text-slate-700 italic">"{app.responses[0]?.text}"</p>
                  
                  {app.responses[0]?.documents.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {app.responses[0].documents.map(doc => (
                        <div key={doc} className="flex items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-lg min-w-0">
                          <div className="flex items-center gap-2 text-sm text-slate-700 flex-1 min-w-0">
                            <File className="w-4 h-4 text-blue-500 shrink-0" /> <span className="truncate">{doc}</span>
                            </div>
                        <button 
                          onClick={() => {
                            const element = document.createElement("a");
                            const file = new Blob(["Mock response document content for " + doc], {type: 'text/plain'});
                            element.href = URL.createObjectURL(file);
                            element.download = doc;
                            document.body.appendChild(element);
                            element.click();
                            document.body.removeChild(element);
                          }}
                          className="text-sm text-blue-600 font-medium hover:underline shrink-0"
                        >
                          Download
                        </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {showAppealForm && (
                  <div className="bg-white border border-[#06038D]/20 rounded-xl p-6 shadow-sm mt-4">
                    <h4 className="font-bold text-slate-900 mb-4">File First Appeal</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Appeal</label>
                        <CustomSelect
                          theme="navy"
                          name="appealReason"
                          value={appealReason}
                          onChange={(e: any) => setAppealReason(e.target.value)}
                          placeholder="Select Reason"
                          options={[
                            {label: 'Incomplete or misleading information', value: 'Incomplete or misleading information'},
                            {label: 'Information denied', value: 'Information denied'},
                            {label: 'No response within time limit', value: 'No response within time limit'},
                            {label: 'Excessive fee charged', value: 'Excessive fee charged'}
                          ]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Brief Description (Optional)</label>
                        <textarea className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-[#06038D] h-24 resize-none"></textarea>
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                        <button onClick={() => setShowAppealForm(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg">Cancel</button>
                        <button 
                          onClick={() => {
    updateApplicationStatus(app.id, 'Closed');
    const newAppealId = app.id.includes('/R/') ? app.id.replace('/R/', '/A/') : app.id + '-A';
    const newAppealApp = {
      ...app,
      id: newAppealId,
      dateSubmitted: new Date().toISOString(),
      status: 'First Appeal Filed' as const,
      subject: `First Appeal: ${app.subject}`,
      responses: [],
      timeline: [
        { status: 'First Appeal Filed' as const, date: new Date().toISOString(), description: `Appeal filed against ${app.id}.` }
      ]
    };
    addApplication(newAppealApp);
    setShowAppealForm(false);
  }}
                          className="px-6 py-2 bg-[#06038D] text-white font-medium rounded-lg hover:bg-[#06038D]/90 shadow-sm"
                        >
                          Submit Appeal
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {app.status === 'Closed' && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
                <p className="text-slate-600 leading-relaxed font-medium">
                  This application is now closed. If you filed an appeal, you can track the new appeal application separately from your dashboard.
                </p>
              </div>
            )}

            {app.status === 'First Appeal Filed' && (
              <p className="text-slate-600 leading-relaxed">
                Your First Appeal has been successfully registered and forwarded to the First Appellate Authority (FAA) of the department. A decision will be made within 30-45 days.
              </p>
            )}

            {app.status === 'Additional Fee Required' && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <p className="text-sm font-medium text-amber-800 mb-3">The CPIO has calculated that an additional fee is required to provide the documents (e.g., photocopying charges).</p>
                <div className="flex items-center justify-between p-3 bg-white border border-amber-100 rounded-lg mb-4">
                   <span className="text-sm font-semibold text-slate-700">Requested Amount:</span>
                   <span className="text-lg font-bold text-amber-600">₹45</span>
                </div>
                <button 
                  onClick={() => updateApplicationStatus(app.id, 'Under Process')}
                  className="w-full bg-[#06038D] hover:bg-[#06038D]/90 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm"
                >
                  Pay Additional Fee
                </button>
              </div>
            )}

          </div>

          {/* Quick Info Sidebar */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Application Details</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
               <div>
                 <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Public Authority</p>
                 <p className="text-sm font-semibold text-slate-900">{app.authority.name}</p>
                 <p className="text-xs text-slate-600">{app.authority.ministry}</p>
               </div>
               
               <hr className="border-slate-200" />
               
               <div>
                 <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Your Question</p>
                 <p className="text-sm text-slate-800 line-clamp-3 italic">"{app.question}"</p>
               </div>

               {app.documents.length > 0 && (
                 <>
                   <hr className="border-slate-200" />
                   <div>
                     <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Supporting Documents</p>
                     {app.documents.map(doc => (
                       <div key={doc} className="flex items-center justify-between gap-3 text-sm text-slate-700 bg-white p-3 rounded border border-slate-200 min-w-0">
                         <div className="flex items-center gap-2 flex-1 min-w-0">
                           <FileText className="w-4 h-4 text-emerald-500 shrink-0" /> 
                           <span className="font-medium text-slate-800 truncate">{doc}</span>
                         </div>
                         <button 
                           onClick={() => {
                             const element = document.createElement("a");
                             let url = "";
                             const foundData = app.documentsData?.find(d => d.name === doc);
                             if (foundData) {
                               url = foundData.dataUrl;
                             } else {
                               const file = new Blob(["Mock supporting document content for " + doc], {type: 'text/plain'});
                               url = URL.createObjectURL(file);
                             }
                             element.href = url;
                             element.download = doc;
                             document.body.appendChild(element);
                             element.click();
                             document.body.removeChild(element);
                           }}
                           className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                         >
                           <Download className="w-3 h-3" /> Download
                         </button>
                       </div>
                     ))}
                   </div>
                 </>
               )}
            </div>
          </div>

        </div>
      </div>
    
      {/* Hidden Templates for PDF Generation */}
      <div className="hidden">
        <div id="app-copy-template" className="w-[800px] bg-white p-12 text-slate-900 font-sans">
          <div className="border-b-2 border-[#06038D] pb-6 mb-8 text-center">
            <h1 className="text-3xl font-bold text-[#06038D] mb-2">RTI Application Form</h1>
            <p className="text-slate-600 font-medium">Under Right to Information Act, 2005</p>
          </div>
          
          <div className="flex justify-between items-center bg-slate-50 p-4 rounded-lg border border-slate-200 mb-8">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Registration No.</p>
              <p className="text-lg font-bold">{app.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Date of Filing</p>
              <p className="text-lg font-bold">{new Date(app.dateSubmitted).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-md font-bold text-slate-800 bg-slate-100 p-2 px-4 rounded mb-4">1. Applicant Details</h3>
            <div className="grid grid-cols-2 gap-4 px-4 text-sm">
              <div><span className="text-slate-500 block mb-1">Full Name</span> <span className="font-medium text-base">{app.applicant?.fullName || 'N/A'}</span></div>
              <div><span className="text-slate-500 block mb-1">Gender</span> <span className="font-medium text-base">{app.applicant?.gender || 'N/A'}</span></div>
              <div><span className="text-slate-500 block mb-1">Email ID</span> <span className="font-medium text-base">{app.applicant?.email || 'N/A'}</span></div>
              <div><span className="text-slate-500 block mb-1">Mobile No.</span> <span className="font-medium text-base">{app.applicant?.mobile || 'N/A'}</span></div>
              <div className="col-span-2"><span className="text-slate-500 block mb-1">Address</span> <span className="font-medium text-base">{app.applicant?.address || 'N/A'}, {app.applicant?.pinCode}, {app.applicant?.state}, {app.applicant?.country}</span></div>
              <div><span className="text-slate-500 block mb-1">Educational Status</span> <span className="font-medium text-base">{app.applicant?.educationalStatus || 'N/A'}</span></div>
              <div><span className="text-slate-500 block mb-1">Citizenship</span> <span className="font-medium text-base">Indian</span></div>
              <div><span className="text-slate-500 block mb-1">Is the applicant below poverty line?</span> <span className="font-medium text-base">{app.applicant?.isBpl ? 'Yes' : 'No'}</span></div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-md font-bold text-slate-800 bg-slate-100 p-2 px-4 rounded mb-4">2. Public Authority Details</h3>
            <div className="grid grid-cols-1 gap-4 px-4 text-sm">
              <div><span className="text-slate-500 block mb-1">Ministry/Department/Apex Body</span> <span className="font-medium text-base">{app.authority?.ministry || 'N/A'}</span></div>
              <div><span className="text-slate-500 block mb-1">Public Authority</span> <span className="font-medium text-base">{app.authority?.name || 'N/A'}</span></div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-md font-bold text-slate-800 bg-slate-100 p-2 px-4 rounded mb-4">3. Information Requested</h3>
            <div className="px-4 text-sm">
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 whitespace-pre-wrap font-medium">
                {app.question || 'N/A'}
              </div>
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
