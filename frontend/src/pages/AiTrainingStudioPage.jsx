import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Play,
  Download,
  Palette,
  UserCheck,
  CloudSun,
  Briefcase,
  Layers,
  Wand2,
  RefreshCw,
  Sliders,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AiTrainingStudioPage({ user, clothes = [], onNavigate }) {
  const { text } = useLanguage();
  const [activeTab, setActiveTab] = useState('rules'); // 'rules', 'samples', 'playground', 'export'
  
  // Data state
  const [rules, setRules] = useState([]);
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal create rule
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [newRule, setNewRule] = useState({
    category: 'Color',
    name: '',
    description: '',
    ruleContent: '',
    priority: 'High',
    isActive: true
  });

  // Modal create sample
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [newSample, setNewSample] = useState({
    title: '',
    style: 'Smart Casual',
    occasion: 'Hẹn hò / Dạo phố',
    gender: 'Nam',
    stylistRationale: '',
    topItem: null,
    bottomItem: null,
    shoesItem: null
  });

  // Playground state
  const [playgroundInput, setPlaygroundInput] = useState({
    userPrompt: 'Gợi ý set đồ đi cafe dạo phố cuối tuần trời se lạnh 19°C, muốn phong cách trẻ trung tôn dáng.',
    gender: 'Nam',
    height: 175,
    weight: 68,
    bodyShape: 'Cân đối',
    occasion: 'Dạo phố / Cafe',
    weatherInfo: '19°C, se lạnh có gió nhẹ',
    stylePreference: 'Minimalist Streetwear'
  });
  const [playgroundLoading, setPlaygroundLoading] = useState(false);
  const [playgroundResult, setPlaygroundResult] = useState(null);

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [rulesRes, samplesRes] = await Promise.all([
        fetch('/api/ai-training/rules'),
        fetch('/api/ai-training/samples')
      ]);

      if (rulesRes.ok) {
        const rData = await rulesRes.json();
        if (rData?.data) setRules(rData.data);
      }
      if (samplesRes.ok) {
        const sData = await samplesRes.json();
        if (sData?.data) setSamples(sData.data);
      }
    } catch (err) {
      console.warn('Error loading AI training data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle toggle rule active
  const handleToggleRule = async (rule) => {
    try {
      const updated = { ...rule, isActive: !rule.isActive };
      const res = await fetch(`/api/ai-training/rules/${rule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !rule.isActive })
      });
      if (res.ok) {
        setRules(prev => prev.map(r => r.id === rule.id ? updated : r));
      }
    } catch (err) {
      console.warn('Toggle rule error:', err);
    }
  };

  // Handle delete rule
  const handleDeleteRule = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa quy tắc thời trang này?')) return;
    try {
      const res = await fetch(`/api/ai-training/rules/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRules(prev => prev.filter(r => r.id !== id));
      }
    } catch (err) {
      console.warn('Delete rule error:', err);
    }
  };

  // Handle create rule
  const handleCreateRule = async (e) => {
    e.preventDefault();
    if (!newRule.name.trim() || !newRule.ruleContent.trim()) {
      alert('Vui lòng điền tên và nội dung quy tắc!');
      return;
    }
    try {
      const res = await fetch('/api/ai-training/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRule)
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.data) {
          setRules(prev => [data.data, ...prev]);
          setShowRuleModal(false);
          setNewRule({
            category: 'Color',
            name: '',
            description: '',
            ruleContent: '',
            priority: 'High',
            isActive: true
          });
        }
      }
    } catch (err) {
      console.warn('Create rule error:', err);
    }
  };

  // Handle create sample
  const handleCreateSample = async (e) => {
    e.preventDefault();
    if (!newSample.title.trim()) {
      alert('Vui lòng nhập tên set đồ mẫu!');
      return;
    }
    const items = [];
    if (newSample.topItem) {
      items.push({
        id: newSample.topItem.id,
        name: newSample.topItem.name,
        categoryName: 'Tops',
        color: newSample.topItem.color,
        imageUrl: newSample.topItem.imageUrl
      });
    }
    if (newSample.bottomItem) {
      items.push({
        id: newSample.bottomItem.id,
        name: newSample.bottomItem.name,
        categoryName: 'Bottoms',
        color: newSample.bottomItem.color,
        imageUrl: newSample.bottomItem.imageUrl
      });
    }
    if (newSample.shoesItem) {
      items.push({
        id: newSample.shoesItem.id,
        name: newSample.shoesItem.name,
        categoryName: 'Shoes',
        color: newSample.shoesItem.color,
        imageUrl: newSample.shoesItem.imageUrl
      });
    }

    try {
      const payload = {
        title: newSample.title,
        style: newSample.style,
        occasion: newSample.occasion,
        gender: newSample.gender,
        stylistRationale: newSample.stylistRationale,
        items
      };
      const res = await fetch('/api/ai-training/samples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.data) {
          setSamples(prev => [data.data, ...prev]);
          setShowSampleModal(false);
          setNewSample({
            title: '',
            style: 'Smart Casual',
            occasion: 'Hẹn hò / Dạo phố',
            gender: 'Nam',
            stylistRationale: '',
            topItem: null,
            bottomItem: null,
            shoesItem: null
          });
        }
      }
    } catch (err) {
      console.warn('Create sample error:', err);
    }
  };

  // Handle delete sample
  const handleDeleteSample = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa set đồ mẫu này khỏi tập huấn luyện?')) return;
    try {
      const res = await fetch(`/api/ai-training/samples/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSamples(prev => prev.filter(s => s.id !== id));
      }
    } catch (err) {
      console.warn('Delete sample error:', err);
    }
  };

  // Run Playground Test
  const handleRunPlayground = async () => {
    if (!playgroundInput.userPrompt.trim()) return;
    setPlaygroundLoading(true);
    setPlaygroundResult(null);
    try {
      const res = await fetch('/api/ai-training/test-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(playgroundInput)
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.data) {
          setPlaygroundResult(data.data);
        }
      }
    } catch (err) {
      console.warn('Playground test error:', err);
    } finally {
      setPlaygroundLoading(false);
    }
  };

  // Export JSONL
  const handleExportJsonl = () => {
    window.location.href = '/api/ai-training/export-dataset';
  };

  // Filter rules
  const filteredRules = rules.filter(r => {
    if (selectedCategory === 'ALL') return true;
    return r.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const activeRulesCount = rules.filter(r => r.isActive).length;

  return (
    <div style={{
      maxWidth: '1240px',
      margin: '0 auto',
      padding: '24px 20px 80px',
      color: '#ECECEC'
    }}>
      {/* HEADER BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(212, 175, 55, 0.08) 100%)',
        border: '1px solid rgba(168, 85, 247, 0.25)',
        borderRadius: '20px',
        padding: '26px 28px',
        marginBottom: '26px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 36px rgba(0,0,0,0.35)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ maxWidth: '700px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{
                background: 'rgba(168, 85, 247, 0.22)',
                color: '#C084FC',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5
              }}>
                <BrainCircuit size={12} />
                AI STYLIST TRAINING STUDIO (CẤP ĐỘ 1)
              </span>
              <span style={{
                background: 'rgba(74, 222, 128, 0.15)',
                color: '#86efac',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                padding: '3px 8px',
                borderRadius: '999px',
                fontSize: '0.7rem',
                fontWeight: 700
              }}>
                ● Đang Hoạt Động
              </span>
            </div>

            <h1 style={{
              fontSize: '1.8rem',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: '0 0 8px',
              fontFamily: "'Outfit', sans-serif"
            }}>
              Trung Tâm Đào Tạo AI Gợi Ý Trang Phục
            </h1>
            <p style={{
              color: 'rgba(255, 255, 255, 0.72)',
              fontSize: '0.92rem',
              lineHeight: 1.55,
              margin: 0
            }}>
              Huấn luyện tư duy thẩm mỹ cho <strong>Google Gemini 1.5 Flash</strong> thông qua <em>In-Context Learning</em>: Thiết lập quy tắc phối màu, vóc dáng, thời tiết và nạp các set đồ mẫu mực chuẩn phong cách Việt Nam.
            </p>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '12px 18px',
              textAlign: 'center',
              minWidth: '110px'
            }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#C084FC' }}>{activeRulesCount}/{rules.length}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.55)', fontWeight: 600 }}>Quy Tắc Đang Bật</div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '12px 18px',
              textAlign: 'center',
              minWidth: '110px'
            }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FDE68A' }}>{samples.length}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.55)', fontWeight: 600 }}>Set Đồ Mẫu Chuẩn</div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '12px 18px',
              textAlign: 'center',
              minWidth: '120px'
            }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38BDF8', marginTop: 4 }}>Gemini 1.5 Flash</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.55)', fontWeight: 600 }}>Model Khuyên Dùng</div>
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginTop: '22px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '18px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('rules')}
            style={{
              background: activeTab === 'rules' ? 'linear-gradient(135deg, #A855F7, #7E22CE)' : 'rgba(255, 255, 255, 0.05)',
              color: activeTab === 'rules' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
              border: activeTab === 'rules' ? '1px solid #C084FC' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s ease'
            }}
          >
            <Sliders size={15} />
            <span>Quy Tắc Phối Đồ ({rules.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('samples')}
            style={{
              background: activeTab === 'samples' ? 'linear-gradient(135deg, #A855F7, #7E22CE)' : 'rgba(255, 255, 255, 0.05)',
              color: activeTab === 'samples' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
              border: activeTab === 'samples' ? '1px solid #C084FC' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s ease'
            }}
          >
            <Layers size={15} />
            <span>Dạy Set Đồ Mẫu ({samples.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('playground')}
            style={{
              background: activeTab === 'playground' ? 'linear-gradient(135deg, #D4AF37, #996515)' : 'rgba(255, 255, 255, 0.05)',
              color: activeTab === 'playground' ? '#17130A' : 'rgba(255, 255, 255, 0.7)',
              border: activeTab === 'playground' ? '1px solid #FDE68A' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s ease'
            }}
          >
            <Play size={15} />
            <span>Phòng Thử Nghiệm AI (Playground)</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            style={{
              background: activeTab === 'export' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              color: activeTab === 'export' ? '#38BDF8' : 'rgba(255, 255, 255, 0.7)',
              border: activeTab === 'export' ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s ease',
              marginLeft: 'auto'
            }}
          >
            <Download size={15} />
            <span>Cấu Hình & Xuất JSONL</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: QUY TẮC PHỐI ĐỒ (FASHION RULES ENGINE) */}
      {/* ========================================================================= */}
      {activeTab === 'rules' && (
        <div>
          {/* Action Bar & Filter */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '18px',
            flexWrap: 'wrap',
            gap: 12
          }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { key: 'ALL', label: 'Tất Cả', icon: Sliders },
                { key: 'Color', label: '🎨 Phối Màu', icon: Palette },
                { key: 'BodyShape', label: '👤 Dáng Người', icon: UserCheck },
                { key: 'Weather', label: '🌤️ Thời Tiết', icon: CloudSun },
                { key: 'Occasion', label: '👔 Dịp / Sự Kiện', icon: Briefcase }
              ].map(cat => {
                const isSel = selectedCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    style={{
                      background: isSel ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      color: isSel ? '#C084FC' : 'rgba(255, 255, 255, 0.65)',
                      border: isSel ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: isSel ? 700 : 500,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5
                    }}
                  >
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowRuleModal(true)}
              style={{
                background: 'linear-gradient(135deg, #A855F7, #7E22CE)',
                color: '#fff',
                border: 0,
                borderRadius: '9px',
                padding: '8px 16px',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 14px rgba(168, 85, 247, 0.3)'
              }}
            >
              <Plus size={16} />
              <span>+ Thêm Quy Tắc Mới</span>
            </button>
          </div>

          {/* Rules Cards List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.5)' }}>
              <RefreshCw size={24} className="spin" style={{ marginBottom: 10 }} />
              <div>Đang tải kho quy tắc thời trang…</div>
            </div>
          ) : filteredRules.length === 0 ? (
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px dashed rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: '48px 20px',
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.5)'
            }}>
              <Sliders size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
              <div style={{ fontSize: '1rem', fontWeight: 600 }}>Chưa có quy tắc nào trong danh mục này</div>
              <div style={{ fontSize: '0.84rem', marginTop: 4 }}>Bấm nút "+ Thêm Quy Tắc Mới" ở trên để đào tạo cho AI</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 14 }}>
              {filteredRules.map((rule) => {
                const priorityColor = rule.priority === 'High' ? '#EF4444' : (rule.priority === 'Medium' ? '#F59E0B' : '#10B981');
                const priorityLabel = rule.priority === 'High' ? 'Bắt buộc' : (rule.priority === 'Medium' ? 'Ưu tiên' : 'Tham khảo');
                return (
                  <div
                    key={rule.id}
                    style={{
                      background: rule.isActive ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.01)',
                      border: rule.isActive ? '1px solid rgba(255, 255, 255, 0.1)' : '1px dashed rgba(255, 255, 255, 0.06)',
                      borderRadius: '14px',
                      padding: '16px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                      opacity: rule.isActive ? 1 : 0.6
                    }}
                  >
                    <div>
                      {/* Top tags */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <span style={{
                            background: 'rgba(168, 85, 247, 0.14)',
                            color: '#C084FC',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '0.68rem',
                            fontWeight: 700
                          }}>
                            {rule.category.toUpperCase()}
                          </span>
                          <span style={{
                            background: `${priorityColor}18`,
                            color: priorityColor,
                            border: `1px solid ${priorityColor}33`,
                            padding: '2px 7px',
                            borderRadius: '6px',
                            fontSize: '0.68rem',
                            fontWeight: 700
                          }}>
                            {priorityLabel}
                          </span>
                        </div>

                        {/* Toggle switch */}
                        <button
                          type="button"
                          onClick={() => handleToggleRule(rule)}
                          title={rule.isActive ? 'Tắt quy tắc này' : 'Bật quy tắc này'}
                          style={{
                            background: rule.isActive ? 'rgba(74, 222, 128, 0.16)' : 'rgba(255, 255, 255, 0.06)',
                            color: rule.isActive ? '#4ade80' : 'rgba(255, 255, 255, 0.4)',
                            border: rule.isActive ? '1px solid rgba(74, 222, 128, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '20px',
                            padding: '3px 10px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          {rule.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          <span>{rule.isActive ? 'Đang Bật' : 'Đã Tắt'}</span>
                        </button>
                      </div>

                      {/* Title */}
                      <h3 style={{
                        fontSize: '0.98rem',
                        fontWeight: 700,
                        color: rule.isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
                        margin: '0 0 6px'
                      }}>
                        {rule.name}
                      </h3>

                      {rule.description && (
                        <p style={{
                          fontSize: '0.8rem',
                          color: 'rgba(255, 255, 255, 0.55)',
                          margin: '0 0 10px',
                          lineHeight: 1.45
                        }}>
                          {rule.description}
                        </p>
                      )}

                      {/* Rule Statement Box */}
                      <div style={{
                        background: 'rgba(0, 0, 0, 0.28)',
                        borderLeft: `3px solid ${rule.isActive ? '#A855F7' : 'rgba(255,255,255,0.2)'}`,
                        borderRadius: '0 8px 8px 0',
                        padding: '10px 12px',
                        fontSize: '0.83rem',
                        color: rule.isActive ? '#E2E8F0' : 'rgba(255,255,255,0.4)',
                        lineHeight: 1.5,
                        marginBottom: 12
                      }}>
                        {rule.ruleContent}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        title="Xóa quy tắc này"
                        style={{
                          background: 'transparent',
                          color: 'rgba(239, 68, 68, 0.7)',
                          border: 0,
                          cursor: 'pointer',
                          padding: '4px 8px',
                          fontSize: '0.75rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <Trash2 size={13} />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DẠY SET ĐỒ MẪU (FEW-SHOT STYLE TEACHER) */}
      {/* ========================================================================= */}
      {activeTab === 'samples' && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '18px',
            flexWrap: 'wrap',
            gap: 12
          }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 4px', color: '#fff' }}>
                Bộ Sưu Tập Phối Mẫu Mực (Few-Shot Ground Truth)
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
                AI sẽ nhìn vào các set đồ này để học gu thẩm mỹ, cách kết hợp áo/quần/giày và lời bình luận từ chuyên gia.
              </p>
            </div>

            <button
              onClick={() => setShowSampleModal(true)}
              style={{
                background: 'linear-gradient(135deg, #A855F7, #7E22CE)',
                color: '#fff',
                border: 0,
                borderRadius: '9px',
                padding: '8px 16px',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 14px rgba(168, 85, 247, 0.3)'
              }}
            >
              <Plus size={16} />
              <span>+ Tạo Set Đồ Mẫu Mới</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 16 }}>
            {samples.map((sample) => (
              <div
                key={sample.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <span style={{
                        background: 'rgba(212, 175, 55, 0.15)',
                        color: '#FDE68A',
                        padding: '3px 9px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        marginRight: 6
                      }}>
                        {sample.style}
                      </span>
                      <span style={{
                        background: 'rgba(56, 189, 248, 0.15)',
                        color: '#38BDF8',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: 700
                      }}>
                        {sample.gender} • {sample.occasion}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteSample(sample.id)}
                      style={{
                        background: 'transparent',
                        border: 0,
                        color: 'rgba(239, 68, 68, 0.7)',
                        cursor: 'pointer',
                        padding: 4
                      }}
                      title="Xóa mẫu này"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>
                    {sample.title}
                  </h3>

                  {/* Items Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${sample.items?.length || 3}, 1fr)`,
                    gap: 10,
                    marginBottom: 14
                  }}>
                    {sample.items?.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(0, 0, 0, 0.35)',
                          borderRadius: '10px',
                          padding: '10px 8px',
                          textAlign: 'center',
                          border: '1px solid rgba(255, 255, 255, 0.06)'
                        }}
                      >
                        <div style={{
                          height: '75px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 6
                        }}>
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />
                          ) : (
                            <Layers size={22} style={{ opacity: 0.3 }} />
                          )}
                        </div>
                        <div style={{ fontSize: '0.66rem', color: '#D4AF37', fontWeight: 700 }}>{item.categoryName}</div>
                        <div style={{
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color: '#ECECEC',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {item.name}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Stylist Rationale */}
                  <div style={{
                    background: 'rgba(168, 85, 247, 0.08)',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    fontSize: '0.83rem',
                    color: '#E9D5FF',
                    lineHeight: 1.5
                  }}>
                    <strong style={{ color: '#FDE68A' }}>✦ Tư duy Stylist: </strong>
                    {sample.stylistRationale}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PHÒNG THỬ NGHIỆM AI (PLAYGROUND) */}
      {/* ========================================================================= */}
      {activeTab === 'playground' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: 20 }}>
          {/* Simulation Input Panel */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            borderRadius: '16px',
            padding: '22px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
              <Sparkles size={16} color="#FDE68A" />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Giả Lập Tình Huống Người Dùng
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: 5 }}>
                  Yêu Cầu / Câu Hỏi Của Người Dùng
                </label>
                <textarea
                  rows={3}
                  value={playgroundInput.userPrompt}
                  onChange={(e) => setPlaygroundInput({ ...playgroundInput, userPrompt: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: '#fff',
                    fontSize: '0.84rem',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: 4 }}>
                    Giới Tính
                  </label>
                  <select
                    value={playgroundInput.gender}
                    onChange={(e) => setPlaygroundInput({ ...playgroundInput, gender: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '8px',
                      padding: '8px',
                      color: '#fff',
                      fontSize: '0.82rem'
                    }}
                  >
                    <option value="Nam">Nam Giới</option>
                    <option value="Nữ">Nữ Giới</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: 4 }}>
                    Dịp / Hoàn Cảnh
                  </label>
                  <input
                    type="text"
                    value={playgroundInput.occasion}
                    onChange={(e) => setPlaygroundInput({ ...playgroundInput, occasion: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '8px',
                      padding: '8px',
                      color: '#fff',
                      fontSize: '0.82rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: 4 }}>
                    Chiều Cao (cm)
                  </label>
                  <input
                    type="number"
                    value={playgroundInput.height}
                    onChange={(e) => setPlaygroundInput({ ...playgroundInput, height: parseFloat(e.target.value) || 0 })}
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '8px',
                      padding: '8px',
                      color: '#fff',
                      fontSize: '0.82rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: 4 }}>
                    Cân Nặng (kg)
                  </label>
                  <input
                    type="number"
                    value={playgroundInput.weight}
                    onChange={(e) => setPlaygroundInput({ ...playgroundInput, weight: parseFloat(e.target.value) || 0 })}
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '8px',
                      padding: '8px',
                      color: '#fff',
                      fontSize: '0.82rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: 4 }}>
                  Thời Tiết Thực Tế
                </label>
                <input
                  type="text"
                  value={playgroundInput.weatherInfo}
                  onChange={(e) => setPlaygroundInput({ ...playgroundInput, weatherInfo: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '8px',
                    padding: '8px',
                    color: '#fff',
                    fontSize: '0.82rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="button"
                disabled={playgroundLoading}
                onClick={handleRunPlayground}
                style={{
                  marginTop: 6,
                  background: 'linear-gradient(135deg, #D4AF37, #996515)',
                  color: '#17130A',
                  border: 0,
                  borderRadius: '10px',
                  padding: '12px',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  cursor: playgroundLoading ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 16px rgba(212, 175, 55, 0.25)',
                  transition: 'all 0.2s ease'
                }}
              >
                {playgroundLoading ? (
                  <>
                    <RefreshCw size={16} className="spin" />
                    <span>AI Đang Áp Dụng Quy Tắc…</span>
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    <span>Thử Nghiệm Gợi Ý AI (Test)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Simulation Output Result */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BrainCircuit size={17} color="#A855F7" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#fff' }}>
                  Kết Quả Tư Vấn Thực Tế Của AI
                </h3>
              </div>
              {playgroundResult && (
                <span style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38BDF8',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}>
                  {playgroundResult.modelUsed}
                </span>
              )}
            </div>

            {!playgroundResult ? (
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255, 255, 255, 0.45)',
                minHeight: '260px',
                textAlign: 'center'
              }}>
                <Wand2 size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
                <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>Chưa có kết quả chạy thử nghiệm</div>
                <div style={{ fontSize: '0.8rem', marginTop: 4, maxWidth: '340px' }}>
                  Điền các thông số bên trái và bấm <strong>"Thử Nghiệm Gợi Ý AI"</strong> để xem AI áp dụng các quy tắc bạn đã huấn luyện ra sao.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Applied rules banner */}
                <div style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.25)',
                  borderRadius: '10px',
                  padding: '10px 14px'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#FDE68A', fontWeight: 700, marginBottom: 4 }}>
                    ✦ Các quy tắc đã được kích hoạt & áp dụng:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {playgroundResult.rulesApplied?.map((rName, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: 'rgba(0, 0, 0, 0.4)',
                          color: '#C084FC',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 600
                        }}
                      >
                        ✓ {rName}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Advice body */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '18px',
                  fontSize: '0.9rem',
                  lineHeight: 1.65,
                  color: '#ECECEC',
                  whiteSpace: 'pre-wrap'
                }}>
                  {playgroundResult.advice}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CẤU HÌNH & XUẤT DATASET (EXPORT) */}
      {/* ========================================================================= */}
      {activeTab === 'export' && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            borderRadius: '18px',
            padding: '28px',
            marginBottom: '20px'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>
              Kiến Trúc & Phương Pháp Huấn Luyện AI Stylist
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.6, margin: '0 0 20px' }}>
              Hệ thống MyFitDaily đang áp dụng kỹ thuật <strong>In-Context Learning (Cấp độ 1)</strong>: Mọi quy tắc và bộ mẫu bạn tạo tại đây sẽ được tự động biên soạn thành System Prompt nạp trực tiếp vào <strong>Google Gemini 1.5 Flash</strong> mỗi khi người dùng hỏi hoặc cần gợi ý trang phục.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 14,
              marginBottom: 24
            }}>
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div style={{ fontSize: '0.74rem', color: '#C084FC', fontWeight: 700 }}>MÔ HÌNH KHUYÊN DÙNG</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginTop: 4 }}>Gemini 1.5 Flash</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>Context Window 1.000.000 tokens</div>
              </div>

              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div style={{ fontSize: '0.74rem', color: '#4ade80', fontWeight: 700 }}>CHI PHÍ VẬN HÀNH</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginTop: 4 }}>100% Miễn Phí</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>Free Tier 15 req/phút của Google</div>
              </div>

              <div style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div style={{ fontSize: '0.74rem', color: '#FDE68A', fontWeight: 700 }}>TỐC ĐỘ XỬ LÝ</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginTop: 4 }}>~0.8 - 1.2 Giây</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>Phản hồi gợi ý tức thì</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              borderRadius: '12px',
              padding: '16px 18px',
              marginBottom: 20
            }}>
              <h4 style={{ margin: '0 0 6px', color: '#38BDF8', fontSize: '0.92rem', fontWeight: 800 }}>
                Xuất File Dataset Để Fine-Tuning Riêng (Cấp Độ 2)
              </h4>
              <p style={{ margin: '0 0 12px', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.5 }}>
                Khi bạn đã xây dựng được hơn 50 - 100 bộ phối đồ mẫu và quy tắc, bạn có thể xuất toàn bộ dữ liệu ra định dạng chuẩn <code>.jsonl</code> để tải lên Google Vertex AI hoặc OpenAI Fine-Tuning tạo ra một model mang tên riêng <code>myfitdaily-stylist-v1</code>.
              </p>
              <button
                type="button"
                onClick={handleExportJsonl}
                style={{
                  background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                  color: '#fff',
                  border: 0,
                  borderRadius: '8px',
                  padding: '10px 18px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
                }}
              >
                <Download size={15} />
                <span>Tải File myfitdaily_fashion_training_dataset.jsonl</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL THÊM QUY TẮC MỚI */}
      {/* ========================================================================= */}
      {showRuleModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 16
        }}>
          <div style={{
            background: '#161922',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '18px',
            width: '100%',
            maxWidth: '560px',
            padding: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 16px', color: '#fff' }}>
              Thêm Quy Tắc Phối Đồ Cho AI Stylist
            </h3>

            <form onSubmit={handleCreateRule} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: 5 }}>
                    Phân Loại Quy Tắc
                  </label>
                  <select
                    value={newRule.category}
                    onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      color: '#fff',
                      fontSize: '0.84rem'
                    }}
                  >
                    <option value="Color">🎨 Phối Màu Sắc (Color)</option>
                    <option value="BodyShape">👤 Vóc Dáng Người (Body)</option>
                    <option value="Weather">🌤️ Thời Tiết / Nhiệt Độ (Weather)</option>
                    <option value="Occasion">👔 Dịp & Sự Kiện (Occasion)</option>
                    <option value="General">✦ Quy Tắc Khác (General)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: 5 }}>
                    Mức Độ Ưu Tiên
                  </label>
                  <select
                    value={newRule.priority}
                    onChange={(e) => setNewRule({ ...newRule, priority: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      color: '#fff',
                      fontSize: '0.84rem'
                    }}
                  >
                    <option value="High">🔴 Bắt buộc (High)</option>
                    <option value="Medium">🟡 Ưu tiên cao (Medium)</option>
                    <option value="Low">🟢 Tham khảo (Low)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: 5 }}>
                  Tên Quy Tắc
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Quy Tắc Tương Phản Sáng - Tối"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: '#fff',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: 5 }}>
                  Mô Tả Ý Nghĩa Ngắn
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Giúp tạo chiều sâu và cân đối thị giác giữa áo và quần."
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: '#fff',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: 5 }}>
                  Nội Dung Quy Tắc (AI sẽ đọc câu này để áp dụng)
                </label>
                <textarea
                  rows={3}
                  placeholder="Ví dụ: Khi người dùng chọn áo màu sáng, BẮT BUỘC ưu tiên gợi ý quần màu tối (đen, navy) và ngược lại để không bị chìm dáng."
                  value={newRule.ruleContent}
                  onChange={(e) => setNewRule({ ...newRule, ruleContent: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: '#fff',
                    fontSize: '0.84rem',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowRuleModal(false)}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.7)',
                    border: 0,
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #A855F7, #7E22CE)',
                    color: '#fff',
                    border: 0,
                    borderRadius: '8px',
                    padding: '8px 18px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Lưu & Áp Dụng Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL TẠO SET ĐỒ MẪU */}
      {/* ========================================================================= */}
      {showSampleModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 16
        }}>
          <div style={{
            background: '#161922',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '18px',
            width: '100%',
            maxWidth: '600px',
            padding: '24px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 16px', color: '#fff' }}>
              Tạo Set Đồ Mẫu Mực (Few-Shot Style Teacher)
            </h3>

            <form onSubmit={handleCreateSample} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: 5 }}>
                  Tên Set Đồ Mẫu
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Set Korean Clean Fit Dạo Phố"
                  value={newSample.title}
                  onChange={(e) => setNewSample({ ...newSample, title: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: '#fff',
                    fontSize: '0.84rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: 4 }}>
                    Phong Cách
                  </label>
                  <select
                    value={newSample.style}
                    onChange={(e) => setNewSample({ ...newSample, style: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '8px',
                      padding: '8px',
                      color: '#fff',
                      fontSize: '0.8rem'
                    }}
                  >
                    <option value="Minimalist Streetwear">Minimalist Streetwear</option>
                    <option value="Smart Casual">Smart Casual</option>
                    <option value="Old Money">Old Money / Quiet Luxury</option>
                    <option value="Korean Clean Fit">Korean Clean Fit</option>
                    <option value="Y2K Aesthetic">Y2K Aesthetic</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: 4 }}>
                    Giới Tính
                  </label>
                  <select
                    value={newSample.gender}
                    onChange={(e) => setNewSample({ ...newSample, gender: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '8px',
                      padding: '8px',
                      color: '#fff',
                      fontSize: '0.8rem'
                    }}
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: 4 }}>
                    Dịp Sự Kiện
                  </label>
                  <input
                    type="text"
                    value={newSample.occasion}
                    onChange={(e) => setNewSample({ ...newSample, occasion: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '8px',
                      padding: '8px',
                      color: '#fff',
                      fontSize: '0.8rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Chọn đồ từ kho */}
              <div style={{
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '14px'
              }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#D4AF37', marginBottom: 10 }}>
                  Chọn 3 Món Đồ Phối Mẫu Từ Kho Toàn Sàn:
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                  {/* Top */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
                      01 / Món Áo (Top)
                    </label>
                    <select
                      onChange={(e) => {
                        const item = clothes.find(c => c.id === parseInt(e.target.value));
                        setNewSample({ ...newSample, topItem: item || null });
                      }}
                      style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '6px',
                        padding: '6px',
                        color: '#fff',
                        fontSize: '0.76rem'
                      }}
                    >
                      <option value="">-- Chọn Áo --</option>
                      {clothes.filter(c => c.categoryId === 1).map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Bottom */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
                      02 / Món Quần (Bottom)
                    </label>
                    <select
                      onChange={(e) => {
                        const item = clothes.find(c => c.id === parseInt(e.target.value));
                        setNewSample({ ...newSample, bottomItem: item || null });
                      }}
                      style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '6px',
                        padding: '6px',
                        color: '#fff',
                        fontSize: '0.76rem'
                      }}
                    >
                      <option value="">-- Chọn Quần --</option>
                      {clothes.filter(c => c.categoryId === 2).map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Shoes */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
                      03 / Món Giày (Shoes)
                    </label>
                    <select
                      onChange={(e) => {
                        const item = clothes.find(c => c.id === parseInt(e.target.value));
                        setNewSample({ ...newSample, shoesItem: item || null });
                      }}
                      style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '6px',
                        padding: '6px',
                        color: '#fff',
                        fontSize: '0.76rem'
                      }}
                    >
                      <option value="">-- Chọn Giày --</option>
                      {clothes.filter(c => c.categoryId === 5).map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: 5 }}>
                  Lời Giải Thích Tư Duy Stylist (Tại sao cách phối này đẹp?)
                </label>
                <textarea
                  rows={3}
                  placeholder="Ví dụ: Bản phối tương phản sáng tối kinh điển, phom suông che khuyết điểm chân, tone màu đất tinh tế..."
                  value={newSample.stylistRationale}
                  onChange={(e) => setNewSample({ ...newSample, stylistRationale: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    color: '#fff',
                    fontSize: '0.84rem',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowSampleModal(false)}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.7)',
                    border: 0,
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '0.84rem',
                    cursor: 'pointer'
                  }}
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #A855F7, #7E22CE)',
                    color: '#fff',
                    border: 0,
                    borderRadius: '8px',
                    padding: '8px 18px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Lưu Vào Bộ Đào Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
