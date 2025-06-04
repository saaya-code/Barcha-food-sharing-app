
export const mockFoodItems = [
  {
    id: '1',
    title: 'Fresh Baguettes',
    description: 'Day-old baguettes from our bakery, still fresh and perfect for sharing',
    foodType: 'bread',
    quantity: '5 pieces',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/20/01_Baguettes_de_pain.jpg',
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
    imageUrl: 'https://hips.hearstapps.com/hmg-prod/images/best-couscous-recipes-israeli-couscous-crispy-garlic-1651512969.jpeg?crop=1.00xw:0.834xh;0,0.166xh&resize=980:*',
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
    imageUrl: 'https://media.istockphoto.com/id/173255460/photo/assortment-of-fruits.jpg?s=612x612&w=0&k=20&c=9FCZJRCXbLH7KGVixrpQxl3GVGXepb2pXqkz-MkzDQM=',
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
