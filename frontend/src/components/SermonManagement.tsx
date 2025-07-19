import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Rating,
  InputAdornment,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import Layout from './Layout';

interface Sermon {
  id: string;
  title: string;
  preacher: string;
  date: string;
  scripture: string;
  content: string;
  attendance: number;
  feedback: {
    rating: number;
    comments: string[];
  };
  aiAnalysis: {
    keywords: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    recommendations: string[];
  };
  notes: string;
}

const SermonManagement: React.FC = () => {
  const [sermons, setSermons] = useState<Sermon[]>([
    {
      id: '1',
      title: '하나님의 사랑',
      preacher: '김목사',
      date: '2024-01-14',
      scripture: '요한복음 3:16',
      content: '하나님이 세상을 이처럼 사랑하사...',
      attendance: 185,
      feedback: {
        rating: 4.5,
        comments: ['매우 감동적이었습니다', '말씀이 마음에 와닿았어요']
      },
      aiAnalysis: {
        keywords: ['사랑', '구원', '믿음'],
        sentiment: 'positive',
        recommendations: ['개인적 경험 사례 추가', '청중 참여 유도']
      },
      notes: '다음 주 설교 준비 시 참고할 점들...'
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);

  const [formData, setFormData] = useState<Partial<Sermon>>({
    title: '',
    preacher: '',
    date: '',
    scripture: '',
    content: '',
    attendance: 0,
    feedback: { rating: 0, comments: [] },
    aiAnalysis: { keywords: [], sentiment: 'neutral', recommendations: [] },
    notes: ''
  });

  const handleOpenDialog = (sermon?: Sermon) => {
    if (sermon) {
      setEditingSermon(sermon);
      setFormData(sermon);
    } else {
      setEditingSermon(null);
      setFormData({
        title: '',
        preacher: '',
        date: '',
        scripture: '',
        content: '',
        attendance: 0,
        feedback: { rating: 0, comments: [] },
        aiAnalysis: { keywords: [], sentiment: 'neutral', recommendations: [] },
        notes: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSermon(null);
  };

  const handleSave = () => {
    if (editingSermon) {
      setSermons(sermons.map(s => s.id === editingSermon.id ? { ...formData, id: editingSermon.id } as Sermon : s));
    } else {
      const newSermon: Sermon = {
        ...formData,
        id: Date.now().toString()
      } as Sermon;
      setSermons([...sermons, newSermon]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setSermons(sermons.filter(s => s.id !== id));
  };

  const filteredSermons = sermons.filter(sermon =>
    sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sermon.preacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sermon.scripture.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'success';
      case 'negative': return 'error';
      default: return 'warning';
    }
  };

  return (
    <Layout showMenuText={false}>
      <Box sx={{ p: 3 }}>
      {/* 헤더 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'white', mb: 1 }}>
          설교 관리
        </Typography>
        <Typography variant="body1" sx={{ color: '#888' }}>
          설교 내용, 피드백, AI 분석 결과를 관리합니다.
        </Typography>
      </Box>

      {/* 검색 및 추가 버튼 */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="설교 제목, 설교자, 성경 구절로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            flexGrow: 1,
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': { borderColor: '#333' },
              '&:hover fieldset': { borderColor: '#555' },
              '&.Mui-focused fieldset': { borderColor: '#1976d2' }
            },
            '& .MuiInputBase-input': { color: 'white' }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#888' }} />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
        >
          설교 추가
        </Button>
      </Box>

      {/* 통계 카드 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
        <Card sx={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}>
          <CardContent>
            <Typography color="textSecondary" sx={{ color: '#888' }}>
              전체 설교
            </Typography>
            <Typography variant="h4" sx={{ color: 'white' }}>
              {sermons.length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}>
          <CardContent>
            <Typography color="textSecondary" sx={{ color: '#888' }}>
              평균 출석률
            </Typography>
            <Typography variant="h4" sx={{ color: 'white' }}>
              {sermons.length > 0 ? Math.round(sermons.reduce((sum, s) => sum + s.attendance, 0) / sermons.length) : 0}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}>
          <CardContent>
            <Typography color="textSecondary" sx={{ color: '#888' }}>
              평균 평점
            </Typography>
            <Typography variant="h4" sx={{ color: 'white' }}>
              {sermons.length > 0 ? (sermons.reduce((sum, s) => sum + s.feedback.rating, 0) / sermons.length).toFixed(1) : 0}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}>
          <CardContent>
            <Typography color="textSecondary" sx={{ color: '#888' }}>
              이번 달 설교
            </Typography>
            <Typography variant="h4" sx={{ color: 'white' }}>
              {sermons.filter(s => new Date(s.date).getMonth() === new Date().getMonth()).length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* 탭 메뉴 */}
      <Box sx={{ borderBottom: 1, borderColor: '#333', mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={(e, newValue) => setSelectedTab(newValue)}
          sx={{ 
            '& .MuiTab-root': { 
              color: '#888',
              fontSize: '0.875rem',
              textTransform: 'none'
            },
            '& .Mui-selected': { color: 'white' },
            '& .MuiTabs-indicator': { backgroundColor: '#1976d2' }
          }}
        >
          <Tab label="설교 목록" />
          <Tab label="AI 분석" />
          <Tab label="피드백 관리" />
        </Tabs>
      </Box>

      {/* 설교 목록 테이블 */}
      {selectedTab === 0 && (
        <TableContainer component={Paper} sx={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>설교 제목</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>설교자</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>날짜</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>성경 구절</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>출석</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>평점</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>AI 분석</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>관리</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSermons.map((sermon) => (
                <TableRow key={sermon.id} sx={{ '&:hover': { backgroundColor: '#2a2a2a' } }}>
                  <TableCell sx={{ color: 'white' }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {sermon.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#888' }}>
                        {sermon.content.substring(0, 50)}...
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>{sermon.preacher}</TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    {new Date(sermon.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>{sermon.scripture}</TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PeopleIcon sx={{ fontSize: 16, color: '#888' }} />
                      {sermon.attendance}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={sermon.feedback.rating} readOnly size="small" />
                      <Typography variant="body2" sx={{ color: 'white' }}>
                        {sermon.feedback.rating}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={sermon.aiAnalysis.sentiment === 'positive' ? '긍정적' : 
                             sermon.aiAnalysis.sentiment === 'negative' ? '부정적' : '중립'}
                      color={getSentimentColor(sermon.aiAnalysis.sentiment) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(sermon)}
                        sx={{ color: '#1976d2' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(sermon.id)}
                        sx={{ color: '#f44336' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* AI 분석 탭 */}
      {selectedTab === 1 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3 }}>
          {sermons.map((sermon) => (
            <Card key={sermon.id} sx={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                  {sermon.title}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
                    키워드:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {sermon.aiAnalysis.keywords.map((keyword, index) => (
                      <Chip
                        key={index}
                        label={keyword}
                        size="small"
                        sx={{ backgroundColor: '#1976d2', color: 'white' }}
                      />
                    ))}
                  </Box>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
                    AI 추천사항:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {sermon.aiAnalysis.recommendations.map((rec, index) => (
                      <Typography key={index} variant="body2" sx={{ color: 'white', fontSize: '0.875rem' }}>
                        • {rec}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* 피드백 관리 탭 */}
      {selectedTab === 2 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sermons.map((sermon) => (
            <Card key={sermon.id} sx={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ color: 'white' }}>
                      {sermon.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#888' }}>
                      {new Date(sermon.date).toLocaleDateString()} - {sermon.preacher}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating value={sermon.feedback.rating} readOnly />
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {sermon.feedback.rating}/5
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
                    피드백 코멘트:
                  </Typography>
                  {sermon.feedback.comments.map((comment, index) => (
                    <Box key={index} sx={{ p: 1, backgroundColor: '#333', borderRadius: 1, mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'white' }}>
                        "{comment}"
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* 설교 추가/수정 다이얼로그 */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1e1e1e', color: 'white' }}>
          {editingSermon ? '설교 정보 수정' : '새 설교 추가'}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#1e1e1e', color: 'white' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2, mt: 1 }}>
            <Box sx={{ gridColumn: 'span 6' }}>
              <TextField
                fullWidth
                label="설교 제목"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                sx={{ mb: 2 }}
              />
            </Box>
            <Box sx={{ gridColumn: 'span 3' }}>
              <TextField
                fullWidth
                label="설교자"
                value={formData.preacher}
                onChange={(e) => setFormData({ ...formData, preacher: e.target.value })}
                sx={{ mb: 2 }}
              />
            </Box>
            <Box sx={{ gridColumn: 'span 3' }}>
              <TextField
                fullWidth
                label="설교 날짜"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            </Box>
            <Box sx={{ gridColumn: 'span 6' }}>
              <TextField
                fullWidth
                label="성경 구절"
                value={formData.scripture}
                onChange={(e) => setFormData({ ...formData, scripture: e.target.value })}
                sx={{ mb: 2 }}
              />
            </Box>
            <Box sx={{ gridColumn: 'span 3' }}>
              <TextField
                fullWidth
                label="출석 인원"
                type="number"
                value={formData.attendance}
                onChange={(e) => setFormData({ ...formData, attendance: parseInt(e.target.value) })}
                sx={{ mb: 2 }}
              />
            </Box>
            <Box sx={{ gridColumn: 'span 3' }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>평점</InputLabel>
                <Select
                  value={formData.feedback?.rating || 0}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    feedback: { ...formData.feedback!, rating: e.target.value as number }
                  })}
                >
                  <MenuItem value={0}>0</MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <TextField
                fullWidth
                label="설교 내용"
                multiline
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                sx={{ mb: 2 }}
              />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <TextField
                fullWidth
                label="메모"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                sx={{ mb: 2 }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#1e1e1e' }}>
          <Button onClick={handleCloseDialog} sx={{ color: '#888' }}>
            취소
          </Button>
          <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: '#1976d2' }}>
            저장
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </Layout>
  );
};

export default SermonManagement; 