import { useRef } from 'react'

export default function OtpInput({ length = 6, value, onChange }) {
  const inputs = useRef([])

  const handleChange = (index, e) => {
    const val = e.target.value.replace(/\D/g, '')
    if (!val) return

    const newValue = value.split('')
    newValue[index] = val[val.length - 1]
    const joined = newValue.join('')
    onChange(joined)

    if (val && index < length - 1) {
      inputs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      const newValue = value.split('')
      newValue[index] = ''
      onChange(newValue.join(''))
      if (index > 0) inputs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(pasted.padEnd(length, '').slice(0, length))
    inputs.current[Math.min(pasted.length, length - 1)]?.focus()
    e.preventDefault()
  }

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl
                     focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-200
                     text-primary transition-all"
        />
      ))}
    </div>
  )
}
