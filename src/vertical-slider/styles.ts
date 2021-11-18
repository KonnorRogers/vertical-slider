import { normalize } from '../normalize'
import { css } from '@microsoft/fast-element'

const thumbStyles = `
  cursor: pointer;
  height: var(--thumb-size);
  width: var(--thumb-size);
  border-radius: 50%;
  border: 2px solid var(--thumb-border);
  margin-top: calc((var(--thumb-size) / -2 + var(--track-width) / 2) - 1px);
  background-color: var(--thumb-color);
`

const trackStyles = `
  width: var(--track-height);
  height: var(--track-width);
  background-color: var(--track-color);
  border: 1px solid var(--track-border-color);
  outline: none;
  border-radius: var(--track-radius);
  cursor: pointer;
`

const progressStyles = `
  width: var(--track-height);
  height: var(--track-width);
  background-color: var(--progress-color);
  border: 1px solid var(--progress-border-color);
  border-radius: var(--track-radius);
`

export const styles = css`
${normalize}

:host {
  --width: 16px;
  --height: 175px;

  --thumb-border: rgb(80, 80, 80);
  --thumb-color: rgb(80, 80, 80);
  --thumb-size: 16px;

  --track-height: 100%;
  --track-width: 6px;
  --track-radius: 6px;
  --track-color: rgb(225, 225, 225);
  --track-border-color: rgb(105, 105, 105);

  --progress-color: rgb(20, 122, 255);
  --progress-border-color: rgb(20, 122, 255);

  display: inline-block;
  position: relative;
  margin-right: calc(var(--width) / 2);
}

.wrapper {
  width: var(--width);
  height: var(--height);
  position: relative;

  /* center the slider */
  margin: 0 auto;
}

.slider {
  -webkit-appearance: none;
  width: var(--height);
  height: var(--width);
  left: 0;
  bottom: -0.75em;
  transform: rotate(-90deg) translateY(calc(var(--width) / 2));
  transform-origin: left;
  position: absolute;
}

/* https://css-tricks.com/styling-cross-browser-compatible-range-inputs-css/ */
/* Special styling for WebKit/Blink */
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  ${thumbStyles}
}

/* All the same stuff for Firefox */
.slider::-moz-range-thumb {
  ${thumbStyles}
}

.slider::-webkit-slider-runnable-track {
  ${trackStyles}
  background: linear-gradient(to right, var(--progress-color) 0%, var(--progress-color) var(--progress-percent), var(--track-color) var(--progress-percent), var(--track-color) 100%);
}

.slider::-moz-range-track {
  ${trackStyles}
}

.slider::-moz-range-progress {
  ${progressStyles}
}
`
