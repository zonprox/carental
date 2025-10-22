import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Users, LayoutDashboard, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current user
    api.auth.me()
      .then((data) => {
        if (!data.user.isAdmin) {
          // Not an admin, redirect to home
          navigate('/');
          return;
        }
        setUser(data.user);
      })
      .catch(() => {
        // Not authenticated, redirect to login
        navigate('/auth/login');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

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

  if (!user) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Bảng điều khiển</h1>
              <p className="text-muted-foreground">Chào mừng trở lại, <span className="font-semibold">{user.name || 'Quản trị viên'}</span>!</p>
            </div>
            <Badge variant="secondary" className="h-fit">
              <TrendingUp className="h-3 w-3 mr-1" />
              Admin
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Quản lý xe
              </CardTitle>
              <CardDescription>
                Xem và quản lý tất cả các xe trong đội xe của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/cars" className="block">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors text-center font-medium text-blue-600">
                  Đi tới quản lý xe →
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Người dùng
              </CardTitle>
              <CardDescription>
                Quản lý tài khoản và quyền hạn người dùng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/users" className="block">
                <div className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors text-center font-medium">
                  Đi tới người dùng →
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5" />
                Trang công khai
              </CardTitle>
              <CardDescription>
                Xem trang web dành cho khách hàng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/" className="block">
                <div className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors text-center font-medium">
                  Xem trang công khai →
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
            <CardDescription>Các tác vụ quản trị thường dùng</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              • Thêm xe mới vào đội xe của bạn
            </p>
            <p className="text-sm text-muted-foreground">
              • Xem xét và duyệt đơn đặt xe
            </p>
            <p className="text-sm text-muted-foreground">
              • Quản lý tài khoản người dùng
            </p>
            <p className="text-sm text-muted-foreground">
              • Xem phân tích và báo cáo
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
