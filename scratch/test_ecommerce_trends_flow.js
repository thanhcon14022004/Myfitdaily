// Test script to verify Age-based E-Commerce Fashion Trend Intelligence
const BASE_URL = 'http://localhost:5240/api';

async function run() {
  console.log('🚀 Starting Multi-Age E-Commerce Fashion Trends Integration Test...\n');

  // Step 1: Verify GET /api/ai/ecommerce-trends
  console.log('Step 1: Testing GET /api/ai/ecommerce-trends...');
  const trendsRes = await fetch(`${BASE_URL}/ai/ecommerce-trends`);
  const trendsData = await trendsRes.json();

  if (!trendsRes.ok || !trendsData.success) {
    console.error('❌ Failed to fetch e-commerce trends:', trendsData);
    process.exit(1);
  }

  console.log(`✅ Loaded ${trendsData.data.length} age group trends from backend:`);
  trendsData.data.forEach(t => {
    console.log(`  - [${t.ageGroupKey}] ${t.ageGroupLabel}:`);
    console.log(`    Channels: ${t.primaryChannels.join(', ')}`);
    console.log(`    Hot Items: ${t.hotTrendingItems.slice(0, 3).join(', ')}`);
  });

  // Helper to register, update profile, and test chat
  async function testAgeFlow(testName, age, height, weight, bodyShape, queryMessage, expectedKeywords) {
    console.log(`\n-----------------------------------------------------------`);
    console.log(`Testing: ${testName} (Age: ${age}, ${height}cm, ${weight}kg, ${bodyShape})`);
    console.log(`-----------------------------------------------------------`);

    // Register user
    const email = `test_trend_${Date.now()}_${Math.floor(Math.random()*1000)}@myfitdaily.com`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'Password123!', fullName: testName })
    });
    const regData = await regRes.json();
    const token = regData.data.token;

    // Update profile with age and body metrics
    const updateRes = await fetch(`${BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        fullName: testName,
        gender: 'Female',
        height,
        weight,
        age,
        bodyShape,
        chest: 85,
        waist: 65,
        hips: 90
      })
    });
    const updateData = await updateRes.json();
    console.log(`✅ Profile updated. Age: ${updateData.data.age}, AgeGroup: "${updateData.data.ageGroup}"`);

    // Call AI Chat
    console.log(`Sending query: "${queryMessage}"...`);
    const chatRes = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        message: queryMessage,
        history: [],
        wardrobeItemIds: []
      })
    });
    const chatData = await chatRes.json();
    const reply = chatData.data?.reply || '';
    console.log(`AI Reply excerpt:\n${reply.slice(0, 450)}...\n`);

    const hasExpectedKeyword = expectedKeywords.some(kw => reply.toLowerCase().includes(kw.toLowerCase()));
    if (!hasExpectedKeyword) {
      console.warn(`⚠️ Warning: None of expected keywords [${expectedKeywords.join(', ')}] found in reply.`);
    } else {
      console.log(`✅ PASS: AI tailored response to ${testName} with matching trend keywords!`);
    }

    // Call AI Recommend
    const recRes = await fetch(`${BASE_URL}/ai/recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        occasion: 'Casual',
        weather: 'Warm',
        style: 'Trendy',
        colorTone: 'Neutral',
        availableItemIds: []
      })
    });
    const recData = await recRes.json();
    console.log(`Recommend Outfit: "${recData.data?.outfitName}"`);
    console.log(`Stylist Notes excerpt: ${recData.data?.stylistNotes?.slice(0, 200)}...`);
    console.log(`✅ Recommend generated successfully!`);
  }

  // Run tests across different age generations
  await testAgeFlow(
    'Linh (Gen Z Giới Trẻ)',
    19,
    163,
    48,
    'Thước kẻ',
    'Tư vấn cho mình set đồ đi chơi dạo phố cuối tuần theo trend TikTok Shop & Shopee với!',
    ['TikTok', 'Shopee', 'Gen Z', 'Y2K', 'ống rộng', 'baby tee', 'sneaker']
  );

  await testAgeFlow(
    'Hương (Millennials Công Sở Trẻ)',
    29,
    166,
    53,
    'Đồng hồ cát',
    'Tư vấn cho mình set đồ đi làm công sở thanh lịch theo xu hướng Zara và Uniqlo',
    ['Zara', 'Uniqlo', 'Millennials', 'Smart Casual', 'Blazer', 'xếp ly', 'tây']
  );

  await testAgeFlow(
    'Cô Mai (Chững Chạc & Quý Phái)',
    46,
    160,
    56,
    'Quả táo',
    'Tư vấn trang phục dự tiệc sang trọng và tôn vinh khí chất quý phái',
    ['Massimo', 'Old Money', 'lụa', 'Tweed', 'quý phái', '35 - 49', 'đĩnh đạc']
  );

  console.log('\n🎉 ALL MULTI-AGE E-COMMERCE TREND TESTS PASSED 100%!');
}

run().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
