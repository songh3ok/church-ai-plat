import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  TextField,
  IconButton,
  Collapse
} from '@mui/material';
import {
  Send,
  TrendingUp,
  TrendingDown,
  LocationOn,
  Business,
  Chat,
  Code,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Layout from './Layout';

interface DashboardData {
  totalMembers: number;
  activeMembers: number;
  visitors: number;
  attendanceRate: number;
  recentSermons: number;
  pendingActions: number;
  riskMembers: number;
  growthRate: number;
}

interface SermonData {
  id: string;
  title: string;
  date: string;
  attendance: number;
  feedbackRate: number;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  message: string;
  timestamp: Date;
  isTyping?: boolean;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData>({
    totalMembers: 0,
    activeMembers: 0,
    visitors: 0,
    attendanceRate: 0,
    recentSermons: 0,
    pendingActions: 0,
    riskMembers: 0,
    growthRate: 0
  });
  const [recentSermons] = useState<SermonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      message: '안녕하세요! 교회 AI 어시스턴트입니다. 무엇을 도와드릴까요?',
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [executionLog, setExecutionLog] = useState<string[]>([]);
  const [showExecutionLog, setShowExecutionLog] = useState(false);

  // 샘플 데이터 로딩
  useEffect(() => {
    setTimeout(() => {
      setData({
        totalMembers: 245,
        activeMembers: 198,
        visitors: 12,
        attendanceRate: 78.5,
        recentSermons: 8,
        pendingActions: 15,
        riskMembers: 8,
        growthRate: 12.3
      });

      // setRecentSermons([
      //   {
      //     id: '1',
      //     title: '하나님의 사랑',
      //     date: '2024-01-14',
      //     attendance: 185,
      //     feedbackRate: 85
      //   },
      //   {
      //     id: '2',
      //     title: '믿음의 여정',
      //     date: '2024-01-07',
      //     attendance: 172,
      //     feedbackRate: 78
      //   },
      //   {
      //     id: '3',
      //     title: '용서의 힘',
      //     date: '2023-12-31',
      //     attendance: 195,
      //     feedbackRate: 92
      //   }
      // ]);

      setLoading(false);
    }, 1000);
  }, []);

  const attendanceData = [
    { name: '1주', attendance: 185 },
    { name: '2주', attendance: 172 },
    { name: '3주', attendance: 195 },
    { name: '4주', attendance: 188 },
    { name: '5주', attendance: 201 }
  ];

  const memberDistribution = [
    { name: '활성 성도', value: 198, color: '#4caf50' },
    { name: '비활성 성도', value: 47, color: '#ff9800' },
    { name: '방문자', value: 12, color: '#2196f3' }
  ];

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      message: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsAiThinking(true);

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        message: `"${chatInput}"에 대한 분석을 시작합니다. 관련 데이터를 수집하고 분석 중입니다...`,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiResponse]);
      setIsAiThinking(false);

      // 실행 로그 추가
      setExecutionLog(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] 사용자 질문 분석: "${chatInput}"`,
        `[${new Date().toLocaleTimeString()}] AI 모델 호출: MEMBER_ANALYSIS`,
        `[${new Date().toLocaleTimeString()}] 데이터베이스 쿼리 실행 중...`,
        `[${new Date().toLocaleTimeString()}] 분석 완료. 결과 생성 중...`
      ]);
    }, 2000);
  };

  const StatCard: React.FC<{ title: string; value: string | number; subtitle?: string; trend?: 'up' | 'down'; icon?: React.ReactNode }> = ({ 
    title, 
    value, 
    subtitle, 
    trend, 
    icon 
  }) => (
    <Card sx={{ 
      height: '100%', 
      backgroundColor: '#1e1e1e', 
      color: 'white',
      border: '1px solid #333'
    }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2" sx={{ color: '#888' }}>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ color: 'white' }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary" sx={{ color: '#888' }}>
                {subtitle}
              </Typography>
            )}
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                {trend === 'up' ? (
                  <TrendingUp color="success" fontSize="small" />
                ) : (
                  <TrendingDown color="error" fontSize="small" />
                )}
                <Typography variant="body2" color={trend === 'up' ? 'success.main' : 'error.main'} ml={0.5}>
                  {trend === 'up' ? '+12.3%' : '-5.2%'}
                </Typography>
              </Box>
            )}
          </Box>
          {icon && (
            <Box color="primary.main">
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Layout showMenuText={true}>
        <Box sx={{ width: '100%', backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
          <LinearProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout showMenuText={true}>
      {/* 주요 지표 섹션 */}
      <Box sx={{ p: 3, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2 }}>
        <StatCard
          title="출석률 (YTD)"
          value={`${data.attendanceRate}%`}
          subtitle="작년 대비 +5%p"
          trend="up"
          icon={<TrendingUp />}
        />
        <StatCard
          title="월간 헌금"
          value="$64M"
          subtitle="작년 대비 +20%"
          trend="up"
          icon={<TrendingUp />}
        />
        <StatCard
          title="성도 수"
          value={data.totalMembers}
          subtitle={`활성 ${data.activeMembers}명`}
          trend="up"
          icon={<Business />}
        />
        <StatCard
          title="소그룹"
          value="22"
          subtitle="1개 새로운 알림"
          trend="down"
          icon={<Business />}
        />
        <StatCard
          title="사역 영역"
          value="15"
          subtitle="8개 분야에 걸쳐"
          trend="up"
          icon={<LocationOn />}
        />
      </Box>

      {/* 메인 콘텐츠 영역 */}
      <Box sx={{ display: 'flex', flexGrow: 1, p: 3, gap: 3 }}>
        {/* 왼쪽: 차트 및 데이터 */}
        <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* 출석률 트렌드 */}
          <Card sx={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                출석률 트렌드
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e1e1e', 
                      border: '1px solid #333',
                      color: 'white'
                    }}
                  />
                  <Line type="monotone" dataKey="attendance" stroke="#4caf50" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 성도 분포 */}
          <Card sx={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                성도 분포
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={memberDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {memberDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e1e1e', 
                      border: '1px solid #333',
                      color: 'white'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        {/* 오른쪽: AI 코파일럿 및 로그 */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* AI 코파일럿 */}
          <Card sx={{ backgroundColor: '#1e1e1e', border: '1px solid #333', flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chat /> Herald AI 코파일럿
              </Typography>
              
              <Box sx={{ height: 400, overflowY: 'auto', mb: 2, p: 1, backgroundColor: '#0a0a0a', borderRadius: 1 }}>
                {chatMessages.map((msg) => (
                  <Box key={msg.id} sx={{ mb: 2, display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                    <Box sx={{ 
                      maxWidth: '80%', 
                      p: 1.5, 
                      borderRadius: 2,
                      backgroundColor: msg.sender === 'user' ? '#1976d2' : '#333',
                      color: 'white'
                    }}>
                      <Typography variant="body2">{msg.message}</Typography>
                      <Typography variant="caption" sx={{ color: '#888', display: 'block', mt: 0.5 }}>
                        {msg.timestamp.toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
                {isAiThinking && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Box sx={{ p: 1.5, borderRadius: 2, backgroundColor: '#333', color: 'white' }}>
                      <Typography variant="body2">AI가 생각 중입니다...</Typography>
                    </Box>
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="질문을 입력하세요..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: '#333' },
                      '&:hover fieldset': { borderColor: '#555' },
                      '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                    },
                    '& .MuiInputBase-input': { color: 'white' },
                    '& .MuiInputLabel-root': { color: '#888' }
                  }}
                />
                <Box 
                  component="button"
                  onClick={handleChatSend}
                  sx={{ 
                    backgroundColor: '#1976d2', 
                    color: 'white', 
                    border: 'none',
                    borderRadius: 1,
                    px: 2,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    '&:hover': { backgroundColor: '#1565c0' } 
                  }}
                >
                  <Send />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* 실행 로그 (토글) */}
          <Card sx={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Code sx={{ fontSize: 16 }} /> 실행 로그
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setShowExecutionLog(!showExecutionLog)}
                  sx={{ color: '#888', p: 0.5 }}
                >
                  {showExecutionLog ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>
              
              <Collapse in={showExecutionLog}>
                <Box sx={{ 
                  maxHeight: 120, 
                  overflowY: 'auto', 
                  p: 1, 
                  backgroundColor: '#0a0a0a', 
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '11px'
                }}>
                  {executionLog.map((log, index) => (
                    <Box key={index} sx={{ color: '#888', mb: 0.5 }}>
                      {log}
                    </Box>
                  ))}
                  {executionLog.length === 0 && (
                    <Box sx={{ color: '#555', fontStyle: 'italic' }}>
                      실행 로그가 없습니다...
                    </Box>
                  )}
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Layout>
  );
};

export default Dashboard; 