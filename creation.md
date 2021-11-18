<h2 id="vertical-sliders">
  <a href="#vertical-sliders">
    Vertical Sliders
  </a>
</h2>

Perhaps you're like me and found the need to arise to make a vertical
slider. My use-case was for a volume slider. I figured, "the browser has
a horizontal slider, how hard could a vertical one be?"

<h2 id="browser-support">
  <a href="#browser-support">
    Browser Support
  </a>
</h2>

To the MDN docs! Turns out vertical sliders only recently gained
cross-browser support with Chrome being the latest to join the party.

At the time of this writing browser support looks like this:

- Chrome 94 (Sep 21, 2021) (implemented via `-webkit-appearance: slider-vertical`)
- Safari 15 (Sep 19, 2021) (implemented via `-webkit-appearance: slider-vertical`)
- IE 10 (2012!) -> all versions of Edge via `writing-mode: bt-lr`
- Firefox (Cant find data) (implemented with an attribute: `<input type="range" orient="vertical">`

Total support at time of writing based on CanIUse.com:
[48%](https://caniuse.com/?search=vertical%20slider)

That's just not gonna cut it. And on top of that, its largely via
browser prefixes. There is this article here:
<https://css-tricks.com/sliding-nightmare-understanding-range-input/#orientation>
that references orientation, but its from 2017 and I imagine hasn't
accounted for these new features. It also makes a great point, you cant
remove default browser styling, if you have to set the
`-webkit-appearance` on the range.

<h2 id="what-does-the-spec-say">
  <a href="#what-does-the-spec-say">
    What does the spec say?
  </a>
</h2>

Well, the spec says ["If the height is greater than the width, make it
vertical!"](https://html.spec.whatwg.org/multipage/input.html#range-state-\(type%3Drange\))
Well, thats nice, but sadly, in practice as of today, its just not true.

<h2 id="first-steps">
  <a href="#first-steps">
    First steps
  </a>
</h2>

The first step to implementing a cross-browser vertical slider is to see
how the browsers that support it actually handle vertical sliders.

Here is the simplest vertical slider you can make:

```html
<style>
  input[type=range][orient=vertical] {
    writing-mode: bt-lr;
    -webkit-appearance: slider-vertical;
    width: 16px;
    height: 175px;
  }
</style>

<input type="range" orient="vertical" min="0" max="100" step="1">
```

Feel free to checkout the example here:
<https://jsfiddle.net/m0btsq89/5/>

Now if you checkout the fiddle, there's some layout stuff to understand.
First of all, its default styling is an inline-block, this will be
important for when we get to sane defaults and making sure we dont break
the document flow.

<h2 id="recreation">
  <a href="#recreation">
    Recreation
  </a>
</h2>

Now that we know how it is supposed to look and how it is supposed to
behave, now we can reimplement it. My weapon of choice here will be a
WebComponent, since this is exactly the situation they were made for.

<h2 id="setup">
  <a href="#setup">
    Setup
  </a>
</h2>

I have a starter for [Fast-Element](https://www.fast.design/docs/fast-element/getting-started/)
ready to go, so I'll just use that as a base.

https://github.com/paramagicdev/fast-element-typescript-starter

<h2 id="remove-the-container">
  <a href="#remove-the-container">
    Remove the counter
  </a>
</h2>

Next step is to remove the counter that exists in the
template and make our own element.

```bash
rm -rf src/my-counter
```


<h2 id="making-the-files">
  <a href="#making-the-files">
    Making the vertical slider files
  </a>
</h2>

Let's mmake a directory called "vertical-slider" withing "src/" and then create 2 files.
`src/vertical-slider/index.ts` and `src/vertical-slider/styles.ts`

```bash
mkdir src/vertical-slider
touch src/vertical-slider/{index,style}.ts
```

<h2 id="populate-index">
  <a href="#populate-index">
    Populate index.ts
  </a>
</h2>

The next step is to create our component in
`src/vertical-slider/index.ts`

```js
// src/vertical-slider/index.ts

import { FASTElement, html, attr, customElement } from '@microsoft/fast-element'
import type { ViewTemplate } from '@microsoft/fast-element'

import { styles } from './styles'

const template: ViewTemplate = html<VerticalSlider>`
  <div class="wrapper" part="wrapper">
    <input type="range" class="slider" part="slider"
           min="${x => x.min}"
           max="${x => x.max}"
           step="${x => x.step}"
           @input="${(x,c) => x.handleInput(c.event)}"
           >
  </div>
`

@customElement({
  name: 'vertical-slider',
  template,
  styles
})
export class VerticalSlider extends FASTElement {
  @attr min = 0
  @attr value = 50
  @attr max = 100
  @attr step = 1

  handleInput (event: Event): void {
    const input = event.currentTarget as HTMLInputElement
    this.value = Number(input.value)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vertical-slider': VerticalSlider
  }
}
```

The component itself and it's logic are fairly straight
forward. We accept the same properties as a regular
`<input type="range">` element to mimic the interface.

Our `handleInput()` function is in charge of reactively
updating the value of the WebComponent so the user can
simply call `document.querySelector("vertical-slider").value`

<h2 id="basic-styling">
  <a href="#basic-styling">
    Basic Styling
  </a>
</h2>

In the `src/vertical-slider/styles.ts` we can add the
following styles:

```js
import { normalize } from '../normalize'
import { css } from '@microsoft/fast-element'

export const styles = css`
${normalize}

:host {
  display: inline-block;
  position: relative;
  --width: 16px;
  --height: 175px;
  /* Native vertical sliders have increased rightward margin. */
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
  /* width and height get swapped due to how the transform
  gets calculated, they will get reversed when turned
  vertical */
  width: var(--height);
  height: var(--width);
  left: 0;

  /* Pushes the slider slightly upward off the bottom of
  the line */
  bottom: -0.75em;

  /* Rotation -90deg makes sliding upward increase, and
  downward decrease. TranslateY centers us since we're
  absolutely positioned */
  transform: rotate(-90deg) translateY(calc(var(--width) / 2));
  transform-origin: left;
  position: absolute;
}
`
```

<h2 id="comparison">
  <a href="#comparison">
    Comparison
  </a>
</h2>

This is a good place to stop. In your `src/index.ts` make
sure to do: `export * from "./vertical-slider"`

Then, in our top level `index.html`, put the following to
allow us to compare:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <script type="module">
      import "./src"
    </script>
  </head>

  <body>
    <style>
      :root {
        --slider-width: 64px;
        --slider-height: 175px;
      }

      input[type=range][orient=vertical] {
        -webkit-appearance: slider-vertical;
      }

      vertical-slider,
      input[type=range][orient=vertical] {
        width: var(--slider-width);
        height: var(--slider-height);
      }
    </style>
    <strong>Browser Native:</strong>
    <a href="https://jsfiddle.net/m0btsq89/5/">https://jsfiddle.net/m0btsq89/5/</a>
    <br>
    above
    <br>
    before <input class="vertical-slider" type="range" orient="vertical"> after
    <br>
    below

    <br><br><br>

    <strong>Web Component based:</strong>
    <br>
    above
    <br>
    before <vertical-slider></vertical-slider> after
    <br>
    below
  </body>
</html>
```

Run `yarn start`, navigate to `localhost:8000` and you
should see something like this:

![Comparison of WebComponent to native slider](https://i.imgur.com/e5YiFpw.png)

And for a cross-browser comparison:

(left-to-right is Firefox, Chrome, Safari, Edge)

![Comparison of all browsers with WebComponent](https://i.imgur.com/yWOnpgy.png)

<h2 id="going-further">
  <a href="#going-further">
    Going further
  </a>
</h2>

Okay, this is a good start, and you could easily stop here.
The problem with stopping here is you hit 2 problems:

1. Our slider looks different in all 4 browsers (Chrome,
   FF, Edge, and Safari)
2. We do not facilitate easy customization of the slider.

Let's fix both of these problems.

<h2 id="styling-the-thumb">
  <a href="#styling-the-thumb">
    Styling the thumb
  </a>
</h2>

The first step is to facilitate easier styling of the
thumb. (The part you grab with your cursor)

In our `src/vertical-slider/styles.ts` lets start by
making some base styles:

```js
// src/vertical-slider/styles.ts
const thumbStyles = `
  cursor: pointer;
  height: var(--thumb-size);
  width: var(--thumb-size);
  border-radius: 50%;
  border: none;
  outline: 1px solid var(--thumb-outline);
  margin-top: calc((var(--thumb-size) / -2 + var(--track-width) / 2) - 1px);
  background-color: var(--thumb-color);
`

export const styles = css`
  :host {
    --thumb-border: rgb(80, 80, 80);
    --thumb-color: rgb(80, 80, 80);
    --thumb-size: 16px;

    /* Allows us to style the slider our own way */
    -webkit-appearance: none;
    /* ... */
  }
  /* ... */
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

  /* All the same stuff for IE */
  .slider::-ms-thumb {
    ${thumbStyles}
  }
`
```

Its important to note we have to seperate the browser
specific selectors due to how polyfills work. We cannot do
`.slider::ms-thumb, .slider::-moz-range-thumb`

We should now have a thumb that looks like this with no
slider.

<img alt="Comparison of thumb across browsers" src="https://i.imgur.com/XeBHReo.png"
     height="600">

<h2 id="implenting-slider">
  <a href="#implenting-slider">
    Implementing the slider
  </a>
</h2>

The next step is to implement the slider styles. We'll call
the slider where the thumb sits the "track".

In your `src/vertical-slider/styles.ts` we'll make some
base slider styles, but we'll split them up differently
since each browser implements tracks to prepare when we
have to style the upper / lower halves.

```js
// src/vertical-slider/styles.ts
const trackStyles = `
  width: var(--track-height);
  height: var(--track-width);
  background-color: var(--track-color);
  border: 1px solid var(--track-border-color);
  border-radius: var(--track-radius);
`

export const styles = css`
:host {
  --track-height: 100%;
  --track-width: 6px;
  --track-radius: 6px;
  --track-color: rgb(225, 225, 225);
  --track-border-color: rgb(105, 105, 105);
  /* ... */
}

/* ... */

.slider::-webkit-runnable-track {
  ${trackStyles}
}

.slider::-moz-range-track {
  ${trackStyles}
}
`
```

<h2 id="implementing-progress">
  <a href="#implementing-progress">
    Implementing progress
  </a>
</h2>

Now this is great, the problem is we have no way to
indicate the lower half of the slider. This is not
currently natively supported by Edge, Safari or Chrome as far as
I can tell. Mozilla does expose a "progress" pseudo
selector. So let's start with mozilla:

```js
const progressStyles = `
  width: var(--track-height);
  height: var(--track-width);
  background-color: var(--progress-color);
  border: 1px solid var(--progress-border-color);
  border-radius: var(--track-radius);
`

export const styles = css`
:host {
  --progress-color: rgb(20, 122, 255);
  --progress-border-color: rgb(20, 122, 255);
  /* ... */
}
/* ... */
.slider::-moz-range-progress {
  ${progressStyles}
}
`
```

This covers us for Firefox, but we need to target the other
3 browsers. To do so, we're going to use a linear gradient
that use the progress and track colors to simulate progress
on the track. Here's what that looks like.

```js
export const styles = css`
  /* ... */

  .volume-slider::-webkit-slider-runnable-track {
    ${trackStyles}
    background: linear-gradient(to right, var(--progress-color) 0%, var(--progress-color) var(--progress-percent), var(--track-color) var(--progress-percent), var(--track-color) 100%);
  }
`
```

You'll notice an undefined css variable in there:
`var(--progress-percent)` To fix this, we need to swap
back to our component and tell it to update this CSS
variable everytime the value changes. This workaround was
found via this post:

https://stackoverflow.com/a/60431650/15524588

Go to `src/vertical-slider/index.ts`

Here we will add the logic that will update our
`progress-percent` as the value of the slider changes.

```js
export class VerticalSlider extends FASTElement {
  // ...
  connectedCallback (): void {
    super.connectedCallback()
    const progressPercent = `${(this.value / this.max) * 100}`
    this.updateProgress(progressPercent)
  }

  valueChanged (_oldValue: number, newValue: number) {
    const progressPercent = `${(newValue / this.max) * 100}`
    this.updateProgress(progressPercent)
  }

  updateProgress(value: string) {
    this.style.setProperty('--progress-percent', value + '%')
  }
}
```

And here is the fruits of our labor! A cross-browser,
consistent vertical slider that mimics the functionality
coming to browsers _soon_ while still using a regular
`<input type="range">`.

![A cross-browser comparison of the slider](https://imgur.com/X4IuLus.png)

Now there are some additional things we can think of like
disabling the slider, what it may look like when disabled,
tooltips, and a wide array of other things you can find
present in something like
[Shoelace's Range Component](https://github.com/shoelace-style/shoelace/blob/next/src/components/range/range.ts)
as well as A11y issues around labelling but that is far beyond the scope of this tutorial.
Some options for A11y include providing an aria-label on
the base component, wrapping the component in a label, or
providing a label slot or aria-label attribute on the web
component.
