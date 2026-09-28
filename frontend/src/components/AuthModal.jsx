import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  KeyRound,
  Clock,
  Send,
  PartyPopper
} from 'lucide-react';
import { apiRequest } from '../api/apiClient';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { getInitialClothesForGender, getInitialOutfitsForGender } from '../data/initialWardrobe';
import { 
  signInWithGoogle, 
  signInWithFacebook, 
  verifyRegistrationOtp, 
  resendVerificationOtp,
  signOutFromSupabase
} from '../services/supabaseAuthService';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onAuthSuccess, 
  initialMode = 'login',
  pendingVerification = null,
  pendingOnboardingUser = null,
}) {
  const { text } = useLanguage();
  const { isLight } = useTheme();

  // Mode: 'login' | 'register' | 'forgot' | 'verify-otp' | 'onboarding'
  const [mode, setMode] = useState(initialMode || 'login');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null); // 'google' | 'facebook' | null
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Form states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('myfitdaily_remember_me') !== 'false';
  });

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    gender: 'Nam',
    confirmPassword: '',
    agreeTerms: true,
  });

  // Onboarding profile states (Tên, Giới tính, Độ tuổi cho người dùng mới)
  const [onboardingUser, setOnboardingUser] = useState(null);
  const [onboardingData, setOnboardingData] = useState({
    fullName: '',
    gender: 'Nam',
    age: 22,
    height: 175,
    weight: 68,
  });

  // OTP Verification States (5-minute countdown)
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpTimeLeft, setOtpTimeLeft] = useState(300); // 300s = 5 minutes
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const [isWelcomeCelebrate, setIsWelcomeCelebrate] = useState(false);
  const timerRef = useRef(null);

  // Countdown timer logic for 5 minutes
  useEffect(() => {
    if (mode === 'verify-otp' && otpTimeLeft > 0) {
      setIsOtpExpired(false);
      timerRef.current = setInterval(() => {
        setOtpTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsOtpExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (otpTimeLeft === 0) {
      setIsOtpExpired(true);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, otpTimeLeft]);

  // Format seconds to mm:ss (e.g. 05:00)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // On mount / open, check pendingOnboardingUser or pendingVerification
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessMsg(null);
      setIsWelcomeCelebrate(false);

      if (pendingOnboardingUser) {
        setMode('onboarding');
        setOnboardingUser(pendingOnboardingUser);
        setOnboardingData({
          fullName: pendingOnboardingUser.fullName || '',
          gender: pendingOnboardingUser.gender || 'Nam',
          age: pendingOnboardingUser.age || 22,
          height: pendingOnboardingUser.height || (pendingOnboardingUser.gender === 'Nữ' ? 165 : 175),
          weight: pendingOnboardingUser.weight || (pendingOnboardingUser.gender === 'Nữ' ? 52 : 68),
        });
      } else if (pendingVerification?.requiresVerification) {
        setMode('verify-otp');
        setOtpEmail(pendingVerification.verificationEmail || pendingVerification.email || '');
        setOtpTimeLeft(pendingVerification.expiresInSeconds || 300);
        setIsOtpExpired(false);
        setOtpCode(''); // Luôn bắt đầu trống - người dùng phải vào email lấy mã thực tế!
      } else {
        setMode(initialMode || 'login');
        setOnboardingUser(null);
        const remembered = localStorage.getItem('myfitdaily_remembered_email');
        if (remembered) {
          setFormData(prev => ({ ...prev, email: remembered }));
        }
      }
    } else {
      setOnboardingUser(null);
      setSocialLoading(null);
      setError(null);
    }
  }, [isOpen, pendingVerification, pendingOnboardingUser, initialMode]);

  if (!isOpen) return null;

  // Calculate password strength for registration
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '#6B7280' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: text('Yếu', 'Weak'), color: '#EF4444' };
    if (score === 2) return { score: 2, label: text('Trung bình', 'Fair'), color: '#F59E0B' };
    if (score === 3) return { score: 3, label: text('Khá mạnh', 'Good'), color: '#3B82F6' };
    return { score: 4, label: text('Rất mạnh', 'Strong'), color: '#10B981' };
  };

  const strength = getPasswordStrength(formData.password);

  // Execute standard login
  const executeLogin = async (loginEmail, loginPassword) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const cleanInput = (loginEmail || '').trim().toLowerCase();

    try {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: cleanInput, password: loginPassword }),
      });

      setLoading(false);

      if (res.ok && res.data?.success) {
        const authData = res.data.data;
        if (rememberMe) {
          localStorage.setItem('myfitdaily_remembered_email', cleanInput);
          localStorage.setItem('myfitdaily_remember_me', 'true');
        } else {
          localStorage.removeItem('myfitdaily_remembered_email');
          localStorage.setItem('myfitdaily_remember_me', 'false');
        }
        localStorage.setItem('myfitdaily_token', authData.token);
        localStorage.setItem('myfitdaily_user', JSON.stringify(authData.user));
        onAuthSuccess(authData.user);
        onClose();
        return;
      }

      const msg = res.data?.message || (res.data?.errors ? Object.values(res.data.errors).flat().join(', ') : null);
      setError(msg || text("Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!", "Invalid email or password. Please try again!"));
    } catch (err) {
      setLoading(false);
      setError(text("Không thể kết nối đến máy chủ xác thực. Vui lòng thử lại sau!", "Cannot connect to authentication server. Please try again!"));
    }
  };

  // Handle Continue with Google via Supabase OAuth
  const handleContinueWithGoogle = async () => {
    setSocialLoading('google');
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setSocialLoading(null);
      setError(err?.message || text("Không thể kết nối đến Google OAuth. Vui lòng thử lại!", "Cannot connect to Google OAuth. Please try again!"));
    }
  };

  // Handle Continue with Facebook via Supabase OAuth
  const handleContinueWithFacebook = async () => {
    setSocialLoading('facebook');
    setError(null);
    try {
      await signInWithFacebook();
    } catch (err) {
      setSocialLoading(null);
      setError(err?.message || text("Không thể kết nối đến Facebook OAuth. Vui lòng thử lại!", "Cannot connect to Facebook OAuth. Please try again!"));
    }
  };

  // Verify OTP submission
  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length < 4) {
      setError(text("Vui lòng nhập mã xác thực 6 số.", "Please enter the 6-digit verification code."));
      return;
    }
    if (isOtpExpired) {
      setError(text("Mã xác thực đã hết hạn (quá 5 phút). Vui lòng bấm 'Gửi lại mã' để tiếp tục.", "Code expired (> 5 mins). Please resend code."));
      return;
    }

    setLoading(true);
    setError(null);

    const result = await verifyRegistrationOtp(otpEmail, otpCode);
    setLoading(false);

    if (result.success && result.user) {
      // NẾU TÀI KHOẢN MỚI CHƯA CÓ THÔNG TIN CÁ NHÂN: CHUYỂN NGAY SANG BƯỚC ONBOARDING (TÊN, GIỚI TÍNH, ĐỘ TUỔI)
      if (result.isNewUser || !result.user.age) {
        setIsWelcomeCelebrate(true);
        setSuccessMsg(text(
          "🎉 Kích hoạt tài khoản thành công! Vui lòng hoàn tất thông tin cá nhân dưới đây để trợ lý AI Stylist cá nhân hóa cho bạn.",
          "🎉 Account activated! Please complete your basic profile so AI Stylist can personalize outfits for you."
        ));

        const targetUser = result.user;
        setOnboardingUser(targetUser);
        setOnboardingData({
          fullName: targetUser.fullName || formData.fullName || '',
          gender: targetUser.gender || formData.gender || 'Nam',
          age: targetUser.age || 22,
          height: targetUser.height || (targetUser.gender === 'Nữ' ? 165 : 175),
          weight: targetUser.weight || (targetUser.gender === 'Nữ' ? 52 : 68),
        });

        setTimeout(() => {
          setIsWelcomeCelebrate(false);
          setSuccessMsg(null);
          setMode('onboarding');
        }, 1200);
        return;
      }

      setIsWelcomeCelebrate(true);
      setSuccessMsg(text(
        "🎉 Chúc mừng! Tài khoản đã được kích hoạt thành công. Thông báo chào mừng đã được gửi về email của bạn!",
        "🎉 Account activated! Welcome email has been sent to your inbox!"
      ));

      // Khởi tạo tủ đồ mặc định
      const initialClothes = getInitialClothesForGender(result.user.gender || 'Nam');
      localStorage.setItem('myfitdaily_user_clothes', JSON.stringify(initialClothes));
      const initialOutfits = getInitialOutfitsForGender(result.user.gender || 'Nam');
      localStorage.setItem('myfitdaily_outfits', JSON.stringify(initialOutfits));

      // Tự động đóng modal và đăng nhập sau 1.8 giây
      setTimeout(() => {
        onAuthSuccess(result.user);
        onClose();
      }, 1800);
    } else {
      setError(result.message || text("Mã xác thực không hợp lệ. Vui lòng thử lại!", "Invalid code. Please try again!"));
    }
  };

  // Submit Handler for Onboarding (Tên, Giới tính, Độ tuổi)
  const handleOnboardingSubmit = async (e) => {
    e.preventDefault();
    if (!onboardingData.fullName.trim()) {
      setError(text("Vui lòng nhập họ và tên của bạn.", "Please enter your full name."));
      return;
    }
    const ageNum = parseInt(onboardingData.age, 10);
    if (!ageNum || ageNum < 10 || ageNum > 120) {
      setError(text("Vui lòng nhập độ tuổi hợp lệ (10 - 120 tuổi).", "Please enter a valid age (10 - 120)."));
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      fullName: onboardingData.fullName.trim(),
      gender: onboardingData.gender,
      age: ageNum,
      height: onboardingData.height ? parseFloat(onboardingData.height) : (onboardingData.gender === 'Nữ' ? 165 : 175),
      weight: onboardingData.weight ? parseFloat(onboardingData.weight) : (onboardingData.gender === 'Nữ' ? 52 : 68),
    };

    try {
      const res = await apiRequest('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      setLoading(false);

      const targetUser = onboardingUser || pendingOnboardingUser || (res.data?.data) || {};
      const updatedUser = {
        ...targetUser,
        ...payload,
        isNewUser: false,
        needsProfileSetup: false,
        ageGroup: ageNum <= 24 ? 'Gen Z (16 - 24 tuổi)' : (ageNum <= 34 ? 'Millennials (25 - 34 tuổi)' : 'Trưởng thành (35+ tuổi)')
      };

      // Khởi tạo tủ đồ và outfits theo giới tính người dùng chọn
      const initialClothes = getInitialClothesForGender(onboardingData.gender);
      localStorage.setItem('myfitdaily_user_clothes', JSON.stringify(initialClothes));
      const initialOutfits = getInitialOutfitsForGender(onboardingData.gender);
      localStorage.setItem('myfitdaily_outfits', JSON.stringify(initialOutfits));

      localStorage.setItem('myfitdaily_user', JSON.stringify(updatedUser));

      setIsWelcomeCelebrate(true);
      setSuccessMsg(text("🎉 Hồ sơ đã được thiết lập thành công! Chào mừng bạn đến với MyFitDaily.", "🎉 Profile saved! Welcome to MyFitDaily."));

      setTimeout(() => {
        onAuthSuccess(updatedUser);
        onClose();
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError(text("Không thể lưu thông tin hồ sơ. Vui lòng thử lại!", "Cannot save profile. Please try again!"));
    }
  };

  const getAgeGroupLabel = (age) => {
    const num = parseInt(age, 10);
    if (!num) return text('Chưa chọn tuổi', 'Age not set');
    if (num <= 24) return text('✨ Gen Z (16 - 24 tuổi)', '✨ Gen Z (16 - 24 yrs)');
    if (num <= 34) return text('💼 Millennials (25 - 34 tuổi)', '💼 Millennials (25 - 34 yrs)');
    if (num <= 49) return text('💎 Đĩnh đạc (35 - 49 tuổi)', '💎 Established (35 - 49 yrs)');
    return text('👑 Quý phái (50+ tuổi)', '👑 Mature (50+ yrs)');
  };

  const handleModalClose = async () => {
    if (mode === 'onboarding') {
      try {
        await signOutFromSupabase();
      } catch { }
      localStorage.removeItem('myfitdaily_token');
      localStorage.removeItem('myfitdaily_user');
    }
    setMode('login');
    setOnboardingUser(null);
    setError(null);
    setSuccessMsg(null);
    onClose();
  };

  const handleCancelOnboarding = async () => {
    try {
      await signOutFromSupabase();
    } catch { }
    localStorage.removeItem('myfitdaily_token');
    localStorage.removeItem('myfitdaily_user');
    setOnboardingUser(null);
    setMode('login');
    setError(null);
    setSuccessMsg(null);
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (!otpEmail) return;
    setLoading(true);
    setError(null);
    const result = await resendVerificationOtp(otpEmail);
    setLoading(false);
    if (result.success) {
      setOtpTimeLeft(result.expiresInSeconds || 300);
      setIsOtpExpired(false);
      setOtpCode(''); // Luôn giữ trống, đợi người dùng kiểm tra mail
      setSuccessMsg(text("Mã xác nhận mới đã được gửi về email của bạn (Hiệu lực 5 phút).", "New code sent (Valid for 5 mins)."));
    } else {
      setError(result.message);
    }
  };

  // Submit Handler for Login, Register & Forgot Password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // MODE: LOGIN
    if (mode === 'login') {
      if (!formData.email.trim()) {
        setError(text("Vui lòng nhập Email hoặc Tên tài khoản.", "Please enter your email or username."));
        return;
      }
      if (!formData.password) {
        setError(text("Vui lòng nhập mật khẩu.", "Please enter your password."));
        return;
      }
      await executeLogin(formData.email, formData.password);
      return;
    }

    // MODE: REGISTER (Sends 5-minute OTP)
    if (mode === 'register') {
      if (!formData.fullName.trim()) {
        setError(text("Vui lòng nhập Họ và Tên.", "Please enter your full name."));
        return;
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.email.trim())) {
        setError(text("Địa chỉ email không đúng định dạng.", "Invalid email address format."));
        return;
      }
      if (formData.password.length < 6) {
        setError(text("Mật khẩu phải chứa ít nhất 6 ký tự.", "Password must be at least 6 characters long."));
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError(text("Mật khẩu xác nhận không khớp.", "Passwords do not match."));
        return;
      }
      if (!formData.agreeTerms) {
        setError(text("Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.", "Please accept the Terms and Privacy Policy."));
        return;
      }

      setLoading(true);
      const cleanEmail = formData.email.trim().toLowerCase();

      try {
        const res = await apiRequest('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            email: cleanEmail,
            password: formData.password,
            fullName: formData.fullName.trim(),
            gender: formData.gender,
          }),
        });

        setLoading(false);

        if (res.ok && res.data?.success) {
          const authData = res.data.data;
          
          // Gửi mã OTP xác thực thực tế về email người dùng
          try {
            await supabase.auth.signInWithOtp({
              email: cleanEmail,
              options: { shouldCreateUser: true }
            });
            console.log("[MyFitDaily] Real OTP email sent to:", cleanEmail);
          } catch (otpErr) {
            console.warn("[MyFitDaily] Supabase OTP send note:", otpErr);
          }

          // Chuyển sang màn hình xác thực OTP 5 phút
          setOtpEmail(cleanEmail);
          setOtpTimeLeft(authData?.expiresInSeconds || 300);
          setIsOtpExpired(false);
          setMode('verify-otp');
          setOtpCode(''); // Luôn để trống, người dùng phải nhập mã từ email
          setSuccessMsg(res.data.message || text(
            `Mã xác thực đã được gửi tới ${cleanEmail}. Mã có hiệu lực trong 5 phút.`,
            `Verification code sent to ${cleanEmail} (Valid for 5 mins).`
          ));
          return;
        }

        const msg = res.data?.message || (res.data?.errors ? Object.values(res.data.errors).flat().join(', ') : null);
        setError(msg || text("Không thể tạo tài khoản. Email này có thể đã được đăng ký.", "Registration failed."));
      } catch (err) {
        setLoading(false);
        setError(text("Đã xảy ra lỗi khi tạo tài khoản. Vui lòng thử lại!", "Error creating account."));
      }
      return;
    }

    // MODE: FORGOT PASSWORD
    if (mode === 'forgot') {
      if (!formData.email.trim()) {
        setError(text("Vui lòng nhập địa chỉ email đã đăng ký.", "Please enter your registered email address."));
        return;
      }
      setLoading(true);
      try {
        const res = await apiRequest('/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ email: formData.email.trim() }),
        });
        setLoading(false);
        if (res.ok && res.data?.success) {
          setSuccessMsg(res.data.message || text("Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn.", "Password reset link sent to your email."));
        } else {
          setSuccessMsg(text(`Mã khôi phục đã được gửi tới ${formData.email.trim()}. Vui lòng kiểm tra hộp thư của bạn!`, `Recovery instructions sent to ${formData.email.trim()}.`));
        }
      } catch (err) {
        setLoading(false);
        setSuccessMsg(text(`Liên kết khôi phục mật khẩu đã được gửi đến ${formData.email.trim()}. Vui lòng kiểm tra hộp thư!`, `Recovery instructions sent to ${formData.email.trim()}.`));
      }
    }
  };

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(7, 10, 19, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
        overflowY: 'auto',
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '36px 32px 30px',
          position: 'relative',
          background: isLight 
            ? '#FFFFFF' 
            : 'linear-gradient(180deg, #181C26 0%, #12151E 100%)',
          border: isLight 
            ? '1.5px solid rgba(212, 175, 55, 0.35)' 
            : '1px solid rgba(212, 175, 55, 0.28)',
          borderRadius: '26px',
          boxShadow: isLight 
            ? '0 25px 60px rgba(0, 0, 0, 0.12), 0 0 30px rgba(212, 175, 55, 0.1)' 
            : '0 30px 80px rgba(0, 0, 0, 0.85), 0 0 40px rgba(212, 175, 55, 0.15)',
          maxHeight: '94vh',
          overflowY: 'auto',
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleModalClose}
          id="btn-close-auth-modal"
          aria-label={text("Đóng cửa sổ", "Close modal")}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.08)',
            color: 'var(--text-secondary, #9CA3AF)',
            border: isLight ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isLight ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.18)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.color = 'var(--text-secondary, #9CA3AF)';
          }}
        >
          <X size={17} />
        </button>

        {/* Brand Logo & Heading */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: '#FFFFFF',
            border: '2px solid rgba(212, 175, 55, 0.65)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18), 0 0 20px rgba(212, 175, 55, 0.3)',
            marginBottom: '14px',
            padding: '6px'
          }}>
            <img 
              src="/assets/logo.png" 
              alt="MyFitDaily Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
            />
          </div>

          <h3 style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            margin: 0,
          }}>
            {mode === 'login' && text('Chào Mừng Trở Lại', 'Welcome Back')}
            {mode === 'register' && text('Tạo Tài Khoản Mới', 'Create Your Account')}
            {mode === 'forgot' && text('Khôi Phục Mật Khẩu', 'Reset Your Password')}
            {mode === 'verify-otp' && text('Xác Thực Kích Hoạt Tài Khoản', 'Verify & Activate Account')}
            {mode === 'onboarding' && text('Thiết Lập Hồ Sơ Cá Nhân', 'Personalize Your Profile')}
          </h3>
          <p style={{
            fontSize: '0.84rem',
            color: 'var(--text-secondary)',
            marginTop: '6px',
            lineHeight: 1.5,
          }}>
            {mode === 'login' && text('Đăng nhập để đồng bộ tủ đồ thông minh và trải nghiệm AI Stylist', 'Sign in to access your digital wardrobe and AI styling')}
            {mode === 'register' && text('Hệ thống sẽ gửi mã xác thực 5 phút về email để kích hoạt tài khoản', 'A 5-minute activation code will be sent to your email')}
            {mode === 'forgot' && text('Nhập email của bạn để nhận liên kết khôi phục mật khẩu bảo mật', 'Enter your email to receive a secure password reset link')}
            {mode === 'verify-otp' && (
              <span>
                {text('Mã xác thực 6 số đã được gửi tới: ', 'A 6-digit verification code was sent to: ')}
                <strong style={{ color: '#D4AF37' }}>{otpEmail}</strong>
              </span>
            )}
            {mode === 'onboarding' && text('Chia sẻ một số thông tin cơ bản để trợ lý AI cá nhân hóa phong cách chuẩn dáng cho bạn', 'Share basic info so AI Stylist can personalize styles to your body')}
          </p>
        </div>

        {/* Tab Navigation (Login vs Register) */}
        {mode !== 'forgot' && mode !== 'verify-otp' && mode !== 'onboarding' && (
          <div style={{
            display: 'flex',
            background: isLight ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.05)',
            borderRadius: '14px',
            padding: '4px',
            marginBottom: '20px',
            border: isLight ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <button
              type="button"
              id="tab-btn-login"
              onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '11px',
                fontWeight: 700,
                fontSize: '0.88rem',
                background: mode === 'login' 
                  ? 'linear-gradient(135deg, #D4AF37 0%, #C27D5E 100%)' 
                  : 'transparent',
                color: mode === 'login' ? '#FFFFFF' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: mode === 'login' ? '0 4px 14px rgba(212, 175, 55, 0.35)' : 'none',
              }}
            >
              {text('Đăng Nhập', 'Sign In')}
            </button>
            <button
              type="button"
              id="tab-btn-register"
              onClick={() => { setMode('register'); setError(null); setSuccessMsg(null); }}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '11px',
                fontWeight: 700,
                fontSize: '0.88rem',
                background: mode === 'register' 
                  ? 'linear-gradient(135deg, #D4AF37 0%, #C27D5E 100%)' 
                  : 'transparent',
                color: mode === 'register' ? '#FFFFFF' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: mode === 'register' ? '0 4px 14px rgba(212, 175, 55, 0.35)' : 'none',
              }}
            >
              {text('Đăng Ký', 'Sign Up')}
            </button>
          </div>
        )}

        {/* OAuth Social Login Button (Google) - only on Login / Register */}
        {mode !== 'forgot' && mode !== 'verify-otp' && mode !== 'onboarding' && (
          <div style={{ marginBottom: '20px' }}>
            <button
              type="button"
              id="btn-social-google"
              onClick={handleContinueWithGoogle}
              disabled={loading || socialLoading !== null}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '13px',
                background: isLight ? '#FFFFFF' : 'rgba(255, 255, 255, 0.05)',
                border: isLight ? '1.5px solid rgba(66, 133, 244, 0.35)' : '1px solid rgba(255, 255, 255, 0.12)',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: (loading || socialLoading !== null) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isLight ? '0 2px 10px rgba(66, 133, 244, 0.08)' : '0 2px 10px rgba(0, 0, 0, 0.25)',
                opacity: (loading || socialLoading !== null) ? 0.7 : 1,
              }}
              title={text("Nếu đã có tài khoản thì vào luôn, nếu chưa có thì gửi mã 5 phút xác nhận về mail", "Login directly or verify new account")}
            >
              {socialLoading === 'google' ? (
                <>
                  <RefreshCw size={17} className="animate-spin" />
                  <span>{text('Đang kết nối Google...', 'Connecting Google...')}</span>
                </>
              ) : (
                <>
                  <svg width="19" height="19" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>{mode === 'register' ? text('Đăng ký bằng Google', 'Sign up with Google') : text('Tiếp tục với Google', 'Continue with Google')}</span>
                </>
              )}
            </button>

            {/* Subtle Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '18px',
            }}>
              <div style={{ flex: 1, height: '1px', background: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.09)' }} />
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {text('Hoặc tiếp tục với email', 'Or continue with email')}
              </span>
              <div style={{ flex: 1, height: '1px', background: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.09)' }} />
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#F87171',
            padding: '11px 14px',
            borderRadius: '12px',
            fontSize: '0.84rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            lineHeight: 1.4,
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: '#34D399',
            padding: '12px 14px',
            borderRadius: '12px',
            fontSize: '0.84rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
          }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 700 }}>{text('Thông báo', 'Notification')}</div>
              <div style={{ marginTop: '2px', lineHeight: 1.4 }}>{successMsg}</div>
            </div>
          </div>
        )}

        {/* MODE: VERIFY OTP (5-MINUTE EXPIRATION WINDOW) */}
        {mode === 'verify-otp' && (
          <form onSubmit={handleVerifyOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Countdown Timer Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '14px',
              background: isOtpExpired 
                ? 'rgba(239, 68, 68, 0.15)' 
                : 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(194, 125, 94, 0.15))',
              border: isOtpExpired 
                ? '1px solid rgba(239, 68, 68, 0.4)' 
                : '1px solid rgba(212, 175, 55, 0.45)',
            }}>
              <Clock size={18} color={isOtpExpired ? '#EF4444' : '#D4AF37'} />
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {isOtpExpired ? text('Thời hạn xác thực đã hết:', 'Verification expired:') : text('Thời gian hiệu lực còn lại:', 'Code expires in:')}
              </span>
              <span style={{
                fontSize: '1.05rem',
                fontWeight: 800,
                color: isOtpExpired ? '#EF4444' : '#F3D98A',
                letterSpacing: '1px',
              }}>
                {formatTime(otpTimeLeft)}
              </span>
            </div>

            {/* OTP Warning if expired */}
            {isOtpExpired && (
              <div style={{
                fontSize: '0.82rem',
                color: '#EF4444',
                textAlign: 'center',
                lineHeight: 1.4,
                background: 'rgba(239, 68, 68, 0.08)',
                padding: '10px',
                borderRadius: '10px',
              }}>
                {text(
                  '⏱ Đã quá thời hạn 5 phút. Tài khoản chưa được đăng ký. Vui lòng nhấn "Gửi lại mã" bên dưới để nhận mã mới.',
                  '⏱ 5-minute window expired. Please click "Resend Code" below to get a new code.'
                )}
              </div>
            )}

            {/* 6-Digit Code Input Box */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)', textAlign: 'center' }}>
                {text('Nhập mã xác thực 6 số', 'Enter 6-digit verification code')}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  maxLength={6}
                  id="input-auth-otp"
                  placeholder="• • • • • •"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  disabled={loading || isWelcomeCelebrate}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    background: isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.06)',
                    border: '2px solid rgba(212, 175, 55, 0.5)',
                    color: 'var(--text-primary)',
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    letterSpacing: '8px',
                    textAlign: 'center',
                    outline: 'none',
                  }}
                  autoFocus
                />
              </div>
            </div>

            {/* Submit Verification Button */}
            <button
              type="submit"
              id="btn-submit-verify-otp"
              disabled={loading || isOtpExpired || otpCode.length < 4 || isWelcomeCelebrate}
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '0.94rem',
                fontWeight: 700,
                borderRadius: '13px',
                background: isOtpExpired 
                  ? '#6B7280' 
                  : 'linear-gradient(135deg, #D4AF37 0%, #C27D5E 100%)',
                color: '#FFFFFF',
                border: 'none',
                boxShadow: isOtpExpired ? 'none' : '0 4px 18px rgba(212, 175, 55, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: (loading || isOtpExpired || isWelcomeCelebrate) ? 'not-allowed' : 'pointer',
                opacity: (loading || isOtpExpired) ? 0.65 : 1,
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={17} className="animate-spin" />
                  <span>{text('Đang xác thực...', 'Verifying...')}</span>
                </>
              ) : isWelcomeCelebrate ? (
                <>
                  <PartyPopper size={18} />
                  <span>{text('Đang khởi tạo tài khoản...', 'Initializing account...')}</span>
                </>
              ) : (
                <>
                  <span>{text('Xác Nhận & Kích Hoạt Tài Khoản', 'Verify & Activate Account')}</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>

            {/* Resend & Back controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.82rem' }}>
              <button
                type="button"
                id="btn-back-to-mode"
                onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                ← {text('Quay lại', 'Back')}
              </button>

              <button
                type="button"
                id="btn-resend-otp"
                onClick={handleResendOtp}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isLight ? '#996515' : '#F3D98A',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0,
                }}
              >
                <Send size={13} />
                <span>{text('Gửi lại mã xác thực', 'Resend code')}</span>
              </button>
            </div>
          </form>
        )}

        {/* MODE: ONBOARDING PROFILE SETUP (TÊN, GIỚI TÍNH, ĐỘ TUỔI) */}
        {mode === 'onboarding' && (
          <form onSubmit={handleOnboardingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Step Progress Banner */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(59, 130, 246, 0.12))',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-primary)'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981' }}>
                <CheckCircle2 size={16} />
                {text('1. Xác thực Email', '1. Email Verified')}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>➔</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#F59E0B', fontWeight: 700 }}>
                <Sparkles size={16} />
                {text('2. Thông tin cơ bản', '2. Profile Details')}
              </span>
            </div>

            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                {text('Họ và Tên của bạn', 'Your Full Name')} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  id="input-onboarding-fullname"
                  placeholder={text("VD: Hà Trung Thành", "e.g. Alex Morgan")}
                  value={onboardingData.fullName}
                  onChange={(e) => setOnboardingData({ ...onboardingData, fullName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 38px',
                    borderRadius: '12px',
                    background: isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.05)',
                    border: isLight ? '1px solid rgba(0, 0, 0, 0.14)' : '1px solid rgba(255, 255, 255, 0.12)',
                    color: 'var(--text-primary)',
                    fontSize: '0.92rem',
                    outline: 'none',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                  onBlur={(e) => e.target.style.borderColor = isLight ? 'rgba(0, 0, 0, 0.14)' : 'rgba(255, 255, 255, 0.12)'}
                />
                <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            {/* Gender Selection */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
                {text('Giới tính phong cách', 'Fashion Gender')} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {[
                  { key: 'Nam', label: text('Nam', 'Men'), icon: '👔' },
                  { key: 'Nữ', label: text('Nữ', 'Women'), icon: '👗' },
                  { key: 'Khác', label: text('Unisex', 'Unisex'), icon: '✨' },
                ].map(item => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setOnboardingData({ ...onboardingData, gender: item.key })}
                    style={{
                      padding: '11px 8px',
                      borderRadius: '12px',
                      border: onboardingData.gender === item.key 
                        ? '2px solid #D4AF37' 
                        : (isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)'),
                      background: onboardingData.gender === item.key
                        ? (isLight ? 'rgba(212, 175, 55, 0.14)' : 'rgba(212, 175, 55, 0.22)')
                        : (isLight ? '#F9FAFB' : 'rgba(255,255,255,0.03)'),
                      color: 'var(--text-primary)',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: onboardingData.gender === item.key ? '0 4px 12px rgba(212, 175, 55, 0.25)' : 'none'
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Age Selection */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {text('Độ tuổi của bạn', 'Your Age')} <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <span style={{
                  fontSize: '0.76rem',
                  padding: '3px 8px',
                  borderRadius: '20px',
                  background: 'rgba(212, 175, 55, 0.15)',
                  color: '#D4AF37',
                  fontWeight: 700
                }}>
                  {getAgeGroupLabel(onboardingData.age)}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  required
                  min="10"
                  max="120"
                  id="input-onboarding-age"
                  value={onboardingData.age}
                  onChange={(e) => setOnboardingData({ ...onboardingData, age: parseInt(e.target.value, 10) || '' })}
                  style={{
                    width: '80px',
                    padding: '9px 10px',
                    borderRadius: '12px',
                    background: isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.05)',
                    border: isLight ? '1px solid rgba(0, 0, 0, 0.14)' : '1px solid rgba(255, 255, 255, 0.12)',
                    color: 'var(--text-primary)',
                    fontSize: '0.98rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    outline: 'none',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                  onBlur={(e) => e.target.style.borderColor = isLight ? 'rgba(0, 0, 0, 0.14)' : 'rgba(255, 255, 255, 0.12)'}
                />
                {/* Quick Age Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', flex: 1 }}>
                  {[18, 20, 22, 25, 28, 32, 40].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setOnboardingData({ ...onboardingData, age: val })}
                      style={{
                        padding: '6px 9px',
                        borderRadius: '9px',
                        background: onboardingData.age === val 
                          ? '#D4AF37' 
                          : (isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.06)'),
                        color: onboardingData.age === val ? '#FFFFFF' : 'var(--text-secondary)',
                        border: 'none',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Optional Body Metrics (Height / Weight) */}
            <div style={{
              background: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)',
              border: isLight ? '1px dashed rgba(0,0,0,0.1)' : '1px dashed rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '11px',
            }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                {text('Thông số vóc dáng gợi ý (Có thể cập nhật sau trong mục Hồ sơ):', 'Recommended body metrics (Optional):')}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                    {text('Chiều cao (cm)', 'Height (cm)')}
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="220"
                    placeholder="170"
                    value={onboardingData.height}
                    onChange={(e) => setOnboardingData({ ...onboardingData, height: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: isLight ? '#FFFFFF' : 'rgba(0,0,0,0.2)',
                      border: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
                      color: 'var(--text-primary)',
                      fontSize: '0.86rem',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                    {text('Cân nặng (kg)', 'Weight (kg)')}
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="200"
                    placeholder="65"
                    value={onboardingData.weight}
                    onChange={(e) => setOnboardingData({ ...onboardingData, weight: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: isLight ? '#FFFFFF' : 'rgba(0,0,0,0.2)',
                      border: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.1)',
                      color: 'var(--text-primary)',
                      fontSize: '0.86rem',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Complete & Enter Home Button */}
            <button
              type="submit"
              disabled={loading}
              id="btn-complete-onboarding"
              style={{
                width: '100%',
                padding: '13px 18px',
                borderRadius: '13px',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.94rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 18px rgba(16, 185, 129, 0.35)',
                transition: 'all 0.25s ease',
                marginTop: '4px',
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>{text('Đang lưu thông tin...', 'Saving profile...')}</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>{text('Hoàn Tất & Khám Phá Trang Chủ', 'Complete & Enter Dashboard')}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Quay lại đăng nhập / Đổi tài khoản khác */}
            <div style={{ textAlign: 'center', marginTop: '6px' }}>
              <button
                type="button"
                id="btn-onboarding-switch-account"
                onClick={handleCancelOnboarding}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary, #9CA3AF)',
                  fontSize: '0.82rem',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: '6px 12px',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#D4AF37'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary, #9CA3AF)'; }}
              >
                {text('← Đăng xuất / Đăng nhập tài khoản khác', '← Sign out / Use different account')}
              </button>
            </div>
          </form>
        )}

        {/* AUTH FORM: LOGIN, REGISTER & FORGOT */}
        {mode !== 'verify-otp' && mode !== 'onboarding' && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Full Name (Register Mode Only) */}
            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '5px', color: 'var(--text-primary)' }}>
                  {text('Họ và Tên', 'Full Name')} <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    id="input-auth-name"
                    placeholder={text("VD: Hà Trung Thành", "e.g. Alex Morgan")}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 38px',
                      borderRadius: '12px',
                      background: isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.05)',
                      border: isLight ? '1px solid rgba(0, 0, 0, 0.14)' : '1px solid rgba(255, 255, 255, 0.12)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                    onBlur={(e) => e.target.style.borderColor = isLight ? 'rgba(0, 0, 0, 0.14)' : 'rgba(255, 255, 255, 0.12)'}
                  />
                  <User size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                </div>
              </div>
            )}

            {/* Gender Selector (Register Mode Only) */}
            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '5px', color: 'var(--text-primary)' }}>
                  {text('Giới tính (Để cá nhân hóa vóc dáng & tủ đồ)', 'Gender (For personalized wardrobe & 3D styling)')}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    id="btn-select-gender-male"
                    onClick={() => setFormData({ ...formData, gender: 'Nam' })}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: formData.gender === 'Nam' 
                        ? (isLight ? 'rgba(59, 130, 246, 0.12)' : 'rgba(59, 130, 246, 0.2)') 
                        : (isLight ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.04)'),
                      border: `1.5px solid ${formData.gender === 'Nam' ? '#3B82F6' : (isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255, 255, 255, 0.1)')}`,
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span>👨</span>
                    <span>{text('Nam', 'Male')}</span>
                  </button>
                  <button
                    type="button"
                    id="btn-select-gender-female"
                    onClick={() => setFormData({ ...formData, gender: 'Nữ' })}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: formData.gender === 'Nữ' 
                        ? (isLight ? 'rgba(212, 175, 55, 0.15)' : 'rgba(212, 175, 55, 0.22)') 
                        : (isLight ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.04)'),
                      border: `1.5px solid ${formData.gender === 'Nữ' ? '#D4AF37' : (isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255, 255, 255, 0.1)')}`,
                      color: 'var(--text-primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: 700,
                      fontSize: '0.86rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span>👩</span>
                    <span>{text('Nữ', 'Female')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Email / Username Input */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '5px', color: 'var(--text-primary)' }}>
                {mode === 'login' 
                  ? text('Email hoặc Tên đăng nhập', 'Email or Username') 
                  : (mode === 'register' ? text('Địa chỉ Email', 'Email Address') : text('Email nhận liên kết đặt lại', 'Registered Email'))}
                <span style={{ color: '#EF4444' }}> *</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={mode === 'login' ? 'text' : 'email'}
                  required
                  id="input-auth-email"
                  placeholder={mode === 'login' ? text("Nhập email hoặc tên tài khoản...", "Enter email or username...") : "name@example.com"}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 38px',
                    borderRadius: '12px',
                    background: isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.05)',
                    border: isLight ? '1px solid rgba(0, 0, 0, 0.14)' : '1px solid rgba(255, 255, 255, 0.12)',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                  onBlur={(e) => e.target.style.borderColor = isLight ? 'rgba(0, 0, 0, 0.14)' : 'rgba(255, 255, 255, 0.12)'}
                />
                <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            {/* Password Input (Login & Register Mode) */}
            {mode !== 'forgot' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {text('Mật khẩu', 'Password')} <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setError(null); setSuccessMsg(null); }}
                      id="link-forgot-password"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: isLight ? '#996515' : '#F3D98A',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      {text('Quên mật khẩu?', 'Forgot password?')}
                    </button>
                  )}
                </div>

                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    id="input-auth-password"
                    placeholder={mode === 'login' ? text("Nhập mật khẩu của bạn", "Enter your password") : text("Tối thiểu 6 ký tự", "Min 6 characters")}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 40px 11px 38px',
                      borderRadius: '12px',
                      background: isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.05)',
                      border: isLight ? '1px solid rgba(0, 0, 0, 0.14)' : '1px solid rgba(255, 255, 255, 0.12)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                    onBlur={(e) => e.target.style.borderColor = isLight ? 'rgba(0, 0, 0, 0.14)' : 'rgba(255, 255, 255, 0.12)'}
                  />
                  <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <button
                    type="button"
                    id="btn-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '10px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title={showPassword ? text("Ẩn mật khẩu", "Hide password") : text("Hiện mật khẩu", "Show password")}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password strength indicator for registration */}
                {mode === 'register' && formData.password && (
                  <div style={{ marginTop: '7px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '3px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{text('Độ mạnh mật khẩu:', 'Password strength:')}</span>
                      <span style={{ color: strength.color, fontWeight: 700 }}>{strength.label}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', height: '4px' }}>
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          style={{
                            flex: 1,
                            borderRadius: '2px',
                            background: step <= strength.score ? strength.color : (isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'),
                            transition: 'background 0.3s ease',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Confirm Password (Register Mode Only) */}
            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '5px', color: 'var(--text-primary)' }}>
                  {text('Xác nhận mật khẩu', 'Confirm Password')} <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    id="input-auth-confirm-password"
                    placeholder={text("Nhập lại mật khẩu", "Repeat password")}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '11px 40px 11px 38px',
                      borderRadius: '12px',
                      background: isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.05)',
                      border: isLight ? '1px solid rgba(0, 0, 0, 0.14)' : '1px solid rgba(255, 255, 255, 0.12)',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                    onBlur={(e) => e.target.style.borderColor = isLight ? 'rgba(0, 0, 0, 0.14)' : 'rgba(255, 255, 255, 0.12)'}
                  />
                  <KeyRound size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  <button
                    type="button"
                    id="btn-toggle-confirm-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '10px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title={showConfirmPassword ? text("Ẩn mật khẩu", "Hide password") : text("Hiện mật khẩu", "Show password")}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {/* Remember Me Checkbox (Login Mode) */}
            {mode === 'login' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  id="checkbox-remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: '#D4AF37',
                    cursor: 'pointer',
                  }}
                />
                <label 
                  htmlFor="checkbox-remember-me"
                  style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}
                >
                  {text('Ghi nhớ đăng nhập trên thiết bị này', 'Remember me on this device')}
                </label>
              </div>
            )}

            {/* Terms Agreement (Register Mode) */}
            {mode === 'register' && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '2px' }}>
                <input
                  type="checkbox"
                  required
                  id="checkbox-agree-terms"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  style={{
                    width: '16px',
                    height: '16px',
                    marginTop: '2px',
                    accentColor: '#D4AF37',
                    cursor: 'pointer',
                  }}
                />
                <label 
                  htmlFor="checkbox-agree-terms"
                  style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, cursor: 'pointer', userSelect: 'none' }}
                >
                  {text(
                    'Tôi đồng ý với Điều khoản Dịch vụ và Chính sách Bảo mật của MyFitDaily.',
                    'I agree to the MyFitDaily Terms of Service and Privacy Policy.'
                  )}
                </label>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              id="btn-submit-auth"
              disabled={loading}
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '13px',
                fontSize: '0.94rem',
                fontWeight: 700,
                borderRadius: '13px',
                marginTop: '4px',
                background: 'linear-gradient(135deg, #D4AF37 0%, #C27D5E 100%)',
                color: '#FFFFFF',
                border: 'none',
                boxShadow: '0 4px 18px rgba(212, 175, 55, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.75 : 1,
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={17} className="animate-spin" />
                  <span>{text('Đang xử lý...', 'Processing...')}</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'login' && text('Đăng Nhập Ngay', 'Sign In')}
                    {mode === 'register' && text('Đăng Ký & Nhận Mã Xác Thực (5 Phút)', 'Create & Get 5-Min Code')}
                    {mode === 'forgot' && text('Gửi Hướng Dẫn Đặt Lại', 'Send Reset Link')}
                  </span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Back to Login link when in Forgot Password mode */}
        {mode === 'forgot' && (
          <div style={{ textAlign: 'center', marginTop: '18px' }}>
            <button
              type="button"
              id="btn-back-to-login"
              onClick={() => { setMode('login'); setError(null); setSuccessMsg(null); }}
              style={{
                background: 'none',
                border: 'none',
                color: isLight ? '#996515' : '#F3D98A',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>← {text('Quay lại Đăng Nhập', 'Back to Sign In')}</span>
            </button>
          </div>
        )}

        {/* Security & Privacy Footer */}
        <div style={{
          marginTop: '22px',
          paddingTop: '14px',
          borderTop: isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.08)',
          textAlign: 'center',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}>
          <ShieldCheck size={14} color="#10B981" />
          <span>{text('Bảo mật dữ liệu 256-bit SSL & Supabase Auth tiêu chuẩn quốc tế', '256-bit SSL encryption & Supabase Auth secured')}</span>
        </div>
      </div>
    </div>
  );
}