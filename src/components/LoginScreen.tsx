import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [managerPass, setManagerPass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleStaffLogin = () => {
    onLogin('staff');
  };

  const handleManagerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (managerPass === '19021988') {
      setErrorMsg('');
      onLogin('manager');
    } else {
      setErrorMsg('Sai mật khẩu');
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xs flex flex-col gap-3">
        <button
          id="login-staff-button"
          type="button"
          onClick={handleStaffLogin}
          className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-stone-50 active:scale-[0.99] text-stone-800 font-semibold border border-stone-200 shadow-sm transition-all cursor-pointer text-center text-base"
        >
          Nhân viên
        </button>

        {!showPassword ? (
          <button
            id="login-manager-button"
            type="button"
            onClick={() => {
              setShowPassword(true);
              setErrorMsg('');
            }}
            className="w-full py-4 px-6 rounded-2xl bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white font-semibold shadow-sm transition-all cursor-pointer text-center text-base"
          >
            Quản lý
          </button>
        ) : (
          <form onSubmit={handleManagerSubmit} className="flex flex-col gap-2.5">
            <input
              id="manager-password-input"
              type="password"
              autoFocus
              value={managerPass}
              onChange={(e) => {
                setManagerPass(e.target.value);
                setErrorMsg('');
              }}
              placeholder="Mật khẩu"
              className={`w-full py-3.5 px-4 rounded-xl bg-white border text-sm text-stone-900 focus:outline-none focus:ring-2 ${
                errorMsg
                  ? 'border-red-400 focus:ring-red-400/20'
                  : 'border-stone-300 focus:border-stone-900 focus:ring-stone-900/10'
              }`}
            />

            {errorMsg && (
              <p className="text-xs text-red-600 text-center font-medium">{errorMsg}</p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowPassword(false);
                  setManagerPass('');
                  setErrorMsg('');
                }}
                className="w-1/3 py-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-sm font-medium transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                id="manager-submit-button"
                type="submit"
                className="flex-1 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white text-sm font-semibold transition cursor-pointer"
              >
                Xác nhận
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

