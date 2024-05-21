const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB 연결 설정
mongoose.connect('mongodb://localhost:27017/auth-example', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// 사용자 데이터 모델 정의
const userSchema = new mongoose.Schema({
    studentId: Number,
    password: String
});
const User = mongoose.model('User', userSchema);

// JSON 요청 본문을 파싱하기 위한 미들웨어
app.use(bodyParser.json());

// 로그인 엔드포인트
app.post('/auth/login', async (req, res) => {
    const { studentId, password } = req.body; // JSON 데이터 추출

    // 요청 본문 유효성 검사
    if (!studentId || !password) {
        return res.status(400).json({ error: '학생 ID와 비밀번호를 모두 입력해주세요' });
    }

    try {
        // MongoDB에서 사용자 확인
        const user = await User.findOne({ studentId, password });

        if (user) {
            // JWT 토큰 생성
            const token = jwt.sign({ studentId: user.studentId }, 'secret_key_for_jwt');

            // 응답에 토큰과 사용자 정보를 포함하여 전송
            res.status(200).json({ token, user });
        } else {
            res.status(401).json({ error: '유효하지 않은 학생 ID 또는 비밀번호입니다' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다' });
    }
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
