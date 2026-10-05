import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Avatar, AvatarFallback, AvatarImage } from '../src/components/Avatar'

class ControlledImage {
  complete = false
  naturalWidth = 0
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  private currentSrc = ''

  get src() {
    return this.currentSrc
  }

  set src(value: string) {
    this.currentSrc = value
  }

  load() {
    this.complete = true
    this.naturalWidth = 64
    this.onload?.()
  }

  fail() {
    this.complete = true
    this.onerror?.()
  }
}

function mockImageLoading() {
  const images: ControlledImage[] = []

  class MockImage extends ControlledImage {
    constructor() {
      super()
      images.push(this)
    }
  }

  vi.stubGlobal('Image', MockImage)

  return {
    getRequest(src: string) {
      const image = images.find((candidate) => candidate.src === src)
      if (!image) throw new Error(`No image request found for ${src}`)
      return image
    },
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('Avatar', () => {
  it('shows the fallback with no source and while a source is loading or errors', async () => {
    const { unmount } = render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    )

    expect(screen.getByText('AB')).toBeInTheDocument()
    unmount()

    const imageLoading = mockImageLoading()
    render(
      <Avatar className={(state) => `avatar-${state.imageLoadingStatus}`}>
        <AvatarImage src="/alex.png" alt="Alex Brown" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    )

    const root = screen.getByText('AB').parentElement
    expect(root).toHaveClass('avatar-loading')
    expect(screen.getByText('AB')).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: 'Alex Brown' })).not.toBeInTheDocument()

    await waitFor(() => expect(imageLoading.getRequest('/alex.png')).toBeDefined())
    act(() => imageLoading.getRequest('/alex.png').fail())

    expect(screen.getByText('AB')).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: 'Alex Brown' })).not.toBeInTheDocument()
  })

  it('replaces the fallback after the image loads', async () => {
    const imageLoading = mockImageLoading()
    const imageRef = createRef<HTMLImageElement>()
    const onLoad = vi.fn()

    render(
      <Avatar>
        <AvatarImage
          ref={imageRef}
          src="/alex.png"
          alt="Alex Brown"
          data-image-id="profile-photo"
          onLoad={onLoad}
        />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    )

    await waitFor(() => expect(imageLoading.getRequest('/alex.png')).toBeDefined())
    act(() => imageLoading.getRequest('/alex.png').load())

    const image = await screen.findByRole('img', { name: 'Alex Brown' })
    expect(image).toHaveAttribute('data-image-id', 'profile-photo')
    expect(imageRef.current).toBe(image)
    expect(screen.queryByText('AB')).not.toBeInTheDocument()

    fireEvent.load(image)
    expect(onLoad).toHaveBeenCalledOnce()
  })

  it('forwards refs, native attributes, and event handlers', () => {
    const rootRef = createRef<HTMLSpanElement>()
    const fallbackRef = createRef<HTMLSpanElement>()
    const onClick = vi.fn()

    render(
      <Avatar ref={rootRef} data-owner="mail-view" onClick={onClick}>
        <AvatarFallback ref={fallbackRef} data-fallback="initials">
          AB
        </AvatarFallback>
      </Avatar>,
    )

    const fallback = screen.getByText('AB')
    expect(rootRef.current).toBe(fallback.parentElement)
    expect(fallbackRef.current).toBe(fallback)
    expect(rootRef.current).toHaveAttribute('data-owner', 'mail-view')
    expect(fallbackRef.current).toHaveAttribute('data-fallback', 'initials')

    fireEvent.click(fallback)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('preserves Base UI render composition', () => {
    render(
      <Avatar render={<button type="button" data-composed="avatar" />}>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    )

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('data-composed', 'avatar')
    expect(button).toHaveTextContent('AB')
  })
})
