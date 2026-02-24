import React from 'react';
import { Database, Cloud, Server, Shield, Users, Globe, Activity, Lock } from 'lucide-react';

const ArchitectureView: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-slate-900">Platform Architecture: LET US PRAY</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            High-level technical design for a scalable, global prayer platform leveraging Firebase, 
            Cloud Functions, and Gemini AI.
          </p>
        </div>

        {/* High Level Diagram Representation */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Cloud className="w-6 h-6 text-indigo-600" />
            System Overview
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            {/* Client Layer */}
            <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2 font-semibold text-slate-700">
                <Globe className="w-5 h-5" /> Client Layer
              </div>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>React Native (Mobile)</li>
                <li>React + Tailwind (Web)</li>
                <li>Redux Toolkit (State)</li>
                <li>Firebase SDK (Auth/Data)</li>
                <li>WebRTC (Audio Rooms)</li>
              </ul>
            </div>

            {/* Backend Layer */}
            <div className="space-y-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="flex items-center gap-2 font-semibold text-indigo-800">
                <Server className="w-5 h-5" /> Serverless Backend
              </div>
              <ul className="list-disc pl-5 space-y-1 text-indigo-700">
                <li>Firebase Auth (Identity)</li>
                <li>Cloud Firestore (NoSQL DB)</li>
                <li>Cloud Functions (Logic)</li>
                <li>Cloud Storage (Media)</li>
                <li>Gemini API (AI/Mod)</li>
              </ul>
            </div>

            {/* Infrastructure Layer */}
            <div className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2 font-semibold text-slate-700">
                <Database className="w-5 h-5" /> Data & Scale
              </div>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Global CDN Hosting</li>
                <li>Firestore Multi-Region</li>
                <li>BigQuery (Analytics)</li>
                <li>Pub/Sub (Async Tasks)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Models */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              Firestore Schema Design
            </h3>
            <div className="space-y-4 font-mono text-sm">
              <div className="border-l-2 border-green-500 pl-3">
                <div className="font-bold text-slate-800">users/{'{userId}'}</div>
                <div className="text-slate-500">Profile, stats, push tokens, settings</div>
              </div>
              <div className="border-l-2 border-blue-500 pl-3">
                <div className="font-bold text-slate-800">prayers/{'{prayerId}'}</div>
                <div className="text-slate-500">Content, authorRef, tags, likeCount, prayCount, geoPoint</div>
              </div>
              <div className="border-l-2 border-purple-500 pl-3">
                <div className="font-bold text-slate-800">rooms/{'{roomId}'}</div>
                <div className="text-slate-500">Live status, hostRef, activeParticipants (subcollection)</div>
              </div>
              <div className="border-l-2 border-orange-500 pl-3">
                <div className="font-bold text-slate-800">reports/{'{reportId}'}</div>
                <div className="text-slate-500">Moderation queue, automatedGeminiScore, status</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Cloud Functions (Triggers)
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold h-fit">ON_CREATE</span>
                <div>
                  <div className="font-medium">prayers/{'{id}'}</div>
                  <div className="text-slate-600">Trigger Gemini moderation. If unsafe → move to rejected. If safe → Fan-out to followers' feeds.</div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold h-fit">SCHEDULE</span>
                <div>
                  <div className="font-medium">dailyDigest</div>
                  <div className="text-slate-600">Aggregates trending prayers and sends FCM push notification at local 8 AM.</div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-bold h-fit">HTTP</span>
                <div>
                  <div className="font-medium">generateAudioToken</div>
                  <div className="text-slate-600">Securely signs Agora/WebRTC tokens for audio room access.</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Security & Privacy */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-600" />
            Security & Moderation Workflow
          </h3>
          
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
               <div className="flex-1">
                 <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                   <Lock className="w-4 h-4" /> Firestore Security Rules
                 </h4>
                 <p className="text-sm text-slate-600 mb-2">
                   Strict RLS (Row Level Security) equivalent.
                 </p>
                 <div className="bg-slate-900 text-slate-300 p-3 rounded text-xs font-mono overflow-x-auto">
                   match /prayers/&#123;prayerId&#125; &#123;<br/>
                   &nbsp;&nbsp;allow read: if true;<br/>
                   &nbsp;&nbsp;allow create: if request.auth != null;<br/>
                   &nbsp;&nbsp;allow update: if request.auth.uid == resource.data.authorId;<br/>
                   &#125;
                 </div>
               </div>
               
               <div className="flex-1">
                 <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                   <Users className="w-4 h-4" /> AI Moderation Pipeline
                 </h4>
                 <div className="relative border-l-2 border-slate-200 pl-4 space-y-4 text-sm">
                   <div className="relative">
                     <span className="absolute -left-[21px] top-1 w-3 h-3 bg-indigo-500 rounded-full"></span>
                     <p className="font-medium">User Submits Prayer</p>
                   </div>
                   <div className="relative">
                     <span className="absolute -left-[21px] top-1 w-3 h-3 bg-indigo-300 rounded-full"></span>
                     <p>Cloud Function calls <strong>Gemini Flash</strong></p>
                     <p className="text-slate-500 text-xs">Prompt: "Analyze for hate speech, blasphemy..."</p>
                   </div>
                   <div className="relative">
                     <span className="absolute -left-[21px] top-1 w-3 h-3 bg-indigo-300 rounded-full"></span>
                     <p><strong>Decision Node:</strong></p>
                     <p className="text-slate-500 text-xs">Safe &gt; 90% confidence: Auto-Publish</p>
                     <p className="text-slate-500 text-xs">Unsafe: Auto-Reject & Notify User</p>
                     <p className="text-slate-500 text-xs">Ambiguous: Flag for Human Review</p>
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

export default ArchitectureView;