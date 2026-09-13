// Utility: AI Garment Extractor & Background Removal (HTML5 Canvas Engine)
// Bóc tách trang phục tự động: Chỉ cắt lọc duy nhất item áo hoặc quần/váy/giày, loại bỏ 100% cảnh vật xung quanh (phòng ngủ, sàn nhà, móc treo, người mặc, tường).

/**
 * Kiểm tra xem một điểm ảnh có phải là màu da người (Human Skin Tone) hay không
 */
function isHumanSkinPixel(r, g, b) {
  // Điều kiện dải màu da chuẩn trong không gian RGB và YCbCr/HSV
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  
  if (r < 75 || g < 40 || b < 25) return false;
  if (r <= g || r <= b) return false;
  if ((r - g) < 10) return false;

  // Tỉ lệ tương phản da
  const diff = max - min;
  if (diff < 15) return false;

  // Tính hue
  let h = 0;
  if (max === r) {
    h = ((g - b) / diff) * 60;
    if (h < 0) h += 360;
  }
  return (h >= 0 && h <= 45) || (h >= 345 && h <= 360);
}

/**
 * Tự động phân tích và loại bỏ hoàn toàn cảnh vật quanh trang phục, chỉ giữ lại item áo/quần
 * @param {string} imageSrc - URL hoặc Base64 của ảnh gốc
 * @param {object} options - Tùy chọn tách nền
 * @returns {Promise<{ originalUrl: string, processedUrl: string, boundingBox: object, success: boolean }>}
 */
export async function extractGarmentImage(imageSrc, options = {}) {
  const {
    tolerance = 32,            // Ngưỡng phân tách màu (10 - 70)
    autoCrop = true,           // Tự động xén sát mép trang phục (Bounding Box)
    removeHanger = true,        // Loại bỏ móc treo ở đỉnh áo
    removeHumanBody = true,     // Loại bỏ da người (cổ, mặt, tay, chân) nếu người đang mặc
    edgeSmoothing = true       // Làm mịn viền vải tự nhiên (Anti-aliasing)
  } = options;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      try {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        // Giới hạn độ phân giải xử lý vừa đủ nét nhưng tốc độ tức thì (< 800px)
        const maxDim = 800;
        let procW = width;
        let procH = height;
        if (procW > maxDim || procH > maxDim) {
          if (procW > procH) {
            procH = Math.round((procH * maxDim) / procW);
            procW = maxDim;
          } else {
            procW = Math.round((procW * maxDim) / procH);
            procH = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = procW;
        canvas.height = procH;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, procW, procH);

        const imgData = ctx.getImageData(0, 0, procW, procH);
        const data = imgData.data;

        // =========================================================================
        // BƯỚC 1: LẤY MẪU MÀU CẢNH VẬT XUNG QUANH (MULTI-PALETTE BORDER SAMPLING)
        // Quét toàn bộ viền 4 cạnh của ảnh: trên, dưới, trái, phải để nhận diện các màu nền/cảnh vật
        // =========================================================================
        const bgColors = [];
        const borderBand = Math.max(3, Math.floor(Math.min(procW, procH) * 0.05));

        const addBgSample = (r, g, b, a) => {
          if (a < 30) return;
          // Gom nhóm màu nền tương tự nhau (Color Clustering)
          for (let c of bgColors) {
            const d = Math.abs(c.r - r) + Math.abs(c.g - g) + Math.abs(c.b - b);
            if (d < 25) {
              c.count++;
              return;
            }
          }
          bgColors.push({ r, g, b, count: 1 });
        };

        // Lấy mẫu viền trên và dưới
        for (let x = 0; x < procW; x += 3) {
          for (let y = 0; y < borderBand; y += 2) {
            const idx = (y * procW + x) * 4;
            addBgSample(data[idx], data[idx + 1], data[idx + 2], data[idx + 3]);
          }
          for (let y = procH - borderBand; y < procH; y += 2) {
            const idx = (y * procW + x) * 4;
            addBgSample(data[idx], data[idx + 1], data[idx + 2], data[idx + 3]);
          }
        }

        // Lấy mẫu viền trái và phải
        for (let y = 0; y < procH; y += 3) {
          for (let x = 0; x < borderBand; x += 2) {
            const idx = (y * procW + x) * 4;
            addBgSample(data[idx], data[idx + 1], data[idx + 2], data[idx + 3]);
          }
          for (let x = procW - borderBand; x < procW; x += 2) {
            const idx = (y * procW + x) * 4;
            addBgSample(data[idx], data[idx + 1], data[idx + 2], data[idx + 3]);
          }
        }

        // Sắp xếp các cụm màu nền chiếm đa số
        bgColors.sort((a, b) => b.count - a.count);
        const dominantBgColors = bgColors.slice(0, 8); // Giữ tối đa 8 màu nền cảnh vật chính

        // =========================================================================
        // BƯỚC 2: THUẬT TOÁN LAN TRUYỀN TÁCH CẢNH VẬT TỪ 4 BIÊN VÀO TRUNG TÂM (BFS MASKING)
        // Cảnh vật xung quanh luôn kết nối với các mép ảnh. Chúng ta lan truyền từ các biên vào
        // cho đến khi chạm vào lớp vải trang phục (Boundary Edge detection).
        // =========================================================================
        const visited = new Uint8Array(procW * procH); // 0: chưa xét, 1: là nền/cảnh vật, 2: là trang phục
        const queue = [];

        // Đẩy toàn bộ các điểm ảnh ở mép 4 biên vào hàng đợi
        const pushBorder = (x, y) => {
          const p = y * procW + x;
          if (!visited[p]) {
            visited[p] = 1;
            queue.push(p);
          }
        };

        for (let x = 0; x < procW; x++) {
          pushBorder(x, 0);
          pushBorder(x, procH - 1);
        }
        for (let y = 0; y < procH; y++) {
          pushBorder(0, y);
          pushBorder(procW - 1, y);
        }

        const isColorMatchBg = (r, g, b, tol) => {
          const tolSq = (tol * 2.5) ** 2;
          for (let c of dominantBgColors) {
            const dist = (r - c.r) ** 2 + (g - c.g) ** 2 + (b - c.b) ** 2;
            if (dist < tolSq) return true;
          }
          return false;
        };

        // Lan truyền BFS
        let qIdx = 0;
        while (qIdx < queue.length) {
          const p = queue[qIdx++];
          const px = p % procW;
          const py = Math.floor(p / procW);
          const idx = p * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          // Kiểm tra 4 hướng lân cận
          const neighbors = [
            [px + 1, py],
            [px - 1, py],
            [px, py + 1],
            [px, py - 1]
          ];

          for (let [nx, ny] of neighbors) {
            if (nx >= 0 && nx < procW && ny >= 0 && ny < procH) {
              const np = ny * procW + nx;
              if (visited[np] === 0) {
                const nIdx = np * 4;
                const nr = data[nIdx];
                const ng = data[nIdx + 1];
                const nb = data[nIdx + 2];

                // Độ chênh lệch màu giữa 2 pixel liền kề
                const localDiff = Math.abs(r - nr) + Math.abs(g - ng) + Math.abs(b - nb);

                // Nếu khớp với một trong các màu cảnh vật và không phải là đường biên vải đậm
                const isBg = isColorMatchBg(nr, ng, nb, tolerance);

                if (isBg && localDiff < 45) {
                  visited[np] = 1; // Đánh dấu là cảnh vật xung quanh
                  queue.push(np);
                }
              }
            }
          }
        }

        // =========================================================================
        // BƯỚC 3: LỌC BỎ MÓC TREO & THỂ THÂN NGƯỜI (HANGER & HUMAN BODY SUPPRESSION)
        // =========================================================================
        let minX = procW, minY = procH, maxX = 0, maxY = 0;
        let garmentPixelsCount = 0;

        for (let y = 0; y < procH; y++) {
          for (let x = 0; x < procW; x++) {
            const p = y * procW + x;
            const idx = p * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];

            // 1. Nếu đã bị BFS đánh dấu là cảnh vật xung quanh -> Làm trong suốt hoàn toàn
            if (visited[p] === 1 || a < 20) {
              data[idx + 3] = 0;
              continue;
            }

            // 2. Lọc bỏ Móc Treo (Hanger): thường ở 10% đỉnh trên cùng ở vị trí cổ
            if (removeHanger && y < procH * 0.12) {
              // Thanh móc treo thường có màu kim loại xám/đen/bạc hoặc màu gỗ nâu sẫm nằm ở giữa đỉnh
              const isHangerArea = x > procW * 0.25 && x < procW * 0.75;
              const isNearBg = isColorMatchBg(r, g, b, tolerance * 1.3);
              if (isHangerArea && (isNearBg || y < procH * 0.05)) {
                data[idx + 3] = 0;
                continue;
              }
            }

            // 3. Lọc bỏ Da Người (Cổ, Khuôn mặt, Cánh tay, Đôi chân) nếu là ảnh người đang mặc
            if (removeHumanBody && isHumanSkinPixel(r, g, b)) {
              // Da ở phần cổ áo / mặt phía trên cùng (y < 20% chiều cao)
              // Hoặc da ở 2 bên rìa ngoài cánh tay (x < 18% hoặc x > 82%)
              // Hoặc da ở phần chân phía dưới cùng (y > 75%)
              const isNeckOrFace = y < procH * 0.22;
              const isArmOrHand = (x < procW * 0.18 || x > procW * 0.82) && y > procH * 0.25;
              const isLegOrFoot = y > procH * 0.78;

              if (isNeckOrFace || isArmOrHand || isLegOrFoot) {
                data[idx + 3] = 0;
                continue;
              }
            }

            // 4. Kiểm tra xem điểm này có màu trùng với màu nền cảnh vật hay không
            if (isColorMatchBg(r, g, b, tolerance * 0.95)) {
              data[idx + 3] = 0;
              continue;
            }

            // ĐIỂM ẢNH HỢP LỆ THUỘC TRANG PHỤC (GARMENT FABRIC)
            garmentPixelsCount++;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }

        // =========================================================================
        // BƯỚC 4: LÀM MỊN ĐƯỜNG BIÊN VẢI (ANTI-ALIASING & FEATHERING)
        // =========================================================================
        if (edgeSmoothing) {
          for (let y = 1; y < procH - 1; y++) {
            for (let x = 1; x < procW - 1; x++) {
              const p = y * procW + x;
              const idx = p * 4;
              if (data[idx + 3] > 0) {
                // Đếm số lượng điểm ảnh trong suốt xung quanh
                let transparentNeighbors = 0;
                const check = (offset) => { if (data[offset + 3] === 0) transparentNeighbors++; };
                check(((y - 1) * procW + x) * 4);
                check(((y + 1) * procW + x) * 4);
                check((y * procW + (x - 1)) * 4);
                check((y * procW + (x + 1)) * 4);

                if (transparentNeighbors >= 2) {
                  // Điểm mép viền vải -> Làm mềm nhẹ alpha để viền không bị răng cưa
                  data[idx + 3] = Math.floor(data[idx + 3] * 0.75);
                }
              }
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);

        // =========================================================================
        // BƯỚC 5: TỰ ĐỘNG XÉN SÁT BIÊN TRANG PHỤC (TIGHT BOUNDING-BOX CROP)
        // Cắt bỏ hoàn toàn các khoảng trống thừa xung quanh, chỉ xuất ra hình ảnh item
        // =========================================================================
        if (autoCrop && garmentPixelsCount > 120 && maxX > minX && maxY > minY) {
          const padding = 8;
          const cropX = Math.max(0, minX - padding);
          const cropY = Math.max(0, minY - padding);
          const cropW = Math.min(procW - cropX, (maxX - minX) + padding * 2);
          const cropH = Math.min(procH - cropY, (maxY - minY) + padding * 2);

          const cropCanvas = document.createElement('canvas');
          cropCanvas.width = cropW;
          cropCanvas.height = cropH;
          const cropCtx = cropCanvas.getContext('2d');
          cropCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

          const processedUrl = cropCanvas.toDataURL('image/png');
          resolve({
            originalUrl: imageSrc,
            processedUrl,
            boundingBox: { x: cropX, y: cropY, width: cropW, height: cropH },
            success: true
          });
        } else {
          const processedUrl = canvas.toDataURL('image/png');
          resolve({
            originalUrl: imageSrc,
            processedUrl,
            boundingBox: { x: 0, y: 0, width: procW, height: procH },
            success: true
          });
        }
      } catch (err) {
        console.warn("Garment extraction error:", err);
        resolve({
          originalUrl: imageSrc,
          processedUrl: imageSrc,
          boundingBox: null,
          success: false
        });
      }
    };

    img.onerror = () => {
      resolve({
        originalUrl: imageSrc,
        processedUrl: imageSrc,
        boundingBox: null,
        success: false
      });
    };

    img.src = imageSrc;
  });
}

/**
 * Thư viện các mẫu trang phục chuẩn đã bóc tách nền (Transparent PNG Assets)
 * Dùng cho người dùng trải nghiệm ngay lập tức trên Ma-nơ-canh ảo.
 */
export const SEGMENTED_PRESET_ITEMS = [
  {
    id: 'seg-top-1',
    name: 'Áo Sơ Mi Lụa Trắng Ý',
    categoryId: 1,
    categoryName: 'Tops',
    color: 'Trắng',
    style: 'Formal',
    brand: 'Zara Studio',
    imageUrl: '/assets/clothes/shirt_white.svg',
    type: 'top'
  },
  {
    id: 'seg-top-2',
    name: 'Áo Thun Cotton Boxy Fit Đen',
    categoryId: 1,
    categoryName: 'Tops',
    color: 'Đen',
    style: 'Streetwear',
    brand: 'Uniqlo LifeWear',
    imageUrl: '/assets/clothes/tshirt_black.svg',
    type: 'top'
  },
  {
    id: 'seg-outer-1',
    name: 'Áo Blazer Dạ Nâu Cacao Relaxed',
    categoryId: 4,
    categoryName: 'Outerwear',
    color: 'Nâu',
    style: 'Smart Casual',
    brand: 'Mango Tailoring',
    imageUrl: '/assets/clothes/blazer_brown.svg',
    type: 'outer'
  },
  {
    id: 'seg-bottom-1',
    name: 'Quần Tây Xếp Ly Ống Suông Đen',
    categoryId: 2,
    categoryName: 'Bottoms',
    color: 'Đen',
    style: 'Formal',
    brand: 'Massimo Dutti',
    imageUrl: '/assets/clothes/pants_black.svg',
    type: 'bottom'
  },
  {
    id: 'seg-bottom-2',
    name: 'Quần Jeans Ống Rộng Vintage Blue',
    categoryId: 2,
    categoryName: 'Bottoms',
    color: 'Xanh Denim',
    style: 'Casual',
    brand: 'Levi\'s 501',
    imageUrl: '/assets/clothes/jeans_blue.svg',
    type: 'bottom'
  },
  {
    id: 'seg-dress-1',
    name: 'Đầm Lụa Midi Slip Dress Champagne',
    categoryId: 3,
    categoryName: 'Dresses',
    color: 'Hồng Nhạt',
    style: 'Elegant',
    brand: 'Zara Atelier',
    imageUrl: '/assets/clothes/dress_silk.svg',
    type: 'bottom'
  },
  {
    id: 'seg-shoes-1',
    name: 'Giày Loafer Da Bóng Khóa Ngựa',
    categoryId: 5,
    categoryName: 'Shoes',
    color: 'Đen',
    style: 'Formal',
    brand: 'Cole Haan',
    imageUrl: '/assets/clothes/shoes_loafer.svg',
    type: 'shoes'
  },
  {
    id: 'seg-shoes-2',
    name: 'Sneaker Trắng Classic Retro',
    categoryId: 5,
    categoryName: 'Shoes',
    color: 'Trắng',
    style: 'Casual',
    brand: 'Adidas Samba',
    imageUrl: '/assets/clothes/shoes_sneaker.svg',
    type: 'shoes'
  },
  {
    id: 'seg-acc-1',
    name: 'Túi Da Đeo Chéo Dáng Baguette',
    categoryId: 6,
    categoryName: 'Accessories',
    color: 'Đen',
    style: 'Minimalist',
    brand: 'Charles & Keith',
    imageUrl: '/assets/clothes/bag_leather.svg',
    type: 'accessory'
  }
];
