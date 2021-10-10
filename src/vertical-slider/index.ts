import { FASTElement, html, attr, customElement } from '@microsoft/fast-element'
import type { ViewTemplate } from '@microsoft/fast-element'

import { styles } from './styles'

const template: ViewTemplate = html<VerticalSlider>`
  <div class="wrapper" part="wrapper">
    <input type="range" class="slider" part="slider"
           min="${x => x.min}"
           max="${x => x.max}"
           step="${x => x.step}"
           @input="${(x, c) => x.handleInput(c.event)}"
           >
  </div>
`

@customElement({
  name: 'vertical-slider',
  template,
  styles
})
export class VerticalSlider extends FASTElement {
  @attr min: number = 0
  @attr value: number = 50
  @attr max: number = 100
  @attr step: number = 1

  connectedCallback (): void {
    super.connectedCallback()
    const progressPercent = `${(this.value / this.max) * 100}`
    this.updateProgress(progressPercent)
  }

  handleInput (event: Event): void {
    const input = event.currentTarget as HTMLInputElement
    this.value = Number(input.value)
  }

  valueChanged (_oldValue: number, newValue: number): void {
    const progressPercent = `${(newValue / this.max) * 100}`
    this.updateProgress(progressPercent)
  }

  updateProgress (value: string): void {
    this.style.setProperty('--progress-percent', value + '%')
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vertical-slider': VerticalSlider
  }
}
