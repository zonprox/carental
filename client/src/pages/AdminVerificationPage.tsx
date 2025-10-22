import { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle, XCircle, Eye, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { toast as sonnerToast } from 'sonner';
import { api } from '@/lib/api';

interface PendingUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  idCardUrl: string | null;
  driverLicenseUrl: string | null;
  verificationStatus: string;
  createdAt: string;
}

export default function AdminVerificationPage() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const res = await api.users.pendingVerification();
      setUsers(res.users);
    } catch (error: any) {
      sonnerToast.error('Lỗi', {
        description: error.message || 'Không thể tải danh sách xác minh',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (user: PendingUser) => {
    setSelectedUser(user);
    setNotes('');
    setDialogOpen(true);
  };

  const handleVerification = async (status: 'verified' | 'rejected') => {
    if (!selectedUser) return;

    if (status === 'rejected' && !notes.trim()) {
      sonnerToast.error('Lỗi', {
        description: 'Vui lòng nhập lý do từ chối',
      });
      return;
    }

    setProcessing(true);
    try {
      await api.users.updateVerification(selectedUser.id, status, notes || undefined);

      sonnerToast.success('Thành công', {
        description: `Đã ${status === 'verified' ? 'xác minh' : 'từ chối'} người dùng`,
      });

      setDialogOpen(false);
      setSelectedUser(null);
      setNotes('');
      fetchPendingUsers();
    } catch (error: any) {
      sonnerToast.error('Lỗi', {
        description: error.message || 'Không thể cập nhật trạng thái xác minh',
      });
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
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
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Xác minh người dùng</h1>
            <p className="text-muted-foreground">
              {users.length} người dùng đang chờ xác minh
            </p>
          </div>
        </div>

        {/* Users Table */}
        {users.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ShieldCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Không có người dùng nào đang chờ xác minh
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Tài liệu</TableHead>
                  <TableHead>Ngày gửi</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="font-medium">{user.name}</div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || 'Chưa cập nhật'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {user.idCardUrl && (
                          <Badge variant="default" className="font-normal">
                            CMND/CCCD
                          </Badge>
                        )}
                        {user.driverLicenseUrl && (
                          <Badge variant="default" className="font-normal">
                            GPLX
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(user)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      {/* Verification Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Xác minh tài liệu
            </DialogTitle>
            <DialogDescription>
              Xem xét và xác minh tài liệu của người dùng
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 py-4">
              {/* User Info */}
              <div>
                <h3 className="font-semibold mb-3">Thông tin người dùng</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Họ tên</Label>
                    <p className="font-medium">{selectedUser.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  {selectedUser.phone && (
                    <div>
                      <Label className="text-muted-foreground">Số điện thoại</Label>
                      <p className="font-medium">{selectedUser.phone}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-muted-foreground">Ngày gửi</Label>
                    <p className="font-medium">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="font-semibold mb-3">Tài liệu đã tải lên</h3>
                <div className="grid grid-cols-1 gap-4">
                  {selectedUser.idCardUrl && (
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label>CMND/CCCD</Label>
                        <a
                          href={selectedUser.idCardUrl}
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
                          src={selectedUser.idCardUrl}
                          alt="CMND/CCCD"
                          className="w-full h-auto rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {selectedUser.driverLicenseUrl && (
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label>Giấy phép lái xe</Label>
                        <a
                          href={selectedUser.driverLicenseUrl}
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
                          src={selectedUser.driverLicenseUrl}
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

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Nhập lý do từ chối hoặc ghi chú..."
                  rows={3}
                  className="mt-2"
                />
              </div>

              {/* Actions */}
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={processing}
                >
                  Hủy
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleVerification('rejected')}
                  disabled={processing}
                  className="text-red-600 hover:text-red-700"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Từ chối
                </Button>
                <Button
                  onClick={() => handleVerification('verified')}
                  disabled={processing}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {processing ? 'Đang xử lý...' : 'Xác minh'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
