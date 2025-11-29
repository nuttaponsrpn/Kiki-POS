export default defineNuxtPlugin(() => {
  if (process.client) {
    // Only run on iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    
    if (isIOS) {
      const focusAndOpenKeyboard = (el: HTMLElement, timeout = 100) => {
        if (!el) return;

        // Create temp input
        const tempEl = document.createElement('input');
        tempEl.style.position = 'absolute';
        tempEl.style.top = (el.offsetTop + 7) + 'px';
        tempEl.style.left = el.offsetLeft + 'px';
        tempEl.style.height = '0';
        tempEl.style.opacity = '0';
        tempEl.style.pointerEvents = 'none'; // Ensure it doesn't block clicks

        // Mount and focus
        document.body.appendChild(tempEl);
        tempEl.focus();

        // Delayed hand-off
        setTimeout(() => {
          el.focus();
          el.click(); // Synthetic click to ensure activation
          document.body.removeChild(tempEl);
        }, timeout);
      };

      // Global listener for touchstart to catch interactions
      // This helps ensure we have a valid user gesture for the focus event
      window.addEventListener('touchstart', (e) => {
        const target = e.target as HTMLElement;
        const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
        
        if (isInput) {
            // We don't want to interfere if it's already focused
            if (document.activeElement === target) return;

            // Check if we are in standalone mode (PWA)
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;

            if (isStandalone) {
                // Apply the fix
                // We use a small timeout to allow the native touch event to process
                // but we trigger the focus chain immediately.
                focusAndOpenKeyboard(target);
            }
        }
      }, { passive: true });
    }
  }
});
