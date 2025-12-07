'use client';

import { useState } from 'react';
import axios from 'axios';
import { ShieldCheck, ShieldAlert, Search, Loader2, Activity, Lock } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  // ⚠️ Ganti ini dengan URL Backend FastAPI kamu
  // Kalau jalan di lokal (beda terminal), biasanya port 8000
  const API_URL = 'http://127.0.0.1:8000/predict'; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Kirim data ke Backend FastAPI
      const response = await axios.post(API_URL, { url: url });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Gagal menghubungi server. Pastikan Backend FastAPI sudah jalan!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-500 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full blur-[128px]" />
      </div>

      <div className="w-full max-w-2xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-slate-900/50 rounded-2xl border border-slate-800 mb-4 shadow-xl backdrop-blur-sm">
            <Lock className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            LinkShield AI
          </h1>
          <p className="text-slate-400 text-lg">
            Deteksi URL Phishing menggunakan <span className="text-green-400 font-semibold">Random Forest</span>
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none text-lg"
                placeholder="Tempel URL yang mencurigakan di sini..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !url}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-green-900/20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Menganalisis Fitur URL...
                </>
              ) : (
                <>
                  <Activity className="mr-2 h-5 w-5" />
                  Analisis Sekarang
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-center text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Result Display */}
        {result && (
          <div className={`transform transition-all duration-500 ${loading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <div className={`p-8 rounded-3xl border shadow-2xl backdrop-blur-md ${
              result.is_phishing === 1 
                ? 'bg-red-950/30 border-red-500/50 shadow-red-900/20' 
                : 'bg-green-950/30 border-green-500/50 shadow-green-900/20'
            }`}>
              <div className="flex flex-col items-center text-center space-y-4">
                
                {/* Icon */}
                <div className={`p-4 rounded-full ${
                  result.is_phishing === 1 ? 'bg-red-500/20' : 'bg-green-500/20'
                }`}>
                  {result.is_phishing === 1 ? (
                    <ShieldAlert className="w-16 h-16 text-red-500" />
                  ) : (
                    <ShieldCheck className="w-16 h-16 text-green-500" />
                  )}
                </div>

                {/* Status Text */}
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {result.is_phishing === 1 ? (
                      <span className="text-red-400">BERBAHAYA!</span>
                    ) : (
                      <span className="text-green-400">AMAN</span>
                    )}
                  </h2>
                  <p className="text-slate-400 max-w-md break-all">
                    {result.url}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 w-full mt-6">
                  <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                    <p className="text-slate-500 text-sm uppercase font-semibold">Confidence</p>
                    <p className="text-2xl font-mono font-bold text-white">
                      {result.confidence_score}%
                    </p>
                  </div>
                  <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                    <p className="text-slate-500 text-sm uppercase font-semibold">Model</p>
                    <p className="text-2xl font-mono font-bold text-blue-400">
                      Random Forest
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}