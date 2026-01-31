// Contact Form Handler

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();

    // Clear previous message
    if (formMessage) {
      formMessage.textContent = '';
      formMessage.className = 'form-message';
    }

    // Validation
    if (!validateForm(name, phone, email, message)) {
      return;
    }

    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'جاري الإرسال...';
    submitButton.disabled = true;

    // Prepare data
    const formData = {
      name: name,
      phone: phone,
      email: email,
      service: service,
      message: message,
      timestamp: new Date().toISOString()
    };

    // Send data (to server or localStorage for demo)
    submitForm(formData).then(() => {
      // Success
      if (formMessage) {
        formMessage.textContent = 'شكراً لك! تم استقبال رسالتك. سنتواصل معك قريباً.';
        formMessage.className = 'form-message success';
      }

      // Reset form
      contactForm.reset();

      // Restore button
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;

      // Show custom notification
      if (typeof showCustomNotification !== 'undefined') {
        showCustomNotification('✓ تم الإرسال بنجاح', 'سيتم التواصل معك قريباً');
      }

      // Scroll to message
      formMessage.scrollIntoView({ behavior: 'smooth' });

    }).catch((error) => {
      // Error
      if (formMessage) {
        formMessage.textContent = 'حدث خطأ في الإرسال. يرجى المحاولة مجدداً.';
        formMessage.className = 'form-message error';
      }

      // Restore button
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;

      console.error('Form submission error:', error);
    });
  });
}

function validateForm(name, phone, email, message) {
  // Validate name
  if (name.length < 3) {
    showFormError('يرجى إدخال اسم صحيح');
    return false;
  }

  // Validate phone
  const phoneRegex = /^[0-9+\-\s()]{8,15}$/;
  if (!phoneRegex.test(phone)) {
    showFormError('يرجى إدخال رقم هاتف صحيح');
    return false;
  }

  // Validate email (optional but if provided, should be valid)
  if (email && !isValidEmail(email)) {
    showFormError('يرجى إدخال بريد إلكتروني صحيح');
    return false;
  }

  // Validate message
  if (message.length < 10) {
    showFormError('الرسالة يجب أن تكون 10 أحرف على الأقل');
    return false;
  }

  return true;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showFormError(errorMessage) {
  if (formMessage) {
    formMessage.textContent = errorMessage;
    formMessage.className = 'form-message error';
    formMessage.scrollIntoView({ behavior: 'smooth' });
  }
}

async function submitForm(data) {
  // For demo purposes, we'll save to localStorage
  // In production, this should send to a server

  // Option 1: Save to localStorage (demo)
  saveToLocalStorage(data);

  // Option 2: Send to server (production)
  // return sendToServer(data);

  return Promise.resolve();
}

function saveToLocalStorage(data) {
  try {
    // Get existing submissions
    let submissions = JSON.parse(localStorage.getItem('contactSubmissions')) || [];

    // Add new submission
    submissions.push(data);

    // Keep only last 100 submissions
    if (submissions.length > 100) {
      submissions = submissions.slice(-100);
    }

    // Save to localStorage
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));

    console.log('Form saved to localStorage');
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    throw error;
  }
}

async function sendToServer(data) {
  // This would be used to send data to a backend server
  // Example using fetch:
  /*
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Server error');
  }

  return response.json();
  */

  // For now, just resolve
  return Promise.resolve({ success: true });
}

// Retrieve submissions from localStorage (for admin purposes)
function getSubmissions() {
  try {
    return JSON.parse(localStorage.getItem('contactSubmissions')) || [];
  } catch (error) {
    console.error('Error retrieving submissions:', error);
    return [];
  }
}

// Clear all submissions
function clearSubmissions() {
  try {
    localStorage.removeItem('contactSubmissions');
    console.log('Submissions cleared');
  } catch (error) {
    console.error('Error clearing submissions:', error);
  }
}

// Export functions for external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateForm,
    showFormError,
    submitForm,
    getSubmissions,
    clearSubmissions
  };
}

// Expose functions to window for debugging
window.getSubmissions = getSubmissions;
window.clearSubmissions = clearSubmissions;
