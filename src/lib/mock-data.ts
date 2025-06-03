
export const mockFoodItems = [
  {
    id: '1',
    title: 'Fresh Baguettes',
    description: 'Day-old baguettes from our bakery, still fresh and perfect for sharing',
    foodType: 'bread',
    quantity: '5 pieces',
    imageUrl: '/api/placeholder/400/300',
    location: 'Tunis Centre',
    expiryDate: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
    pickupInstructions: 'Ring the bell at the side entrance',
    donorName: 'Ahmed Ben Ali',
    donorContact: '+216 20 123 456',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isAvailable: true
  },
  {
    id: '2',
    title: 'Homemade Couscous',
    description: 'Traditional Tunisian couscous with vegetables, enough for 4 people',
    foodType: 'cooked-meals',
    quantity: '1 large pot',
    imageUrl: '/api/placeholder/400/300',
    location: 'Sfax',
    expiryDate: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    pickupInstructions: 'Available after 6 PM',
    donorName: 'Fatma Mahmoud',
    donorContact: '+216 25 654 321',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isAvailable: true
  },
  {
    id: '3',
    title: 'Mixed Seasonal Fruits',
    description: 'Fresh oranges, apples, and pears from our fruit shop',
    foodType: 'fruits',
    quantity: '2 kg',
    imageUrl: '/api/placeholder/400/300',
    location: 'Sousse',
    expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    pickupInstructions: 'Shop closes at 8 PM',
    donorName: 'Mohamed Trabelsi',
    donorContact: '+216 22 987 654',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    isAvailable: true
  }
]

export const mockUsers = [
  {
    id: '1',
    email: 'ahmed@example.com',
    name: 'Ahmed Ben Ali',
    whatsappNumber: '+216 20 123 456',
    totalDonations: 15,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    email: 'fatma@example.com',
    name: 'Fatma Mahmoud',
    whatsappNumber: '+216 25 654 321',
    totalDonations: 8,
    createdAt: new Date('2024-02-20')
  },
  {
    id: '3',
    email: 'mohamed@example.com',
    name: 'Mohamed Trabelsi',
    whatsappNumber: '+216 22 987 654',
    totalDonations: 12,
    createdAt: new Date('2024-01-30')
  }
]
