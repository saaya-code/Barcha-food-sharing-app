// Note: Cloudinary v2 SDK is for server-side only
// For client-side uploads, we use the REST API directly

// Helper function to upload image to Cloudinary via our API
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  // Check if Cloudinary is configured
  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    console.warn('Cloudinary not configured, returning mock URL')
    return `https://via.placeholder.com/400x300?text=${encodeURIComponent(file.name)}`
  }

  const formData = new FormData()
  formData.append('file', file)
  
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Upload failed')
    }
    
    return data.url
  } catch (error) {
    console.error('Error uploading image:', error)
    // Return placeholder image as fallback
    return `https://via.placeholder.com/400x300?text=${encodeURIComponent(file.name)}`
  }
}

// Helper function to generate optimized image URL
export const getOptimizedImageUrl = (publicId: string, options: {
  width?: number
  height?: number
  quality?: string
  format?: string
} = {}) => {
  const { width = 400, height = 300, quality = 'auto', format = 'auto' } = options
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  
  if (!cloudName) {
    return publicId // Return original URL if Cloudinary not configured
  }
  
  // Build transformation string
  const transformations = [
    `w_${width}`,
    `h_${height}`,
    'c_fill',
    `q_${quality}`,
    `f_${format}`,
    'dpr_auto'
  ].join(',')
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`
}