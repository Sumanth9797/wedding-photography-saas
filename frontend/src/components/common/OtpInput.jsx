import { useRef, useState, useEffect } from 'react'
import { clsx } from 'clsx'

export default function OtpInput({
  length = 6,
  value = '',
  onChange,
  error = false,
  autoFocus = true,
}) {
  const inputsRef = useRef([])
  const [digits, setDigits] = useState(Array(length).fill(''))

  useEffect(() => {
    if (value) {
      const arr = value.split('').slice(0, length)
      while (arr.length < length) arr.push('')
      setDigits(arr)
    }
  }, [value, length])

  const updateDigits = (newDigits) => {
    setDigits(newDigits)
    onChange(newDigits.join(''))
  }

  const handleChange = (index, e) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1)
    const newDigits = [...digits]
    newDigits[index] = val
    updateDigits(newDigits)
    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        const newDigits = [...digits]
        newDigits[index - 1] = ''
        updateDigits(newDigits)
        inputsRef.current[index - 1]?.focus()
      } else {
        const newDigits = [...digits]
        newDigits[index] = ''
        updateDigits(newDigits)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    const newDigits = Array(length).fill('')
    pasted.split('').forEach((char, i) => { newDigits[i] = char })
    updateDigits(newDigits)
    const focusIdx = Math.min(pasted.length, length - 1)
    inputsRef.current[focusIdx]?.focus()
  }

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          autoFocus={autoFocus && index === 0}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={clsx(
            'w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all duration-200',
            'focus:border-primary-500 focus:ring-2 focus:ring-primary-200',
            error
              ? 'border-red-400 bg-red-50 text-red-600'
              : digit
              ? 'border-primary-400 bg-primary-50 text-primary-700'
              : 'border-gray-200 bg-white text-gray-900'
          )}
        />
      ))}
    </div>
  )
}
