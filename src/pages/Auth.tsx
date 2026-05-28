import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn, UserPlus, LogOut, User, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Auth() {
  const [mode, setMode] = useState<'signin' | 'signup' | 'email-confirmed'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  
  const { user, isLoading, error: authError, signIn, signUp, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmed = searchParams.get('confirmed');
    if (confirmed === 'true') {
      setSuccessMessage('邮箱确认成功！请登录你的账号。');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setLocalError('两次密码输入不一致');
        return;
      }
      if (password.length < 6) {
        setLocalError('密码长度至少6位');
        return;
      }
    }

    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        setSuccessMessage('注册成功！请查看邮箱并点击确认链接来完成注册。');
        setMode('email-confirmed');
      }
    } catch (err: any) {
      setLocalError(err.message || '操作失败');
    }
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-4">
              <User size={40} className="text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">已登录</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
          
          <button
            onClick={() => signOut()}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            <LogOut size={20} />
            {isLoading ? '退出中...' : '退出登录'}
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'email-confirmed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <User size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">注册成功！</h2>
            <p className="text-gray-500 mb-4">请查看你的邮箱</p>
            <p className="text-sm text-gray-600 mb-4">
              我们已向 <span className="font-medium text-orange-500">{email}</span> 发送了确认邮件
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-800">
              📧 请点击邮箱中的确认链接来完成注册。如果你没有收到邮件，请检查垃圾邮件文件夹。
            </p>
          </div>
          
          <button
            onClick={() => setMode('signin')}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl"
          >
            返回登录
          </button>

          <p className="text-center text-gray-500 text-sm mt-4">
            已经确认了？
            <button
              onClick={() => {
                setMode('signin');
                setSuccessMessage(null);
              }}
              className="text-orange-500 hover:text-orange-600 font-medium ml-1"
            >
              点击登录
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 font-serif">灵感花园</h1>
          <p className="text-gray-500">登录以同步你的灵感</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('signin')}
            className={cn(
              "flex-1 py-2 rounded-lg font-medium transition-all",
              mode === 'signin'
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            <LogIn size={18} className="inline mr-2" />
            登录
          </button>
          <button
            onClick={() => setMode('signup')}
            className={cn(
              "flex-1 py-2 rounded-lg font-medium transition-all",
              mode === 'signup'
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            <UserPlus size={18} className="inline mr-2" />
            注册
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                确认密码
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
              />
            </div>
          )}

          {(localError || authError) && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-start gap-2">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{localError || authError}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm flex items-start gap-2">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
          >
            {isLoading ? '处理中...' : mode === 'signin' ? '登录' : '注册'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          {mode === 'signup' ? '已有账号？' : '没有账号？'}
          <button
            onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
            className="text-orange-500 hover:text-orange-600 font-medium ml-1"
          >
            {mode === 'signup' ? '登录' : '注册'}
          </button>
        </p>
      </div>
    </div>
  );
}
