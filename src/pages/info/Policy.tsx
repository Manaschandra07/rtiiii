import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const Policy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="mb-8 flex items-center">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-orange-600 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5" />
          Home
        </Link>
      </div>

      <div className="bg-white border border-slate-200 p-8 md:p-12 rounded-2xl shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-200">Website Policies</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Disclaimer</h2>
          <div className="space-y-4 text-slate-600 leading-relaxed text-sm md:text-base">
            <p>This Website is designed & developed by National Informatics Center and maintained by Department of Personnel & Training, Ministry of Personnel, Public Grievances & Pensions, Government of India.</p>
            <p>The contents of this website are for information purposes only, enabling public to have a quick and an easy access to information. We are taking every effort to provide accurate and updated information. However, it is likely that the details such as telephone numbers, name of the officer holding a post, etc may change prior to their updating in the web site. Hence, we do not assume any legal liability on the completeness, accuracy or usefulness of the contents provided in this web site.</p>
            <p>The links are provided to other external sites in some documents. We are not responsible for the accuracy of the contents in those sites. The links given to external sites do not constitute an endorsement of information, products or services offered by these sites.</p>
            <p>Despite our best efforts, we do not guarantee that the documents in this site are free from infection by computer viruses etc.</p>
            <p>We welcome your suggestions to improve our site and request that any error found may kindly be brought to our notice.</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Copyright Policy</h2>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base">
            Material featured on this site may be reproduced free of charge in any format or media without requiring specific permission. This is subject to the material being reproduced accurately and not being used in a derogatory manner or in a misleading context. Where the material is being published or issued to others, the source must be prominently acknowledged. However, the permission to reproduce this material does not extend to any material on this site, which is explicitly identified as being the copyright of a third party. Authorisation to reproduce such material must be obtained from the copyright holders concerned.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Hyperlink Policy</h2>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base">
            We do not object to you linking directly to the information that is hosted on our site and no prior permission is required for the same. However, we would like you to inform us about any links provided to our site so that you can be informed of any changes or updations therein. Also, we do not permit our pages to be loaded into frames on your site. Our Department's pages must load into a newly opened browser window of the user.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Privacy Statement</h2>
          <div className="space-y-4 text-slate-600 leading-relaxed text-sm md:text-base">
            <p>As a general rule, this web site does not collect Personal Information about you when you visit the site. You can generally Visit this Site, without revealing personal information, unless you choose to provide such information. Any personal information collected shall be used only for the stated purpose and shall NOT be shared with any other department organization (public/private).</p>
            <p>This site may contain links to non-Government sites whose data protection and privacy practices may differ from ours. We are not responsible for the content and privacy practices of these other websites and encourage you to consult the privacy notices of those site.</p>
            <p>Thanks for visiting our site.</p>
            <p>Web Site Administration Team</p>
          </div>
        </section>
      </div>
    </div>
  );
};
