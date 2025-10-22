import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Upload, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast as sonnerToast } from 'sonner';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [driverLicenseFile, setDriverLicenseFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.users.profile();
      setProfile(res.user);
    } catch (error: any) {
      sonnerToast.error('Lỗi', {
        description: error.message || 'Không thể tải thông tin cá nhân',
      });
      navigate('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!idCardFile && !driverLicenseFile) {
      sonnerToast.error('Lỗi', {
        description: 'Vui lòng chọn ít nhất một tài liệu để tải lên',
      });
      return;
    }

    setUploading(true);
    try {
      await api.users.uploadDocuments({
        idCard: idCardFile || undefined,
        driverLicense: driverLicenseFile || undefined,
      });

      sonnerToast.success('Thành công', {
        description: 'Đã tải lên tài liệu. Chúng tôi sẽ xác minh trong thời gian sớm nhất.',
      });

      setIdCardFile(null);
      setDriverLicenseFile(null);
      fetchProfile();
    } catch (error: any) {
      sonnerToast.error('Lỗi', {
        description: error.message || 'Không thể tải lên tài liệu',
      });
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      unverified: { label: 'Chưa xác minh', icon: Clock, variant: 'secondary' as const },
      pending: { label: 'Đang xét duyệt', icon: Clock, variant: 'default' as const },
      verified: { label: 'Đã xác minh', icon: CheckCircle, variant: 'default' as const },
      rejected: { label: 'Bị từ chối', icon: XCircle, variant: 'secondary' as const },
    };

    const statusConfig = config[status as keyof typeof config] || config.unverified;
    const Icon = statusConfig.icon;

    return (
      <Badge variant={statusConfig.variant} className="font-normal">
        <Icon className="h-3 w-3 mr-1" />
        {statusConfig.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại trang chủ
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <User className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Hồ sơ cá nhân</h1>
        </div>

        {/* Profile Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Thông tin tài khoản</CardTitle>
            <CardDescription>Thông tin cá nhân và trạng thái xác minh</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Họ tên</Label>
                <p className="font-medium">{profile.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{profile.email}</p>
              </div>
              {profile.phone && (
                <div>
                  <Label className="text-muted-foreground">Số điện thoại</Label>
                  <p className="font-medium">{profile.phone}</p>
                </div>
              )}
              {profile.address && (
                <div className="md:col-span-2">
                  <Label className="text-muted-foreground">Địa chỉ</Label>
                  <p className="font-medium">{profile.address}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <Label className="text-muted-foreground">Trạng thái xác minh</Label>
              <div className="mt-2">{getStatusBadge(profile.verificationStatus)}</div>
              {profile.verificationNotes && (
                <p className="mt-2 text-sm text-muted-foreground">{profile.verificationNotes}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Document Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Tài liệu xác minh</CardTitle>
            <CardDescription>
              Tải lên CMND/CCCD và Giấy phép lái xe để xác minh tài khoản
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-6">
              {/* ID Card */}
              <div>
                <Label htmlFor="idCard">CMND/CCCD</Label>
                {profile.idCardUrl ? (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Đã tải lên
                    </div>
                    <a
                      href={profile.idCardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      Xem tài liệu đã tải lên
                    </a>
                  </div>
                ) : (
                  <div className="mt-2">
                    <input
                      id="idCard"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => setIdCardFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-muted-foreground
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-medium
                        file:bg-primary file:text-primary-foreground
                        hover:file:bg-primary/90"
                    />
                    {idCardFile && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Đã chọn: {idCardFile.name}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Driver License */}
              <div>
                <Label htmlFor="driverLicense">Giấy phép lái xe</Label>
                {profile.driverLicenseUrl ? (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Đã tải lên
                    </div>
                    <a
                      href={profile.driverLicenseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      Xem tài liệu đã tải lên
                    </a>
                  </div>
                ) : (
                  <div className="mt-2">
                    <input
                      id="driverLicense"
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => setDriverLicenseFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-muted-foreground
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-medium
                        file:bg-primary file:text-primary-foreground
                        hover:file:bg-primary/90"
                    />
                    {driverLicenseFile && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Đã chọn: {driverLicenseFile.name}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {(!profile.idCardUrl || !profile.driverLicenseUrl) && (
                <Button
                  type="submit"
                  disabled={uploading || (!idCardFile && !driverLicenseFile)}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Đang tải lên...' : 'Tải lên tài liệu'}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
