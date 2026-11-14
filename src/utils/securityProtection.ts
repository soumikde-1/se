/**
 * Client-Side Content & Code Protection
 * Prevents unauthorized right-clicking, image saving, DevTools inspection shortcuts,
 * and text extraction to keep Purbasha's birthday surprise private and protected.
 */
export function initSecurityProtection(): () => void {
  if (typeof window === 'undefined') return () => {};

  // 1. Disable Right-Click Context Menu
  const handleContextMenu = (e: MouseEvent) => {
    // Prevent default context menu
    e.preventDefault();
    return false;
  };

  // 2. Block DevTools & Source Inspection Keyboard Shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    const isMac = navigator.platform?.toUpperCase().indexOf('MAC') >= 0;
    const modifier = isMac ? e.metaKey : e.ctrlKey;

    // F12 key
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+I / Cmd+Option+I (Inspect)
    if (modifier && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+J / Cmd+Option+J (Console)
    if (modifier && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+C / Cmd+Option+C (Inspect Element)
    if (modifier && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+U / Cmd+Option+U (View Source)
    if (modifier && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+S / Cmd+S (Save Page)
    if (modifier && (e.key === 'S' || e.key === 's' || e.keyCode === 83)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  // 3. Disable Dragging of Images & Assets
  const handleDragStart = (e: DragEvent) => {
    e.preventDefault();
    return false;
  };

  window.addEventListener('contextmenu', handleContextMenu, { capture: true });
  window.addEventListener('keydown', handleKeyDown, { capture: true });
  window.addEventListener('dragstart', handleDragStart, { capture: true });

  return () => {
    window.removeEventListener('contextmenu', handleContextMenu, { capture: true });
    window.removeEventListener('keydown', handleKeyDown, { capture: true });
    window.removeEventListener('dragstart', handleDragStart, { capture: true });
  };
}
