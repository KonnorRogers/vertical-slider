import { fixture, assert } from '@open-wc/testing'

import { VerticalSlider } from '../src/vertical-slider'

const tag = new VerticalSlider().tagName

describe('VerticalSlider', () => {
  it('Should render without error', async () => {
    const el = await fixture<VerticalSlider>(`<${tag}></${tag}>`)
    assert.equal(el.value, 50)
    // await assert.isAccessible(el)
  })
})
