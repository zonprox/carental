// Vietnamese translations
export const vi = {
  // Common
  common: {
    loading: 'Đang tải...',
    noData: 'Không có dữ liệu',
    error: 'Đã có lỗi xảy ra',
    retry: 'Thử lại',
    save: 'Lưu',
    cancel: 'Hủy',
    delete: 'Xóa',
    edit: 'Sửa',
    add: 'Thêm',
    search: 'Tìm kiếm',
    filter: 'Lọc',
    refresh: 'Làm mới',
    export: 'Xuất dữ liệu',
    import: 'Nhập dữ liệu',
    close: 'Đóng',
    confirm: 'Xác nhận',
    back: 'Quay lại',
    or: 'Hoặc'
  },

  // Navigation
  nav: {
    dashboard: 'Dashboard',
    vehicles: 'Quản lý xe',
    users: 'Quản lý người dùng',
    bookings: 'Quản lý đặt xe',
    reports: 'Báo cáo',
    settings: 'Cài đặt'
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Tổng quan hệ thống quản lý thuê xe',
    loading: 'Đang tải dữ liệu...',

    // Stats
    stats: {
      totalVehicles: {
        title: 'Total Vehicles',
        label: 'Tổng số xe'
      },
      available: {
        title: 'Available',
        label: 'Xe sẵn sàng'
      },
      withDriver: {
        title: 'With Driver',
        label: 'Có tài xế'
      },
      bookings: {
        title: 'Bookings',
        label: 'Lượt thuê'
      },
      totalValue: {
        title: 'Total Value',
        label: 'Tổng giá trị'
      },
      deltaText: 'so với tháng trước'
    },

    // Charts & Sections
    charts: {
      overview: {
        title: 'Biểu đồ tổng quan',
        description: 'Thống kê hoạt động theo thời gian',
        placeholder: 'Chart Placeholder',
        placeholderDesc: 'Biểu đồ sẽ được hiển thị tại đây'
      },
      activity: {
        title: 'Hoạt động gần đây',
        description: 'Các hoạt động mới nhất trong hệ thống',
        empty: 'No Activity',
        emptyDesc: 'Chưa có hoạt động nào được ghi nhận'
      },
      popular: {
        title: 'Xe phổ biến',
        description: 'Top xe được thuê nhiều nhất',
        empty: 'Chưa có dữ liệu'
      },
      revenue: {
        title: 'Doanh thu',
        description: 'Thống kê doanh thu tháng này',
        empty: 'Chưa có dữ liệu'
      },
      reviews: {
        title: 'Đánh giá',
        description: 'Phản hồi từ khách hàng',
        empty: 'Chưa có đánh giá'
      }
    }
  },

  // User Menu
  userMenu: {
    account: 'Tài khoản',
    appearance: 'Giao diện',
    logout: 'Đăng xuất',

    theme: {
      light: 'Sáng',
      dark: 'Tối',
      system: 'Hệ thống'
    },

    fallback: {
      name: 'Người dùng',
      email: 'user@example.com',
      initials: 'U'
    }
  },

  // Auth
  auth: {
    login: {
      title: 'Đăng nhập',
      subtitle: 'Vui lòng nhập thông tin tài khoản để truy cập',
      adminTitle: 'Đăng nhập quản trị',
      adminSubtitle: 'Vui lòng nhập thông tin tài khoản để truy cập',
      email: 'Email',
      password: 'Mật khẩu',
      loginButton: 'Đăng nhập',
      logging: 'Đang đăng nhập...',
      backToHome: '← Quay về trang chủ',
      adminAccess: 'Bạn là quản trị viên?',
      adminLink: 'Đăng nhập quản trị'
    },
    register: {
      title: 'Tạo tài khoản',
      subtitle: 'Điền thông tin để tạo tài khoản thuê xe',
      name: 'Họ và tên',
      email: 'Email',
      password: 'Mật khẩu',
      confirmPassword: 'Xác nhận mật khẩu',
      phone: 'Số điện thoại',
      address: 'Địa chỉ',
      registerButton: 'Đăng ký',
      registering: 'Đang đăng ký...',
      hasAccount: 'Đã có tài khoản?',
      loginLink: 'Đăng nhập ngay',
      backToHome: '← Quay về trang chủ'
    },
    errors: {
      invalidCredentials: 'Email hoặc mật khẩu không đúng',
      networkError: 'Lỗi kết nối. Vui lòng thử lại.',
      passwordMismatch: 'Mật khẩu xác nhận không khớp',
      emailExists: 'Email đã tồn tại trong hệ thống',
      weakPassword: 'Mật khẩu phải có ít nhất 6 ký tự'
    }
  },

  // Car Management
  cars: {
    title: 'Quản lý xe',
    subtitle: 'Quản lý danh sách xe cho thuê',
    addNew: 'Thêm xe mới',
    editTitle: 'Chỉnh sửa xe',
    addTitle: 'Thêm xe mới',
    editDescription: 'Cập nhật thông tin xe',
    addDescription: 'Điền thông tin xe mới',
    
    fields: {
      name: 'Tên xe',
      brand: 'Hãng xe',
      year: 'Năm sản xuất',
      seats: 'Số chỗ ngồi',
      fuelType: 'Loại nhiên liệu',
      pricePerDay: 'Giá thuê/ngày (VNĐ)',
      imageUrl: 'URL hình ảnh',
      location: 'Địa điểm'
    },
    
    placeholders: {
      name: 'VD: Toyota Camry',
      brand: 'VD: Toyota',
      year: 'VD: 2023',
      seats: 'VD: 5',
      fuelType: 'VD: Xăng',
      pricePerDay: 'VD: 800000',
      imageUrl: 'https://example.com/car.jpg',
      location: 'VD: Hà Nội'
    },

    table: {
      name: 'Tên xe',
      brand: 'Hãng',
      year: 'Năm',
      seats: 'Chỗ ngồi',
      fuel: 'Nhiên liệu',
      location: 'Địa điểm',
      price: 'Giá/ngày',
      actions: 'Thao tác'
    },

    status: {
      available: 'Sẵn sàng',
      rented: 'Đã thuê',
      maintenance: 'Bảo trì'
    },

    empty: 'Chưa có xe nào trong hệ thống',
    deleteConfirm: 'Bạn có chắc chắn muốn xóa xe này?'
  },

  // User Management
  users: {
    title: 'Quản lý người dùng',
    subtitle: 'Quản lý tài khoản người dùng và phân quyền',
    addNew: 'Thêm người dùng',
    editTitle: 'Chỉnh sửa người dùng',
    addTitle: 'Thêm người dùng mới',
    editDescription: 'Cập nhật thông tin người dùng',
    addDescription: 'Tạo tài khoản người dùng mới',

    fields: {
      name: 'Họ tên',
      email: 'Email',
      password: 'Mật khẩu',
      phone: 'Số điện thoại',
      address: 'Địa chỉ',
      role: 'Vai trò'
    },

    roles: {
      admin: 'Quản trị viên',
      user: 'Người dùng'
    },

    table: {
      name: 'Họ tên',
      email: 'Email',
      phone: 'Số điện thoại',
      address: 'Địa chỉ',
      role: 'Vai trò',
      createdAt: 'Ngày tạo',
      actions: 'Thao tác'
    },

    stats: {
      total: 'Tổng người dùng',
      admins: 'Quản trị viên',
      users: 'Người dùng thường'
    },

    empty: 'Chưa có người dùng nào trong hệ thống',
    deleteConfirm: 'Bạn có chắc chắn muốn xóa người dùng này?'
  },

  // Home Page
  home: {
    title: 'Thuê xe tự lái dễ dàng',
    subtitle: 'Khám phá bộ sưu tập xe đa dạng của chúng tôi với giá cả hợp lý và dịch vụ tốt nhất',
    login: 'Đăng nhập',
    rentNow: 'Thuê xe ngay',
    empty: 'Chưa có xe nào',
    emptyDesc: 'Hiện tại chưa có xe nào có sẵn. Vui lòng quay lại sau.',
    carDetails: {
      seats: 'chỗ ngồi',
      perDay: '/ngày'
    },
    footer: 'Tất cả quyền được bảo lưu.'
  },

  // Validation Messages
  validation: {
    required: 'Trường này là bắt buộc',
    email: 'Email không hợp lệ',
    minLength: 'Tối thiểu {min} ký tự',
    maxLength: 'Tối đa {max} ký tự',
    number: 'Phải là số',
    positive: 'Phải là số dương',
    url: 'URL không hợp lệ'
  }
}
