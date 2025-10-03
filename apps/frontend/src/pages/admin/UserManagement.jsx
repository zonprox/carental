import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { PageContainer, PageHeader } from '@/components/ui/page-header'
import { Plus, Edit, Trash2, Save, X, Users as UsersIcon, Shield, User, AlertCircle, Loader2, AlertTriangle } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { t } from '@/locales'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { userAPI } from '@/lib/api'

export default function UserManagement() {
  const { toast } = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [showDialog, setShowDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userId: null, userName: '' })
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: 'user'
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')
      
      const data = await userAPI.getAll()
      
      if (data.success) {
        setUsers(data.data || [])
      } else {
        throw new Error(data.message || 'Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      const errorMsg = error.message || 'Không thể tải danh sách người dùng'
      setError(errorMsg)
      toast({
        variant: "destructive",
        title: "Lỗi tải dữ liệu",
        description: errorMsg,
      })
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.name.trim()) {
      errors.name = 'Họ tên là bắt buộc'
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email là bắt buộc'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email không hợp lệ'
    }
    
    if (!editingUser && !formData.password) {
      errors.password = 'Mật khẩu là bắt buộc'
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }
    
    if (!formData.role) {
      errors.role = 'Vai trò là bắt buộc'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSaving(true)
    setError('')
    
    try {
      // Prepare data - only send password if it's filled
      const submitData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null,
        role: formData.role
      }
      
      if (formData.password) {
        submitData.password = formData.password
      }

      const result = editingUser
        ? await userAPI.update(editingUser.id, submitData)
        : await userAPI.create(submitData)

      if (result.success) {
        // Success - close dialog and refresh
        handleCloseDialog()
        await fetchUsers()
        
        // Show success toast
        toast({
          variant: "success",
          title: editingUser ? "Cập nhật thành công" : "Thêm thành công",
          description: editingUser 
            ? `Đã cập nhật thông tin người dùng "${formData.name}"`
            : `Đã thêm người dùng "${formData.name}" vào hệ thống`,
        })
      } else {
        throw new Error(result.message || 'Failed to save user')
      }
    } catch (error) {
      console.error('Error saving user:', error)
      
      // Handle validation errors from backend
      let errorMsg = 'Có lỗi xảy ra khi lưu thông tin người dùng'
      if (error.message.includes('errors') || error.message.includes('validation')) {
        errorMsg = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.'
      } else if (error.message) {
        errorMsg = error.message
      }
      
      setError(errorMsg)
      toast({
        variant: "destructive",
        title: "Lỗi lưu dữ liệu",
        description: errorMsg,
      })
    } finally {
      setSaving(false)
    }
  }

  const openDeleteDialog = (id) => {
    const user = users.find(u => u.id === id)
    setDeleteDialog({
      open: true,
      userId: id,
      userName: user ? user.name : 'người dùng này'
    })
  }

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, userId: null, userName: '' })
  }

  const handleDelete = async () => {
    const { userId, userName } = deleteDialog
    
    try {
      const result = await userAPI.delete(userId)

      if (result.success) {
        toast({
          variant: "success",
          title: "Xóa thành công",
          description: `Đã xóa người dùng "${userName}" khỏi hệ thống`,
        })
        closeDeleteDialog()
        handleCloseDialog() // Close edit dialog if open
        await fetchUsers()
      } else {
        throw new Error(result.message || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast({
        variant: "destructive",
        title: "Lỗi xóa người dùng",
        description: error.message || 'Không thể xóa người dùng',
      })
      closeDeleteDialog()
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      phone: user.phone || '',
      address: user.address || '',
      role: user.role || 'user'
    })
    setError('')
    setValidationErrors({})
    setShowDialog(true)
  }

  const handleAdd = () => {
    setEditingUser(null)
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      role: 'user'
    })
    setError('')
    setValidationErrors({})
    setShowDialog(true)
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
    setEditingUser(null)
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      role: 'user'
    })
    setError('')
    setValidationErrors({})
  }

  // Calculate stats
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    regularUsers: users.filter(u => u.role !== 'admin').length
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Đang tải danh sách người dùng...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <PageContainer>
        <PageHeader 
          title={t('users.title')}
          description={t('users.subtitle')}
        >
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            {t('users.addNew')}
          </Button>
        </PageHeader>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('users.stats.total')}
                  </p>
                  <p className="text-3xl font-bold mt-1 text-foreground">
                    {stats.total}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    người dùng trong hệ thống
                  </p>
                </div>
                <UsersIcon className="h-10 w-10 text-primary opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('users.stats.admins')}
                  </p>
                  <p className="text-3xl font-bold mt-1 text-foreground">
                    {stats.admins}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    quản trị viên
                  </p>
                </div>
                <Shield className="h-10 w-10 text-blue-600 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t('users.stats.users')}
                  </p>
                  <p className="text-3xl font-bold mt-1 text-foreground">
                    {stats.regularUsers}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    người dùng thường
                  </p>
                </div>
                <User className="h-10 w-10 text-green-600 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-foreground font-semibold">
                      {t('users.table.name')}
                    </TableHead>
                    <TableHead className="text-foreground font-semibold">
                      {t('users.table.email')}
                    </TableHead>
                    <TableHead className="text-foreground font-semibold">
                      {t('users.table.phone')}
                    </TableHead>
                    <TableHead className="text-foreground font-semibold">
                      {t('users.table.address')}
                    </TableHead>
                    <TableHead className="text-foreground font-semibold">
                      {t('users.table.role')}
                    </TableHead>
                    <TableHead className="text-foreground font-semibold">
                      {t('users.table.createdAt')}
                    </TableHead>
                    <TableHead className="text-right text-foreground font-semibold">
                      {t('users.table.actions')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <UsersIcon className="h-12 w-12 text-muted-foreground opacity-50" />
                          <p className="text-muted-foreground font-medium">
                            {t('users.empty')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Nhấn "Thêm người dùng" để tạo người dùng mới
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.phone || <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {user.address || <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.role === 'admin' ? 'default' : 'secondary'}
                            className={user.role === 'admin' ? 'bg-blue-600' : ''}
                          >
                            {user.role === 'admin' ? (
                              <><Shield className="h-3 w-3 mr-1" />Quản trị</>
                            ) : (
                              <><User className="h-3 w-3 mr-1" />Người dùng</>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(user)}
                              title="Chỉnh sửa"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => openDeleteDialog(user.id)}
                              title="Xóa người dùng"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit User Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
              </DialogTitle>
              <DialogDescription>
                {editingUser 
                  ? 'Cập nhật thông tin người dùng trong hệ thống' 
                  : 'Tạo tài khoản người dùng mới trong hệ thống'}
              </DialogDescription>
            </DialogHeader>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Họ tên */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Họ tên <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nguyễn Văn A"
                    disabled={saving}
                    className={validationErrors.name ? 'border-red-500' : ''}
                  />
                  {validationErrors.name && (
                    <p className="text-xs text-red-500">{validationErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    disabled={saving}
                    className={validationErrors.email ? 'border-red-500' : ''}
                  />
                  {validationErrors.email && (
                    <p className="text-xs text-red-500">{validationErrors.email}</p>
                  )}
                </div>

                {/* Mật khẩu */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Mật khẩu {!editingUser && <span className="text-red-500">*</span>}
                  </label>
                  <Input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={editingUser ? 'Để trống nếu không đổi' : 'Tối thiểu 6 ký tự'}
                    disabled={saving}
                    className={validationErrors.password ? 'border-red-500' : ''}
                  />
                  {validationErrors.password && (
                    <p className="text-xs text-red-500">{validationErrors.password}</p>
                  )}
                  {editingUser && (
                    <p className="text-xs text-muted-foreground">
                      Chỉ nhập mật khẩu nếu muốn thay đổi
                    </p>
                  )}
                </div>

                {/* Số điện thoại */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Số điện thoại</label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="0912345678"
                    disabled={saving}
                    className={validationErrors.phone ? 'border-red-500' : ''}
                  />
                  {validationErrors.phone && (
                    <p className="text-xs text-red-500">{validationErrors.phone}</p>
                  )}
                </div>

                {/* Địa chỉ */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Địa chỉ</label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    disabled={saving}
                    className={validationErrors.address ? 'border-red-500' : ''}
                  />
                  {validationErrors.address && (
                    <p className="text-xs text-red-500">{validationErrors.address}</p>
                  )}
                </div>

                {/* Vai trò */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Vai trò <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    disabled={saving}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${validationErrors.role ? 'border-red-500' : ''}`}
                  >
                    <option value="user">👤 Người dùng</option>
                    <option value="admin">🛡️ Quản trị viên</option>
                  </select>
                  {validationErrors.role && (
                    <p className="text-xs text-red-500">{validationErrors.role}</p>
                  )}
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
                <div className="flex-1">
                  {editingUser && (
                    <Button 
                      type="button" 
                      variant="destructive" 
                      onClick={() => openDeleteDialog(editingUser.id)}
                      disabled={saving}
                      className="w-full sm:w-auto"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa người dùng
                    </Button>
                  )}
                </div>
                <div className="flex gap-2 justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleCloseDialog}
                    disabled={saving}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Hủy
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {editingUser ? 'Cập nhật' : 'Thêm người dùng'}
                      </>
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialog.open} onOpenChange={closeDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <AlertDialogTitle className="text-left">
                    Xác nhận xóa người dùng
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-left">
                    Bạn có chắc chắn muốn xóa người dùng <strong>"{deleteDialog.userName}"</strong>?
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
            <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ <strong>Cảnh báo:</strong> Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến người dùng này sẽ bị xóa vĩnh viễn.
              </p>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={closeDeleteDialog}>
                <X className="h-4 w-4 mr-2" />
                Hủy bỏ
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa người dùng
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </PageContainer>
    </AdminLayout>
  )
}
