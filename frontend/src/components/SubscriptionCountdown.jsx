import React, { useState, useEffect } from 'react';
import { Clock, Crown, Sparkles, AlertCircle, RefreshCw, Zap } from 'lucide-react';
import { calculateRemainingTime } from '../utils/subscriptionUtils';
import { useLanguage } from '../context/LanguageContext';

export default function SubscriptionCountdown({
  expiresAt,
  planType = 'Premium',
  variant = 'banner', // 'banner' | 'compact' | 'pill' | 'card'
  onRenew = null
}) {
  const { text } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(() => calculateRemainingTime(expiresAt));

  useEffect(() => {
    if (!expiresAt) return;
    
    // Update immediately
    setTimeLeft(calculateRemainingTime(expiresAt));

    // Update every second for live countdown ticking
    const interval = setInterval(() => {
      setTimeLeft(calculateRemainingTime(expiresAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!expiresAt || !timeLeft.hasExpiry) {
    return null;
  }

  const isPlus = planType?.toLowerCase().includes('plus');
  const accentColor = isPlus ? '#FB7185' : '#D4AF37';
  const glowColor = isPlus ? 'rgba(251, 113, 133, 0.25)' : 'rgba(212, 175, 55, 0.25)';
  const borderColor = isPlus ? 'rgba(251, 113, 133, 0.4)' : 'rgba(212, 175, 55, 0.4)';
  const planTitle = isPlus ? 'VIP Premium Plus' : 'VIP Premium';

  const pad = (n) => String(n).padStart(2, '0');

  // Variant 1: PILL (Small inline badge for TopBar or Sidebar)
  if (variant === 'pill') {
    if (timeLeft.isExpired) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '2px 8px',
          borderRadius: '9999px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          color: '#F87171',
          fontSize: '0.72rem',
          fontWeight: 700
        }}>
          <AlertCircle size={11} />
          <span>{text('Hết hạn', 'Expired')}</span>
        </span>
      );
    }

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '2px 9px',
        borderRadius: '9999px',
        background: glowColor,
        border: `1px solid ${borderColor}`,
        color: accentColor,
        fontSize: '0.74rem',
        fontWeight: 700,
        fontVariantNumeric: 'tabular-nums'
      }}>
        <Clock size={11} />
        <span>{timeLeft.shortText}</span>
      </span>
    );
  }

  // Variant 2: COMPACT / CARD (For ProfilePage or plan card)
  if (variant === 'compact') {
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 14px',
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.04)',
        border: `1px solid ${borderColor}`,
        fontSize: '0.82rem',
        fontVariantNumeric: 'tabular-nums'
      }}>
        <Clock size={14} color={accentColor} />
        <span style={{ color: 'var(--text-secondary)' }}>
          {text('Thời gian còn lại:', 'Time remaining:')}
        </span>
        <span style={{ color: accentColor, fontWeight: 700 }}>
          {timeLeft.isExpired
            ? text('Đã hết hạn', 'Expired')
            : `${timeLeft.days}d ${pad(timeLeft.hours)}:${pad(timeLeft.minutes)}:${pad(timeLeft.seconds)}`}
        </span>
      </div>
    );
  }

  // Variant 3: FULL BANNER (Hero Dashboard for PremiumPage)
  return (
    <div style={{
      margin: '0 auto 36px',
      maxWidth: '920px',
      padding: '24px 28px',
      borderRadius: '20px',
      background: isPlus
        ? 'linear-gradient(135deg, rgba(251, 113, 133, 0.12) 0%, rgba(225, 29, 72, 0.05) 50%, rgba(15, 23, 42, 0.8) 100%)'
        : 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(194, 125, 94, 0.05) 50%, rgba(15, 23, 42, 0.8) 100%)',
      border: `1.5px solid ${borderColor}`,
      boxShadow: `0 12px 35px ${glowColor}`,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative background glow */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: accentColor,
        filter: 'blur(70px)',
        opacity: 0.18,
        pointerEvents: 'none'
      }} />

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Left Side: Membership info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 12px',
              borderRadius: '9999px',
              background: glowColor,
              border: `1px solid ${borderColor}`,
              color: accentColor,
              fontSize: '0.78rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              {isPlus ? <Sparkles size={13} /> : <Crown size={13} />}
              {text('ĐANG KÍCH HOẠT', 'ACTIVE MEMBERSHIP')}
            </span>
            <span style={{
              fontSize: '0.76rem',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 600
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 8px #10B981'
              }} />
              {text('Đang hoạt động', 'Active')}
            </span>
          </div>

          <h3 style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '0 0 6px 0',
            letterSpacing: '-0.01em'
          }}>
            {planTitle}
          </h3>

          <p style={{
            margin: 0,
            fontSize: '0.85rem',
            color: 'var(--text-secondary)'
          }}>
            {text('Hạn sử dụng gói đến:', 'Plan expiration date:')}{' '}
            <strong style={{ color: '#F3F4F6' }}>
              {timeLeft.expiryDate
                ? `${pad(timeLeft.expiryDate.getHours())}:${pad(timeLeft.expiryDate.getMinutes())} • ${timeLeft.expiryDate.toLocaleDateString('vi-VN')}`
                : ''}
            </strong>
          </p>
        </div>

        {/* Right Side: Glowing Countdown Digital Boxes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Days */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: `1px solid ${borderColor}`,
            borderRadius: '12px',
            padding: '10px 14px',
            minWidth: '66px',
            textAlign: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: accentColor,
              fontFamily: 'monospace',
              lineHeight: 1
            }}>
              {pad(timeLeft.days)}
            </div>
            <div style={{
              fontSize: '0.66rem',
              color: 'var(--text-muted)',
              fontWeight: 700,
              marginTop: '4px',
              textTransform: 'uppercase'
            }}>
              {text('Ngày', 'Days')}
            </div>
          </div>

          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: borderColor }}>:</span>

          {/* Hours */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: `1px solid ${borderColor}`,
            borderRadius: '12px',
            padding: '10px 14px',
            minWidth: '66px',
            textAlign: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: accentColor,
              fontFamily: 'monospace',
              lineHeight: 1
            }}>
              {pad(timeLeft.hours)}
            </div>
            <div style={{
              fontSize: '0.66rem',
              color: 'var(--text-muted)',
              fontWeight: 700,
              marginTop: '4px',
              textTransform: 'uppercase'
            }}>
              {text('Giờ', 'Hours')}
            </div>
          </div>

          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: borderColor }}>:</span>

          {/* Minutes */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: `1px solid ${borderColor}`,
            borderRadius: '12px',
            padding: '10px 14px',
            minWidth: '66px',
            textAlign: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: accentColor,
              fontFamily: 'monospace',
              lineHeight: 1
            }}>
              {pad(timeLeft.minutes)}
            </div>
            <div style={{
              fontSize: '0.66rem',
              color: 'var(--text-muted)',
              fontWeight: 700,
              marginTop: '4px',
              textTransform: 'uppercase'
            }}>
              {text('Phút', 'Mins')}
            </div>
          </div>

          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: borderColor }}>:</span>

          {/* Seconds */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.75)',
            border: `1px solid ${borderColor}`,
            borderRadius: '12px',
            padding: '10px 14px',
            minWidth: '66px',
            textAlign: 'center',
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: '#FFFFFF',
              fontFamily: 'monospace',
              lineHeight: 1
            }}>
              {pad(timeLeft.seconds)}
            </div>
            <div style={{
              fontSize: '0.66rem',
              color: 'var(--text-muted)',
              fontWeight: 700,
              marginTop: '4px',
              textTransform: 'uppercase'
            }}>
              {text('Giây', 'Secs')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
