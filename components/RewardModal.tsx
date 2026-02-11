import React, { useState } from 'react';

interface RewardModalProps {
  reward: any;
  onClose: () => void;
}

const RewardModal: React.FC<RewardModalProps> = ({ reward, onClose }) => {
  const [step, setStep] = useState<'reward' | 'form' | 'success'>('reward');
  const [formData, setFormData] = useState({ name: '', stk: '', bank: '' });

  if (!reward) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.stk) return;

    // Lưu vào localStorage (Bảng xếp hạng/Danh sách cục bộ)
    const history = JSON.parse(localStorage.getItem('tet_rewards_2026') || '[]');
    const newEntry = {
        ...formData,
        reward: reward.value,
        type: reward.type,
        date: new Date().toLocaleString()
    };
    localStorage.setItem('tet_rewards_2026', JSON.stringify([...history, newEntry]));
    
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-[fadeIn_0.3s_ease-out]">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-red-600 to-red-900 rounded-[2.5rem] p-6 md:p-8 border-4 border-yellow-500 shadow-[0_0_60px_rgba(234,179,8,0.4)] text-center transform animate-[popIn_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)]">
        
        {step === 'reward' && (
          <div className="animate-[fadeIn_0.5s]">
            <div className="text-7xl mb-4 animate-bounce">🧧</div>
            <h2 className="text-yellow-300 text-2xl font-black uppercase tracking-widest mb-4 drop-shadow-md">
              LỘC XUÂN GÕ CỬA!
            </h2>
            <div className="bg-white/10 rounded-3xl py-10 mb-6 border border-white/20 backdrop-blur-sm">
              <span className="text-5xl md:text-6xl font-black text-yellow-400 drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
                {reward.value}
                {reward.type === 'money' && <span className="text-2xl ml-1">đ</span>}
              </span>
              <p className="text-red-100 mt-4 font-medium px-4">
                {reward.type === 'money' ? 'Chúc mừng bạn đã nhận được tiền mừng tuổi!' : 'Một lời chúc vạn điều may!'}
              </p>
            </div>
            <button 
              onClick={() => setStep('form')}
              className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-red-900 font-black text-xl rounded-2xl transition-all shadow-xl active:scale-95"
            >
              NHẬN THƯỞNG NGAY
            </button>
          </div>
        )}

        {step === 'form' && (
          <div className="animate-[fadeIn_0.5s] text-left">
            <h3 className="text-yellow-300 text-xl font-bold text-center mb-6 uppercase">Thông tin nhận thưởng</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-red-100 text-xs font-bold uppercase ml-2">Họ và Tên</label>
                <input 
                  required
                  type="text"
                  placeholder="Nhập tên của bạn..."
                  className="w-full bg-red-950/50 border-2 border-yellow-600/50 rounded-xl px-4 py-3 text-white placeholder:text-red-300/50 focus:border-yellow-400 outline-none transition-all"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-red-100 text-xs font-bold uppercase ml-2">Số tài khoản / Ngân hàng</label>
                <input 
                  required
                  type="text"
                  placeholder="STK - Ngân hàng (Vd: 12345 - VCB)"
                  className="w-full bg-red-950/50 border-2 border-yellow-600/50 rounded-xl px-4 py-3 text-white placeholder:text-red-300/50 focus:border-yellow-400 outline-none transition-all"
                  value={formData.stk}
                  onChange={e => setFormData({...formData, stk: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-red-900 font-black text-lg rounded-2xl transition-all mt-4"
              >
                GỬI THÔNG TIN
              </button>
            </form>
          </div>
        )}

        {step === 'success' && (
          <div className="animate-[fadeIn_0.5s] py-10">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-yellow-300 text-2xl font-bold mb-4">GỬI THÀNH CÔNG!</h3>
            <p className="text-red-100 mb-8">Thông tin của bạn đã được ghi lại. Chúc bạn một năm mới thịnh vượng!</p>
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl transition-all"
            >
              ĐÓNG
            </button>
          </div>
        )}

      </div>

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default RewardModal;