import React from 'react';
import { BookOpen, FileText, Scale, Info, ArrowRight, Search, CheckCircle, HelpCircle, Check } from 'lucide-react';

export const LearnRti = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">Learn about RTI</h1>
        <p className="text-xl text-slate-600">The Right to Information Act, 2005 empowers citizens, promotes transparency, and makes our democracy work for the people.</p>
      </div>

      <div className="space-y-12">
        {/* Section 1 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-xl shrink-0 mt-1">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">What is RTI?</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                The Right to Information (RTI) is an act of the Parliament of India which sets out the rules and procedures regarding citizens' right to information. It replaced the former Freedom of Information Act, 2002.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                Under the provisions of the Act, any citizen of India may request information from a "public authority" (a body of Government or "instrumentality of State") which is required to reply expeditiously or within thirty days.
              </p>
              <div className="bg-slate-50 border-l-4 border-blue-500 p-4 rounded-r-lg mt-6">
                <p className="text-sm text-slate-700 font-medium">"Information is the currency of democracy."</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1.5 - How it Works */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-emerald-100 p-3 rounded-xl shrink-0 mt-1">
              <HelpCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="w-full">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">How RTI Works</h2>
              
              <div className="relative w-full mb-4">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 hidden md:block"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 text-center">
                   {[
                     { step: '1', title: 'Ask', desc: 'You have a question', icon: <FileText className="w-6 h-6" />, color: 'text-blue-600 bg-blue-50 border-blue-200' },
                     { step: '2', title: 'Submit', desc: 'File your RTI application', icon: <ArrowRight className="w-6 h-6" />, color: 'text-orange-600 bg-orange-50 border-orange-200' },
                     { step: '3', title: 'Receive', desc: 'Authority receives & processes', icon: <Search className="w-6 h-6" />, color: 'text-slate-600 bg-slate-50 border-slate-200' },
                     { step: '4', title: 'Response', desc: 'Get info within 30 days', icon: <Check className="w-6 h-6 stroke-[3]" />, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                     { step: '5', title: 'Appeal', desc: 'Not satisfied? You can appeal', icon: <Scale className="w-6 h-6" />, color: 'text-purple-600 bg-purple-50 border-purple-200' },
                   ].map((s, i) => (
                     <div key={i} className="flex flex-col items-center bg-white p-2">
                       <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center mb-3 bg-white relative z-10 ${s.color}`}>
                         {s.icon}
                       </div>
                       <h4 className="font-bold text-slate-900 text-sm mb-1">{s.step}. {s.title}</h4>
                       <p className="text-xs text-slate-500 leading-snug">{s.desc}</p>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-orange-100 p-3 rounded-xl shrink-0 mt-1">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">What can you ask?</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                You can ask for any information that is held by a public authority or is under its control. This includes:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-700 mb-6">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div> Records and documents</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div> Memos and emails</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div> Opinions and advices (if on record)</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div> Press releases and circulars</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div> Logbooks and contracts</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div> Data material held in electronic form</li>
              </ul>
              
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <h3 className="text-sm font-bold text-red-800 mb-2">What is Exempt? (Section 8)</h3>
                <p className="text-xs text-red-700 leading-relaxed">
                  Information affecting national security, strategic interests, foreign relations, cabinet papers, trade secrets, and personal information which has no relationship to any public activity or interest are generally exempt from disclosure.
                </p>
              </div>
            </div>
          </div>
        </div>

        
        {/* Detailed RTI Flow Process */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-xl shrink-0 mt-1">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="w-full">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">RTI Request Flow & Appeals Process</h2>
              
              <div className="space-y-6">
                
                {/* Stage 1: Initial Request */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-bold text-slate-800">
                    Stage 1: Initial RTI Request
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                        <h4 className="font-bold text-emerald-800 mb-2">Reply Received</h4>
                        <p className="text-xs text-emerald-700 mb-2">Within 30 Days.</p>
                        <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1">
                          <li>If <span className="font-semibold">Satisfied</span>: Process Ends.</li>
                          <li>If <span className="font-semibold">Not Satisfied</span>: File First Appeal within 30 Days.</li>
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-bold text-blue-800 mb-2">Transferred</h4>
                        <p className="text-xs text-blue-700 mb-2">Within 5 Days.</p>
                        <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1">
                          <li><span className="font-semibold">Reply (30 Days)</span>: If Satisfied, End. If Not Satisfied, First Appeal within 30 Days.</li>
                          <li><span className="font-semibold">No Reply (30 Days)</span>: First Appeal within 30 Days.</li>
                        </ul>
                      </div>
                      
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <h4 className="font-bold text-orange-800 mb-2">No Reply Received</h4>
                        <p className="text-xs text-orange-700 mb-2">Within 30 Days.</p>
                        <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1">
                          <li>File <span className="font-semibold">First Appeal</span> within 30 Days.</li>
                          <li><span className="font-bold">AND/OR</span></li>
                          <li>File <span className="font-semibold">Section 18 Complaint</span> to CIC (No time limit).</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stage 2: First Appeal */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-bold text-slate-800">
                    Stage 2: First Appeal Stage
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <h4 className="font-bold text-purple-800 mb-2">Decision Reached</h4>
                        <p className="text-xs text-purple-700 mb-2">Within 45 Days.</p>
                        <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1">
                          <li>If <span className="font-semibold">Satisfied</span>: Process Ends.</li>
                          <li>If <span className="font-semibold">Not Satisfied</span>: File Second Appeal to CIC / SIC within 90 Days.</li>
                        </ul>
                      </div>
                      
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="font-bold text-red-800 mb-2">No Decision Reached</h4>
                        <p className="text-xs text-red-700 mb-2">After 45 Days.</p>
                        <ul className="text-xs text-slate-600 list-disc pl-4 space-y-1">
                          <li>File <span className="font-semibold">Second Appeal</span> to CIC / SIC after an additional 90 Days.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
