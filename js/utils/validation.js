/**
 * Input Validation Utilities
 * Centralized validation system for all user inputs
 */

export const Validation = {
  /**
   * Required Field Validation
   * @param {string} value - Field value
   * @param {string} fieldName - Field name for error messages
   * @returns {object} Validation result
   */
  required(value, fieldName) {
    const result = {
      isValid: true,
      message: ''
    };

    if (!value || value.trim() === '') {
      result.isValid = false;
      result.message = `${fieldName} is required`;
    }

    return result;
  },

  /**
   * Number Validation
   * @param {string|number} value - Value to validate
   * @param {string} fieldName - Field name
   * @param {object} options - Validation options
   * @returns {object} Validation result
   */
  number(value, fieldName, options = {}) {
    const result = {
      isValid: true,
      message: ''
    };

    const num = parseFloat(value);

    if (isNaN(num)) {
      result.isValid = false;
      result.message = `${fieldName} must be a valid number`;
      return result;
    }

    if (options.min !== undefined && num < options.min) {
      result.isValid = false;
      result.message = `${fieldName} must be at least ${options.min}`;
    }

    if (options.max !== undefined && num > options.max) {
      result.isValid = false;
      result.message = `${fieldName} must be no more than ${options.max}`;
    }

    if (options.positive && num <= 0) {
      result.isValid = false;
      result.message = `${fieldName} must be greater than 0`;
    }

    return result;
  },

  /**
   * Email Validation
   * @param {string} value - Email to validate
   * @returns {object} Validation result
   */
  email(value) {
    const result = {
      isValid: true,
      message: ''
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!value || value.trim() === '') {
      result.isValid = false;
      result.message = 'Email is required';
    } else if (!emailRegex.test(value)) {
      result.isValid = false;
      result.message = 'Please enter a valid email address';
    }

    return result;
  },

  /**
   * Phone Validation
   * @param {string} value - Phone number to validate
   * @returns {object} Validation result
   */
  phone(value) {
    const result = {
      isValid: true,
      message: ''
    };

    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    
    if (!value || value.trim() === '') {
      result.isValid = false;
      result.message = 'Phone number is required';
    } else if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      result.isValid = false;
      result.message = 'Please enter a valid phone number';
    }

    return result;
  },

  /**
   * Project Name Validation
   * @param {string} value - Project name to validate
   * @returns {object} Validation result
   */
  projectName(value) {
    const result = {
      isValid: true,
      message: ''
    };

    if (!value || value.trim() === '') {
      result.isValid = false;
      result.message = 'Project name is required';
    } else if (value.trim().length < 3) {
      result.isValid = false;
      result.message = 'Project name must be at least 3 characters';
    } else if (value.trim().length > 100) {
      result.isValid = false;
      result.message = 'Project name must be no more than 100 characters';
    }

    return result;
  },

  /**
   * Form Validation
   * @param {HTMLFormElement} form - Form to validate
   * @param {object} rules - Validation rules object
   * @returns {object} Validation result
   */
  form(form, rules) {
    const result = {
      isValid: true,
      errors: {},
      firstError: null
    };

    Object.keys(rules).forEach(fieldName => {
      const field = form.elements[fieldName];
      const rule = rules[fieldName];
      const value = field ? field.value : '';

      let validationResult;
      
      if (rule.required) {
        validationResult = this.required(value, rule.label || fieldName);
        if (!validationResult.isValid) {
          result.isValid = false;
          result.errors[fieldName] = validationResult.message;
          if (!result.firstError) {
            result.firstError = validationResult.message;
          }
        }
      }

      if (rule.type === 'number' && validationResult.isValid) {
        validationResult = this.number(value, rule.label || fieldName, rule.options);
        if (!validationResult.isValid) {
          result.isValid = false;
          result.errors[fieldName] = validationResult.message;
          if (!result.firstError) {
            result.firstError = validationResult.message;
          }
        }
      }

      if (rule.type === 'email' && validationResult.isValid) {
        validationResult = this.email(value);
        if (!validationResult.isValid) {
          result.isValid = false;
          result.errors[fieldName] = validationResult.message;
          if (!result.firstError) {
            result.firstError = validationResult.message;
          }
        }
      }
    });

    return result;
  },

  /**
   * Sanitize Input
   * @param {string} value - Value to sanitize
   * @returns {string} Sanitized value
   */
  sanitize(value) {
    if (typeof value !== 'string') return value;
    
    return value
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  },

  /**
   * Show Validation Errors
   * @param {object} validationResult - Validation result object
   * @param {HTMLElement} container - Container to show errors in
   */
  showErrors(validationResult, container) {
    container.innerHTML = '';
    
    if (!validationResult.isValid) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'validation-errors';
      errorDiv.style.cssText = `
        background: #fee;
        color: #c33;
        padding: 10px;
        border-radius: 4px;
        margin-bottom: 10px;
        font-size: 14px;
      `;

      const errorList = document.createElement('ul');
      errorList.style.cssText = 'margin: 0; padding-left: 20px;';
      
      Object.values(validationResult.errors).forEach(error => {
        const li = document.createElement('li');
        li.textContent = error;
        errorList.appendChild(li);
      });

      errorDiv.appendChild(errorList);
      container.appendChild(errorDiv);
    }
  },

  /**
   * Clear Validation Errors
   * @param {HTMLElement} container - Container to clear errors from
   */
  clearErrors(container) {
    const errorElements = container.querySelectorAll('.validation-errors');
    errorElements.forEach(el => el.remove());
  }
};
