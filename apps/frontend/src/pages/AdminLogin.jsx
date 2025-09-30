import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Car, Lock, Mail } from 'lucide-react'

export default function AdminLogin() {
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
        localStorage.setItem('token', data.token)
        navigate('/admin/dashboard')
      } else {
        setError(data.message || 'Đăng nhập thất bại')
      }
    } catch (error) {
      setError('Lỗi kết nối. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setEmail('admin@carental.com')
    setPassword('admin123')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Car className="h-10 w-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">CarRental</h1>
          </div>
          <p className="text-gray-600">Quản trị hệ thống</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
            <CardDescription className="text-center">
              Nhập thông tin để truy cập trang quản trị
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="admin@carental.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Tài khoản demo để test:
                </p>
                <Button
                  variant="outline"
                  onClick={handleDemoLogin}
                  className="w-full"
                >
                  Sử dụng tài khoản demo
                </Button>
                <div className="mt-2 text-xs text-gray-500">
                  Email: admin@carental.com<br />
                  Mật khẩu: admin123
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Button variant="ghost" asChild>
                <a href="/">← Quay về trang chủ</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}