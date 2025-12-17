'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { 
  ShieldCheck, ShieldAlert, Search, Loader2, Activity, 
  ArrowLeft, AlertTriangle, History, Trash2, Clock, Globe, Lock
} from 'lucide-react';

interface ScanHistory {
  url: string;
  is_phishing: boolean | number;
  confidence_score: number;
  timestamp: string;
}

export default function ScanPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  
  const [history, setHistory] = useState<ScanHistory[]>([]);

  // Port Backend (Sesuaikan)
  const API_URL = 'http://127.0.0.1:8000/api/v1/predict'; 

  useEffect(() => {
    const savedHistory = localStorage.getItem('scanHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (data: any, scannedUrl: string) => {
    const newRecord: ScanHistory = {
      url: scannedUrl,
      is_phishing: data.is_phishing,
      confidence_score: data.confidence, 
      timestamp: new Date().toISOString(),
    };
    const updatedHistory = [newRecord, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('scanHistory');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post(API_URL, { url: url });
      const data = response.data;
      console.log("DATA DARI BACKEND:", data); // Cek console browser untuk lihat 'impersonation'
      setResult(data);
      saveToHistory(data, url);
    } catch (err: any) {
      console.error(err);
      if (err.code === "ERR_NETWORK") {
        setError('Gagal terhubung ke Backend. Pastikan port backend benar!');
      } else {
        setError(err.response?.data?.detail || 'Terjadi kesalahan saat analisis.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 p-4 flex flex-col items-center justify-center relative">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />
      </div>

      <div className="absolute top-6 left-6 z-20">
        <Link href="/">
          <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Home</span>
          </button>
        </Link>
      </div>

      <div className="w-full max-w-3xl space-y-8 animate-in fade-in zoom-in duration-500 mt-20 mb-10">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md">
            <Activity className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-extrabold text-white">Scanner URL</h1>
          <p className="text-slate-400">Analisis keamanan tautan menggunakan AI.</p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
              </div>
              <input
                type="url"
                required
                className="block w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-600 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all outline-none text-lg"
                placeholder="https://suspect-link.com"
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
                  Menganalisis...
                </>
              ) : (
                <>
                  <Activity className="mr-2 h-5 w-5" />
                  Scan Sekarang
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-950/30 border border-red-500/30 rounded-xl text-red-300 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        {/* --- HASIL SCAN --- */}
        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
            <div className={`p-8 rounded-3xl border shadow-2xl backdrop-blur-md overflow-hidden relative ${
              result.is_phishing 
                ? 'bg-red-950/40 border-red-500/30 shadow-red-900/20' 
                : 'bg-emerald-950/40 border-emerald-500/30 shadow-emerald-900/20'
            }`}>
              
              <div className="flex flex-col items-center text-center space-y-6 mb-8">
                <div className={`p-5 rounded-full ${
                  result.is_phishing 
                  ? 'bg-red-500/20 text-red-500' 
                  : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {result.is_phishing ? (
                    <ShieldAlert className="w-16 h-16" />
                  ) : (
                    <ShieldCheck className="w-16 h-16" />
                  )}
                </div>

                <div>
                  <h2 className="text-3xl font-bold mb-2 tracking-wide">
                    {result.is_phishing ? (
                      <span className="text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]">PHISHING DETECTED</span>
                    ) : (
                      <span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">SAFE URL</span>
                    )}
                  </h2>
                  <p className="text-slate-400 text-sm max-w-md break-all mx-auto font-mono bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                    {result.url}
                  </p>
                </div>
              </div>

              {/* --- IMPERSONATION WARNING (BARU) --- */}
              {/* Ini hanya muncul jika backend mengirim object impersonation */}
              {result.impersonation && (
                <div className="mb-8 mx-auto max-w-lg animate-pulse">
                  <div className="bg-orange-500/10 border border-orange-500/50 rounded-xl p-4 flex items-center gap-4">
                    <div className="bg-orange-500/20 p-3 rounded-lg">
                      <AlertTriangle className="w-8 h-8 text-orange-500" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-orange-200 text-xs uppercase font-bold tracking-wider mb-1">
                        Potential Impersonation
                      </p>
                      <p className="text-white text-sm">
                        Link ini terlihat mencoba meniru: <br/>
                        <span className="text-orange-400 font-bold text-lg block mt-1">
                          {result.impersonation.brand}
                        </span>
                      </p>
                    </div>
                    <div className="text-right pl-4 border-l border-orange-500/30">
                      <span className="text-2xl font-bold text-orange-500">
                        {(result.impersonation.similarity * 100).toFixed(0)}%
                      </span>
                      <p className="text-[10px] text-slate-400">Match</p>
                    </div>
                  </div>
                </div>
              )}
              {/* ------------------------------------ */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
                  <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-2">Risk Level</p>
                  <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase ${
                    result.risk_level === 'high' ? 'bg-red-500 text-white' :
                    result.risk_level === 'medium' ? 'bg-yellow-500 text-black' :
                    'bg-emerald-500 text-white'
                  }`}>
                    {result.risk_level || 'UNKNOWN'}
                  </span>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
                  <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">AI Confidence</p>
                  <p className="text-3xl font-mono font-bold text-white">
                    {(result.confidence * 100).toFixed(1)}%
                  </p>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex flex-col justify-center items-center">
                  <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1 text-center">Analysis Time</p>
                  <p className="text-xl font-mono font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    {result.analysis_time_ms} ms
                  </p>
                </div>
              </div>

              {result.features && (
                <div className="bg-slate-900/30 p-4 rounded-2xl border border-slate-800/50">
                  <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-3 text-center">Technical Analysis</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div className="flex flex-col items-center bg-slate-950 p-2 rounded-lg">
                      <Lock className="w-4 h-4 mb-1 text-slate-400"/>
                      <span className="text-slate-500 text-[10px]">Security</span>
                      <span className={result.features.is_https || result.features.IsHTTPS ? "text-emerald-400" : "text-red-400"}>
                        {result.features.is_https || result.features.IsHTTPS ? "HTTPS" : "HTTP"}
                      </span>
                    </div>

                    <div className="flex flex-col items-center bg-slate-950 p-2 rounded-lg">
                      <Globe className="w-4 h-4 mb-1 text-slate-400"/>
                      <span className="text-slate-500 text-[10px]">Domain Len</span>
                      <span className="text-white font-mono">
                         {result.features.domain_length || new URL(result.url).hostname.length}
                      </span>
                    </div>

                    <div className="flex flex-col items-center bg-slate-950 p-2 rounded-lg">
                      <Search className="w-4 h-4 mb-1 text-slate-400"/>
                      <span className="text-slate-500 text-[10px]">Similarity</span>
                      <span className="text-white font-mono">
                        {result.features.url_similarity_index ? result.features.url_similarity_index.toFixed(1) : 0}%
                      </span>
                    </div>

                    <div className="flex flex-col items-center bg-slate-950 p-2 rounded-lg">
                      <AlertTriangle className="w-4 h-4 mb-1 text-slate-400"/>
                      <span className="text-slate-500 text-[10px]">Special Chars</span>
                      <span className="text-white font-mono">
                        {result.features.no_of_other_special_chars_in_url || 0}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- HISTORY SECTION --- */}
        {history.length > 0 && (
          <div className="pt-8 border-t border-slate-800/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <History className="text-slate-400 w-5 h-5" />
                <h3 className="text-xl font-bold text-slate-200">Riwayat Pengecekan</h3>
              </div>
              <button 
                onClick={clearHistory}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 px-3 py-1 rounded-full hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Hapus Semua
              </button>
            </div>

            <div className="space-y-3">
              {history.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 flex items-center justify-between hover:border-slate-700 transition-all group"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-slate-300 font-mono text-sm truncate">{item.url}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>Score: {(item.confidence_score * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                    item.is_phishing === true || item.is_phishing === 1
                      ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {item.is_phishing === true || item.is_phishing === 1 ? 'PHISHING' : 'SAFE'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}