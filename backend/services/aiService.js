const OpenAI = require('openai');
const Member = require('../models/Member');
const Sermon = require('../models/Sermon');

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AIService {
  // 설교 요약 및 분석
  static async analyzeSermon(sermonText, title) {
    try {
      const prompt = `
다음은 교회 설교 내용입니다. 다음 형식으로 분석해주세요:

설교 제목: ${title}
설교 내용: ${sermonText}

다음 항목들을 분석해주세요:
1. 핵심 메시지 (3-4문장으로 요약)
2. 주요 주제 (5개 이내의 키워드)
3. 감정적 톤 (encouraging, challenging, comforting, convicting, inspiring 중 선택)
4. 복잡도 (1-10점, 1=매우 쉬움, 10=매우 어려움)
5. 대상 청중 (all, new, growing, mature, leaders 중 선택)
6. 적용 포인트 (3-5개)
7. 후속 조치 제안 (2-3개)

JSON 형식으로 응답해주세요:
{
  "summary": "핵심 메시지",
  "keyThemes": ["주제1", "주제2", "주제3"],
  "emotionalTone": "encouraging",
  "complexity": 5,
  "targetAudience": "all",
  "application": ["적용1", "적용2", "적용3"],
  "recommendedFollowUp": ["후속1", "후속2"]
}
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "당신은 교회 설교를 분석하는 전문가입니다. 설교의 핵심을 파악하고 실용적인 적용점을 제시해주세요."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const response = completion.choices[0].message.content;
      return JSON.parse(response);
    } catch (error) {
      console.error('설교 분석 오류:', error);
      throw new Error('설교 분석 중 오류가 발생했습니다.');
    }
  }

  // 성도 상태 분석
  static async analyzeMemberStatus(memberData) {
    try {
      const prompt = `
다음 성도의 데이터를 분석하여 영적 상태와 위험도를 평가해주세요:

성도 정보:
- 이름: ${memberData.name}
- 나이: ${memberData.age}
- 교회 경력: ${memberData.churchExperience}년
- 영적 수준: ${memberData.spiritualLevel}
- 최근 출석률: ${memberData.recentAttendance}%
- 사역 참여: ${memberData.ministryInvolvement}
- 최근 피드백: ${memberData.recentFeedback}

다음 항목들을 분석해주세요:
1. 위험도 (low, medium, high)
2. 영적 성장 점수 (0-100)
3. 참여도 점수 (0-100)
4. 추천 사역 (3-5개)
5. 주의사항 (있다면)

JSON 형식으로 응답해주세요:
{
  "riskLevel": "low",
  "spiritualGrowth": 75,
  "engagementScore": 80,
  "recommendedMinistries": ["사역1", "사역2", "사역3"],
  "warnings": ["주의사항1", "주의사항2"]
}
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "당신은 교회 성도의 영적 상태를 분석하는 전문가입니다. 객관적이고 실용적인 평가를 제공해주세요."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 800
      });

      const response = completion.choices[0].message.content;
      return JSON.parse(response);
    } catch (error) {
      console.error('성도 분석 오류:', error);
      throw new Error('성도 분석 중 오류가 발생했습니다.');
    }
  }

  // 설교 피드백 요약
  static async summarizeSermonFeedback(feedbackData) {
    try {
      const feedbackText = feedbackData.map(f => 
        `응답: ${f.response}, 적용: ${f.application}, 코멘트: ${f.comment || '없음'}`
      ).join('\n');

      const prompt = `
다음은 설교에 대한 성도들의 피드백입니다. 주요 인사이트를 요약해주세요:

${feedbackText}

다음 항목들을 분석해주세요:
1. 전체적인 반응 (긍정적/부정적/중립적)
2. 주요 관심사 (3-5개)
3. 적용 어려움 (있다면)
4. 개선 제안 (2-3개)

JSON 형식으로 응답해주세요:
{
  "overallReaction": "긍정적",
  "mainConcerns": ["관심사1", "관심사2"],
  "applicationDifficulties": ["어려움1", "어려움2"],
  "improvementSuggestions": ["제안1", "제안2"]
}
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "당신은 설교 피드백을 분석하는 전문가입니다. 객관적이고 실용적인 인사이트를 제공해주세요."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 600
      });

      const response = completion.choices[0].message.content;
      return JSON.parse(response);
    } catch (error) {
      console.error('피드백 요약 오류:', error);
      throw new Error('피드백 요약 중 오류가 발생했습니다.');
    }
  }

  // 맞춤형 설교 추천
  static async recommendSermon(memberData, recentSermons) {
    try {
      const sermonsText = recentSermons.map(s => 
        `제목: ${s.title}, 주제: ${s.aiAnalysis.keyThemes.join(', ')}, 반응: ${s.averageResponse}`
      ).join('\n');

      const prompt = `
다음 성도에게 적합한 설교를 추천해주세요:

성도 정보:
- 영적 수준: ${memberData.spiritualLevel}
- 관심사: ${memberData.interests}
- 최근 어려움: ${memberData.recentChallenges}

최근 설교들:
${sermonsText}

이 성도에게 가장 적합한 설교 주제나 방향을 추천해주세요.

JSON 형식으로 응답해주세요:
{
  "recommendedTopics": ["주제1", "주제2", "주제3"],
  "reasoning": "추천 이유",
  "approach": "접근 방식"
}
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "당신은 성도 개인에게 맞춤형 설교를 추천하는 전문가입니다."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const response = completion.choices[0].message.content;
      return JSON.parse(response);
    } catch (error) {
      console.error('설교 추천 오류:', error);
      throw new Error('설교 추천 중 오류가 발생했습니다.');
    }
  }

  // 자동 메시지 생성
  static async generatePersonalMessage(memberData, sermonData) {
    try {
      const prompt = `
다음 성도에게 설교 요약과 개인화된 메시지를 생성해주세요:

성도 정보:
- 이름: ${memberData.name}
- 영적 수준: ${memberData.spiritualLevel}
- 최근 관심사: ${memberData.recentInterests}

설교 정보:
- 제목: ${sermonData.title}
- 요약: ${sermonData.aiAnalysis.summary}
- 적용점: ${sermonData.aiAnalysis.application.join(', ')}

이 성도에게 맞춤화된 친근하고 격려적인 메시지를 작성해주세요.
카카오톡 메시지 형식으로, 200자 이내로 작성해주세요.

응답 형식:
{
  "message": "메시지 내용",
  "tone": "친근함/격려/도전"
}
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "당신은 교회 성도에게 개인화된 메시지를 작성하는 전문가입니다. 친근하고 격려적인 톤으로 작성해주세요."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 300
      });

      const response = completion.choices[0].message.content;
      return JSON.parse(response);
    } catch (error) {
      console.error('메시지 생성 오류:', error);
      throw new Error('메시지 생성 중 오류가 발생했습니다.');
    }
  }

  // 위험도 예측
  static async predictRiskLevel(memberData) {
    try {
      const prompt = `
다음 성도의 데이터를 바탕으로 이탈 위험도를 예측해주세요:

성도 데이터:
- 최근 3개월 출석률: ${memberData.attendanceRate}%
- 사역 참여도: ${memberData.ministryInvolvement}
- 소그룹 참여: ${memberData.cellGroupParticipation}
- 최근 피드백: ${memberData.recentFeedback}
- 개인적 어려움: ${memberData.personalChallenges}

위험도 수준을 예측하고 이유를 설명해주세요.

JSON 형식으로 응답해주세요:
{
  "riskLevel": "low/medium/high",
  "confidence": 85,
  "reasons": ["이유1", "이유2"],
  "recommendations": ["권장사항1", "권장사항2"]
}
`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "당신은 교회 성도의 이탈 위험도를 예측하는 전문가입니다. 객관적이고 정확한 분석을 제공해주세요."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 400
      });

      const response = completion.choices[0].message.content;
      return JSON.parse(response);
    } catch (error) {
      console.error('위험도 예측 오류:', error);
      throw new Error('위험도 예측 중 오류가 발생했습니다.');
    }
  }
}

module.exports = AIService; 