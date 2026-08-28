import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import clsx from 'clsx';

export const Faq = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);

  const faqs = [
    {
      q: "1. To which Public Authority can I file a request through this portal?",
      a: "An applicant who desires to obtain information under the RTI Act, 2005 can make a request through this RTI Online Portal to the Central Ministries/Departments and other Central Public Authorities mentioned in ONLINE RTI request form."
    },
    {
      q: "2. How do I write my application for seeking the information as per RTI Act 2005?",
      a: "The text of the application may be written in the prescribed column of the RTI request form. At present, the text of the application is confined up to 3000 characters only.\nIn case, the text of an application contains more than 3000 characters, it can be uploaded as a PDF attachment in the \"Supporting Document\" column of the form."
    },
    {
      q: "3. How do I make the payment for RTI fee?",
      a: "After filling the first page of the RTI request form, a non-BPL applicant has to click on \"Make Payment\" button for payment of the prescribed RTI fee.\nThe applicant can pay the prescribed RTI fee through the following modes:\n(i) Internet banking through SBI payment gateway and its associated banks.\n(ii) Using ATM-cum-Debit card of State Bank of India.\n(iii) Credit/Debit card of Master/Visa.\n(iv) UPI\nIt may be noted that no RTI fee is required to be paid by a citizen who is below poverty line, as per RTI Rules, 2012. However, the BPL applicant must attach a copy of the certificate issued by the appropriate government in this regard, along with the application."
    },
    {
      q: "4. Do I get any receipt for online filing of RTI application?",
      a: "On submission of an application, a unique registration number will be issued, which may be referred by the applicant for any future reference.\nIt may be noted that the application filed through this RTI Online Portal will reach electronically to the \"Nodal Officer\" of the said Ministry/Department and \"Not\" to the CPIO of the concerned Ministry/Department.\nThe Nodal Officer will transmit the RTI application electronically to the concerned CPIO."
    },
    {
      q: "5. What will happen to my application if I select a wrong Public Authority in the RTI request form?",
      a: "In case the RTI application is not meant for the Public authority which has been selected by the applicant, the \"Nodal Officer\" of the said public authority would transfer the application electronically to the \"Nodal Officer\" of the concerned Central Public authority, if aligned to this portal and physically to that Central Public authority which is not aligned to this portal, under section 6(3) of the RTI Act.\nIt may be noted that RTI applications filed through this portal for the state public authorities, including NCT of Delhi, would be returned, without any refund of fee."
    },
    {
      q: "6. Will I be informed about the additional fee (if any) is required to pay?",
      a: "In case additional fee representing the cost is required for providing information, the CPIO will intimate the same, which can be viewed by the applicant through \"View Status\" option in the RTI Online Portal and an e-mail alert or SMS or both will also be sent to the applicant for the same.\nFor payment of additional fee online, the applicant needs to use the option 'View Status' in the RTI Online Portal and on providing the registration number of the request, option for \"Make Payment\" will be available."
    },
    {
      q: "7. How do I file an appeal with First Appellate Authority?",
      a: "For making an appeal to the first Appellate Authority, the applicant has to select the option \"Submit First Appeal\" in the RTI Online Portal and fill up the form that will appear.\nThe registration number and e-mail ID of the original application is required for filing the first appeal."
    },
    {
      q: "8. Do I need to make any payment for filing an appeal?",
      a: "As per RTI Act, no fee has to be paid for first appeal."
    },
    {
      q: "9. Do I get any SMS from RTI Online Portal?",
      a: "Though optional, the mobile number can be provided by the applicant/ appellant in order to receive SMS alerts."
    },
    {
      q: "10. What can I do if I forgot my login credentials?",
      a: "You can go to View History column to see your past RTI requests/appeals."
    },
    {
      q: "11. Is it mandatory to create user account on RTI online web portal?",
      a: "No. You can directly file your RTI on \"Submit Request\" tab."
    },
    {
      q: "12. How much time RTI request/appeal retain at this portal?",
      a: "In the View History/View Status citizen can see RTI Cases retained for a period of 3 years."
    },
    {
      q: "13. What should I do if amount is deducted from my account but registration number is not generated?",
      a: "Use \"Payment Reconciliation\" feature\nPlease do not attempt to make payment repeatedly or try to submit request once again. Kindly wait for the 24 to 48 working hours as registration number will be generated after reconciliation. If it is not generated within stipulated time frame then kindly send an e-mail at helprtionline-dopt[at]nic[dot]in with your transaction details.\nHowever, in cases of unsuccessful RTI payment requests, if the requester wishes to check the payment status before 48 hours, it can be verified using the \"Payment Reconciliation\" feature."
    },
    {
      q: "14. What should I do when portal is not allowing me to file the first appeal?",
      a: "This may happen under following two situation:\n\nWhen your RTI application has been physically transferred to other public authority, which is not aligned to this portal. In such a case, you are required to file your appeal in physical mode to the concerned public authority.\n\nAnother case can be if your RTI application has not been replied to by CPIO and 30 days period has not lapsed. In such a case, you may file first appeal only after completion of stipulated time period of 30 days."
    },
    {
      q: "15. Can I file online first appeal for any RTI application filed physically in the first place ?",
      a: "No,Online first appeal can only be filed against previously filed online RTI application."
    },
    {
      q: "16. Why RTI application filed by me is not reflecting in my user account history?",
      a: "If you have opted to file RTI or First Appeal directly i.e without logging into your user account, then in such cases you will not be able to see the filed RTI or Appeal in your registered account's history. However you can always check its status in \"View Status\" with the provided Reg. Nos."
    },
    {
      q: "17. Why I have received multiple RTI registration numbers, even though I have filed single RTI application ?",
      a: "This is the case where in your RTI application has been forwarded to multiple CPIOs since the information sought lies with more than one PIO."
    },
    {
      q: "18. How can I View Status/Reply of my RTI Application or First Appeal?",
      a: "Status/Reply of the RTI Application or First appeal filed online can be viewed by the applicant by clicking on \"View Status\"."
    },
    {
      q: "19. What if the Registration Number is not received on my Email or Mobile No. even after 48 working Hours?",
      a: "Registration Number are generated after reconciliation of bank scrolls for cases whose numbers are not generated instantly after the payment. This procedure may take 24 to 48 working hours. If someones still does not receive the Registration Number, They may contact their respective bank for refund of amount."
    },
    {
      q: "20. How to upload a supporting document if an alert comes as \"SUPPORTING DOCUMENTS REQUIRED FROM APPLICANT\"?",
      a: "When a Public Authority request for supporting document, an alert is sent to the applicant to his/her Mobile or Email Id. In such situation, the applicant is requested to visit the RTI Online Website and enter the details in 'View Status'. Once the detail is entered, the current status of the RTI application is shown along with the option for uploading the supporting document."
    },
    {
      q: "21. What queries can be raised with Helpline Email helprtionline-dopt(at)nic(dot)in ?",
      a: "Helpline mail id is exclusively meant for queries or problem being faced while filing the online RTI through this portal. Please do not send mail to this helpline for any other matter or asking for any other details. The reply is limited to RTI online portal of Central Government only."
    },
    {
      q: "22. What should I do when my browser show certificate error while opening RTI online portal?",
      a: "You should ignore the certificate error and proceed forward. Kindly select,\nMozilla Firefox – I understand the risk add exception.\nGoogle Chrome – Proceed Anyway.\nInternet Explorer - Continue to this website"
    },
    {
      q: "23. Can I file RTI application for state public authorities through this portal?",
      a: "No. This Portal is exclusively meant for Public Authorities under Central Govt. only."
    },
    {
      q: "24. If the RTI application is filed manually , then is it possible to file 1st appeal on line?",
      a: "Manual applications can be lodged into RTI Online portal by CPIOs and can be disposed off by CPIO online.\nIn this context, if applicant provides email id/Mobile No. in the application form and CPIO lodges this RTI application in the portal , then the actions taken by CPIO will be conveyed to applicant automatically through e-mail and Mobile SMS.\nThen applicant can file 1st appeal with the help of registration number conveyed."
    },
    {
      q: "25. What are the reasons for my RTI payment failing?",
      a: "The major reasons for failure are due to Business declines,\nBusiness Decline are as under:\n\nCustomer has set e-Commerce flag as Disabled for Debit / Credit Card.\n\nCustomer either closed the internet browser or not proceeded further with the transaction resulting into session timeout.\n\nWrong OTP or no OTP entered by customer.\n\nWrong details of cards entered by customers like Card No, CVV, expiry date.\n\nInsufficient balance in customer's account.\n\nCustomer cancelled the transaction and reinitiated with different mode of payment (say from Debit card to UPI etc.).\n\nCustomer received collect request for payment in UPI app, but not completed the payment within time limit."
    },
    {
      q: "26. Why this OTP feature is introduced in view status option?",
      a: "RTI Application may contain personal information of the Applicant and if any third person gets the registration number and email id, then the person can view this personal information. So, in order to protect personal information of the applicant, according to cyber security norms, this OTP validating feature has been introduced. In view status option while OTPs are promptly dispatched from the NIC email domain, delays may occasionally occur due to high traffic on either NIC server or external email services like Gmail or Yahoo. Importantly, OTPs do not expire until they are used, meaning users can access the status of their applications as soon as the OTP arrives."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-slate-600">Find answers to common questions about RTI</p>
      </div>

      <div className="relative max-w-2xl mx-auto mb-12">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Enter Keyword" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 shadow-sm text-lg outline-none" 
        />
      </div>

      <div className="space-y-4">
        {filteredFaqs.map((faq, idx) => {
          const match = faq.q.match(/^(\d+\.)\s*(.*)$/);
          const num = match ? match[1] : '';
          const text = match ? match[2] : faq.q;

          return (
          <div 
            key={idx} 
            className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors cursor-pointer group outline-none"
            onClick={() => setOpenQuestions(prev => prev.includes(faq.q) ? prev.filter(q => q !== faq.q) : [...prev, faq.q])}
          >
            <div className="flex justify-between items-start gap-4">
              <h3 className="font-semibold text-slate-900 mt-0.5 flex gap-2">
                {num && <span className="shrink-0 min-w-[1.5rem]">{num}</span>}
                <span>{text}</span>
              </h3>
              <ChevronDown 
                className={clsx(
                  "w-5 h-5 text-slate-400 shrink-0 transition-transform",
                  openQuestions.includes(faq.q) ? "rotate-180 text-orange-500" : "group-hover:text-slate-600"
                )} 
              />
            </div>
            {openQuestions.includes(faq.q) && (
              <div className={clsx(
                "text-sm text-slate-600 mt-4 pr-8 leading-relaxed whitespace-pre-line",
                num ? "ml-8" : ""
              )}>
                {faq.a}
              </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
};
