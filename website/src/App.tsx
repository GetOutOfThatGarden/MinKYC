import { ShieldCheck, FileCheck, Lock, Building, Scale, Clock, ArrowRight, Shield } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 py-4 border-b border-gray-100 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <Shield className="w-8 h-8 text-[#9945FF]" />
          <span className="text-xl font-bold tracking-tight text-gray-900">MinKYC</span>
        </div>
        <div className="flex items-center space-x-6">
          <a href="#problem" className="text-gray-600 hover:text-gray-900 font-medium">Why MinKYC?</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium">How It Works</a>
          <a href="#use-cases" className="text-gray-600 hover:text-gray-900 font-medium">Use Cases</a>
          <button className="bg-[#111827] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Request Demo
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-purple-50 text-[#7A37CC] px-4 py-2 rounded-full font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9945FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9945FF]"></span>
            </span>
            <span>Live on Solana Devnet</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 tracking-tight leading-tight">
            Achieve KYC Compliance <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9945FF] to-[#14F195]">
              Without the Data Liability.
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Verify your users meet regulatory requirements (age, residency, accredited status) instantly. You get the cryptographic compliance receipt, not the sensitive data.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="w-full sm:w-auto bg-[#111827] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all transform flex items-center justify-center">
              Request Platform Demo
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors">
              Read Regulatory Whitepaper
            </button>
          </div>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section id="problem" className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Toxic Asset Problem</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              You don't need your customer's passport. You just need to know they are over 18.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-6">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Breach Risk</h3>
              <p className="text-gray-600">
                Storing passports and government IDs turns your servers into high-value targets for hackers. A single breach can destroy user trust permanently.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mb-6">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">GDPR Liability</h3>
              <p className="text-gray-600">
                Regulations put the complete burden of data protection on your platform. You are legally responsible for data you never actually needed to hold.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">High Compliance Costs</h3>
              <p className="text-gray-600">
                Managing sensitive data requires expensive security audits, dedicated Data Protection Officers, and complex cross-border storage architectures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">How MinKYC Works</h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  A seamless, zero-knowledge compliance flow that protects your users and shields your business from liability.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#9945FF] text-white flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">User Verification</h4>
                    <p className="text-gray-600">The user scans their physical ID using the MinKYC secure mobile app via NFC. Their sensitive personal data never leaves their device.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Instant Cryptographic Proof</h4>
                    <p className="text-gray-600">Your platform requests a specific check (e.g., "Is over 18?"). You receive an unforgeable, zero-knowledge proof that the user meets your requirements.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Immutable Audit Trail</h4>
                    <p className="text-gray-600">A permanent, privacy-preserved receipt is logged on the Solana blockchain. Regulatory agencies can verify the authenticity of the compliance check at any time.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-gradient-to-tr from-gray-50 to-gray-100 rounded-3xl p-8 border border-gray-200 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#9945FF] opacity-5 blur-3xl rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#10B981] opacity-5 blur-3xl rounded-full"></div>
                
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6 relative z-10 font-mono text-sm">
                  <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
                    <span className="text-gray-500">MinKYC Verification API</span>
                    <span className="text-[#10B981] bg-green-50 px-2 py-1 rounded text-xs">200 OK</span>
                  </div>
                  <div className="text-gray-700">
                    <span className="text-purple-600">POST</span> /api/v1/verify
                  </div>
                  <div className="mt-4 text-gray-500">Request:</div>
                  <div className="bg-gray-50 p-3 rounded mt-2">
                    {"{"}
                    <br />&nbsp;&nbsp;"requirement": "minimum_age: 18"
                    <br />{"}"}
                  </div>
                  <div className="mt-4 text-gray-500">Response:</div>
                  <div className="bg-gray-50 p-3 rounded mt-2">
                    {"{"}
                    <br />&nbsp;&nbsp;"verified": <span className="text-green-600">true</span>,
                    <br />&nbsp;&nbsp;"compliance_receipt": "7K7yRj...WmAi",
                    <br />&nbsp;&nbsp;"timestamp": "2026-03-10T14:32:00Z"
                    <br />{"}"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section id="use-cases" className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Enterprise-Grade Compliance</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Scalable trust infrastructure for regulated industries moving into the next generation of digital commerce.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <Building className="w-8 h-8 text-[#9945FF] mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Institutions</h3>
              <p className="text-gray-600 text-sm">De-risk customer onboarding and entirely remove identity honeypots from your infrastructure.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <ShieldCheck className="w-8 h-8 text-[#9945FF] mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Age-Restricted Commerce</h3>
              <p className="text-gray-600 text-sm">Automated, robust compliance for online age gates without degrading conversion rates.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <Clock className="w-8 h-8 text-[#9945FF] mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Healthcare Providers</h3>
              <p className="text-gray-600 text-sm">Verify health status and credentials instantly without storing HIPAA-sensitive files.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <Lock className="w-8 h-8 text-[#9945FF] mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Web3 & DeFi</h3>
              <p className="text-gray-600 text-sm">Manage permissioned pools and governance compliance without breaking decentralization principles.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2 justify-center md:justify-start mb-2">
              <Shield className="w-6 h-6 text-[#9945FF]" />
              <span className="text-lg font-bold text-gray-900">MinKYC</span>
            </div>
            <p className="text-sm text-gray-500">Privacy-Preserving Compliance Infrastructure</p>
          </div>
          
          <div className="flex space-x-6 text-sm">
            <a href="https://github.com/GetOutOfThatGarden/MinKYC" className="text-gray-500 hover:text-gray-900 transition-colors">GitHub Repository</a>
            <a href="https://colosseum.com/agent-hackathon/projects/minkyc-e5qc5l" className="text-gray-500 hover:text-gray-900 transition-colors">Colosseum Project</a>
            <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
