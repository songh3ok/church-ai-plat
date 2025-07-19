const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  // 기본 정보
  name: {
    type: String,
    required: [true, '이름은 필수입니다.'],
    trim: true
  },
  email: {
    type: String,
    required: [true, '이메일은 필수입니다.'],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  birthDate: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'other'
  },
  
  // 가족 정보
  familyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family'
  },
  maritalStatus: {
    type: String,
    enum: ['single', 'married', 'divorced', 'widowed'],
    default: 'single'
  },
  children: [{
    name: String,
    birthDate: Date,
    gender: String
  }],
  
  // 주소 정보
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'South Korea'
    }
  },
  
  // 신앙 정보
  baptismDate: Date,
  baptismType: {
    type: String,
    enum: ['infant', 'believer', 'none'],
    default: 'none'
  },
  membershipDate: {
    type: Date,
    default: Date.now
  },
  spiritualLevel: {
    type: String,
    enum: ['new', 'growing', 'mature', 'leader'],
    default: 'new'
  },
  
  // 소속 정보
  district: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'District'
  },
  cellGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CellGroup'
  },
  ministry: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ministry'
  }],
  
  // AI 분석 결과
  aiAnalysis: {
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    },
    spiritualGrowth: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    engagementScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    recommendedMinistries: [String],
    lastAnalysisDate: {
      type: Date,
      default: Date.now
    }
  },
  
  // 상태 정보
  status: {
    type: String,
    enum: ['active', 'inactive', 'visitor', 'transferred'],
    default: 'active'
  },
  
  // 메모 및 노트
  notes: [{
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    category: {
      type: String,
      enum: ['general', 'counseling', 'visitation', 'ministry', 'prayer'],
      default: 'general'
    }
  }],
  
  // 설정
  preferences: {
    language: {
      type: String,
      default: 'ko'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 가상 필드: 나이 계산
memberSchema.virtual('age').get(function() {
  if (!this.birthDate) return null;
  const today = new Date();
  const birthDate = new Date(this.birthDate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// 가상 필드: 교회 경력 (년)
memberSchema.virtual('churchExperience').get(function() {
  if (!this.membershipDate) return 0;
  const today = new Date();
  const membershipDate = new Date(this.membershipDate);
  return Math.floor((today - membershipDate) / (1000 * 60 * 60 * 24 * 365));
});

// 인덱스 설정
memberSchema.index({ email: 1 });
memberSchema.index({ name: 1 });
memberSchema.index({ district: 1 });
memberSchema.index({ 'aiAnalysis.riskLevel': 1 });
memberSchema.index({ status: 1 });

// 미들웨어: 이메일 중복 체크
memberSchema.pre('save', async function(next) {
  if (this.isModified('email')) {
    const existingMember = await this.constructor.findOne({ 
      email: this.email, 
      _id: { $ne: this._id } 
    });
    if (existingMember) {
      throw new Error('이미 등록된 이메일입니다.');
    }
  }
  next();
});

// 정적 메서드: 위험도별 성도 조회
memberSchema.statics.findByRiskLevel = function(riskLevel) {
  return this.find({ 'aiAnalysis.riskLevel': riskLevel })
    .populate('district')
    .populate('cellGroup')
    .sort({ 'aiAnalysis.lastAnalysisDate': -1 });
};

// 인스턴스 메서드: AI 분석 업데이트
memberSchema.methods.updateAIAnalysis = function(analysisData) {
  this.aiAnalysis = {
    ...this.aiAnalysis,
    ...analysisData,
    lastAnalysisDate: new Date()
  };
  return this.save();
};

module.exports = mongoose.model('Member', memberSchema); 