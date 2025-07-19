const mongoose = require('mongoose');

const sermonSchema = new mongoose.Schema({
  // 기본 정보
  title: {
    type: String,
    required: [true, '설교 제목은 필수입니다.'],
    trim: true
  },
  preacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  service: {
    type: String,
    enum: ['sunday_morning', 'sunday_evening', 'wednesday', 'friday', 'special'],
    default: 'sunday_morning'
  },
  
  // 성경 본문
  scripture: {
    book: {
      type: String,
      required: true
    },
    chapter: {
      type: Number,
      required: true
    },
    verse: {
      type: String,
      required: true
    },
    fullText: String
  },
  
  // 설교 내용
  content: {
    outline: [String],
    summary: String,
    keyPoints: [String],
    application: [String],
    fullText: String,
    duration: Number // 분 단위
  },
  
  // AI 분석 결과
  aiAnalysis: {
    summary: String,
    keyThemes: [String],
    emotionalTone: {
      type: String,
      enum: ['encouraging', 'challenging', 'comforting', 'convicting', 'inspiring'],
      default: 'encouraging'
    },
    complexity: {
      type: Number,
      min: 1,
      max: 10,
      default: 5
    },
    targetAudience: {
      type: String,
      enum: ['all', 'new', 'growing', 'mature', 'leaders'],
      default: 'all'
    },
    recommendedFollowUp: [String]
  },
  
  // 피드백 및 반응
  feedback: [{
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member'
    },
    response: {
      type: String,
      enum: ['very_helpful', 'helpful', 'neutral', 'not_helpful', 'confusing'],
      default: 'neutral'
    },
    application: {
      type: String,
      enum: ['will_apply', 'thinking', 'not_sure', 'not_applicable'],
      default: 'thinking'
    },
    comment: String,
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // 출석 통계
  attendance: {
    total: {
      type: Number,
      default: 0
    },
    members: {
      type: Number,
      default: 0
    },
    visitors: {
      type: Number,
      default: 0
    },
    children: {
      type: Number,
      default: 0
    }
  },
  
  // 미디어
  media: {
    audio: String,
    video: String,
    slides: String,
    notes: String
  },
  
  // 태그 및 분류
  tags: [String],
  series: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SermonSeries'
  },
  seriesPart: {
    type: Number,
    default: 1
  },
  
  // 상태
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'delivered', 'archived'],
    default: 'draft'
  },
  
  // 메모
  notes: [{
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 가상 필드: 피드백 통계
sermonSchema.virtual('feedbackStats').get(function() {
  const total = this.feedback.length;
  if (total === 0) return { total: 0, helpful: 0, application: 0 };
  
  const helpful = this.feedback.filter(f => 
    ['very_helpful', 'helpful'].includes(f.response)
  ).length;
  
  const application = this.feedback.filter(f => 
    f.application === 'will_apply'
  ).length;
  
  return {
    total,
    helpful: Math.round((helpful / total) * 100),
    application: Math.round((application / total) * 100)
  };
});

// 가상 필드: 평균 응답 점수
sermonSchema.virtual('averageResponse').get(function() {
  if (this.feedback.length === 0) return 0;
  
  const responseScores = {
    'very_helpful': 5,
    'helpful': 4,
    'neutral': 3,
    'not_helpful': 2,
    'confusing': 1
  };
  
  const totalScore = this.feedback.reduce((sum, f) => {
    return sum + (responseScores[f.response] || 0);
  }, 0);
  
  return Math.round((totalScore / this.feedback.length) * 10) / 10;
});

// 인덱스 설정
sermonSchema.index({ date: -1 });
sermonSchema.index({ preacher: 1 });
sermonSchema.index({ 'scripture.book': 1, 'scripture.chapter': 1 });
sermonSchema.index({ tags: 1 });
sermonSchema.index({ series: 1 });

// 정적 메서드: 시리즈별 설교 조회
sermonSchema.statics.findBySeries = function(seriesId) {
  return this.find({ series: seriesId })
    .populate('preacher')
    .sort({ date: 1 });
};

// 정적 메서드: 최근 설교 조회
sermonSchema.statics.findRecent = function(limit = 10) {
  return this.find({ status: 'delivered' })
    .populate('preacher')
    .sort({ date: -1 })
    .limit(limit);
};

// 정적 메서드: 인기 설교 조회 (피드백 기준)
sermonSchema.statics.findPopular = function(limit = 10) {
  return this.aggregate([
    { $match: { status: 'delivered' } },
    { $addFields: { 
      helpfulRate: { 
        $cond: [
          { $gt: [{ $size: '$feedback' }, 0] },
          { $divide: [
            { $size: { $filter: { 
              input: '$feedback', 
              cond: { $in: ['$$this.response', ['very_helpful', 'helpful']] }
            }}},
            { $size: '$feedback' }
          ]},
          0
        ]
      }
    }},
    { $sort: { helpfulRate: -1 } },
    { $limit: limit },
    { $lookup: { from: 'users', localField: 'preacher', foreignField: '_id', as: 'preacher' }},
    { $unwind: '$preacher' }
  ]);
};

// 인스턴스 메서드: 피드백 추가
sermonSchema.methods.addFeedback = function(memberId, feedbackData) {
  // 기존 피드백이 있는지 확인
  const existingIndex = this.feedback.findIndex(f => 
    f.member.toString() === memberId.toString()
  );
  
  if (existingIndex >= 0) {
    // 기존 피드백 업데이트
    this.feedback[existingIndex] = {
      ...this.feedback[existingIndex],
      ...feedbackData,
      submittedAt: new Date()
    };
  } else {
    // 새 피드백 추가
    this.feedback.push({
      member: memberId,
      ...feedbackData,
      submittedAt: new Date()
    });
  }
  
  return this.save();
};

// 인스턴스 메서드: AI 분석 업데이트
sermonSchema.methods.updateAIAnalysis = function(analysisData) {
  this.aiAnalysis = {
    ...this.aiAnalysis,
    ...analysisData
  };
  return this.save();
};

module.exports = mongoose.model('Sermon', sermonSchema); 