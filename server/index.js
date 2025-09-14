const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const chatRoutes = require('./routes/chat');
const regulationsRoutes = require('./routes/regulations');

const app = express();
const PORT = process.env.PORT || 5000;

// 보안 및 성능 미들웨어
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 최대 100개 요청
  message: '너무 많은 요청이 발생했습니다. 15분 후 다시 시도해주세요.'
});
app.use('/api', limiter);

// CORS 설정
app.use(cors({
  origin: process.env.CLIENT_URL || ['http://localhost:3000', 'http://localhost:3002'],
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 정적 파일 서빙 (프로덕션용)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// API 라우트
app.use('/api/chat', chatRoutes);
app.use('/api/regulations', regulationsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Railway Regulations Chatbot API'
  });
});

// 프로덕션에서 React 앱 서빙
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: '서버 내부 오류가 발생했습니다.',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 핸들링
app.use('*', (req, res) => {
  res.status(404).json({ error: '요청하신 리소스를 찾을 수 없습니다.' });
});

app.listen(PORT, () => {
  console.log(`🚄 Railway Regulations Chatbot Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});