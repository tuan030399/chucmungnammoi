import React, { useState, useEffect } from 'react';
import Fireworks from './components/Fireworks';
import EnvelopeGame from './components/EnvelopeGame';
import RewardModal from './components/RewardModal';

const App: React.FC = () => {
  // Đã bỏ trạng thái 'countdown'
  const [appState, setAppState] = useState<'intro' | 'game'>('intro');
  const [isMuted, setIsMuted] = useState(false);
  const [openedReward, setOpenedReward] = useState<any>(null);
  const [hasPicked, setHasPicked] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('tet_rewards_2026');
    if (saved) setHistory(JSON.parse(saved));
  }, [openedReward]);

  const handleStart = () => {
    // Vào thẳng game luôn, không đếm ngược nữa
    setAppState('game');
  };

  const handleOpenEnvelope = (reward: any) => {
    if (hasPicked) return;
    setOpenedReward(reward);
    setHasPicked(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black touch-none font-sans selection:bg-red-500 selection:text-white">
      
      {/* 1. MÀN HÌNH CHỜ (INTRO) */}
      {appState === 'intro' && (
        <div className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4">
            <div className="absolute inset-0 z-0">
               <Fireworks isMuted={true} /> {/* Pháo hoa nhẹ nền */}
               <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
            </div>

            <div className="relative z-10 text-center space-y-10 animate-[fadeIn_1s_ease-out]">
                <div className="relative inline-block">
                    <div className="text-9xl mb-4 animate-bounce drop-shadow-[0_0_20px_rgba(255,0,0,0.5)]">🧧</div>
                </div>
                
                <h1 className="text-5xl md:text-7xl text-yellow-500 font-script font-bold uppercase tracking-tighter leading-none drop-shadow-lg">
                    Hái Lộc <br/> <span className="text-red-500 text-6xl md:text-8xl drop-shadow-sm">Đầu Xuân</span>
                </h1>
                
                <p className="text-gray-300 text-base md:text-xl font-light tracking-widest uppercase">
                    Chào đón năm mới 2026
                </p>

                <button 
                    onClick={handleStart}
                    className="group relative px-16 py-5 bg-gradient-to-r from-red-700 to-red-600 rounded-full transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] active:scale-95 overflow-hidden ring-2 ring-yellow-500/50"
                >
                    <span className="relative text-white font-bold text-xl uppercase tracking-widest flex items-center gap-3">
                        Bắt đầu
                    </span>
                </button>
            </div>
        </div>
      )}

      {/* 2. MÀN HÌNH CHÍNH (GAME) - Đã bỏ Countdown */}
      {appState === 'game' && (
        <div className="absolute inset-0 z-0 animate-[fadeIn_1.5s_ease-in-out]">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <img 
                    src="https://images.unsplash.com/photo-1548263594-a71ea65a85b2?q=80&w=2600&auto=format&fit=crop" 
                    alt="Background" 
                    className="w-full h-full object-cover opacity-20 filter blur-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)]"></div>
            </div>
            
            {/* Pháo hoa chạy nền */}
            <Fireworks isMuted={isMuted} />
            
            {/* Khu vực chọn bao lì xì */}
            <EnvelopeGame onOpen={handleOpenEnvelope} disabled={hasPicked} />

            {/* UI Controls */}
            <div className="absolute top-4 right-4 z-50 flex gap-3">
                <button onClick={toggleMute} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center">
                    {isMuted ? "🔇" : "🔊"}
                </button>
                {hasPicked && (
                    <button 
                        onClick={() => setShowHistory(true)} 
                        className="px-4 h-10 rounded-full bg-yellow-600/80 backdrop-blur-md border border-yellow-400/50 text-white text-xs font-bold uppercase tracking-wider hover:bg-yellow-600 transition-all"
                    >
                        Danh sách
                    </button>
                )}
            </div>

            {/* Modal Kết quả */}
            <RewardModal reward={openedReward} onClose={() => setOpenedReward(null)} />
        </div>
      )}

      {/* 3. MODAL LỊCH SỬ */}
      {showHistory && (
        <div className="fixed inset-0 z-[300] bg-black/95 p-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-lg bg-[#1a1a1a] rounded-2xl border border-white/10 p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                    <h2 className="text-yellow-500 text-xl font-bold uppercase tracking-widest">Bảng vàng</h2>
                    <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-white transition-colors text-3xl">&times;</button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto space-y-3 custom-scrollbar">
                    {history.length === 0 ? (
                        <p className="text-gray-600 text-center py-10 italic">Chưa có dữ liệu.</p>
                    ) : (
                        history.map((item, idx) => (
                            <div key={idx} className="bg-white/5 p-4 rounded-xl flex justify-between items-center hover:bg-white/10 transition-colors group">
                                <div>
                                    <p className="text-white font-bold group-hover:text-yellow-400 transition-colors">{item.name}</p>
                                    <p className="text-gray-500 text-xs mt-1">{item.date}</p>
                                </div>
                                <div className="text-right">
                                    <span className="inline-block px-3 py-1 bg-red-900/50 text-red-400 rounded-lg font-bold text-sm border border-red-800/50">
                                        {item.reward}{item.type === 'money' ? 'đ' : ''}
                                    </span>
                                </div>
                            </div>
                        ))
                    ).reverse()}
                </div>
            </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;