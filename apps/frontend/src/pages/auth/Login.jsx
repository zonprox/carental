import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Car, ArrowLeft } from 'lucide-react'
import { t } from '@/locales'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store auth data
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Auto redirect based on user role
        if (data.user.role === 'admin') {
          navigate('/admin/dashboard')
        } else {
          navigate('/dashboard')
        }
      } else {
        setError(data.message || t('auth.errors.invalidCredentials'))
      }
    } catch (error) {
      setError(t('auth.errors.networkError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo và Back */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-blue-600">
            <Car className="h-8 w-8" />
            <span className="text-2xl font-bold">CarRental</span>
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

        {/* Card đăng nhập */}
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {t('auth.login.title')}
            </CardTitle>
            <CardDescription className="text-center">
              Nhập thông tin để đăng nhập
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="email"
                  placeholder="Email"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Input
                  id="password"
                  placeholder="Mật khẩu"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="current-password"
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                  {error}
                </div>
              )}

              <Button className="w-full" disabled={loading}>
                {loading ? t('auth.login.logging') : t('auth.login.loginButton')}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Chưa có tài khoản?{' '}
              <a
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Đăng ký ngay
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

