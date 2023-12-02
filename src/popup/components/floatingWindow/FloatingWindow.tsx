import { type PropsWithChildren, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import useResizeObserver from 'use-resize-observer'

import Backdrop from '../Backdrop/index.js'
import useGlobalBodySize from './useGlobalBodySize.js'

type Props = Readonly<
  PropsWithChildren<{
    positionLeft: number
    positionTop: number
    onClose: () => void
  }>
>
export default function FloatingWindow({
  children,
  positionLeft,
  positionTop,
  onClose,
}: Props) {
  const { insertBodySize } = useGlobalBodySize()

  const [windowSize, setWindowSize] = useState<
    Readonly<{
      height: number | undefined
      width: number | undefined
    }>
  >()
  const { ref } = useResizeObserver({
    onResize: setWindowSize,
    round: Math.ceil,
  })

  const [calibratedPosition, setCalibratedPosition] = useState<
    Readonly<{
      left: number
      top: number
    }>
  >()

  // make sure the floating window is within the body
  useLayoutEffect(() => {
    if (windowSize?.height === undefined || windowSize?.width === undefined) {
      return
    }

    const currentBodyHeight = document.body.scrollHeight
    const updatedBodyHeight =
      windowSize.height > currentBodyHeight ? windowSize.height : undefined

    const currentBodyWidth = document.body.offsetWidth
    const updatedBodyWidth =
      windowSize.width > currentBodyWidth ? windowSize.width : undefined

    setCalibratedPosition({
      left: Math.min(
        positionLeft,
        (updatedBodyWidth ?? currentBodyWidth) - windowSize.width,
      ),
      top: Math.min(
        positionTop,
        (updatedBodyHeight ?? currentBodyHeight) - windowSize.height,
      ),
    })

    const { removeBodySize } = insertBodySize({
      height: updatedBodyHeight,
      width: updatedBodyWidth,
    })
    return () => {
      removeBodySize()
    }
  }, [
    insertBodySize,
    positionLeft,
    positionTop,
    windowSize?.height,
    windowSize?.width,
  ])

  return createPortal(
    <>
      <Backdrop opacity={0.3} onClick={onClose} />
      <div
        ref={ref}
        aria-modal
        role='dialog'
        style={{
          position: 'absolute',
          ...(calibratedPosition
            ? {
                left: `${calibratedPosition.left}px`,
                top: `${calibratedPosition.top}px`,
              }
            : {
                // to avoid content jumping: hidden first to calculate the dimensions, then calibrate the position
                visibility: 'hidden',
              }),
        }}
      >
        {children}
      </div>
    </>,
    document.body,
  )
}
