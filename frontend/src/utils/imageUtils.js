/**
 * Compress an image using Canvas API before upload
 * @param {File} file - The original image file
 * @param {number} maxWidth - Maximum width (default 1920)
 * @param {number} quality - JPEG quality 0-1 (default 0.8)
 * @returns {Promise<File>} Compressed image file
 */
export const compressImage = (file, maxWidth = 1920, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Calculate new dimensions
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas toBlob failed'))
              return
            }
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          },
          'image/jpeg',
          quality
        )
      }
      img.onerror = reject
      img.src = event.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Create a thumbnail
 */
export const createThumbnail = (file, size = 300) => {
  return compressImage(file, size, 0.7)
}

/**
 * Validate image file type
 */
export const isValidImage = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic']
  return validTypes.includes(file.type.toLowerCase())
}

/**
 * Get image dimensions
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => resolve({ width: img.width, height: img.height })
      img.onerror = reject
      img.src = event.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
