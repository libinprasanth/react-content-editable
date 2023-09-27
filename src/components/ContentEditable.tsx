import * as React from 'react'

export type ContentEditableProps = {
  html: string
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
  innerRef?: React.LegacyRef<HTMLDivElement> | React.RefObject<HTMLDivElement> | string | null
  onChange: Function
}

/**
 * ContentEditable Component
 * @param html - html content
 * @param onChange - return the updated html content
 * @returns
 */
const ContentEditable = ({
  html,
  disabled = false,
  className = '',
  style = { height: 200 },
  innerRef,
  onChange,
}: ContentEditableProps) => {
  const contentRef = React.useRef<HTMLDivElement>(null)
  const ref = typeof innerRef === 'string' ? undefined : (innerRef as React.RefObject<HTMLDivElement>) || contentRef

  React.useEffect(() => {
    // Save the selection before re-render
    const selection = window.getSelection()
    if (selection) {
      const range = selection.getRangeAt(0)
      const startOffset = range.startOffset

      // Restore the selection after re-render
      if (ref && ref.current && ref.current.textContent && startOffset <= ref.current.textContent.length) {
        const newRange = document.createRange()
        newRange.setStart(ref.current.firstChild || ref.current, startOffset)
        newRange.collapse(true)
        selection.removeAllRanges()
        selection.addRange(newRange)
      }
    }
  }, [html])

  const emitChange = (event: React.SyntheticEvent<any>) => {
    const newHtml = event.currentTarget.innerHTML
    if (html !== newHtml) {
      onChange(newHtml)
    }
  }

  return (
    <div
      className={className}
      style={style}
      ref={ref}
      onInput={emitChange}
      onBlur={emitChange}
      onKeyUp={emitChange}
      onKeyDown={emitChange}
      contentEditable={!disabled}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export { ContentEditable }
