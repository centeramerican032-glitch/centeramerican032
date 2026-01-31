// Fake Booking Notifications

const firstNames = [
  'محمد', 'أحمد', 'علي', 'سارة', 'فاطمة', 'خديجة', 'نور', 'هند', 'زينب', 'عائشة',
  'عبدالله', 'سلمان', 'خالد', 'فيصل', 'ياسر', 'مريم', 'ليلى', 'جميلة', 'أمل', 'إسراء'
];

const lastNames = [
  'الأحمد', 'محمود', 'سالم', 'عبدالرحمن', 'الشمري', 'الدعيج', 'الحويل', 'الصباح', 'العتيبي', 'الدعجاني'
];

const services = [
  'مكافحة الصراصير', 'مكافحة النمل', 'مكافحة بق الفراش', 'مكافحة الخنافس', 'مكافحة الفئران', 'مكافحة العناكب'
];

const areas = [
  'العاصمة', 'الفروانية', 'الجهراء', 'حولي', 'مبارك الكبير', 'الأحمدي', 'السالمية', 'صباح الأحمد'
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomNotification() {
  const firstName = getRandomElement(firstNames);
  const lastName = getRandomElement(lastNames);
  const service = getRandomElement(services);
  const area = getRandomElement(areas);

  return {
    name: `${firstName} ${lastName}`,
    service: service,
    area: area
  };
}

function createNotificationElement(title, message) {
  const container = document.getElementById('notificationContainer');
  if (!container) return;

  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `
    <span class="notification-close" onclick="this.parentElement.remove()">✕</span>
    <div class="notification-title">${title}</div>
    <div class="notification-text">${message}</div>
  `;

  container.appendChild(notification);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 4000);
}

function showFakeBookingNotification() {
  const booking = generateRandomNotification();
  const title = '✓ تم حجز خدمة جديدة';
  const message = `${booking.name} من ${booking.area} حجز خدمة ${booking.service}`;

  createNotificationElement(title, message);
}

// Show notifications every 15 minutes (900000ms)
function startNotificationInterval() {
  // Initial notification after 30 seconds
  setTimeout(showFakeBookingNotification, 30000);

  // Set interval for every 15 minutes
  setInterval(showFakeBookingNotification, 900000);
}

// Start notifications when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    startNotificationInterval();
  });
} else {
  startNotificationInterval();
}


// Utility function to create custom notifications
function showCustomNotification(title, message, duration = 4000) {
  createNotificationElement(title, message);
}

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    showFakeBookingNotification,
    createNotificationElement,
    showCustomNotification
  };
}
