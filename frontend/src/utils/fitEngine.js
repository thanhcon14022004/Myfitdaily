// These measurements belong to the garment, not a computer-vision estimate.
// They are the minimum data needed to make a defensible size recommendation.
const FIT_SPECS = {
  'Áo ba lỗ Coolmate Relaxed': { chest: 108, shoulder: 44, ease: 14, fit: 'relaxed' },
  'Sweatshirt Frozen.HN Studio': { chest: 116, shoulder: 54, ease: 20, fit: 'oversize' },
  'Quần suông dây rút Cream': { waistMin: 72, waistMax: 92, hips: 112, inseam: 72, ease: 12, fit: 'relaxed' },
  'Sneaker Retro Cream / Black': { size: 42, footLength: 26.5, fit: 'true-to-size' }
};

export function getFitRecommendation(item, user = {}) {
  const spec = FIT_SPECS[item?.name];
  if (!spec) return { label: 'Cần thông số sản phẩm', tone: 'neutral', detail: 'Chưa có bảng kích thước của món này.' };
  if (item.categoryId === 1) {
    if (!user.chest) return { label: 'Cần vòng ngực', tone: 'neutral', detail: `Áo có vòng ngực ${spec.chest} cm.` };
    const room = spec.chest - user.chest;
    if (room < 4) return { label: 'Hơi chật', tone: 'danger', detail: `Chênh ${room} cm — nên tăng size.` };
    return { label: spec.fit === 'oversize' ? 'Oversize chuẩn' : 'Vừa thoải mái', tone: 'good', detail: `Độ cử động ${room} cm ở vòng ngực.` };
  }
  if (item.categoryId === 2) {
    if (!user.waist || !user.hips) return { label: 'Cần eo & mông', tone: 'neutral', detail: `Cạp chun ${spec.waistMin}–${spec.waistMax} cm.` };
    const waistOk = user.waist >= spec.waistMin && user.waist <= spec.waistMax;
    const hipRoom = spec.hips - user.hips;
    if (!waistOk || hipRoom < 4) return { label: 'Hơi chật', tone: 'danger', detail: 'Nên chọn size lớn hơn hoặc mẫu khác.' };
    return { label: 'Vừa thoải mái', tone: 'good', detail: `Dư ${hipRoom} cm ở mông; inseam ${spec.inseam} cm.` };
  }
  return { label: 'Cần chiều dài bàn chân', tone: 'neutral', detail: `Mẫu hiện tại là EU ${spec.size} (${spec.footLength} cm).` };
}

export function hasCompleteFitProfile(user = {}) {
  return Boolean(user.chest && user.waist && user.hips);
}
