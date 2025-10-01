// Message keys tiếng Việt cho toàn bộ ứng dụng
export const messages = {
  // Dashboard
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Tổng quan hệ thống quản lý thuê xe',
    refresh: 'Làm mới',
    export: 'Xuất dữ liệu',
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
      deltaText: 'so với tháng trước',
      deltaTextEn: 'from last month'
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
    
    // Theme options
    theme: {
      light: 'Sáng',
      dark: 'Tối',
      system: 'Hệ thống'
    },
    
    // User info fallbacks
    fallback: {
      name: 'Người dùng',
      email: 'user@example.com',
      initials: 'U'
    }
  },
  
  // Common
  common: {
    loading: 'Đang tải...',
    noData: 'Không có dữ liệu',
    error: 'Đã có lỗi xảy ra',
    retry: 'Thử lại'
  }
}

// Helper function to get nested message
export const getMessage = (path, fallback = '') => {
  return path.split('.').reduce((obj, key) => obj?.[key], messages) || fallback
}
