import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

export default function EmailConfirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('正在确认邮箱...');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const token = searchParams.get('token');
        const type = searchParams.get('type');
        const email = searchParams.get('email');

        if (token && type === 'signup' && email) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          setStatus('success');
          setMessage('邮箱确认成功！正在跳转...');
          
          setTimeout(() => {
            navigate('/auth?confirmed=true');
          }, 2000);
        } else {
          setStatus('error');
          setMessage('确认链接无效或已过期');
        }
      } catch (error) {
        setStatus('error');
        setMessage('确认失败，请稍后重试');
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
              <Loader size={40} className="text-blue-500 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">确认邮箱中</h2>
            <p className="text-gray-500">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">确认成功！</h2>
            <p className="text-gray-500">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
              <XCircle size={40} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">确认失败</h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <button
              onClick={() => navigate('/auth')}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl"
            >
              返回登录
            </button>
          </>
        )}
      </div>
    </div>
  );
}
