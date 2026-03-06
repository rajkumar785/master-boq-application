/**
 * Global Error Handler
 * Centralized error handling for the entire application
 */

export const ErrorHandler = {
  /**
   * Log Error
   * @param {Error} error - Error object
   * @param {string} context - Context where error occurred
   * @param {object} additional - Additional data
   */
  log(error, context = 'Unknown', additional = {}) {
    const errorData = {
      timestamp: new Date().toISOString(),
      context,
      message: error.message,
      stack: error.stack,
      additional
    };

    console.error('Application Error:', errorData);

    // Store error in localStorage for debugging
    try {
      const errors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      errors.push(errorData);
      
      // Keep only last 50 errors
      if (errors.length > 50) {
        errors.splice(0, errors.length - 50);
      }
      
      localStorage.setItem('app_errors', JSON.stringify(errors));
    } catch (e) {
      console.error('Failed to store error:', e);
    }
  },

  /**
   * Handle Form Error
   * @param {Error} error - Error object
   * @param {HTMLFormElement} form - Form that caused error
   * @param {string} operation - Operation being performed
   */
  handleFormError(error, form, operation) {
    this.log(error, `Form: ${operation}`, {
      formId: form.id,
      formData: new FormData(form)
    });

    // Show user-friendly error message
    this.showUserMessage(`Failed to ${operation}: ${error.message}`, 'error');
  },

  /**
   * Handle API Error
   * @param {Error} error - Error object
   * @param {string} endpoint - API endpoint
   * @param {object} requestData - Request data
   */
  handleApiError(error, endpoint, requestData) {
    this.log(error, `API: ${endpoint}`, {
      endpoint,
      requestData
    });

    this.showUserMessage('Server error occurred. Please try again.', 'error');
  },

  /**
   * Handle Storage Error
   * @param {Error} error - Error object
   * @param {string} operation - Storage operation
   * @param {object} data - Data being stored
   */
  handleStorageError(error, operation, data) {
    this.log(error, `Storage: ${operation}`, {
      operation,
      dataSize: JSON.stringify(data).length
    });

    if (error.name === 'QuotaExceededError') {
      this.showUserMessage('Storage quota exceeded. Please clear some data.', 'error');
    } else if (error.name === 'SecurityError') {
      this.showUserMessage('Storage access denied. Please check browser settings.', 'error');
    } else {
      this.showUserMessage('Data storage failed. Please try again.', 'error');
    }
  },

  /**
   * Handle Validation Error
   * @param {object} validationResult - Validation result
   * @param {HTMLElement} container - Container to show errors in
   */
  handleValidationError(validationResult, container) {
    if (!validationResult.isValid) {
      this.log(new Error(validationResult.firstError), 'Validation', {
        errors: validationResult.errors
      });

      this.showValidationErrors(validationResult, container);
    }
  },

  /**
   * Show User Message
   * @param {string} message - Message to show
   * @param {string} type - Message type (info, warning, error, success)
   */
  showUserMessage(message, type = 'info') {
    // Remove existing messages
    const existing = document.querySelectorAll('.user-message');
    existing.forEach(el => el.remove());

    const messageDiv = document.createElement('div');
    messageDiv.className = `user-message user-message--${type}`;
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 4px;
      z-index: 10000;
      max-width: 300px;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out;
    `;

    // Set colors based on type
    const colors = {
      info: { bg: '#007bff', color: 'white' },
      success: { bg: '#28a745', color: 'white' },
      warning: { bg: '#ffc107', color: 'black' },
      error: { bg: '#dc3545', color: 'white' }
    };

    const color = colors[type] || colors.info;
    messageDiv.style.backgroundColor = color.bg;
    messageDiv.style.color = color.color;

    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
          if (messageDiv.parentNode) {
            messageDiv.remove();
          }
        }, 300);
      }
    }, 5000);
  },

  /**
   * Show Validation Errors in Container
   * @param {object} validationResult - Validation result
   * @param {HTMLElement} container - Container element
   */
  showValidationErrors(validationResult, container) {
    // Clear existing errors
    const existing = container.querySelectorAll('.validation-errors');
    existing.forEach(el => el.remove());

    if (!validationResult.isValid) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'validation-errors';
      errorDiv.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: 10px;
        border-radius: 4px;
        margin-bottom: 10px;
        font-size: 14px;
        border: 1px solid #f5c6cb;
      `;

      const errorList = document.createElement('ul');
      errorList.style.cssText = 'margin: 0; padding-left: 20px;';
      
      Object.values(validationResult.errors).forEach(error => {
        const li = document.createElement('li');
        li.textContent = error;
        errorList.appendChild(li);
      });

      errorDiv.appendChild(errorList);
      container.insertBefore(errorDiv, container.firstChild);
    }
  },

  /**
   * Get Error Logs
   * @returns {Array} Array of logged errors
   */
  getErrorLogs() {
    try {
      return JSON.parse(localStorage.getItem('app_errors') || '[]');
    } catch (e) {
      return [];
    }
  },

  /**
   * Clear Error Logs
   */
  clearErrorLogs() {
    localStorage.removeItem('app_errors');
  },

  /**
   * Initialize Error Handler
   */
  init() {
    // Add global error handler
    window.addEventListener('error', (event) => {
      this.log(event.error, 'Global JavaScript Error', {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Add unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.log(event.reason, 'Unhandled Promise Rejection');
    });

    // Add CSS animations for messages
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
};
