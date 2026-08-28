import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, ShieldCheck, FileText, CheckCircle, Scale, Users, Info, Play, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-2 leading-[1.1]">
                <span className="text-orange-500">Your Right.</span> <br/>
                <span className="text-[#06038D]">Your Information.</span> <br/>
                <span className="text-emerald-600">Your Power.</span>
              </h1>
              <p className="mt-6 text-xl text-slate-600 font-medium max-w-lg leading-relaxed">
                Ask questions. Get answers. <br/>
                Build a transparent India.
              </p>
              

            </motion.div>
            
            {/* Hero Artwork */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:flex items-center justify-end h-full w-full pointer-events-none select-none"
            >
               <div className="relative w-full max-w-[550px]">
                 {/* Decorative background blobs */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-orange-100 via-blue-50 to-emerald-50 rounded-full blur-3xl opacity-60"></div>
                 
                 {/* Image Frame */}
                 <div className="relative bg-white p-3 rounded-[2rem] shadow-2xl border border-slate-100/50 transform rotate-1 transition-transform hover:rotate-0 duration-500">
                   <div className="relative rounded-[1.5rem] overflow-hidden bg-slate-100 aspect-[4/3]">
                     <img 
                       src="/hero-image.png"
                       alt="India Gate Monument"
                       referrerPolicy="no-referrer"
                       className="w-full h-full object-cover"
                     />
                     {/* Overlay gradient for depth */}
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent"></div>
                   </div>
                   
                   {/* Floating badge */}
                   <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 transform -rotate-2">
                     <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                       <ShieldCheck className="w-6 h-6" />
                     </div>
                     <div>
                       <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Secured by</p>
                       <p className="text-sm font-bold text-slate-900">RTI Act, 2005</p>
                     </div>
                   </div>
                 </div>
               </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Primary Actions Grid */}
      <section className="py-12 bg-stone-50 border-b border-slate-200 relative -mt-6 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           
           <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl py-3 px-4 shadow-sm flex items-center">
              <Info className="w-5 h-5 mr-3 flex-shrink-0 text-blue-600" />
              <div className="marquee-container flex-grow overflow-hidden relative">
                <span className="animate-marquee text-sm font-medium">
                  The Central Information Commission (CIC) has integrated its Second Appeal Filing Portal with the Department of Personnel and Training (DoPT) RTI Online Portal. Now, while submitting a Second Appeal, appellants can input the First Appeal Registration Number, Email ID and Date of Filing the First Appeal, thereafter, the system will automatically retrieve related details of the RTI Application and First Appeal from the RTI Online Portal. This will ensure a smooth and more streamlined Second Appeal filing process.
                </span>
              </div>
           </div>

           <div className="mb-8 flex items-start gap-4 p-5 bg-red-50 border-l-4 border-red-500 rounded-r-xl shadow-sm text-sm text-red-900">
             <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
             <div className="flex flex-col gap-1">
               <span className="font-bold uppercase tracking-wide text-xs text-red-700">Important Disclaimer</span>
               <p className="font-medium leading-relaxed">Please do not file RTI applications through this portal for the public authorities under the State Governments, including Government of NCT Delhi. <span className="font-bold underline decoration-red-300 underline-offset-2">If filed, the application would be returned, without refund of amount.</span></p>
             </div>
           </div>
           
           <h2 className="text-lg font-semibold text-slate-800 mb-6 tracking-tight">What would you like to do?</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             
             <Link to="/file" className="group flex flex-col bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-orange-300 transition-all duration-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 transform origin-left scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                <div className="mb-4 text-orange-500 bg-orange-50 w-12 h-12 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">File an RTI</h3>
                <p className="text-sm text-slate-500 mb-4 flex-grow">Ask the government for information directly.</p>
                <div className="flex items-center text-orange-600 font-medium text-sm">
                  Start Application <ArrowRight className="w-3.5 h-3.5 ml-1.5 mt-[2px] group-hover:translate-x-1 transition-transform" />
                </div>
             </Link>

             <Link to="/track" className="group flex flex-col bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-[#06038D]/30 transition-all duration-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#06038D] transform origin-left scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                <div className="mb-4 text-[#06038D] bg-[#06038D]/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Track RTI</h3>
                <p className="text-sm text-slate-500 mb-4 flex-grow">Check the current status of your submitted application.</p>
                <div className="flex items-center text-[#06038D] font-medium text-sm">
                  Check Status <ArrowRight className="w-3.5 h-3.5 ml-1.5 mt-[2px] group-hover:translate-x-1 transition-transform" />
                </div>
             </Link>

             <Link to="/appeals" className="group flex flex-col bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-emerald-300 transition-all duration-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 transform origin-left scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                <div className="mb-4 text-emerald-600 bg-emerald-50 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Scale className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">File an Appeal</h3>
                <p className="text-sm text-slate-500 mb-4 flex-grow">Not satisfied with the response? File a First Appeal.</p>
                <div className="flex items-center text-emerald-600 font-medium text-sm">
                  Start Appeal <ArrowRight className="w-3.5 h-3.5 ml-1.5 mt-[2px] group-hover:translate-x-1 transition-transform" />
                </div>
             </Link>

           </div>
        </div>
      </section>




    </div>
  );
};
