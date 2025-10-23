import { useEffect, useState } from 'react';
import { Users, Plus, Pencil, Trash2, Search, Shield, Mail, ShieldCheck, CheckCircle, XCircle, ExternalLink, AlertCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast as sonnerToast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface UserData {
  id?: string;
  email: string;
  name: string;
  password?: string;
  isAdmin: boolean;
}

interface User extends UserData {
  id: string;
  phone?: string | null;
  address?: string | null;
  verificationStatus: string;
  isVerified: boolean;
  idCardUrl?: string | null;
  driverLicenseUrl?: string | null;
  verificationNotes?: string | null;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState<UserData>({
    email: '',
    name: '',
    password: '',
    isAdmin: false,
  });
  
  const [verificationNotes, setVerificationNotes] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('unverified');
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [driverLicenseFile, setDriverLicenseFile] = useState<File | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search query
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      const response = await api.users.list();
      setUsers(response.users as User[]);
      setFilteredUsers(response.users as User[]);
    } catch (error: any) {
      sonnerToast.error('Lỗi', {
        description: error.message || 'Không thể tải danh sách người dùng',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      sonnerToast.error('Lỗi', {
        description: 'Email không hợp lệ',
      });
      return;
    }

    // Validate password for new users
    if (!editing && (!formData.password || formData.password.length < 6)) {
      sonnerToast.error('Lỗi', {
        description: 'Mật khẩu phải có ít nhất 6 ký tự',
      });
      return;
    }

    setLoading(true);

    try {
      if (editing?.id) {
        // Update user
        const updateData: any = {
          email: formData.email,
          name: formData.name,
          isAdmin: formData.isAdmin,
        };
        
        if (formData.password && formData.password.trim()) {
          updateData.password = formData.password;
        }
        
        await api.users.update(editing.id, updateData);
        
        // Upload documents if provided
        if (idCardFile || driverLicenseFile) {
          await api.users.uploadDocuments({
            idCard: idCardFile || undefined,
            driverLicense: driverLicenseFile || undefined,
          });
        }
        
        // Update verification status if changed
        if (verificationStatus !== editing.verificationStatus) {
          await api.users.updateVerification(
            editing.id,
            verificationStatus as 'verified' | 'rejected',
            verificationNotes || undefined
          );
        }
        
        sonnerToast.success('Thành công', {
          description: 'Cập nhật người dùng thành công',
        });
        
        await fetchUsers();
      } else {
        // Create new user
        await api.users.create({
          email: formData.email,
          name: formData.name,
          password: formData.password!,
          isAdmin: formData.isAdmin,
        });
        
        sonnerToast.success('Thành công', {
          description: 'Thêm người dùng mới thành công',
        });
        
        await fetchUsers();
      }

      setDialogOpen(false);
      setEditing(null);
      setFormData({ email: '', name: '', password: '', isAdmin: false });
    } catch (error: any) {
      sonnerToast.error('Lỗi', {
        description: error.message || 'Không thể lưu dữ liệu người dùng',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditing(user);
    setFormData({
      email: user.email,
      name: user.name,
      password: '',
      isAdmin: user.isAdmin,
    });
    setVerificationNotes(user.verificationNotes || '');
    setVerificationStatus(user.verificationStatus || 'unverified');
    setIdCardFile(null);
    setDriverLicenseFile(null);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setFormData({ email: '', name: '', password: '', isAdmin: false });
    setVerificationStatus('unverified');
    setIdCardFile(null);
    setDriverLicenseFile(null);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;

    try {
      await api.users.delete(id);
      
      sonnerToast.success('Thành công', {
        description: 'Đã xóa người dùng',
      });
      
      await fetchUsers();
    } catch (error: any) {
      sonnerToast.error('Lỗi', {
        description: error.message || 'Không thể xóa người dùng',
      });
    }
  };
  
  const handleVerification = async (status: 'verified' | 'rejected') => {
    if (!editing) return;

    if (status === 'rejected' && !verificationNotes.trim()) {
      sonnerToast.error('Lỗi', {
        description: 'Vui lòng nhập lý do từ chối',
      });
      return;
    }

    setLoading(true);
    try {
      await api.users.updateVerification(
        editing.id,
        status,
        verificationNotes || undefined
      );

      sonnerToast.success('Thành công', {
        description: `Đã ${status === 'verified' ? 'xác minh' : 'từ chối'} người dùng`,
      });

      setVerificationNotes('');
      await fetchUsers();
    } catch (error: any) {
      sonnerToast.error('Lỗi', {
        description: error.message || 'Không thể cập nhật trạng thái xác minh',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getVerificationBadge = (user: User) => {
    switch (user.verificationStatus) {
      case 'verified':
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Đã xác minh
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Chờ xác minh
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Đã từ chối
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            Chưa gửi
          </Badge>
        );
    }
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditing(null);
      setFormData({ email: '', name: '', password: '', isAdmin: false });
      setVerificationNotes('');
      setVerificationStatus('unverified');
      setIdCardFile(null);
      setDriverLicenseFile(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading && users.length === 0) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Đang tải...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-1">Quản lý người dùng</h1>
            <p className="text-muted-foreground">
              Tổng cộng {users.length} người dùng
            </p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm người dùng
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Users Table */}
        {filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? 'Không tìm thấy người dùng' : 'Chưa có người dùng nào'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]">Họ và tên</TableHead>
                  <TableHead className="w-[25%]">Email</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái xác minh</TableHead>
                  <TableHead>Ngày tham gia</TableHead>
                  <TableHead className="w-[100px] text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{user.name}</div>
                        {user.isAdmin && (
                          <Shield className="h-3.5 w-3.5 text-yellow-600" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.isAdmin ? 'default' : 'secondary'}
                        className="font-normal"
                      >
                        {user.isAdmin ? 'Quản trị viên' : 'Người dùng'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getVerificationBadge(user)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(user)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {editing ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? 'Cập nhật thông tin người dùng và xác minh tài liệu'
                : 'Nhập thông tin để tạo tài khoản người dùng mới'}
            </DialogDescription>
          </DialogHeader>

          {editing ? (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Thông tin</TabsTrigger>
                <TabsTrigger value="documents">
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Tài liệu
                </TabsTrigger>
                {(editing.idCardUrl || editing.driverLicenseUrl) && (
                  <TabsTrigger value="view">Xem chi tiết</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="info">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên *</Label>
                <Input
                  id="name"
                  placeholder="Nguyễn Văn A"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              {!editing && (
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Tối thiểu 6 ký tự"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    Mật khẩu phải có ít nhất 6 ký tự
                  </p>
                </div>
              )}

              {editing && (
                <div className="space-y-2">
                  <Label htmlFor="password-edit">Mật khẩu mới (tùy chọn)</Label>
                  <Input
                    id="password-edit"
                    type="password"
                    placeholder="Để trống nếu không muốn thay đổi"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Chỉ nhập nếu bạn muốn thay đổi mật khẩu
                  </p>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="isAdmin" className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-yellow-600" />
                    Quyền quản trị viên
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Cho phép người dùng truy cập trang quản trị
                  </p>
                </div>
                <Switch
                  id="isAdmin"
                  checked={formData.isAdmin}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isAdmin: checked })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogClose(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Đang lưu...' : editing ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </DialogFooter>
                </form>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verificationStatus">Trạng thái xác minh</Label>
                    <Select
                      value={verificationStatus}
                      onValueChange={setVerificationStatus}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unverified">Chưa gửi</SelectItem>
                        <SelectItem value="pending">Chờ xác minh</SelectItem>
                        <SelectItem value="verified">Đã xác minh</SelectItem>
                        <SelectItem value="rejected">Đã từ chối</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="idCard">CMND/CCCD</Label>
                      <Input
                        id="idCard"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setIdCardFile(e.target.files?.[0] || null)}
                      />
                      {editing && editing.idCardUrl && !idCardFile && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Đã có tài liệu
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="driverLicense">Giấy phép lái xe</Label>
                      <Input
                        id="driverLicense"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setDriverLicenseFile(e.target.files?.[0] || null)}
                      />
                      {editing && editing.driverLicenseUrl && !driverLicenseFile && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Đã có tài liệu
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="verificationNotes">Ghi chú xác minh</Label>
                    <Textarea
                      id="verificationNotes"
                      value={verificationNotes}
                      onChange={(e) => setVerificationNotes(e.target.value)}
                      placeholder="Nhập ghi chú hoặc lý do từ chối..."
                      rows={3}
                    />
                  </div>

                  <Button onClick={handleSubmit} disabled={loading} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="view" className="space-y-4 py-4">
                <div className="space-y-4">
                  {editing && editing.verificationNotes && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h3 className="font-semibold mb-2">Ghi chú hiện tại</h3>
                      <p className="text-sm text-muted-foreground">{editing.verificationNotes}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold mb-3">Tài liệu đã tải lên</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {editing.idCardUrl && (
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Label>CMND/CCCD</Label>
                            <a
                              href={editing.idCardUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm flex items-center gap-1"
                            >
                              Xem tài liệu
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                          <div className="bg-muted rounded p-2">
                            <img
                              src={editing.idCardUrl}
                              alt="CMND/CCCD"
                              className="w-full h-auto rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {editing.driverLicenseUrl && (
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <Label>Giấy phép lái xe</Label>
                            <a
                              href={editing.driverLicenseUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline text-sm flex items-center gap-1"
                            >
                              Xem tài liệu
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                          <div className="bg-muted rounded p-2">
                            <img
                              src={editing.driverLicenseUrl}
                              alt="Giấy phép lái xe"
                              className="w-full h-auto rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Verification notes */}
                  <div>
                    <Label htmlFor="verificationNotes">Ghi chú xác minh</Label>
                    <Textarea
                      id="verificationNotes"
                      value={verificationNotes}
                      onChange={(e) => setVerificationNotes(e.target.value)}
                      placeholder="Nhập lý do từ chối hoặc ghi chú xác minh..."
                      rows={3}
                      className="mt-2"
                    />
                  </div>

                  {/* Verification actions */}
                  {editing.verificationStatus === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleVerification('rejected')}
                        disabled={loading}
                        className="flex-1 text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Từ chối
                      </Button>
                      <Button
                        onClick={() => handleVerification('verified')}
                        disabled={loading}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {loading ? 'Đang xử lý...' : 'Xác minh'}
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên *</Label>
                  <Input
                    id="name"
                    placeholder="Nguyễn Văn A"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                {!editing && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Tối thiểu 6 ký tự"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      Mật khẩu phải có ít nhất 6 ký tự
                    </p>
                  </div>
                )}

                {editing && (
                  <div className="space-y-2">
                    <Label htmlFor="password-edit">Mật khẩu mới (tùy chọn)</Label>
                    <Input
                      id="password-edit"
                      type="password"
                      placeholder="Để trống nếu không muốn thay đổi"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Chỉ nhập nếu bạn muốn thay đổi mật khẩu
                    </p>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isAdmin" className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-yellow-600" />
                      Quyền quản trị viên
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Cho phép người dùng truy cập trang quản trị
                    </p>
                  </div>
                  <Switch
                    id="isAdmin"
                    checked={formData.isAdmin}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isAdmin: checked })
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDialogClose(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Đang lưu...' : editing ? 'Cập nhật' : 'Tạo mới'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
