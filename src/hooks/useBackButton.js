import { useEffect, useRef } from 'react';

// Intercepts the browser back button while a modal/sheet is open.
// Pushes a history entry on mount and pops it on unmount (if not already
// popped by the back button), so the back button closes the UI instead of
// leaving the page.
export function useBackButton(onClose) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const closedByBack = useRef(false);

  useEffect(() => {
    closedByBack.current = false;
    window.history.pushState({ tmaModal: true }, '');

    function handlePopState() {
      closedByBack.current = true;
      onCloseRef.current();
    }

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      // If closed programmatically (not via back), clean up the pushed entry.
      if (!closedByBack.current && window.history.state?.tmaModal) {
        window.history.back();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
