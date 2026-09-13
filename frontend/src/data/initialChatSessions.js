// Dữ liệu mẫu các đoạn chat lịch sử ban đầu theo đúng giao diện ChatGPT
export const INITIAL_CHAT_SESSIONS = [
  {
    id: 'chat-1',
    title: 'Nhớ dự án MYFITDAILY',
    createdAt: Date.now() - 1000 * 60 * 60 * 2, // 2 giờ trước
    messages: [
      {
        id: 101,
        sender: 'user',
        text: 'Nhớ dự án MYFITDAILY và hỗ trợ lên kế hoạch trang phục tuần này nhé',
        isFashionRelated: true,
      },
      {
        id: 102,
        sender: 'ai',
        text: 'Tôi đã ghi nhớ rõ dự án **MYFITDAILY** của chúng ta! Dưới đây là kế hoạch trang phục đề xuất cho tuần làm việc và hoạt động của bạn:\n\n' +
              '• **Thứ 2 - Thứ 3 (Đầu tuần năng lượng):** Áo sơ mi trắng phom rộng kết hợp quần tây âu ống suông màu than chì và giày tây hoặc loafer da bóng.\n' +
              '• **Thứ 4 - Thứ 5 (Smart Casual):** Áo thun polo dệt kim kết hợp quần chinos beige và blazer nhẹ.\n' +
              '• **Thứ 6 (Creative Friday):** Áo thun basic trắng, khoác denim jacket hoặc overshirt, đi cùng quần jeans tối màu và sneakers trắng.\n' +
              '• **Cuối tuần:** Set đồ dạo phố thoải mái với áo nỉ oversize và quần shorts/chinos lửng.\n\n' +
              'Bạn có muốn tôi điều chỉnh chi tiết theo các món đồ có sẵn trong tủ của bạn không?',
        isFashionRelated: true,
        suggestedFollowUpQuestions: [
          "Phối lại set đồ thứ 2 với áo blazer",
          "Tủ đồ của tôi có đủ đồ cho kế hoạch này chưa?",
          "Gợi ý thêm phụ kiện đi kèm"
        ]
      }
    ]
  },
  {
    id: 'chat-2',
    title: 'Ví dụ vận động sinh học',
    createdAt: Date.now() - 1000 * 60 * 60 * 24, // 1 ngày trước
    messages: [
      {
        id: 201,
        sender: 'user',
        text: 'Ví dụ vận động sinh học ảnh hưởng thế nào đến sự thoải mái của chất liệu quần áo?',
        isFashionRelated: true,
      },
      {
        id: 202,
        sender: 'ai',
        text: 'Vận động sinh học (**Biomechanics**) trong thiết kế thời trang tập trung vào chuyển động cơ học của các khớp xương và khối cơ khi cơ thể hoạt động:\n\n' +
              '1. **Độ co giãn tại điểm căng (Stress Points):** Khi ngồi hoặc co gối, vải tại đầu gối và mông cần độ giãn từ 15-25%. Chất liệu pha Spandex/Elastane giúp giảm áp lực cọ xát và tránh rách đường may.\n' +
              '2. **Cử động vai và nách:** Cánh tay nâng lên hạ xuống liên tục khi làm việc với máy tính. Áo có đường cắt raglan hoặc vải dệt kim sẽ không bị giật gấu áo lên khi giơ tay.\n' +
              '3. **Điều hòa thân nhiệt theo vùng vận động:** Lưng và nách là nơi tiết nhiệt cao nhất, cần vải có cấu trúc dệt thoáng khí tự nhiên như Modal, Cotton Pima hoặc Tencel.\n\n' +
              'Các thiết kế may mặc hiện đại luôn tính toán kỹ các thông số này để trang phục vừa tôn dáng vừa tạo cảm giác nhẹ nhàng nhất.',
        isFashionRelated: true,
        suggestedFollowUpQuestions: [
          "Chất liệu nào tốt nhất cho người ngồi văn phòng cả ngày?",
          "Cách nhận biết vải cotton chất lượng cao"
        ]
      }
    ]
  },
  {
    id: 'chat-3',
    title: 'Quy ước C#',
    createdAt: Date.now() - 1000 * 60 * 60 * 48, // 2 ngày trước
    messages: [
      {
        id: 301,
        sender: 'user',
        text: 'Gợi ý phong cách phối đồ cho lập trình viên làm việc văn phòng công nghệ C# / .NET',
        isFashionRelated: true,
      },
      {
        id: 302,
        sender: 'ai',
        text: 'Dành riêng cho các kỹ sư công nghệ và lập trình viên C# / .NET:\n\n' +
              '💼 **Phong cách Tech Minimalist (Hiện đại & Tinh tế):**\n' +
              '• **Áo:** Áo thun cổ tròn chất liệu cotton dày dặn màu đen / navy hoặc áo sơ mi overshirt chất liệu đũi/kaki khoác ngoài.\n' +
              '• **Quần:** Quần chinos dáng crop mắt cá chân hoặc quần âu vải co giãn thoáng mát.\n' +
              '• **Giày:** Sneakers tối giản da trắng (Minimalist White Leather) hoặc Chelsea boots da lộn.\n' +
              '• **Phụ kiện:** Đồng hồ thông minh hoặc đồng hồ cơ tối giản kim loại, balo da chống sốc đựng laptop.\n\n' +
              'Set đồ này giúp bạn luôn chỉn chu khi họp cùng Product Manager và thoải mái khi ngồi code liên tục nhiều giờ!',
        isFashionRelated: true,
        suggestedFollowUpQuestions: [
          "Gợi ý áo khoác nhẹ mặc trong phòng máy lạnh",
          "Thêm giày lười Loafer vào phong cách này"
        ]
      }
    ]
  }
];
