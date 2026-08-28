import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Upload, X, File, AlertTriangle } from 'lucide-react';
import { RtiDraft } from '../../../types';

interface Props {
  draft: RtiDraft;
  updateDraft: (data: Partial<RtiDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step4Request = ({ draft, updateDraft, onNext, onBack }: Props) => {
  const [file, setFile] = useState<{ name: string, type: string, dataUrl: string, size: number } | null>(draft.supportingDocument);
  const [text, setText] = useState(draft.question || '');
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setFileError('Supporting document should be in PDF format.');
        return;
      }
      if (selectedFile.size > 1024 * 1024) {
        setFileError('Supporting document size must be upto 1MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setFile({
          name: selectedFile.name,
          type: selectedFile.type,
          dataUrl: event.target?.result as string,
          size: selectedFile.size
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleBack = () => {
    updateDraft({ question: text, supportingDocument: file });
    onBack();
  };
    useEffect(() => {
    updateDraft({ question: text, supportingDocument: file });
  }, [text, file]);
  const handleNext = () => {
    updateDraft({ question: text, supportingDocument: file });
    onNext();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">RTI Request Details</h2>
        <p className="text-slate-600 mt-2">Confirm your request and add supporting documents if needed.</p>
        <p className="text-slate-600 text-sm mt-1">All fields marked with * are mandatory.</p>
      </div>

      <form id="step4form" onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="flex-grow space-y-6">
        
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2">What information do you want? *</h3>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="E.g., I would like to know how much money was allocated for scholarships under the Post Matric Scholarship Scheme in Rajasthan for the financial year 2024-25..."
            className="w-full h-48 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none text-slate-700 bg-white"
            maxLength={3000}
            required
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-slate-500">Be as specific as possible</span>
            <span className={`text-xs font-medium ${text.length > 2900 ? 'text-orange-500' : 'text-slate-500'}`}>
              {text.length} / 3000 characters
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Supporting Document (Optional)</h3>
          <p className="text-sm text-slate-500 mb-4">Upload any supporting document (PDF only, max 1MB).</p>
          
          {draft.applicant?.isBpl && (
             <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex gap-3 text-sm text-emerald-800">
                <p>No RTI fee is required to be paid by any citizen who is below poverty line as per RTI Rules, 2012. Please upload a valid BPL Certificate (Optional for this mock website).</p>
             </div>
          )}

          <div className="flex items-center gap-4">
            <input 
              type="file" 
              id="requestDoc"
              ref={fileInputRef} 
              accept=".pdf" 
              className="hidden" 
              onChange={handleFileChange} 
            />
            <label 
              htmlFor="requestDoc" 
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors"
            >
              <Upload className="w-4 h-4" /> Choose File
            </label>
            <div className="flex flex-col">
              <span className="text-sm text-slate-500">
                {file ? file.name : 'No file chosen'}
              </span>
              {fileError && <p className="text-xs text-red-500 mt-1 font-medium">{fileError}</p>}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-6">
           <h4 className="font-semibold text-slate-700 text-sm mb-2">Important Guidelines</h4>
           <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
              <li>File name should not contain blank spaces.</li>
              <li>Do not upload Aadhaar, PAN or other personal ID documents (Except BPL Card for fee exemption).</li>
           </ul>
        </div>

      </form>
      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between">
        <button onClick={handleBack} type="button" className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button 
           
          type="submit"
          form="step4form"
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
        >
          Save & Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
