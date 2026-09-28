import { supabase } from '../api/supabaseClient';
import { apiRequest } from '../api/apiClient';

/**
 * Đăng nhập bằng Google qua Supabase Auth OAuth
 * Tự động chuyển hướng trình duyệt trực tiếp sang trang xác thực Google (accounts.google.com)
 */
export async function signInWithGoogle() {
  const redirectUrl = `${window.location.origin}/`;
  console.log("[MyFitDaily] Requesting Google OAuth with redirect:", redirectUrl);
  
  const directAuthorizeUrl = `https://cewdaygasiwjfjlgmnwn.supabase.co/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUrl)}&access_type=offline&prompt=select_account`;

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      console.warn("[MyFitDaily] Supabase SDK error, navigating via direct URL:", error);
      window.location.assign(directAuthorizeUrl);
      return;
    }

    if (data?.url) {
      window.location.assign(data.url);
      return data;
    }

    window.location.assign(directAuthorizeUrl);
    return data;
  } catch (err) {
    console.warn("[MyFitDaily] Exception caught, navigating via direct URL:", err);
    window.location.assign(directAuthorizeUrl);
  }
}

/**
 * Đăng nhập bằng Facebook qua Supabase Auth OAuth
 * Tự động chuyển hướng trình duyệt trực tiếp sang trang xác thực Facebook (facebook.com)
 */
export async function signInWithFacebook() {
  const redirectUrl = `${window.location.origin}/`;
  const directAuthorizeUrl = `https://cewdaygasiwjfjlgmnwn.supabase.co/auth/v1/authorize?provider=facebook&redirect_to=${encodeURIComponent(redirectUrl)}`;

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: redirectUrl,
        scopes: 'email,public_profile',
      },
    });

    if (error) {
      window.location.assign(directAuthorizeUrl);
      return;
    }

    if (data?.url) {
      window.location.assign(data.url);
      return data;
    }

    window.location.assign(directAuthorizeUrl);
    return data;
  } catch {
    window.location.assign(directAuthorizeUrl);
  }
}

/**
 * Đồng bộ người dùng Supabase OAuth với bảng Users hiện tại của MyFitDaily trên Backend
 * - Nếu đã có tài khoản: Vào luôn (trả về User và JWT token)
 * - Nếu chưa có tài khoản: Yêu cầu mã xác thực 6 số gửi về email (hiệu lực 5 phút)
 */
export async function syncSocialUserWithBackend(supabaseUser, provider = 'Google') {
  if (!supabaseUser || !supabaseUser.email) {
    throw new Error("Không thể trích xuất thông tin email từ phiên đăng nhập OAuth.");
  }

  const metadata = supabaseUser.user_metadata || {};
  const fullName = metadata.full_name || metadata.name || supabaseUser.email.split('@')[0];
  const avatarUrl = metadata.avatar_url || metadata.picture || null;
  const inferredGender = metadata.gender 
    ? (metadata.gender.toLowerCase() === 'female' ? 'Nữ' : 'Nam')
    : 'Nam';

  const payload = {
    provider: provider,
    email: supabaseUser.email.trim().toLowerCase(),
    fullName: fullName,
    avatarUrl: avatarUrl,
    gender: inferredGender,
    providerKey: supabaseUser.id,
    isEmailConfirmed: Boolean(supabaseUser.email_confirmed_at),
  };

  const res = await apiRequest('/auth/social-login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (res.ok && res.data?.success) {
    const authData = res.data.data;
    
    // Nếu là người dùng mới: yêu cầu xác nhận email trong 5 phút
    if (authData?.requiresVerification) {
      // Gửi mã OTP thực tế qua Supabase Auth tới hòm thư người dùng
      try {
        await supabase.auth.signInWithOtp({
          email: supabaseUser.email.trim().toLowerCase(),
          options: { shouldCreateUser: true }
        });
        console.log("[MyFitDaily] Real OTP email dispatched via Supabase to:", supabaseUser.email);
      } catch (err) {
        console.warn("[MyFitDaily] Supabase signInWithOtp notice:", err);
      }

      return {
        requiresVerification: true,
        verificationEmail: authData.verificationEmail || supabaseUser.email,
        expiresInSeconds: authData.expiresInSeconds || 300,
        user: authData.user,
        message: res.data.message
      };
    }

    // Lưu token phiên đăng nhập
    localStorage.setItem('myfitdaily_token', authData.token);
    const isNewUserFlag = Boolean(authData.isNewUser || authData.needsProfileSetup || (!authData.user?.age && authData.user?.role !== 'Admin'));
    const enrichedUser = {
      ...authData.user,
      isNewUser: isNewUserFlag,
      needsProfileSetup: isNewUserFlag
    };
    localStorage.setItem('myfitdaily_user', JSON.stringify(enrichedUser));
    return enrichedUser;
  }

  throw new Error(res.data?.message || "Lỗi khi đồng bộ tài khoản với máy chủ MyFitDaily.");
}

/**
 * Xác thực mã OTP 6 số để hoàn tất đăng ký tài khoản (thời hạn 5 phút)
 */
export async function verifyRegistrationOtp(email, otpCode) {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanCode = (otpCode || '').trim();

  let isVerifiedByProvider = false;
  // 1. Thử xác thực với Supabase Auth (mã người dùng nhận từ hộp thư email)
  try {
    const { data: sbData, error: sbError } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanCode,
      type: 'email'
    });
    if (!sbError && (sbData?.session || sbData?.user)) {
      isVerifiedByProvider = true;
      console.log("[MyFitDaily] Supabase OTP confirmed valid!");
    }
  } catch (err) {
    console.warn("[MyFitDaily] Supabase verifyOtp error:", err);
  }

  // 2. Xác thực với Backend MyFitDaily để hoàn tất lưu DB và cấp JWT token
  const res = await apiRequest('/auth/verify-registration-otp', {
    method: 'POST',
    body: JSON.stringify({ 
      email: cleanEmail, 
      otpCode: cleanCode,
      isVerifiedByProvider: isVerifiedByProvider
    }),
  });

  if (res.ok && res.data?.success) {
    const authData = res.data.data;
    localStorage.setItem('myfitdaily_token', authData.token);
    const isNewUserFlag = Boolean(authData.isNewUser || authData.needsProfileSetup || (!authData.user?.age && authData.user?.role !== 'Admin'));
    const enrichedUser = {
      ...authData.user,
      isNewUser: isNewUserFlag,
      needsProfileSetup: isNewUserFlag
    };
    localStorage.setItem('myfitdaily_user', JSON.stringify(enrichedUser));
    return { 
      success: true, 
      user: enrichedUser, 
      isNewUser: isNewUserFlag,
      message: res.data.message 
    };
  }

  return { 
    success: false, 
    message: res.data?.message || "Mã xác thực không hợp lệ hoặc đã hết hạn." 
  };
}

/**
 * Gửi lại mã xác thực mới (hiệu lực 5 phút)
 */
export async function resendVerificationOtp(email) {
  const cleanEmail = (email || '').trim().toLowerCase();

  // Gửi lại mã thực tế vào email
  try {
    await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: { shouldCreateUser: true }
    });
  } catch (err) {
    console.warn("[MyFitDaily] Supabase resend signInWithOtp notice:", err);
  }

  const res = await apiRequest('/auth/resend-verification-otp', {
    method: 'POST',
    body: JSON.stringify({ email: cleanEmail }),
  });

  if (res.ok && res.data?.success) {
    return { 
      success: true, 
      expiresInSeconds: res.data.data?.expiresInSeconds || 300, 
      message: res.data.message 
    };
  }

  return { 
    success: false, 
    message: res.data?.message || "Không thể gửi lại mã xác thực." 
  };
}

/**
 * Đăng xuất an toàn khỏi Supabase Auth và MyFitDaily
 */
export async function signOutFromSupabase() {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn("Supabase signOut error:", err);
  }
  localStorage.removeItem('myfitdaily_token');
  localStorage.removeItem('myfitdaily_user');
}
