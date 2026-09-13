import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#080A0F',
          color: '#FFF',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '500px',
            padding: '36px',
            borderRadius: '16px',
            background: 'rgba(18, 24, 38, 0.95)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)'
          }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FB7185', marginBottom: '12px' }}>
              ⚠️ Đã xảy ra sự cố hiển thị
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '14px' }}>
              Hệ thống vừa phát hiện sự cố khi tải trang. Bạn có thể nhấn nút bên dưới để tải lại hoặc trở về trang chủ.
            </p>
            {this.state.error?.message && (
              <div style={{
                background: 'rgba(251, 113, 133, 0.1)',
                border: '1px solid rgba(251, 113, 133, 0.3)',
                color: '#FDA4AF',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontFamily: 'monospace',
                marginBottom: '18px',
                wordBreak: 'break-word',
                textAlign: 'left'
              }}>
                {this.state.error.message}
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="btn-primary"
                style={{ padding: '10px 24px', fontSize: '0.9rem' }}
              >
                Tải Lại Trang
              </button>
              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="btn-secondary"
                style={{ padding: '10px 24px', fontSize: '0.9rem' }}
              >
                Về Trang Chủ
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
