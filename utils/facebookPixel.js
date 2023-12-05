import ReactPixel from 'react-facebook-pixel';

const isBrowser = typeof window !== 'undefined';

const options = {
  autoConfig: true,
  debug: false,
};

export function initFacebookPixel(pixelId) {
  if (typeof window !== 'undefined') {
    if (isBrowser && !window.fbq) {
      ReactPixel.init(pixelId, null, options);
    }
  }
}

export function trackPageView() {
  if (typeof window !== 'undefined') {
    if (isBrowser && window.fbq) {
      ReactPixel.pageView();
    }
  }
}

export function trackCustomEvent(event, data) {
  if (typeof window !== 'undefined') {
    if (isBrowser && window.fbq) {
      ReactPixel.track(event, data);
    }
  }
}

export function trackAddToCart(data) {
  if (typeof window !== 'undefined') {
    if (isBrowser && window.fbq) {
      ReactPixel.track('AddToCart', data);
    }
  }
}
