import React, { useState, useEffect, useRef } from 'react';
import { Search, Building2, CheckCircle, ArrowRight, ChevronDown } from 'lucide-react';
import { RtiDraft, PublicAuthority } from '../../../types';

interface Props {
  draft: RtiDraft;
  updateDraft: (data: Partial<RtiDraft>) => void;
  onNext: () => void;
  onBack: () => void;
}

const allAuthorities: PublicAuthority[] = [
  {
    "id": "1",
    "name": "National Centre for Good Governance (NCGG)",
    "ministry": "Department of Administrative Reforms & PG",
    "department": "Department of Administrative Reforms & PG",
    "category": "General"
  },
  {
    "id": "2",
    "name": "Department of Administrative Reforms and Public Grievances (Main)",
    "ministry": "Department of Administrative Reforms & PG",
    "department": "Department of Administrative Reforms & PG",
    "category": "General"
  },
  {
    "id": "3",
    "name": "Indian Council of Agricultural Research (ICAR)",
    "ministry": "Department of Agricultural Research & Education",
    "department": "Department of Agricultural Research & Education",
    "category": "General"
  },
  {
    "id": "4",
    "name": "Central Agricultural University (CAU)",
    "ministry": "Department of Agricultural Research & Education",
    "department": "Department of Agricultural Research & Education",
    "category": "General"
  },
  {
    "id": "5",
    "name": "Commission for Agricultural Costs and Prices (CACP)",
    "ministry": "Department of Agriculture, Cooperation & Farmers Welfare",
    "department": "Department of Agriculture, Cooperation & Farmers Welfare",
    "category": "General"
  },
  {
    "id": "6",
    "name": "National Cooperative Development Corporation (NCDC)",
    "ministry": "Department of Agriculture, Cooperation & Farmers Welfare",
    "department": "Department of Agriculture, Cooperation & Farmers Welfare",
    "category": "General"
  },
  {
    "id": "7",
    "name": "National Dairy Development Board (NDDB)",
    "ministry": "Department of Animal Husbandry, Dairying and Fisheries",
    "department": "Department of Animal Husbandry, Dairying and Fisheries",
    "category": "General"
  },
  {
    "id": "8",
    "name": "Fishery Survey of India",
    "ministry": "Department of Animal Husbandry, Dairying and Fisheries",
    "department": "Department of Animal Husbandry, Dairying and Fisheries",
    "category": "General"
  },
  {
    "id": "9",
    "name": "Bhabha Atomic Research Centre (BARC)",
    "ministry": "Department of Atomic Energy",
    "department": "Department of Atomic Energy",
    "category": "General"
  },
  {
    "id": "10",
    "name": "Nuclear Power Corporation of India Limited (NPCIL)",
    "ministry": "Department of Atomic Energy",
    "department": "Department of Atomic Energy",
    "category": "General"
  },
  {
    "id": "11",
    "name": "National Institute of Immunology (NII)",
    "ministry": "Department of Bio-Technology",
    "department": "Department of Bio-Technology",
    "category": "General"
  },
  {
    "id": "12",
    "name": "Centre for DNA Fingerprinting and Diagnostics (CDFD)",
    "ministry": "Department of Bio-Technology",
    "department": "Department of Bio-Technology",
    "category": "General"
  },
  {
    "id": "13",
    "name": "Central Institute of Petrochemicals Engineering & Technology (CIPET)",
    "ministry": "Department of Chemicals & Petrochemicals",
    "department": "Department of Chemicals & Petrochemicals",
    "category": "General"
  },
  {
    "id": "14",
    "name": "Hindustan Organic Chemicals Limited (HOCL)",
    "ministry": "Department of Chemicals & Petrochemicals",
    "department": "Department of Chemicals & Petrochemicals",
    "category": "General"
  },
  {
    "id": "15",
    "name": "Tea Board of India",
    "ministry": "Department of Commerce",
    "department": "Department of Commerce",
    "category": "General"
  },
  {
    "id": "16",
    "name": "Coffee Board",
    "ministry": "Department of Commerce",
    "department": "Department of Commerce",
    "category": "General"
  },
  {
    "id": "17",
    "name": "APEDA",
    "ministry": "Department of Commerce",
    "department": "Department of Commerce",
    "category": "General"
  },
  {
    "id": "18",
    "name": "Bureau of Indian Standards (BIS)",
    "ministry": "Department of Consumer Affairs",
    "department": "Department of Consumer Affairs",
    "category": "General"
  },
  {
    "id": "19",
    "name": "National Consumer Disputes Redressal Commission (NCDRC)",
    "ministry": "Department of Consumer Affairs",
    "department": "Department of Consumer Affairs",
    "category": "General"
  },
  {
    "id": "20",
    "name": "Defence Research and Development Organisation (DRDO)",
    "ministry": "Department of Defence",
    "department": "Department of Defence",
    "category": "General"
  },
  {
    "id": "21",
    "name": "Border Roads Organisation (BRO)",
    "ministry": "Department of Defence",
    "department": "Department of Defence",
    "category": "General"
  },
  {
    "id": "22",
    "name": "Hindustan Aeronautics Limited (HAL)",
    "ministry": "Department of Defence Production",
    "department": "Department of Defence Production",
    "category": "General"
  },
  {
    "id": "23",
    "name": "Bharat Electronics Limited (BEL)",
    "ministry": "Department of Defence Production",
    "department": "Department of Defence Production",
    "category": "General"
  },
  {
    "id": "24",
    "name": "Securities and Exchange Board of India (SEBI)",
    "ministry": "Department of Economic Affairs",
    "department": "Department of Economic Affairs",
    "category": "General"
  },
  {
    "id": "25",
    "name": "Security Printing and Minting Corporation of India Limited (SPMCIL)",
    "ministry": "Department of Economic Affairs",
    "department": "Department of Economic Affairs",
    "category": "General"
  },
  {
    "id": "26",
    "name": "Artificial Limbs Manufacturing Corporation of India (ALIMCO)",
    "ministry": "Department of Empowerment of Person with Disabilities (Divyangjan)",
    "department": "Department of Empowerment of Person with Disabilities (Divyangjan)",
    "category": "General"
  },
  {
    "id": "27",
    "name": "Rehabilitation Council of India (RCI)",
    "ministry": "Department of Empowerment of Person with Disabilities (Divyangjan)",
    "department": "Department of Empowerment of Person with Disabilities (Divyangjan)",
    "category": "General"
  },
  {
    "id": "28",
    "name": "Controller General of Accounts (CGA)",
    "ministry": "Department of Expenditure",
    "department": "Department of Expenditure",
    "category": "General"
  },
  {
    "id": "29",
    "name": "National Institute of Financial Management (NIFM)",
    "ministry": "Department of Expenditure",
    "department": "Department of Expenditure",
    "category": "General"
  },
  {
    "id": "30",
    "name": "Kendriya Sainik Board (KSB)",
    "ministry": "Department of Ex-Servicemen Welfare",
    "department": "Department of Ex-Servicemen Welfare",
    "category": "General"
  },
  {
    "id": "31",
    "name": "Directorate General of Resettlement (DGR)",
    "ministry": "Department of Ex-Servicemen Welfare",
    "department": "Department of Ex-Servicemen Welfare",
    "category": "General"
  },
  {
    "id": "32",
    "name": "National Fertilizers Limited (NFL)",
    "ministry": "Department of Fertilisers",
    "department": "Department of Fertilisers",
    "category": "General"
  },
  {
    "id": "33",
    "name": "Fertilizers and Chemicals Travancore Limited (FACT)",
    "ministry": "Department of Fertilisers",
    "department": "Department of Fertilisers",
    "category": "General"
  },
  {
    "id": "34",
    "name": "State Bank of India (SBI)",
    "ministry": "Department of Financial Services",
    "department": "Department of Financial Services",
    "category": "General"
  },
  {
    "id": "35",
    "name": "Life Insurance Corporation of India (LIC)",
    "ministry": "Department of Financial Services",
    "department": "Department of Financial Services",
    "category": "General"
  },
  {
    "id": "36",
    "name": "NABARD",
    "ministry": "Department of Financial Services",
    "department": "Department of Financial Services",
    "category": "General"
  },
  {
    "id": "37",
    "name": "PFRDA",
    "ministry": "Department of Financial Services",
    "department": "Department of Financial Services",
    "category": "General"
  },
  {
    "id": "38",
    "name": "Food Corporation of India (FCI)",
    "ministry": "Department of Food & Public Distribution",
    "department": "Department of Food & Public Distribution",
    "category": "General"
  },
  {
    "id": "39",
    "name": "Central Warehousing Corporation (CWC)",
    "ministry": "Department of Food & Public Distribution",
    "department": "Department of Food & Public Distribution",
    "category": "General"
  },
  {
    "id": "40",
    "name": "All India Institute of Medical Sciences (AIIMS) [Various branches]",
    "ministry": "Department of Health & Family Welfare",
    "department": "Department of Health & Family Welfare",
    "category": "General"
  },
  {
    "id": "41",
    "name": "Central Drugs Standard Control Organization (CDSCO)",
    "ministry": "Department of Health & Family Welfare",
    "department": "Department of Health & Family Welfare",
    "category": "General"
  },
  {
    "id": "42",
    "name": "Indian Council of Medical Research (ICMR)",
    "ministry": "Department of Health Research",
    "department": "Department of Health Research",
    "category": "General"
  },
  {
    "id": "43",
    "name": "National Institute of Virology (NIV)",
    "ministry": "Department of Health Research",
    "department": "Department of Health Research",
    "category": "General"
  },
  {
    "id": "44",
    "name": "University Grants Commission (UGC)",
    "ministry": "Department of Higher Education",
    "department": "Department of Higher Education",
    "category": "General"
  },
  {
    "id": "45",
    "name": "All Indian Institutes of Technology (IITs)",
    "ministry": "Department of Higher Education",
    "department": "Department of Higher Education",
    "category": "General"
  },
  {
    "id": "46",
    "name": "All Central Universities",
    "ministry": "Department of Higher Education",
    "department": "Department of Higher Education",
    "category": "General"
  },
  {
    "id": "47",
    "name": "Controller General of Patents, Designs and Trade Marks (CGPDTM)",
    "ministry": "Department of Industrial Policy & Promotion (DPIIT)",
    "department": "Department of Industrial Policy & Promotion (DPIIT)",
    "category": "General"
  },
  {
    "id": "48",
    "name": "Petroleum and Explosives Safety Organisation (PESO)",
    "ministry": "Department of Industrial Policy & Promotion (DPIIT)",
    "department": "Department of Industrial Policy & Promotion (DPIIT)",
    "category": "General"
  },
  {
    "id": "49",
    "name": "DIPAM (Main Office)",
    "ministry": "Department of Investment and Public Asset Management",
    "department": "Department of Investment and Public Asset Management",
    "category": "General"
  },
  {
    "id": "50",
    "name": "National Legal Services Authority (NALSA)",
    "ministry": "Department of Justice",
    "department": "Department of Justice",
    "category": "General"
  },
  {
    "id": "51",
    "name": "Department of Land Resources (Main Office)",
    "ministry": "Department of Land Resources",
    "department": "Department of Land Resources",
    "category": "General"
  },
  {
    "id": "52",
    "name": "Law Commission of India",
    "ministry": "Department of Legal Affairs",
    "department": "Department of Legal Affairs",
    "category": "General"
  },
  {
    "id": "53",
    "name": "Income Tax Appellate Tribunal (ITAT)",
    "ministry": "Department of Legal Affairs",
    "department": "Department of Legal Affairs",
    "category": "General"
  },
  {
    "id": "54",
    "name": "Directorate General of Armed Forces Medical Services (DGAFMS)",
    "ministry": "Department of Military Affairs",
    "department": "Department of Military Affairs",
    "category": "General"
  },
  {
    "id": "55",
    "name": "Central Pension Accounting Office (CPAO)",
    "ministry": "Department of Pensions & Pensioners Welfare",
    "department": "Department of Pensions & Pensioners Welfare",
    "category": "General"
  },
  {
    "id": "56",
    "name": "Central Bureau of Investigation (CBI)",
    "ministry": "Department of Personnel & Training",
    "department": "Department of Personnel & Training",
    "category": "General"
  },
  {
    "id": "57",
    "name": "Union Public Service Commission (UPSC)",
    "ministry": "Department of Personnel & Training",
    "department": "Department of Personnel & Training",
    "category": "General"
  },
  {
    "id": "58",
    "name": "Staff Selection Commission (SSC)",
    "ministry": "Department of Personnel & Training",
    "department": "Department of Personnel & Training",
    "category": "General"
  },
  {
    "id": "59",
    "name": "National Pharmaceutical Pricing Authority (NPPA)",
    "ministry": "Department of Pharmaceuticals",
    "department": "Department of Pharmaceuticals",
    "category": "General"
  },
  {
    "id": "60",
    "name": "Bengal Chemicals & Pharmaceuticals Ltd",
    "ministry": "Department of Pharmaceuticals",
    "department": "Department of Pharmaceuticals",
    "category": "General"
  },
  {
    "id": "61",
    "name": "India Post (Various Postal Circles)",
    "ministry": "Department of Posts",
    "department": "Department of Posts",
    "category": "General"
  },
  {
    "id": "62",
    "name": "Centre for Excellence in Postal Technology (CEPT)",
    "ministry": "Department of Posts",
    "department": "Department of Posts",
    "category": "General"
  },
  {
    "id": "63",
    "name": "Heavy Engineering Corporation Ltd",
    "ministry": "Department of Public Enterprises",
    "department": "Department of Public Enterprises",
    "category": "General"
  },
  {
    "id": "64",
    "name": "and other minor unmapped CPSEs",
    "ministry": "Department of Public Enterprises",
    "department": "Department of Public Enterprises",
    "category": "General"
  },
  {
    "id": "65",
    "name": "Central Board of Direct Taxes (CBDT)",
    "ministry": "Department of Revenue",
    "department": "Department of Revenue",
    "category": "General"
  },
  {
    "id": "66",
    "name": "Central Board of Indirect Taxes and Customs (CBIC)",
    "ministry": "Department of Revenue",
    "department": "Department of Revenue",
    "category": "General"
  },
  {
    "id": "67",
    "name": "Enforcement Directorate (ED)",
    "ministry": "Department of Revenue",
    "department": "Department of Revenue",
    "category": "General"
  },
  {
    "id": "68",
    "name": "Central Board of Secondary Education (CBSE)",
    "ministry": "Department of School Education and Literacy",
    "department": "Department of School Education and Literacy",
    "category": "General"
  },
  {
    "id": "69",
    "name": "Kendriya Vidyalaya Sangathan (KVS)",
    "ministry": "Department of School Education and Literacy",
    "department": "Department of School Education and Literacy",
    "category": "General"
  },
  {
    "id": "70",
    "name": "Navodaya Vidyalaya Sangathan (NVS)",
    "ministry": "Department of School Education and Literacy",
    "department": "Department of School Education and Literacy",
    "category": "General"
  },
  {
    "id": "71",
    "name": "Survey of India",
    "ministry": "Department of Science & Technology",
    "department": "Department of Science & Technology",
    "category": "General"
  },
  {
    "id": "72",
    "name": "Technology Information, Forecasting and Assessment Council (TIFAC)",
    "ministry": "Department of Science & Technology",
    "department": "Department of Science & Technology",
    "category": "General"
  },
  {
    "id": "73",
    "name": "Council of Scientific and Industrial Research (CSIR)",
    "ministry": "Department of Scientific & Industrial Research",
    "department": "Department of Scientific & Industrial Research",
    "category": "General"
  },
  {
    "id": "74",
    "name": "Central Electronics Limited (CEL)",
    "ministry": "Department of Scientific & Industrial Research",
    "department": "Department of Scientific & Industrial Research",
    "category": "General"
  },
  {
    "id": "75",
    "name": "Indian Space Research Organisation (ISRO)",
    "ministry": "Department of Space",
    "department": "Department of Space",
    "category": "General"
  },
  {
    "id": "76",
    "name": "Vikram Sarabhai Space Centre (VSSC)",
    "ministry": "Department of Space",
    "department": "Department of Space",
    "category": "General"
  },
  {
    "id": "77",
    "name": "Bharat Sanchar Nigam Limited (BSNL)",
    "ministry": "Department of Telecommunications",
    "department": "Department of Telecommunications",
    "category": "General"
  },
  {
    "id": "78",
    "name": "Telecom Regulatory Authority of India (TRAI)",
    "ministry": "Department of Telecommunications",
    "department": "Department of Telecommunications",
    "category": "General"
  },
  {
    "id": "79",
    "name": "C-DOT",
    "ministry": "Department of Telecommunications",
    "department": "Department of Telecommunications",
    "category": "General"
  },
  {
    "id": "80",
    "name": "Nehru Yuva Kendra Sangathan (NYKS)",
    "ministry": "Department of Youth Affairs",
    "department": "Department of Youth Affairs",
    "category": "General"
  },
  {
    "id": "81",
    "name": "Official Languages Wing",
    "ministry": "Legislative Department",
    "department": "Legislative Department",
    "category": "General"
  },
  {
    "id": "82",
    "name": "Vidhi Sahitya Prakashan",
    "ministry": "Legislative Department",
    "department": "Legislative Department",
    "category": "General"
  }
];

export const Step2Authority = ({ draft, updateDraft, onNext, onBack }: Props) => {
  const [selectedMinistry, setSelectedMinistry] = useState<string>(draft.authority?.ministry || '');
  const [selectedAuth, setSelectedAuth] = useState<PublicAuthority | null>(draft.authority);
  
  const [ministrySearch, setMinistrySearch] = useState('');
  const [authSearch, setAuthSearch] = useState('');
  
  const [showMinistryDropdown, setShowMinistryDropdown] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  
  const ministryRef = useRef<HTMLDivElement>(null);
  const authRef = useRef<HTMLDivElement>(null);

  // Get unique ministries
  const uniqueMinistries = Array.from(new Set(allAuthorities.map(a => a.ministry))).sort();
  
  // Filtered lists
  const filteredMinistries = uniqueMinistries.filter(m => 
    m.toLowerCase().includes(ministrySearch.toLowerCase())
  );
  
  const availableAuths = allAuthorities.filter(a => a.ministry === selectedMinistry);
  const filteredAuths = availableAuths.filter(a => 
    a.name.toLowerCase().includes(authSearch.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ministryRef.current && !ministryRef.current.contains(event.target as Node)) {
        setShowMinistryDropdown(false);
      }
      if (authRef.current && !authRef.current.contains(event.target as Node)) {
        setShowAuthDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

    useEffect(() => {
    updateDraft({ authority: selectedAuth });
  }, [selectedAuth]);
  const handleNext = () => {
    if (selectedAuth) {
      updateDraft({ authority: selectedAuth });
      onNext();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Find the right Public Authority *</h2>
        <p className="text-slate-600 mt-2">Which Central Government department holds this information? *</p>
        <p className="text-slate-600 text-sm mt-1">All fields marked with * are mandatory.</p>
      </div>
      
      <form id="step2form" onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="flex-grow flex flex-col gap-6">
        
        {/* Ministry Selection */}
        <div className="w-full relative" ref={ministryRef}>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Select Ministry/Department/Apex body *</label>
          <div 
            className={`relative w-full border border-slate-300 bg-white flex items-center cursor-text transition-all ${showMinistryDropdown ? 'rounded-t-lg border-b-transparent' : 'rounded-lg focus-within:border-orange-500'}`}
            onClick={() => setShowMinistryDropdown(true)}
          >
            <Search className="absolute left-3 text-slate-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search and select Ministry..."
              value={showMinistryDropdown ? ministrySearch : selectedMinistry || ministrySearch}
              onChange={(e) => {
                setMinistrySearch(e.target.value);
                setShowMinistryDropdown(true);
                if (!showMinistryDropdown) {
                  setSelectedMinistry('');
                  setSelectedAuth(null);
                }
              }}
              onFocus={() => {
                setShowMinistryDropdown(true);
                setMinistrySearch(''); // Clear search when focusing to show all
              }}
              className="w-full pl-10 pr-10 py-2.5 outline-none rounded-lg text-slate-700 bg-transparent"
            />
            <ChevronDown className="absolute right-3 text-slate-400 w-5 h-5 pointer-events-none" />
          </div>
          
          {showMinistryDropdown && (
            <div className="absolute z-50 w-full bg-white border border-slate-300 border-t-0 rounded-b-lg shadow-xl max-h-60 overflow-y-auto outline-none">
              {filteredMinistries.length > 0 ? (
                filteredMinistries.map(ministry => (
                  <div 
                    key={ministry}
                    onClick={() => {
                      setSelectedMinistry(ministry);
                      setMinistrySearch('');
                      setShowMinistryDropdown(false);
                      setSelectedAuth(null); // Reset auth when ministry changes
                    }}
                    className="px-4 py-2.5 hover:bg-orange-50 cursor-pointer text-slate-700 text-sm border-b border-slate-50 last:border-0"
                  >
                    {ministry}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-slate-500 text-sm text-center">No ministries found matching "{ministrySearch}"</div>
              )}
            </div>
          )}
        </div>

        {/* Authority Selection */}
        <div className="w-full relative" ref={authRef}>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Select Public Authority * 
            <span className="block text-xs text-slate-500 font-normal mt-0.5">(Your Request will be filed with this selected Public Authority)</span>
          </label>
          <div 
            className={`relative w-full border bg-white flex items-center transition-all ${!selectedMinistry ? 'border-slate-200 bg-slate-100 opacity-70 cursor-not-allowed rounded-lg' : `border-slate-300 cursor-text ${showAuthDropdown ? 'rounded-t-lg border-b-transparent' : 'rounded-lg focus-within:border-orange-500'}`}`}
            onClick={() => selectedMinistry && setShowAuthDropdown(true)}
          >
            <Search className="absolute left-3 text-slate-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search and select Public Authority..."
              value={showAuthDropdown ? authSearch : selectedAuth?.name || authSearch}
              onChange={(e) => {
                setAuthSearch(e.target.value);
                setShowAuthDropdown(true);
                if (!showAuthDropdown) setSelectedAuth(null);
              }}
              onFocus={() => {
                setShowAuthDropdown(true);
                setAuthSearch('');
              }}
              disabled={!selectedMinistry}
              className="w-full pl-10 pr-10 py-2.5 outline-none rounded-lg text-slate-700 bg-transparent disabled:cursor-not-allowed"
            />
            <ChevronDown className="absolute right-3 text-slate-400 w-5 h-5 pointer-events-none" />
          </div>

          {showAuthDropdown && selectedMinistry && (
            <div className="absolute z-50 w-full bg-white border border-slate-300 border-t-0 rounded-b-lg shadow-xl max-h-60 overflow-y-auto outline-none">
              {filteredAuths.length > 0 ? (
                filteredAuths.map(auth => (
                  <div 
                    key={auth.id}
                    onClick={() => {
                      setSelectedAuth(auth);
                      setAuthSearch('');
                      setShowAuthDropdown(false);
                    }}
                    className={`px-4 py-2.5 hover:bg-orange-50 cursor-pointer text-sm border-b border-slate-50 last:border-0 flex items-center justify-between ${selectedAuth?.id === auth.id ? 'bg-orange-50 text-orange-700 font-medium' : 'text-slate-700'}`}
                  >
                    <span>{auth.name}</span>
                    {selectedAuth?.id === auth.id && <CheckCircle className="w-4 h-4 text-orange-500" />}
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-slate-500 text-sm text-center">No authorities found matching "{authSearch}"</div>
              )}
            </div>
          )}
          
          {/* Hidden inputs to enforce required validation */}
          <input type="text" required style={{ opacity: 0, position: "absolute", zIndex: -1 }} value={selectedMinistry || ""} onChange={() => {}} />
          <input type="text" required style={{ opacity: 0, position: "absolute", zIndex: -1 }} value={selectedAuth?.id || ""} onChange={() => {}} />
        </div>

      </form>
      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">        
        <button           
          type="submit"
          form="step2form"
          className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
        >
          Next Step <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
