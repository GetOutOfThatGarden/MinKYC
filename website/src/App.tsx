import { ShieldCheck, FileCheck, Lock, Building, Scale, Clock, ArrowRight, Shield, Code, Terminal, Cpu } from 'lucide-react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-100 max-w-7xl mx-auto sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center space-x-2">
          <Shield className="w-8 h-8 text-[#9945FF]" />
          <span className="text-xl font-bold tracking-tight text-gray-900">MinKYC</span>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <a href="#problem" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Why MinKYC?</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">How It Works</a>
          <a href="#developers" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Developers</a>
          <a href="#use-cases" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Use Cases</a>
          <a 
            href="https://forms.gle/CZkWhv2dFbK4A9x26" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#111827] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-sm"
          >
            Request Demo
          </a>
        </div>
        <div className="md:hidden">
          <a 
            href="https://forms.gle/CZkWhv2dFbK4A9x26" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#111827] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm"
          >
            Demo
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 md:pt-24 pb-16 md:pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-purple-50 text-[#7A37CC] px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm font-medium mb-6 md:mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9945FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9945FF]"></span>
            </span>
            <span>Live on Solana Devnet</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-bold text-gray-900 mb-6 md:mb-8 tracking-tight leading-tight">
            Sovereign Identity <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9945FF] to-[#14F195]">
              Without the Data Liability.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed">
            MinKYC is a privacy-first infrastructure that enables platforms to verify user requirements instantly. You receive a cryptographic proof of compliance, while raw data stays where it belongs—with the user.
          </p>
          <div className="flex justify-center flex-col items-center">
            <div className="relative inline-block">
              <a 
                href="https://forms.gle/CZkWhv2dFbK4A9x26"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-[#111827] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all transform flex items-center justify-center relative z-10"
              >
                Request Platform Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              
              {/* Subtle Pointer Animation */}
              <div className="absolute -right-28 -bottom-16 w-40 h-32 hidden lg:block pointer-events-none transform rotate-6 z-20">
                <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-floating">
                  <path 
                    d="M140 100C110 100 40 80 18 25" 
                    stroke="#9945FF" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeDasharray="8 8" 
                    className="animate-dash-scroll"
                  />
                  <path 
                    d="M18 25L22 40M18 25L35 28" 
                    stroke="#9945FF" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance by Design Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Performance by Design</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              MinKYC is architected to solve the core trade-off between strict regulatory compliance and user privacy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-gray-900">Zero Data Liability</h4>
              <p className="text-gray-600 leading-relaxed">
                Raw identity data never leaves the user's device. By receiving only Zero-Knowledge proofs, your platform eliminates the $10M+ risk of PII data breaches and GDPR exposure.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-gray-900">Hyper-Scale Efficiency</h4>
              <p className="text-gray-600 leading-relaxed">
                Built with ZK Compression (Light Protocol V3), MinKYC reduces on-chain storage overhead by over 90% compared to standard accounts, making compliance economically viable for millions of users.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-gray-900">Consumer-Grade UX</h4>
              <p className="text-gray-600 leading-relaxed">
                Replace high-friction "selfie and scan" workflows with instant NFC ingestion. Verify age and residency in seconds, removing the manual review bottleneck that kills conversion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section id="problem" className="py-20 bg-white border-y border-gray-100">
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
      <section id="how-it-works" className="py-24 bg-gray-50">
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
            
            <div className="flex-1 w-full overflow-hidden">
              <div className="bg-gradient-to-tr from-gray-50 to-gray-100 rounded-2xl md:rounded-3xl p-4 md:p-8 border border-gray-200 shadow-inner relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#9945FF] opacity-5 blur-3xl rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#10B981] opacity-5 blur-3xl rounded-full"></div>
                
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 md:p-6 mb-0 relative z-10 font-mono text-xs sm:text-sm overflow-x-auto">
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

      {/* Developers Section */}
      <section id="developers" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-start gap-16">
            <div className="flex-1 space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Build with MinKYC</h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Integrate privacy-preserving KYC into your platform with just a few lines of code. No PII storage, no liability.
                </p>
              </div>

              <div className="grid gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-50 rounded-xl text-[#9945FF]">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Unified SDK</h4>
                    <p className="text-gray-600">A high-level TypeScript SDK for proof request generation and on-chain verification.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-50 rounded-xl text-[#14F195]">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">React Hooks</h4>
                    <p className="text-gray-600">First-class support for React with hooks for seamless mobile and web integration.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-500">
                    <Code className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Custom Noir Circuits</h4>
                    <p className="text-gray-600">Extend the protocol with your own ZK circuits for custom constraint verification.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <a 
                  href="https://github.com/GetOutOfThatGarden/MinKYC" 
                  target="_blank"
                  className="inline-flex items-center text-[#9945FF] font-semibold hover:underline"
                >
                  Explore the SDK on GitHub
                  <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="bg-[#111827] rounded-2xl p-6 shadow-2xl border border-gray-800 font-mono text-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-500 ml-2">App.tsx</span>
                </div>
                <div className="space-y-1">
                  <p className="text-pink-400">import <span className="text-gray-300">{"{"} MinKYCClient, useMinKYC {"}"}</span> from <span className="text-green-400">'@minkyc/sdk'</span>;</p>
                  <p className="text-gray-500 mt-4">// 1. Initialize Client</p>
                  <p className="text-purple-400">const <span className="text-blue-400">client</span> = <span className="text-blue-300">new</span> <span className="text-yellow-300">MinKYCClient</span>(connection);</p>
                  <p className="text-gray-500 mt-4">// 2. Create Verification Request</p>
                  <p className="text-purple-400">const <span className="text-blue-400">verifyUrl</span> = client.<span className="text-yellow-300">createRequest</span>({"{"}</p>
                  <p className="text-blue-300 ml-4">requester: <span className="text-green-400">'My DEX'</span>,</p>
                  <p className="text-blue-300 ml-4">requirements: {"{"} over18: <span className="text-orange-400">true</span> {"}"}</p>
                  <p className="text-purple-400">{"}"});</p>
                  <p className="text-gray-500 mt-4">// 3. Verify on Solana</p>
                  <p className="text-purple-400"><span className="text-blue-300">await</span> program.methods</p>
                  <p className="text-blue-300 ml-4">.<span className="text-yellow-300">verifyProof</span>(proof, publicInputs)</p>
                  <p className="text-blue-300 ml-4">.<span className="text-yellow-300">rpc</span>();</p>
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
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <div className="flex items-center space-x-2 justify-center md:justify-start mb-2">
              <Shield className="w-6 h-6 text-[#9945FF]" />
              <span className="text-lg font-bold text-gray-900">MinKYC</span>
            </div>
            <p className="text-sm text-gray-500">Privacy-Preserving Compliance Infrastructure</p>
          </div>
          

        </div>
      </footer>
    </div>
  );
}

export default App;
