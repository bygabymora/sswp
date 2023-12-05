import ReactPixel from 'react-facebook-pixel';

const options = {
  autoConfig: true,
  debug: false,
};

export function initFacebookPixel(pixelId) {
  if (!window.fbq) {
    ReactPixel.init(pixelId, null, options);
  }
}

export function trackPageView() {
  if (window.fbq) {
    ReactPixel.pageView();
  }
}

export function trackCustomEvent(event, data) {
  if (window.fbq) {
    ReactPixel.track(event, data);
  }
}

export function trackAddToCart(data) {
  if (window.fbq) {
    ReactPixel.track('AddToCart', data);
  }
}
