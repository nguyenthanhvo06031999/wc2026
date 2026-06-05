import { useState } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '../context/useAuth.js'
import toast from 'react-hot-toast'
import { syncToSheets } from '../lib/predictionStore.js'

export default function AuthModal({ onClose }) {
  const { user, setUser } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const set = key => event => setForm(current => ({ ...current, [key]: event.target.value }))

  const handleSubmit = async event => {
    event.preventDefault()
    if (form.name.trim().length < 2) {
      toast.error('Nhập tên của bạn')
      return
    }
    if (form.phone.replace(/\D/g, '').length < 8) {
      toast.error('Số điện thoại chưa hợp lệ')
      return
    }
    const participant = setUser(form)
    const result = await syncToSheets('participant', participant)
    toast.success(result.ok ? `Đã lưu ${participant.name}. Google Sheets đang nhận nền.` : `Đã lưu ${participant.name} cục bộ.`)
    onClose()
  }

  const inputBase = {
    width:'100%', padding:'0.72rem 1rem', borderRadius:10,
    background:'rgba(26,122,60,0.1)', border:'1px solid rgba(26,122,60,0.35)',
    color:'var(--c-text)', fontSize:'0.875rem', outline:'none',
    fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s',
  }
  const onFocus = e => { e.target.style.borderColor='var(--c-gold)'; e.target.style.boxShadow='0 0 0 3px rgba(255,236,0,0.12)'; e.target.style.background='rgba(255,236,0,0.06)' }
  const onBlur = e => { e.target.style.borderColor='rgba(26,122,60,0.35)'; e.target.style.boxShadow='none'; e.target.style.background='rgba(26,122,60,0.1)' }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background:'rgba(0,0,0,0.75)', backdropFilter:'blur(16px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card w-full max-w-sm" style={{ background:'rgba(8,28,14,0.98)' }}>
        <div className="flex items-start justify-between p-6 pb-0">
          <div>
            <div className="text-4xl mb-2">⚽</div>
            <h2 className="font-display font-bold text-2xl text-white">Thông tin dự đoán</h2>
            <p className="text-sm mt-0.5" style={{ color:'var(--c-muted)' }}>
              Không cần đăng ký. Tên và số điện thoại dùng để lưu kết quả.
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg transition-colors"
            style={{ color:'var(--c-muted)' }}
            onMouseEnter={e => e.currentTarget.style.color='#fff'}
            onMouseLeave={e => e.currentTarget.style.color='var(--c-muted)'}>
            <X size={18}/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color:'var(--c-muted)' }}>Tên</label>
            <input type="text" required value={form.name} onChange={set('name')} placeholder="Nguyễn Văn A" style={inputBase} onFocus={onFocus} onBlur={onBlur}/>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color:'var(--c-muted)' }}>Số điện thoại</label>
            <input type="tel" required value={form.phone} onChange={set('phone')} placeholder="0901234567" style={inputBase} onFocus={onFocus} onBlur={onBlur}/>
          </div>
          <button type="submit" className="btn-gold w-full justify-center mt-2 rounded-xl py-3">
            Lưu và tiếp tục
          </button>
        </form>

        <p className="text-center pb-5 font-mono text-xs" style={{ color:'rgba(26,122,60,0.55)' }}>
          Lưu cục bộ · Có thể xuất CSV cho Excel / Google Sheets
        </p>
      </div>
    </div>
  )
}
