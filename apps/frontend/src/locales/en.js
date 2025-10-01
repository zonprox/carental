// English translations
export const en = {
  // Common
  common: {
    loading: 'Loading...',
    noData: 'No data available',
    error: 'An error occurred',
    retry: 'Retry',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    refresh: 'Refresh',
    export: 'Export',
    import: 'Import',
    close: 'Close',
    confirm: 'Confirm',
    back: 'Back'
  },

  // Navigation
  nav: {
    dashboard: 'Dashboard',
    vehicles: 'Vehicle Management',
    users: 'User Management',
    bookings: 'Booking Management',
    reports: 'Reports',
    settings: 'Settings'
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Car rental management system overview',
    loading: 'Loading data...',

    // Stats
    stats: {
      totalVehicles: {
        title: 'Total Vehicles',
        label: 'Total vehicles'
      },
      available: {
        title: 'Available',
        label: 'Available vehicles'
      },
      withDriver: {
        title: 'With Driver',
        label: 'With driver'
      },
      bookings: {
        title: 'Bookings',
        label: 'Total bookings'
      },
      totalValue: {
        title: 'Total Value',
        label: 'Total value'
      },
      deltaText: 'from last month'
    },

    // Charts & Sections
    charts: {
      overview: {
        title: 'Overview Chart',
        description: 'Activity statistics over time',
        placeholder: 'Chart Placeholder',
        placeholderDesc: 'Chart will be displayed here'
      },
      activity: {
        title: 'Recent Activity',
        description: 'Latest activities in the system',
        empty: 'No Activity',
        emptyDesc: 'No activities recorded yet'
      },
      popular: {
        title: 'Popular Cars',
        description: 'Most rented vehicles',
        empty: 'No data available'
      },
      revenue: {
        title: 'Revenue',
        description: 'This month\'s revenue statistics',
        empty: 'No data available'
      },
      reviews: {
        title: 'Reviews',
        description: 'Customer feedback',
        empty: 'No reviews yet'
      }
    }
  },

  // User Menu
  userMenu: {
    account: 'Account',
    appearance: 'Appearance',
    logout: 'Logout',

    theme: {
      light: 'Light',
      dark: 'Dark',
      system: 'System'
    },

    fallback: {
      name: 'User',
      email: 'user@example.com',
      initials: 'U'
    }
  },

  // Auth
  auth: {
    login: {
      title: 'Login',
      subtitle: 'Please enter your account information to access',
      adminTitle: 'Admin Login',
      adminSubtitle: 'Please enter your account information to access',
      email: 'Email',
      password: 'Password',
      loginButton: 'Login',
      logging: 'Logging in...',
      backToHome: '← Back to home',
      adminAccess: 'Are you an administrator?',
      adminLink: 'Admin login'
    },
    register: {
      title: 'Create Account',
      subtitle: 'Fill in the information to create a car rental account',
      name: 'Full Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      phone: 'Phone Number',
      address: 'Address',
      registerButton: 'Register',
      registering: 'Registering...',
      hasAccount: 'Already have an account?',
      loginLink: 'Login now',
      backToHome: '← Back to home'
    },
    errors: {
      invalidCredentials: 'Invalid email or password',
      networkError: 'Network error. Please try again.',
      passwordMismatch: 'Password confirmation does not match',
      emailExists: 'Email already exists in the system',
      weakPassword: 'Password must be at least 6 characters'
    }
  },

  // Car Management
  cars: {
    title: 'Vehicle Management',
    subtitle: 'Manage rental vehicle list',
    addNew: 'Add New Vehicle',
    editTitle: 'Edit Vehicle',
    addTitle: 'Add New Vehicle',
    editDescription: 'Update vehicle information',
    addDescription: 'Enter new vehicle information',
    
    fields: {
      name: 'Vehicle Name',
      brand: 'Brand',
      year: 'Year',
      seats: 'Seats',
      fuelType: 'Fuel Type',
      pricePerDay: 'Price per Day (VND)',
      imageUrl: 'Image URL',
      location: 'Location'
    },
    
    placeholders: {
      name: 'e.g: Toyota Camry',
      brand: 'e.g: Toyota',
      year: 'e.g: 2023',
      seats: 'e.g: 5',
      fuelType: 'e.g: Gasoline',
      pricePerDay: 'e.g: 800000',
      imageUrl: 'https://example.com/car.jpg',
      location: 'e.g: Hanoi'
    },

    table: {
      name: 'Name',
      brand: 'Brand',
      year: 'Year',
      seats: 'Seats',
      fuel: 'Fuel',
      location: 'Location',
      price: 'Price/Day',
      actions: 'Actions'
    },

    status: {
      available: 'Available',
      rented: 'Rented',
      maintenance: 'Maintenance'
    },

    empty: 'No vehicles in the system',
    deleteConfirm: 'Are you sure you want to delete this vehicle?'
  },

  // User Management
  users: {
    title: 'User Management',
    subtitle: 'Manage user accounts and permissions',
    addNew: 'Add User',
    editTitle: 'Edit User',
    addTitle: 'Add New User',
    editDescription: 'Update user information',
    addDescription: 'Create new user account',

    fields: {
      name: 'Full Name',
      email: 'Email',
      password: 'Password',
      phone: 'Phone Number',
      address: 'Address',
      role: 'Role'
    },

    roles: {
      admin: 'Administrator',
      user: 'User'
    },

    table: {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      role: 'Role',
      createdAt: 'Created At',
      actions: 'Actions'
    },

    stats: {
      total: 'Total Users',
      admins: 'Administrators',
      users: 'Regular Users'
    },

    empty: 'No users in the system',
    deleteConfirm: 'Are you sure you want to delete this user?'
  },

  // Home Page
  home: {
    title: 'Easy Self-Drive Car Rental',
    subtitle: 'Explore our diverse car collection with affordable prices and the best service',
    login: 'Login',
    rentNow: 'Rent Now',
    empty: 'No cars available',
    emptyDesc: 'Currently no cars are available. Please come back later.',
    carDetails: {
      seats: 'seats',
      perDay: '/day'
    },
    footer: 'All rights reserved.'
  },

  // Validation Messages
  validation: {
    required: 'This field is required',
    email: 'Invalid email format',
    minLength: 'Minimum {min} characters',
    maxLength: 'Maximum {max} characters',
    number: 'Must be a number',
    positive: 'Must be a positive number',
    url: 'Invalid URL format'
  }
}
