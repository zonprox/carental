import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Car, ArrowLeft } from 'lucide-react'
import { t } from '@/locales'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.errors.passwordMismatch'))
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect to login page after successful registration
        navigate('/login', { 
          state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' }
        })
      } else {
        setError(data.message || t('auth.errors.networkError'))
      }
    } catch (error) {
      setError(t('auth.errors.networkError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-background dark:via-background dark:to-background p-4">
      <div className="w-full max-w-md">
        {/* Logo và Back */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-primary">
            <Car className="h-8 w-8" />
            <span className="text-2xl font-bold text-foreground">CarRental</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Trang chủ
          </Button>
        </div>

        {/* Card đăng ký */}
        <Card className="shadow-xl border-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {t('auth.register.title')}
            </CardTitle>
            <CardDescription className="text-center">
              Tạo tài khoản mới
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                <Input
                  id="name"
                  name="name"
                  placeholder="Họ và tên"
                  type="text"
                  autoCapitalize="words"
                  autoComplete="name"
                  disabled={loading}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Input
                  id="email"
                  name="email"
                  placeholder="Email"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={loading}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Số điện thoại"
                  type="tel"
                  autoComplete="tel"
                  disabled={loading}
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Input
                  id="address"
                  name="address"
                  placeholder="Địa chỉ (tùy chọn)"
                  type="text"
                  autoComplete="address-line1"
                  disabled={loading}
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Input
                  id="password"
                  name="password"
                  placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  disabled={loading}
                  value={formData.password}
                  onChange={handleInputChange}
                  minLength={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Xác nhận mật khẩu"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  disabled={loading}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  minLength={6}
                  required
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                  {error}
                </div>
              )}

              <Button className="w-full" disabled={loading}>
                {loading ? t('auth.register.registering') : t('auth.register.registerButton')}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {t('auth.register.hasAccount')}{' '}
              <a
                href="/login"
                className="text-green-600 hover:text-green-700 font-medium hover:underline"
              >
                {t('auth.register.loginLink')}
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

