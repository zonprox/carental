import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import { useSettings } from '@/contexts/SettingsContext';
import {
  Settings,
  Globe,
  Shield,
  Bell,
  Database,
  Save,
  Info,
  Mail,
  MessageSquare,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const { refreshSettings } = useSettings();
  const [saving, setSaving] = useState(false);
  const { section } = useParams<{ section?: string }>();
  const currentSection = section || 'general';

  // General Settings State
  const [siteName, setSiteName] = useState('Car Rental');
  const [siteDescription, setSiteDescription] = useState('Dịch vụ cho thuê xe uy tín');
  const [contactEmail, setContactEmail] = useState('contact@carental.com');
  const [contactPhone, setContactPhone] = useState('+84 123 456 789');

  // Booking Settings State
  const [minBookingDays, setMinBookingDays] = useState('1');
  const [maxBookingDays, setMaxBookingDays] = useState('30');
  const [advanceBookingDays, setAdvanceBookingDays] = useState('90');
  const [autoApproveBookings, setAutoApproveBookings] = useState(false);

  // Notification Settings State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [bookingNotifications, setBookingNotifications] = useState(true);
  const [paymentNotifications, setPaymentNotifications] = useState(true);

  // Security Settings State
  const [requireEmailVerification, setRequireEmailVerification] = useState(true);
  const [requirePhoneVerification, setRequirePhoneVerification] = useState(false);
  const [enableTwoFactor, setEnableTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  // SMTP Email Settings State
  const [smtpEnabled, setSmtpEnabled] = useState(false);
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpSecure, setSmtpSecure] = useState(false);
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpFromEmail, setSmtpFromEmail] = useState('');
  const [smtpFromName, setSmtpFromName] = useState('Car Rental');

  const handleSaveGeneral = async () => {
    setSaving(true);
    try {
      await api.settings.update({
        site_name: siteName,
        site_description: siteDescription,
        contact_email: contactEmail,
        contact_phone: contactPhone,
      });
      await refreshSettings();
      toast({
        title: 'Đã lưu cài đặt chung',
        description: 'Các thay đổi đã được cập nhật thành công.',
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể lưu cài đặt.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBooking = async () => {
    setSaving(true);
    try {
      await api.settings.update({
        min_booking_days: minBookingDays,
        max_booking_days: maxBookingDays,
        advance_booking_days: advanceBookingDays,
        auto_approve_bookings: autoApproveBookings,
      });
      await refreshSettings();
      toast({
        title: 'Đã lưu cài đặt đặt xe',
        description: 'Các thay đổi đã được cập nhật thành công.',
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể lưu cài đặt.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      await api.settings.update({
        email_notifications: emailNotifications,
        sms_notifications: smsNotifications,
        booking_notifications: bookingNotifications,
        payment_notifications: paymentNotifications,
      });
      await refreshSettings();
      toast({
        title: 'Đã lưu cài đặt thông báo',
        description: 'Các thay đổi đã được cập nhật thành công.',
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể lưu cài đặt.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecurity = async () => {
    setSaving(true);
    try {
      await api.settings.update({
        require_email_verification: requireEmailVerification,
        require_phone_verification: requirePhoneVerification,
        enable_two_factor: enableTwoFactor,
        session_timeout: sessionTimeout,
      });
      await refreshSettings();
      toast({
        title: 'Đã lưu cài đặt bảo mật',
        description: 'Các thay đổi đã được cập nhật thành công.',
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể lưu cài đặt.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEmail = async () => {
    setSaving(true);
    try {
      await api.settings.update({
        smtp_enabled: smtpEnabled,
        smtp_host: smtpHost,
        smtp_port: smtpPort,
        smtp_secure: smtpSecure,
        smtp_user: smtpUser,
        smtp_password: smtpPassword,
        smtp_from_email: smtpFromEmail,
        smtp_from_name: smtpFromName,
      });
      await refreshSettings();
      toast({
        title: 'Đã lưu cài đặt email',
        description: 'Cấu hình SMTP đã được cập nhật thành công.',
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể lưu cài đặt email.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { settings } = await api.settings.get();
        
        // General settings
        if (settings.site_name) setSiteName(settings.site_name);
        if (settings.site_description) setSiteDescription(settings.site_description);
        if (settings.contact_email) setContactEmail(settings.contact_email);
        if (settings.contact_phone) setContactPhone(settings.contact_phone);
        
        // Booking settings
        if (settings.min_booking_days) setMinBookingDays(settings.min_booking_days);
        if (settings.max_booking_days) setMaxBookingDays(settings.max_booking_days);
        if (settings.advance_booking_days) setAdvanceBookingDays(settings.advance_booking_days);
        if (settings.auto_approve_bookings) setAutoApproveBookings(settings.auto_approve_bookings === 'true');
        
        // Notification settings
        if (settings.email_notifications) setEmailNotifications(settings.email_notifications === 'true');
        if (settings.sms_notifications) setSmsNotifications(settings.sms_notifications === 'true');
        if (settings.booking_notifications) setBookingNotifications(settings.booking_notifications === 'true');
        if (settings.payment_notifications) setPaymentNotifications(settings.payment_notifications === 'true');
        
        // Security settings
        if (settings.require_email_verification) setRequireEmailVerification(settings.require_email_verification === 'true');
        if (settings.require_phone_verification) setRequirePhoneVerification(settings.require_phone_verification === 'true');
        if (settings.enable_two_factor) setEnableTwoFactor(settings.enable_two_factor === 'true');
        if (settings.session_timeout) setSessionTimeout(settings.session_timeout);
        
        // SMTP settings
        if (settings.smtp_enabled) setSmtpEnabled(settings.smtp_enabled === 'true');
        if (settings.smtp_host) setSmtpHost(settings.smtp_host);
        if (settings.smtp_port) setSmtpPort(settings.smtp_port);
        if (settings.smtp_secure) setSmtpSecure(settings.smtp_secure === 'true');
        if (settings.smtp_user) setSmtpUser(settings.smtp_user);
        if (settings.smtp_from_email) setSmtpFromEmail(settings.smtp_from_email);
        if (settings.smtp_from_name) setSmtpFromName(settings.smtp_from_name);
        // Note: password is not loaded for security
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Cài đặt hệ thống</h1>
          </div>
          <p className="text-muted-foreground">
            Quản lý cấu hình và tùy chọn hệ thống
          </p>
        </div>

        {/* Settings Content */}
        <div className="space-y-6">

          {/* General Settings */}
          {currentSection === 'general' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Cài đặt chung
                </CardTitle>
                <CardDescription>
                  Thông tin cơ bản về trang web và liên hệ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Tên trang web</Label>
                  <Input
                    id="siteName"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="Car Rental"
                  />
                  <p className="text-xs text-muted-foreground">
                    Tên này sẽ hiển thị trên thanh tiêu đề trình duyệt
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Mô tả trang web</Label>
                  <Input
                    id="siteDescription"
                    value={siteDescription}
                    onChange={(e) => setSiteDescription(e.target.value)}
                    placeholder="Dịch vụ cho thuê xe uy tín"
                  />
                  <p className="text-xs text-muted-foreground">
                    Mô tả ngắn gọn về dịch vụ của bạn
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email liên hệ</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="contact@carental.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Số điện thoại liên hệ</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+84 123 456 789"
                  />
                </div>

                <Button onClick={handleSaveGeneral} disabled={saving} className="w-full sm:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Booking Settings */}
          {currentSection === 'booking' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Cài đặt đặt xe
                </CardTitle>
                <CardDescription>
                  Cấu hình quy tắc và giới hạn đặt xe
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="minBookingDays">Số ngày thuê tối thiểu</Label>
                  <Input
                    id="minBookingDays"
                    type="number"
                    min="1"
                    value={minBookingDays}
                    onChange={(e) => setMinBookingDays(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Số ngày tối thiểu khách hàng phải thuê xe
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxBookingDays">Số ngày thuê tối đa</Label>
                  <Input
                    id="maxBookingDays"
                    type="number"
                    min="1"
                    value={maxBookingDays}
                    onChange={(e) => setMaxBookingDays(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Số ngày tối đa khách hàng có thể thuê xe
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="advanceBookingDays">Đặt trước tối đa (ngày)</Label>
                  <Input
                    id="advanceBookingDays"
                    type="number"
                    min="1"
                    value={advanceBookingDays}
                    onChange={(e) => setAdvanceBookingDays(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Khách hàng có thể đặt xe trước bao nhiêu ngày
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoApprove">Tự động duyệt đơn đặt xe</Label>
                    <p className="text-xs text-muted-foreground">
                      Đơn đặt xe sẽ được duyệt tự động mà không cần xác nhận thủ công
                    </p>
                  </div>
                  <Switch
                    id="autoApprove"
                    checked={autoApproveBookings}
                    onCheckedChange={setAutoApproveBookings}
                  />
                </div>

                <Button onClick={handleSaveBooking} disabled={saving} className="w-full sm:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {currentSection === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Cài đặt thông báo
                </CardTitle>
                <CardDescription>
                  Quản lý cách thức gửi thông báo cho người dùng
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotif">Thông báo qua Email</Label>
                      <p className="text-xs text-muted-foreground">
                        Gửi thông báo cho người dùng qua email
                      </p>
                    </div>
                    <Switch
                      id="emailNotif"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsNotif">Thông báo qua SMS</Label>
                      <p className="text-xs text-muted-foreground">
                        Gửi tin nhắn SMS cho người dùng
                      </p>
                    </div>
                    <Switch
                      id="smsNotif"
                      checked={smsNotifications}
                      onCheckedChange={setSmsNotifications}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="bookingNotif">Thông báo đặt xe</Label>
                      <p className="text-xs text-muted-foreground">
                        Gửi thông báo khi có đơn đặt xe mới
                      </p>
                    </div>
                    <Switch
                      id="bookingNotif"
                      checked={bookingNotifications}
                      onCheckedChange={setBookingNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="paymentNotif">Thông báo thanh toán</Label>
                      <p className="text-xs text-muted-foreground">
                        Gửi thông báo khi có giao dịch thanh toán
                      </p>
                    </div>
                    <Switch
                      id="paymentNotif"
                      checked={paymentNotifications}
                      onCheckedChange={setPaymentNotifications}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveNotifications} disabled={saving} className="w-full sm:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {currentSection === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Cài đặt bảo mật
                </CardTitle>
                <CardDescription>
                  Cấu hình các tùy chọn bảo mật cho hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailVerif">Yêu cầu xác thực email</Label>
                      <p className="text-xs text-muted-foreground">
                        Người dùng phải xác thực email trước khi sử dụng dịch vụ
                      </p>
                    </div>
                    <Switch
                      id="emailVerif"
                      checked={requireEmailVerification}
                      onCheckedChange={setRequireEmailVerification}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="phoneVerif">Yêu cầu xác thực số điện thoại</Label>
                      <p className="text-xs text-muted-foreground">
                        Người dùng phải xác thực số điện thoại
                      </p>
                    </div>
                    <Switch
                      id="phoneVerif"
                      checked={requirePhoneVerification}
                      onCheckedChange={setRequirePhoneVerification}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="twoFactor">Xác thực hai yếu tố (2FA)</Label>
                      <p className="text-xs text-muted-foreground">
                        Bật xác thực hai yếu tố cho tài khoản admin
                      </p>
                    </div>
                    <Switch
                      id="twoFactor"
                      checked={enableTwoFactor}
                      onCheckedChange={setEnableTwoFactor}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Thời gian hết phiên (phút)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      min="5"
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Phiên đăng nhập sẽ tự động hết hạn sau thời gian này
                    </p>
                  </div>
                </div>

                <Button onClick={handleSaveSecurity} disabled={saving} className="w-full sm:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Email SMTP Settings */}
          {currentSection === 'email' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Cài đặt Email SMTP
                </CardTitle>
                <CardDescription>
                  Cấu hình máy chủ SMTP để gửi email thông báo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="space-y-0.5">
                    <Label htmlFor="smtpEnabled" className="text-base font-semibold">Kích hoạt SMTP</Label>
                    <p className="text-xs text-muted-foreground">
                      Bật tính năng gửi email qua SMTP server
                    </p>
                  </div>
                  <Switch
                    id="smtpEnabled"
                    checked={smtpEnabled}
                    onCheckedChange={setSmtpEnabled}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                      placeholder="smtp.gmail.com"
                      disabled={!smtpEnabled}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">Port</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      placeholder="587"
                      disabled={!smtpEnabled}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label htmlFor="smtpSecure">Kết nối bảo mật (SSL/TLS)</Label>
                    <p className="text-xs text-muted-foreground">Sử dụng cho port 465</p>
                  </div>
                  <Switch
                    id="smtpSecure"
                    checked={smtpSecure}
                    onCheckedChange={setSmtpSecure}
                    disabled={!smtpEnabled}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpUser">SMTP Username</Label>
                    <Input
                      id="smtpUser"
                      type="email"
                      value={smtpUser}
                      onChange={(e) => setSmtpUser(e.target.value)}
                      placeholder="your-email@gmail.com"
                      disabled={!smtpEnabled}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={smtpPassword}
                      onChange={(e) => setSmtpPassword(e.target.value)}
                      placeholder="••••••••••••••••"
                      disabled={!smtpEnabled}
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpFromEmail">Email người gửi</Label>
                    <Input
                      id="smtpFromEmail"
                      type="email"
                      value={smtpFromEmail}
                      onChange={(e) => setSmtpFromEmail(e.target.value)}
                      placeholder="noreply@carental.com"
                      disabled={!smtpEnabled}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpFromName">Tên người gửi</Label>
                    <Input
                      id="smtpFromName"
                      value={smtpFromName}
                      onChange={(e) => setSmtpFromName(e.target.value)}
                      placeholder="Car Rental System"
                      disabled={!smtpEnabled}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveEmail} disabled={saving} className="w-full sm:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Đang lưu...' : 'Lưu cấu hình SMTP'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Telegram Bot Settings */}
          {currentSection === 'telegram' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Cài đặt Telegram Bot
                </CardTitle>
                <CardDescription>
                  Cấu hình bot Telegram để nhận thông báo tự động
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div className="space-y-0.5">
                    <Label htmlFor="telegramEnabled" className="text-base font-semibold">Kích hoạt Telegram Bot</Label>
                    <p className="text-xs text-muted-foreground">
                      Bật thông báo qua Telegram
                    </p>
                  </div>
                  <Switch
                    id="telegramEnabled"
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telegramBotToken">Bot Token</Label>
                  <Input
                    id="telegramBotToken"
                    placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Lấy token từ @BotFather trên Telegram
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telegramChatId">Chat ID</Label>
                  <Input
                    id="telegramChatId"
                    placeholder="-1001234567890"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    ID của group/channel nhận thông báo
                  </p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Hướng dẫn thiết lập
                  </h3>
                  <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                    <li>Tìm @BotFather trên Telegram</li>
                    <li>Gửi /newbot và làm theo hướng dẫn</li>
                    <li>Copy Bot Token và dán vào trường bên trên</li>
                    <li>Thêm bot vào group/channel</li>
                    <li>Lấy Chat ID từ bot @userinfobot</li>
                  </ol>
                </div>

                <Button disabled className="w-full sm:w-auto opacity-50">
                  <Save className="h-4 w-4 mr-2" />
                  Sắp ra mắt
                </Button>
              </CardContent>
            </Card>
          )}

          {/* System Information */}
          {currentSection === 'system' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Thông tin hệ thống
                </CardTitle>
                <CardDescription>
                  Chi tiết kỹ thuật và trạng thái hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Info className="h-4 w-4 text-primary" />
                      Phiên bản
                    </div>
                    <p className="text-2xl font-bold">v1.0.0</p>
                  </div>

                  <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Database className="h-4 w-4 text-primary" />
                      Cơ sở dữ liệu
                    </div>
                    <p className="text-2xl font-bold">PostgreSQL 16</p>
                  </div>

                  <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Settings className="h-4 w-4 text-primary" />
                      Môi trường
                    </div>
                    <p className="text-2xl font-bold">Development</p>
                  </div>

                  <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Globe className="h-4 w-4 text-primary" />
                      API Version
                    </div>
                    <p className="text-2xl font-bold">v1</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="font-semibold">Trạng thái dịch vụ</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
                      <span className="text-sm">API Server</span>
                      <span className="text-sm font-medium text-green-600">Hoạt động</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
                      <span className="text-sm">Database</span>
                      <span className="text-sm font-medium text-green-600">Hoạt động</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
                      <span className="text-sm">File Storage</span>
                      <span className="text-sm font-medium text-green-600">Hoạt động</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
