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
  Avatar,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,

} from '@mui/icons-material';
import Layout from './Layout';

interface Member {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  phone: string;
  email: string;
  address: string;
  familyMembers: string[];
  baptismDate: string;
  membershipDate: string;
  spiritualStatus: 'active' | 'inactive' | 'visitor';
  ministryAreas: string[];
  notes: string;
}

const MemberManagement: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      name: '김철수',
      age: 35,
      gender: 'male',
      phone: '010-1234-5678',
      email: 'kim@example.com',
      address: '서울시 강남구',
      familyMembers: ['김영희(배우자)', '김민수(아들)'],
      baptismDate: '2010-05-15',
      membershipDate: '2010-06-01',
      spiritualStatus: 'active',
      ministryAreas: ['찬양팀', '유치부'],
      notes: '음악에 재능이 있음'
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState<Partial<Member>>({
    name: '',
    age: 0,
    gender: 'male',
    phone: '',
    email: '',
    address: '',
    familyMembers: [],
    baptismDate: '',
    membershipDate: '',
    spiritualStatus: 'active',
    ministryAreas: [],
    notes: ''
  });

  const handleOpenDialog = (member?: Member) => {
    if (member) {
      setEditingMember(member);
      setFormData(member);
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        age: 0,
        gender: 'male',
        phone: '',
        email: '',
        address: '',
        familyMembers: [],
        baptismDate: '',
        membershipDate: '',
        spiritualStatus: 'active',
        ministryAreas: [],
        notes: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMember(null);
  };

  const handleSave = () => {
    if (editingMember) {
      setMembers(members.map(m => m.id === editingMember.id ? { ...formData, id: editingMember.id } as Member : m));
    } else {
      const newMember: Member = {
        ...formData,
        id: Date.now().toString()
      } as Member;
      setMembers([...members, newMember]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'warning';
      case 'visitor': return 'info';
      default: return 'default';
    }
  };

  return (
    <Layout showMenuText={false}>
      <Box sx={{ p: 3 }}>
      {/* 헤더 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'white', mb: 1 }}>
          성도 관리
        </Typography>
        <Typography variant="body1" sx={{ color: '#888' }}>
          교회 성도들의 정보를 관리하고 AI 분석을 위한 데이터를 입력합니다.
        </Typography>
      </Box>

      {/* 검색 및 추가 버튼 */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          placeholder="성도명, 전화번호, 이메일로 검색..."
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
          성도 추가
        </Button>
      </Box>

      {/* 통계 카드 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
        <Card sx={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}>
          <CardContent>
            <Typography color="textSecondary" sx={{ color: '#888' }}>
              전체 성도
            </Typography>
            <Typography variant="h4" sx={{ color: 'white' }}>
              {members.length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}>
          <CardContent>
            <Typography color="textSecondary" sx={{ color: '#888' }}>
              활성 성도
            </Typography>
            <Typography variant="h4" sx={{ color: 'white' }}>
              {members.filter(m => m.spiritualStatus === 'active').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}>
          <CardContent>
            <Typography color="textSecondary" sx={{ color: '#888' }}>
              비활성 성도
            </Typography>
            <Typography variant="h4" sx={{ color: 'white' }}>
              {members.filter(m => m.spiritualStatus === 'inactive').length}
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}>
          <CardContent>
            <Typography color="textSecondary" sx={{ color: '#888' }}>
              방문자
            </Typography>
            <Typography variant="h4" sx={{ color: 'white' }}>
              {members.filter(m => m.spiritualStatus === 'visitor').length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* 성도 목록 테이블 */}
      <TableContainer component={Paper} sx={{ backgroundColor: '#1e1e1e', border: '1px solid #333' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>성도명</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>연락처</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>가족 구성</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>신앙 상태</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>사역 영역</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>입교일</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>관리</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id} sx={{ '&:hover': { backgroundColor: '#2a2a2a' } }}>
                <TableCell sx={{ color: 'white' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'white' }}>
                        {member.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#888' }}>
                        {member.age}세, {member.gender === 'male' ? '남성' : '여성'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'white' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {member.phone}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#888' }}>
                      {member.email}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'white' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {member.familyMembers.map((family, index) => (
                      <Chip
                        key={index}
                        label={family}
                        size="small"
                        sx={{ backgroundColor: '#333', color: 'white' }}
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={member.spiritualStatus === 'active' ? '활성' : 
                           member.spiritualStatus === 'inactive' ? '비활성' : '방문자'}
                    color={getStatusColor(member.spiritualStatus) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ color: 'white' }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {member.ministryAreas.map((area, index) => (
                      <Chip
                        key={index}
                        label={area}
                        size="small"
                        sx={{ backgroundColor: '#1976d2', color: 'white' }}
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'white' }}>
                  {new Date(member.membershipDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(member)}
                      sx={{ color: '#1976d2' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(member.id)}
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

      {/* 성도 추가/수정 다이얼로그 */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#1e1e1e', color: 'white' }}>
          {editingMember ? '성도 정보 수정' : '새 성도 추가'}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#1e1e1e', color: 'white' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 2, mt: 1 }}>
            <Box sx={{ gridColumn: 'span 6' }}>
              <TextField
                fullWidth
                label="성도명"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                sx={{ mb: 2 }}
              />
            </Box>
            <Box sx={{ gridColumn: 'span 3' }}>
              <TextField
                fullWidth
                label="나이"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                sx={{ mb: 2 }}
              />
            </Box>
            <Box sx={{ gridColumn: 'span 3' }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>성별</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                >
                  <MenuItem value="male">남성</MenuItem>
                  <MenuItem value="female">여성</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ gridColumn: 'span 6' }}>
              <TextField
                fullWidth
                label="전화번호"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                sx={{ mb: 2 }}
              />
            </Box>
            <Box sx={{ gridColumn: 'span 6' }}>
              <TextField
                fullWidth
                label="이메일"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                sx={{ mb: 2 }}
              />
            </Box>
            <Box sx={{ gridColumn: 'span 12' }}>
              <TextField
                fullWidth
                label="주소"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                sx={{ mb: 2 }}
              />
            </Box>
            <Box sx={{ gridColumn: 'span 6' }}>
              <TextField
                fullWidth
                label="세례일"
                type="date"
                value={formData.baptismDate}
                onChange={(e) => setFormData({ ...formData, baptismDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            </Box>
            <Box sx={{ gridColumn: 'span 6' }}>
              <TextField
                fullWidth
                label="입교일"
                type="date"
                value={formData.membershipDate}
                onChange={(e) => setFormData({ ...formData, membershipDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            </Box>
            <Box sx={{ gridColumn: 'span 6' }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>신앙 상태</InputLabel>
                <Select
                  value={formData.spiritualStatus}
                  onChange={(e) => setFormData({ ...formData, spiritualStatus: e.target.value as any })}
                >
                  <MenuItem value="active">활성</MenuItem>
                  <MenuItem value="inactive">비활성</MenuItem>
                  <MenuItem value="visitor">방문자</MenuItem>
                </Select>
              </FormControl>
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

export default MemberManagement; 