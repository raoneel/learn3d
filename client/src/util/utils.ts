export function hashCode(s: string) {
  var h = 0, l = s.length, i = 0;
  if ( l > 0 )
    while (i < l)
      h = (h << 5) - h + s.charCodeAt(i++) | 0;
  return h;
};

export function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Tracks a GA event
 * @param category Google Analytics category
 * @param action Google Analytics action
 */
export function trackEvent(category: string, action: string) {
  if (!(window as any).gtag) {
    return;
  }

  (window as any).gtag("event", action, {
    event_category: category,
  });
}