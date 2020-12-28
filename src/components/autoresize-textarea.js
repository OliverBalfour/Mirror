
// This textarea automatically resizes to the height of its contents
// It still supports min/max-height and a scrollbar appears past the limit
// Modified from https://www.impressivewebs.com/textarea-auto-resize/
// We don't use Material-UI's <TextField multiline /> as it doesn't support CSS max-height

import * as React from 'react';
import { useEventListener } from '../common';

// You must supply an input ref, and can supply className etc.
export default React.forwardRef(({ value, setValue, className, offset = 5, ...props }, ref) => {
  const hiddenDivRef = React.useRef(null);
  const inputRef = ref;

  // Update the height every time the value changes
  // It is assumed the textarea's width is constant
  const resize = () => {
    const hiddenDiv = hiddenDivRef.current;
    const input = inputRef.current;
    if (!hiddenDiv || !input) return;
    window.swap = () => {
      hiddenDiv.style.display = window.swapped ? 'none' : 'block';
      input.style.display = window.swapped ? 'block' : 'none';
      window.swapped = !window.swapped;
    }

    // Set the div's contents to the same value and calculate the new height
    // The <br> fixes the way the textarea grows if line-height isn't included
    hiddenDiv.innerHTML = inputRef.current.value + '<br style="line-height: 3px;">';

    // Briefly make the hidden div block but invisible to read the height
    let height = 0;
    hiddenDiv.style.visibility = 'hidden';
    hiddenDiv.style.display = 'block';
    input.style.display = 'none';
    height = hiddenDiv.offsetHeight;
    hiddenDiv.style.visibility = 'visible';
    hiddenDiv.style.display = 'none';
    input.style.display = 'block';
    input.style.height = height + offset + 'px';
  };
  window.resize=resize;
  React.useEffect(resize, [value, inputRef]);
  useEventListener(window, 'resize', resize);

  return (
    <React.Fragment>
      <div ref={hiddenDivRef} className={'autoresize-div ' + (className ? className : '')}
        style={{ padding: 2 }}></div>
      <textarea {...props} onChange={e => setValue(e.target.value)} value={value}
        className={'custom-textarea autoresize ' + (className ? className : '')} ref={inputRef} />
    </React.Fragment>
  );
});
