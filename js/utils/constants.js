/**
 * Application Constants
 * Centralized constants for the entire application
 */

export const APP_CONSTANTS = {
  // Application Info
  APP_NAME: 'Smart SMM7 Construction Estimating Platform',
  VERSION: '2.1.0',
  BUILD_DATE: '2026-03-06',
  
  // Storage Keys
  STORAGE_KEYS: {
    MAIN_STATE: 'smartSmm7.state.v1',
    ERRORS: 'app_errors',
    USER_PREFERENCES: 'user_preferences',
    BACKUP_VERSION: 'backup_v2.1.0'
  },
  
  // Validation Rules
  VALIDATION: {
    PROJECT_NAME: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 100,
      PATTERN: /^[a-zA-Z0-9\s\-_.,()]+$/
    },
    CLIENT_NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 100
    },
    LOCATION: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 200
    },
    BUILDING_TYPE: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 50
    },
    FLOORS: {
      MIN: 1,
      MAX: 200
    },
    DURATION_MONTHS: {
      MIN: 1,
      MAX: 240
    }
  },
  
  // SMM7 Categories
  SMM7_CATEGORIES: {
    PRELIMINARIES: 'A',
    SUBSTRUCTURE: 'E', 
    SUPERSTRUCTURE: 'F',
    FINISHES: 'G',
    SERVICES: 'L',
    EXTERNAL_WORKS: 'M'
  },
  
  // Default Values
  DEFAULTS: {
    WASTE_PERCENTAGE: 5,
    OVERHEAD_PERCENTAGE: 12,
    PROFIT_PERCENTAGE: 10,
    CURRENCY: 'INR',
    DECIMAL_PLACES: 2,
    DATE_FORMAT: 'YYYY-MM-DD',
    COVERAGE: 25 // mm for concrete cover
  },
  
  // Material Wastage Percentages
  WASTAGE: {
    CONCRETE: 3,
    BRICKS: 5,
    STEEL: 2,
    PLASTER: 5,
    PAINT: 10,
    TILES: 8,
    AGGREGATES: 5,
    SAND: 5,
    CEMENT: 2,
    TIMBER: 10,
    ROOFING: 5
  },
  
  // Reinforcement Standard Values
  REINFORCEMENT: {
    DENSITY: 7850, // kg/m³
    WEIGHT_FORMULA: 'D² ÷ 162',
    STANDARD_DIAMETERS: [8, 10, 12, 16, 20, 25, 32],
    STANDARD_LENGTHS: [6, 9, 12, 15, 18],
    BEND_RADIUS: 2, // times diameter
    LAP_LENGTH: 50 // times diameter
  },
  
  // Concrete Mix Ratios
  CONCRETE_MIXES: {
    GRADE_15: { cement: 1, sand: 3, aggregate: 6, water: 0.5 },
    GRADE_20: { cement: 1, sand: 2.5, aggregate: 5, water: 0.5 },
    GRADE_25: { cement: 1, sand: 2, aggregate: 4, water: 0.5 },
    GRADE_30: { cement: 1, sand: 1.5, aggregate: 3, water: 0.45 }
  },
  
  // Unit Conversions
  CONVERSIONS: {
    MM_TO_M: 0.001,
    M_TO_MM: 1000,
    SQM_TO_SQFT: 10.764,
    SQFT_TO_SQM: 0.093,
    CUM_TO_CUFT: 35.315,
    KG_TO_TONNE: 0.001,
    TONNE_TO_KG: 1000
  },
  
  // UI Constants
  UI: {
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 300,
    TOAST_DURATION: 5000,
    MODAL_Z_INDEX: 10000,
    SIDEBAR_BREAKPOINT: 768,
    MOBILE_BREAKPOINT: 480,
    TABLET_BREAKPOINT: 1200
  },
  
  // File Upload Limits
  FILE_LIMITS: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    MAX_FILES: 5
  },
  
  // Performance Constants
  PERFORMANCE: {
    CACHE_SIZE: 100,
    BATCH_SIZE: 50,
    LAZY_LOAD_THRESHOLD: 200,
    DEBOUNCE_THRESHOLD: 100
  },
  
  // Error Messages
  ERROR_MESSAGES: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_NUMBER: 'Please enter a valid number',
    INVALID_EMAIL: 'Please enter a valid email address',
    STORAGE_QUOTA_EXCEEDED: 'Storage quota exceeded. Please clear some data',
    NETWORK_ERROR: 'Network error. Please check your connection',
    FILE_TOO_LARGE: 'File size exceeds maximum limit',
    INVALID_FILE_TYPE: 'File type not supported',
    PROJECT_CREATE_FAILED: 'Failed to create project. Please try again.',
    BOQ_SAVE_FAILED: 'Failed to save BOQ. Please try again.',
    CALCULATION_ERROR: 'Calculation error. Please check your inputs.'
  },
  
  // Success Messages
  SUCCESS_MESSAGES: {
    PROJECT_CREATED: 'Project created successfully',
    PROJECT_UPDATED: 'Project updated successfully',
    PROJECT_DELETED: 'Project deleted successfully',
    BOQ_SAVED: 'BOQ saved successfully',
    CALCULATION_COMPLETE: 'Calculation completed successfully',
    DATA_EXPORTED: 'Data exported successfully',
    DATA_IMPORTED: 'Data imported successfully'
  },
  
  // Navigation Routes
  ROUTES: {
    DASHBOARD: '/dashboard',
    PROJECTS: '/projects',
    LIBRARY: '/library',
    TAKEOFF: '/takeoff',
    BOQ: '/boq',
    RATE: '/rate',
    MATERIALS: '/materials',
    REBAR: '/rebar',
    CONCRETE: '/concrete',
    VARIATIONS: '/variations',
    PROGRESS: '/progress',
    CASHFLOW: '/cashflow',
    REPORTS: '/reports'
  },
  
  // Export Formats
  EXPORT_FORMATS: {
    JSON: 'application/json',
    CSV: 'text/csv',
    PDF: 'application/pdf',
    EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }
};

// Export commonly used constants for easy access
export const { 
  STORAGE_KEYS, 
  VALIDATION, 
  DEFAULTS, 
  WASTAGE, 
  REINFORCEMENT, 
  CONCRETE_MIXES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES 
} = APP_CONSTANTS;
