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

