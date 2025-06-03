import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

// Helper function to upload image to Cloudinary
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'barcha_preset') // You'll need to create this in Cloudinary dashboard
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )
    
    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error('Failed to upload image')
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
  
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    quality,
    format,
    fetch_format: 'auto',
    dpr: 'auto',
  })
}