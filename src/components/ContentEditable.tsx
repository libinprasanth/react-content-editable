import * as React from 'react'

export type ContentEditableProps = {
  html: string
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
  innerRef?: React.LegacyRef<HTMLDivElement> | React.RefObject<HTMLDivElement> | string | null
  onChange: any
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
  const [content, setContent] = React.useState(html)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const ref = typeof innerRef === 'string' ? undefined : (innerRef as React.RefObject<HTMLDivElement>) || contentRef

  const normalizeHtml = (str: string) => {
    return str && str.replace(/&nbsp;|\u202F|\u00A0/g, ' ').replace(/<br \/>/g, '<br>')
  }

  React.useEffect(() => {
    const currentHtml = ref && ref?.current?.innerHTML
    if (normalizeHtml(html) != normalizeHtml(currentHtml || '')) {
      setContent(html)
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
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}

export { ContentEditable }
