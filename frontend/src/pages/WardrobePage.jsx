import React, { useState } from 'react';
import { 
  Shirt, 
  Search, 
  Plus, 
  Filter, 
  Sparkles, 
  RotateCcw,
  SlidersHorizontal,
  Check,
  Trash2,
  CheckSquare,
  Square,
  X
} from 'lucide-react';
import ClothingCard from '../components/ClothingCard';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { useLanguage } from '../context/LanguageContext';

export default function WardrobePage({ 
  clothes = [], 
  categories = [], 
  onOpenAddModal, 
  onDeleteClothing,
  onDeleteItem,
  onBulkDeleteClothes,
  onNavigate 
}) {
  const { text, isEnglish } = useLanguage();

  // Đồng bộ hàm xóa đơn lẻ bất kể tên prop nào được truyền vào
  const deleteSingleHandler = onDeleteClothing || onDeleteItem;

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');

  // Chế độ dọn dẹp / Xóa hàng loạt
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal xác nhận xóa
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    items: [],
  });

  const colorOptions = [
    { label: text("Tất Cả", "All"), value: "all" },
    { label: text("Trắng", "White"), value: "Trắng", hex: "#FFFFFF" },
    { label: text("Đen", "Black"), value: "Đen", hex: "#0F172A" },
    { label: text("Xanh Denim", "Denim Blue"), value: "Xanh", hex: "#38BDF8" },
    { label: text("Nâu", "Brown"), value: "Nâu", hex: "#A16207" },
    { label: text("Hồng", "Pink"), value: "Hồng", hex: "#F472B6" },
  ];

  const styles = [
    { label: text("Tất Cả", "All"), value: "all" },
    { label: "Minimalist", value: "Minimalist" },
    { label: "Casual", value: "Casual" },
    { label: "Formal", value: "Formal" },
    { label: "Streetwear", value: "Streetwear" },
    { label: "Elegant", value: "Elegant" },
  ];

  // Filter logic
  const filteredClothes = clothes.filter((item) => {
    // Category
    if (selectedCategory !== 'all') {
      const cat = categories.find(c => c.id.toString() === selectedCategory.toString());
      if (cat && item.categoryName !== cat.name) return false;
    }
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name?.toLowerCase().includes(q);
      const matchColor = item.color?.toLowerCase().includes(q);
      const matchStyle = item.style?.toLowerCase().includes(q);
      const matchBrand = item.brand?.toLowerCase().includes(q);
      const matchSize = item.size?.toLowerCase().includes(q);
      if (!matchName && !matchColor && !matchStyle && !matchBrand && !matchSize) return false;
    }
    // Style
    if (selectedStyle !== 'all' && item.style !== selectedStyle) {
      return false;
    }
    // Color
    if (selectedColor !== 'all' && !item.color?.toLowerCase().includes(selectedColor.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Toggle chọn 1 item trong selection mode
  const handleToggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Chọn tất cả các món đang hiển thị trong bộ lọc
  const handleSelectAllFiltered = () => {
    const currentFilteredIds = filteredClothes.map(c => c.id);
    setSelectedIds(currentFilteredIds);
  };

  // Bỏ chọn tất cả
  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  // Thoát chế độ chọn xóa
  const handleExitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedIds([]);
  };

  // Mở modal xóa đơn lẻ từ icon thùng rác trên thẻ
  const handleRequestDeleteSingle = (item) => {
    setDeleteModal({
      isOpen: true,
      items: [item],
    });
  };

  // Mở modal xóa hàng loạt các món đã chọn
  const handleRequestDeleteBulk = () => {
    if (selectedIds.length === 0) return;
    const itemsToDelete = clothes.filter(c => selectedIds.includes(c.id));
    setDeleteModal({
      isOpen: true,
      items: itemsToDelete,
    });
  };

  // Thực hiện xóa khi người dùng bấm xác nhận trong modal
  const handleConfirmDelete = async (idsOrId) => {
    if (Array.isArray(idsOrId)) {
      // Xóa hàng loạt
      if (onBulkDeleteClothes) {
        await onBulkDeleteClothes(idsOrId);
      } else if (deleteSingleHandler) {
        for (const id of idsOrId) {
          await deleteSingleHandler(id);
        }
      }
      setSelectedIds([]);
      setIsSelectionMode(false);
    } else {
      // Xóa 1 món
      if (deleteSingleHandler) {
        await deleteSingleHandler(idsOrId);
      }
    }
  };

  return (
    <div className="container" style={{ padding: '36px 24px 110px' }}>
      {/* Header with Title and Quick Add */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px',
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="badge badge-rose">{text('Kho Lưu Trữ Kỹ Thuật Số', 'Digital Archive')}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              ✦ {clothes.length} {text('món đồ sẵn sàng', 'items ready')}
            </span>
          </div>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>
            {text('Tủ Đồ Số Cá Nhân', 'My Digital Wardrobe')}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* Nút Dọn Dẹp / Quản Lý Xóa Đồ */}
          {clothes.length > 0 && (
            <button
              onClick={() => {
                if (isSelectionMode) {
                  handleExitSelectionMode();
                } else {
                  setIsSelectionMode(true);
                }
              }}
              id="btn-toggle-bulk-cleanup"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.88rem',
                fontWeight: 700,
                border: isSelectionMode ? '1px solid #F43F5E' : '1px solid rgba(255, 255, 255, 0.12)',
                background: isSelectionMode ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                color: isSelectionMode ? '#FDA4AF' : '#FFF',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              {isSelectionMode ? (
                <>
                  <X size={16} />
                  <span>{text('Thoát Dọn Dẹp', 'Exit Clean Mode')}</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>{text('Dọn Dẹp Tủ Đồ', 'Clean Up Wardrobe')}</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => onNavigate('ai-stylist')}
            className="btn-ai"
            style={{ padding: '11px 22px', fontSize: '0.88rem' }}
          >
            <Sparkles size={16} />
            <span>{text('Nhờ AI Phối Đồ', 'Ask AI to Style')}</span>
          </button>

          <button
            onClick={onOpenAddModal}
            id="btn-wardrobe-add"
            className="btn-primary"
            style={{ padding: '11px 22px', fontSize: '0.88rem' }}
          >
            <Plus size={16} />
            <span>{text('Thêm Món Đồ', 'Add Clothing')}</span>
          </button>
        </div>
      </div>

      {/* Bulk Mode Banner Guide */}
      {isSelectionMode && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '14px 20px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.15), rgba(7, 10, 17, 0.8))',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          marginBottom: '24px',
          boxShadow: '0 8px 24px rgba(225, 29, 72, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Trash2 size={20} color="#F43F5E" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#FFF' }}>
                {text('Chế độ Dọn Dẹp Tủ Đồ đang bật', 'Wardrobe Cleanup Mode Active')}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {text('Nhấp vào từng món đồ bạn không còn mặc hoặc không cần thiết để đánh dấu xóa.', 'Click on any items you no longer wear to mark for deletion.')}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleSelectAllFiltered}
              className="btn-secondary"
              style={{ padding: '7px 14px', fontSize: '0.78rem', height: 'auto' }}
            >
              {text('Chọn tất cả', 'Select All')} ({filteredClothes.length})
            </button>
            {selectedIds.length > 0 && (
              <button
                onClick={handleClearSelection}
                className="btn-secondary"
                style={{ padding: '7px 14px', fontSize: '0.78rem', height: 'auto' }}
              >
                {text('Bỏ chọn', 'Deselect All')}
              </button>
            )}
            <button
              onClick={handleExitSelectionMode}
              className="btn-secondary"
              style={{ padding: '7px 14px', fontSize: '0.78rem', height: 'auto', color: 'var(--text-muted)' }}
            >
              {text('Hủy', 'Cancel')}
            </button>
          </div>
        </div>
      )}

      {/* Control Panel: Category Pills & Instant Search */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
        {/* Row 1: Search and Style filter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '20px',
        }}>
          {/* Search Bar */}
          <div style={{
            position: 'relative',
            flex: 1,
            minWidth: '260px',
          }}>
            <Search 
              size={18} 
              color="var(--text-muted)" 
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} 
            />
            <input 
              type="text"
              placeholder={text(
                'Tìm kiếm theo tên áo, hãng thời trang (Zara, Nike...), size hoặc màu sắc...',
                'Search by item name, brand (Zara, Nike...), size or color...'
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '46px',
                paddingRight: '16px',
                height: '46px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(7, 10, 17, 0.6)',
              }}
            />
          </div>

          {/* Style select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SlidersHorizontal size={16} color="var(--text-muted)" />
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              style={{
                height: '46px',
                borderRadius: 'var(--radius-full)',
                padding: '0 20px',
                background: 'rgba(7, 10, 17, 0.6)',
                cursor: 'pointer',
              }}
            >
              {styles.map(s => (
                <option key={s.value} value={s.value}>{text('Phong cách: ', 'Style: ')}{s.label}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {(selectedCategory !== 'all' || searchQuery || selectedStyle !== 'all' || selectedColor !== 'all') && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setSelectedStyle('all');
                setSelectedColor('all');
              }}
              className="btn-secondary"
              style={{ height: '46px', padding: '0 18px', fontSize: '0.84rem' }}
            >
              <RotateCcw size={14} />
              <span>{text('Xóa bộ lọc', 'Clear Filters')}</span>
            </button>
          )}
        </div>

        {/* Row 2: Category Filter Pills with Item Counts */}
        <div className="filter-pills" style={{ marginBottom: '16px' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`filter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
          >
            <span>{text('Tất Cả Món Đồ', 'All Items')}</span>
            <span className="filter-count">{clothes.length}</span>
          </button>

          {categories.map((cat) => {
            const count = clothes.filter(c => c.categoryId === cat.id).length;
            const isActive = selectedCategory === cat.id.toString();
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id.toString())}
                className={`filter-pill ${isActive ? 'active' : ''}`}
              >
                <span>{cat.name}</span>
                <span className="filter-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Row 3: Color dots filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {text('Lọc theo màu:', 'Filter by color:')}
          </span>
          {colorOptions.map((col) => (
            <button
              key={col.value}
              onClick={() => setSelectedColor(col.value)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.76rem',
                fontWeight: 600,
                color: selectedColor === col.value ? '#FFF' : 'var(--text-secondary)',
                background: selectedColor === col.value ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid ' + (selectedColor === col.value ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)'),
              }}
            >
              {col.hex && (
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: col.hex,
                  border: '1px solid rgba(255,255,255,0.4)',
                }} />
              )}
              <span>{col.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Clothing Items or Empty States */}
      {clothes.length === 0 ? (
        <div className="glass-card" style={{
          padding: '80px 24px',
          textAlign: 'center',
          maxWidth: '660px',
          margin: '0 auto',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)'
        }}>
          <div style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(194, 125, 94, 0.15))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: '#F3D98A',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            boxShadow: '0 0 25px rgba(212, 175, 55, 0.2)'
          }}>
            <Plus size={36} color="#D4AF37" />
          </div>
          <h3 style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: '12px', color: '#FFF' }}>
            {text('Tủ Đồ Của Bạn Đang Trống', 'Your Wardrobe Is Empty')}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.65, marginBottom: '32px' }}>
            {text(
              'Chào mừng bạn đến với MYFITDAILY! Bạn chưa tải lên món đồ nào. Hãy bắt đầu số hóa tủ đồ của bạn bằng cách tự chụp ảnh hoặc tải lên áo, quần, váy, blazer, giày dép... để AI Stylist phối đồ chuẩn xác nhất từ trang phục thực tế của bạn!',
              'Welcome to MYFITDAILY! You have not uploaded any clothes yet. Start digitizing your wardrobe by uploading or taking photos of your shirts, pants, dresses, blazers, and shoes so the AI Stylist can coordinate real outfits for you!'
            )}
          </p>
          <button
            onClick={onOpenAddModal}
            className="btn-primary"
            style={{ padding: '14px 36px', fontSize: '1rem' }}
          >
            <Plus size={18} />
            <span>{text('Tải Lên Món Đồ Đầu Tiên Của Bạn', 'Upload Your First Clothing Item')}</span>
          </button>
        </div>
      ) : filteredClothes.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          gap: '24px',
        }}>
          {filteredClothes.map((item) => (
            <ClothingCard 
              key={item.id} 
              item={item} 
              onDelete={handleRequestDeleteSingle}
              isSelectionMode={isSelectionMode}
              isChecked={selectedIds.includes(item.id)}
              onToggleSelect={handleToggleSelect}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <Shirt size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>
            {text('Không tìm thấy món đồ phù hợp', 'No matching items found')}
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 20px' }}>
            {text('Không có trang phục nào khớp với từ khóa tìm kiếm hoặc bộ lọc hiện tại của bạn.', 'No clothes matched your search keywords or current active filters.')}
          </p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setSelectedStyle('all'); setSelectedColor('all'); }}
            className="btn-primary"
          >
            {text('Hiển Thị Tất Cả Món Đồ', 'Show All Items')}
          </button>
        </div>
      )}

      {/* Floating Action Dock for Bulk Deletion */}
      {isSelectionMode && selectedIds.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'rgba(10, 15, 28, 0.92)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(244, 63, 94, 0.5)',
          borderRadius: 'var(--radius-full)',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(225, 29, 72, 0.3)',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#F43F5E',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.85rem',
            }}>
              {selectedIds.length}
            </span>
            <span style={{ color: '#FFF', fontSize: '0.9rem', fontWeight: 600 }}>
              món đồ không cần thiết đã chọn
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleClearSelection}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.82rem', height: 'auto' }}
            >
              Bỏ Chọn
            </button>

            <button
              onClick={handleRequestDeleteBulk}
              id="btn-execute-bulk-delete"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 22px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.88rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #E11D48, #9F1239)',
                color: '#FFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 14px rgba(225, 29, 72, 0.4)',
                cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              <Trash2 size={16} />
              <span>Xóa {selectedIds.length} Món Đồ Này</span>
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, items: [] })}
        items={deleteModal.items}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
