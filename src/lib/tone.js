/**
 * Props for a full-width section in a given tone ('ink' | 'accent' | 'paper').
 *
 * - data-tone colours the section itself (see globals.css)
 * - data-stage marks where the page stage changes, so fixed UI (navbar,
 *   scrollbar) matches the section under the navbar (see usePageTheme)
 */
export function toneProps(tone) {
  return {
    'data-tone': tone,
    'data-stage': tone,
    // The navbar sits ~16–86px from the top; switch when the section reaches it
    'data-stage-start': 'top 48px',
  }
}
