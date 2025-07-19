const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// 라우터 임포트
const authRoutes = require('./routes/auth');
const memberRoutes = require('./routes/members');
const sermonRoutes = require('./routes/sermons');
const ministryRoutes = require('./routes/ministry');
const analyticsRoutes = require('./routes/analytics');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100 // IP당 최대 요청 수
});
app.use('/api/', limiter);

// 로깅
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서빙
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API 라우트
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/sermons', sermonRoutes);
app.use('/api/ministry', ministryRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);

// 헬스 체크
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: '서버 내부 오류가 발생했습니다.',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// 404 핸들링
app.use('*', (req, res) => {
  res.status(404).json({ error: '요청한 리소스를 찾을 수 없습니다.' });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 교회 AI 플랫폼 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📊 환경: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API 엔드포인트: http://localhost:${PORT}/api`);
});

module.exports = app; 