'use client';

import { useState } from 'react';
import axios from 'axios';
import { ShieldCheck, ShieldAlert, Search, Loader2, Activity, Lock, AlertTriangle } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  // ---------------------------------------------------------------------------
  // 🔗 KONFIGURASI API BACKEND (Punya Temanmu)
  // Berdasarkan main.py temanmu, prefix-nya adalah /api/v1
  // Pastikan endpoint akhirnya benar (misal: /detect atau /predict)
  // Cek Swagger UI backend temanmu di http://localhost:8000/docs untuk memastikannya.
  // ---------------------------------------------------------------------------
  const API_URL = 'http://127.0.0.1:8000/api/v1/predict'; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Mengirim request POST ke Backend
      // Payload { url: "..." } disesuaikan dengan Pydantic model di backend
      const response = await axios.post(API_URL, { url: url });
      
      // Simpan hasil respons
      setResult(response.data);
    } catch (err: any) {
      console.error(err);
      if (err.code === "ERR_NETWORK") {
        setError('Gagal terhubung ke Backend. Pastikan repo backend temanmu sudah dijalankan!');
      } else {
        setError(err.response?.data?.detail || 'Terjadi kesalahan saat analisis.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* --- Background Effects --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]" />
      </div>

      <div className="w-full max-w-2xl space-y-8 z-10">
        
        {/* --- Header --- */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
            <Lock className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 p-2">
            Phising Detection App
          </h1>
          <p className="text-slate-400 text-lg">
            AI-Powered URL Phishing Detection System
          </p>
        </div>

        {/* --- Form Input --- */}
        <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl transition-all hover:border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
              </div>
              <input
                type="url"
                required
                className="block w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none text-lg"
                placeholder="https://example.com/login"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !url}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-emerald-900/20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Analyzing URL...
                </>
              ) : (
                <>
                  <Activity className="mr-2 h-5 w-5" />
                  Scan URL
                </>
              )}
            </button>
          </form>

          {/* --- Error Alert --- */}
          {error && (
            <div className="mt-6 p-4 bg-red-950/30 border border-red-500/30 rounded-xl text-red-300 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        {/* --- Result Card --- */}
        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`p-8 rounded-3xl border shadow-2xl backdrop-blur-md ${
              result.is_phishing === 1 || result.status === 'Phishing'
                ? 'bg-red-950/40 border-red-500/30 shadow-red-900/20' 
                : 'bg-emerald-950/40 border-emerald-500/30 shadow-emerald-900/20'
            }`}>
              <div className="flex flex-col items-center text-center space-y-6">
                
                {/* Status Icon */}
                <div className={`p-5 rounded-full ${
                  result.is_phishing === 1 || result.status === 'Phishing'
                  ? 'bg-red-500/20 text-red-500' 
                  : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {result.is_phishing === 1 || result.status === 'Phishing' ? (
                    <ShieldAlert className="w-16 h-16" />
                  ) : (
                    <ShieldCheck className="w-16 h-16" />
                  )}
                </div>

                {/* Verdict */}
                <div>
                  <h2 className="text-3xl font-bold mb-2 tracking-wide">
                    {result.is_phishing === 1 || result.status === 'Phishing' ? (
                      <span className="text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]">PHISHING DETECTED</span>
                    ) : (
                      <span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">SAFE URL</span>
                    )}
                  </h2>
                  <p className="text-slate-400 text-sm max-w-md break-all mx-auto font-mono bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                    {result.url}
                  </p>
                </div>

                {/* Score Cards */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                    <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Confidence</p>
                    <p className="text-2xl font-mono font-bold text-white">
                      {result.confidence_score}%
                    </p>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                    <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Prediction</p>
                    <p className={`text-xl font-bold ${
                      result.is_phishing === 1 || result.status === 'Phishing' ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                      {result.is_phishing === 1 || result.status === 'Phishing' ? 'Malicious' : 'Legitimate'}
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