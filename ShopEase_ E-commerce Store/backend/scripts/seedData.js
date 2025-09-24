// backend/scripts/seedData.js
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/database');

// Enhanced product data with better, more reliable images
const sampleProducts = [
  // Electronics (8 products)
  {
    name: "iPhone 14 Pro",
    description: "Latest iPhone with A16 Bionic chip and Pro camera system",
    price: 999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center",
    stock: 50,
    rating: 4.8,
    reviews: []
  },
  {
    name: "MacBook Air M2",
    description: "Supercharged by M2 chip for incredible performance",
    price: 1299,
    category: "Electronics", 
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop&crop=center",
    stock: 30,
    rating: 4.9,
    reviews: []
  },
  {
    name: "Samsung 4K Smart TV",
    description: "55-inch 4K UHD Smart TV with HDR support",
    price: 699,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop&crop=center",
    stock: 25,
    rating: 4.6,
    reviews: []
  },
  {
    name: "Wireless Headphones",
    description: "Noise-canceling wireless headphones with 30-hour battery",
    price: 199,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&crop=center",
    stock: 75,
    rating: 4.7,
    reviews: []
  },
  {
    name: "iPad Pro 12.9",
    description: "Most advanced iPad with M2 chip and Liquid Retina display",
    price: 1099,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&crop=center",
    stock: 40,
    rating: 4.8,
    reviews: []
  },
  {
    name: "Gaming Laptop",
    description: "High-performance gaming laptop with RTX 4060 and Intel i7",
    price: 1499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop&crop=center",
    stock: 20,
    rating: 4.5,
    reviews: []
  },
  {
    name: "Smartphone Camera Lens Kit",
    description: "Professional camera lens kit for smartphones with macro and wide-angle",
    price: 89,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1606983340081-d527e4feea10?w=500&h=500&fit=crop&crop=center",
    stock: 60,
    rating: 4.3,
    reviews: []
  },
  {
    name: "Wireless Charging Pad",
    description: "Fast wireless charging pad compatible with all Qi devices",
    price: 39,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop&crop=center",
    stock: 100,
    rating: 4.4,
    reviews: []
  },

  // Clothing (6 products)
  {
    name: "Leather Jacket",
    description: "Premium genuine leather jacket for stylish look",
    price: 299,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop&crop=center",
    stock: 40,
    rating: 4.4,
    reviews: []
  },
  {
    name: "Designer Jeans",
    description: "High-quality denim jeans with perfect fit and comfort",
    price: 129,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop&crop=center",
    stock: 80,
    rating: 4.2,
    reviews: []
  },
  {
    name: "Casual T-Shirt",
    description: "100% cotton comfortable t-shirt for everyday wear",
    price: 29,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop&crop=center",
    stock: 150,
    rating: 4.1,
    reviews: []
  },
  {
    name: "Winter Coat",
    description: "Warm and stylish winter coat with water-resistant fabric",
    price: 199,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=500&h=500&fit=crop&crop=center",
    stock: 35,
    rating: 4.6,
    reviews: []
  },
  {
    name: "Running Shoes",
    description: "Lightweight running shoes with superior cushioning",
    price: 149,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop&crop=center",
    stock: 70,
    rating: 4.5,
    reviews: []
  },
  {
    name: "Formal Dress Shirt",
    description: "Classic formal dress shirt perfect for business occasions",
    price: 79,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&h=500&fit=crop&crop=center",
    stock: 60,
    rating: 4.3,
    reviews: []
  },

  // Books (5 products)
  {
    name: "Coffee Table Book",
    description: "Beautiful photography coffee table book",
    price: 45,
    category: "Books",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop&crop=center",
    stock: 60,
    rating: 4.3,
    reviews: []
  },
  {
    name: "Programming Guide",
    description: "Comprehensive guide to modern web development",
    price: 59,
    category: "Books",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&h=500&fit=crop&crop=center",
    stock: 45,
    rating: 4.7,
    reviews: []
  },
  {
    name: "Cookbook Collection",
    description: "International cuisine cookbook with 500+ recipes",
    price: 39,
    category: "Books",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop&crop=center",
    stock: 55,
    rating: 4.4,
    reviews: []
  },
  {
    name: "Science Fiction Novel",
    description: "Award-winning science fiction novel by bestselling author",
    price: 24,
    category: "Books",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop&crop=center",
    stock: 80,
    rating: 4.6,
    reviews: []
  },
  {
    name: "Self-Help Guide",
    description: "Personal development and productivity improvement guide",
    price: 34,
    category: "Books",
    image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&h=500&fit=crop&crop=center",
    stock: 65,
    rating: 4.2,
    reviews: []
  },

  // Home & Garden (6 products)
  {
    name: "Kitchen Blender",
    description: "High-speed blender for smoothies and food prep",
    price: 129,
    category: "Home & Garden",
    image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&h=500&fit=crop&crop=center",
    stock: 45,
    rating: 4.4,
    reviews: []
  },
  {
    name: "Indoor Plant Set",
    description: "Set of 3 low-maintenance indoor plants with decorative pots",
    price: 89,
    category: "Home & Garden",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=500&fit=crop&crop=center",
    stock: 30,
    rating: 4.5,
    reviews: []
  },
  {
    name: "Coffee Maker",
    description: "Programmable drip coffee maker with thermal carafe",
    price: 159,
    category: "Home & Garden",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop&crop=center",
    stock: 25,
    rating: 4.6,
    reviews: []
  },
  {
    name: "Decorative Lamp",
    description: "Modern table lamp with adjustable brightness",
    price: 79,
    category: "Home & Garden",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop&crop=center",
    stock: 50,
    rating: 4.3,
    reviews: []
  },
  {
    name: "Garden Tool Set",
    description: "Complete gardening tool set with carrying case",
    price: 119,
    category: "Home & Garden",
    image: "https://images.unsplash.com/photo-1416879595895-c2c136f2a36b?w=500&h=500&fit=crop&crop=center",
    stock: 40,
    rating: 4.4,
    reviews: []
  },
  {
    name: "Throw Pillows Set",
    description: "Set of 4 decorative throw pillows in various colors",
    price: 69,
    category: "Home & Garden",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop&crop=center",
    stock: 75,
    rating: 4.2,
    reviews: []
  },

  // Sports (5 products)
  {
    name: "Yoga Mat",
    description: "Non-slip yoga mat perfect for home workouts",
    price: 35,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop&crop=center",
    stock: 90,
    rating: 4.5,
    reviews: []
  },
  {
    name: "Dumbbell Set",
    description: "Adjustable dumbbell set for strength training",
    price: 199,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop&crop=center",
    stock: 25,
    rating: 4.7,
    reviews: []
  },
  {
    name: "Basketball",
    description: "Official size basketball for indoor and outdoor play",
    price: 49,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&h=500&fit=crop&crop=center",
    stock: 60,
    rating: 4.3,
    reviews: []
  },
  {
    name: "Tennis Racket",
    description: "Professional tennis racket with premium grip",
    price: 149,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500&h=500&fit=crop&crop=center",
    stock: 35,
    rating: 4.6,
    reviews: []
  },
  {
    name: "Fitness Tracker",
    description: "Waterproof fitness tracker with heart rate monitoring",
    price: 99,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1557935728-e6d1eaabe5fa?w=500&h=500&fit=crop&crop=center",
    stock: 80,
    rating: 4.4,
    reviews: []
  },

  // Beauty (4 products)
  {
    name: "Skincare Set",
    description: "Complete skincare routine set with cleanser, serum, and moisturizer",
    price: 89,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop&crop=center",
    stock: 40,
    rating: 4.5,
    reviews: []
  },
  {
    name: "Makeup Brush Set",
    description: "Professional makeup brush set with 12 brushes and case",
    price: 59,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop&crop=center",
    stock: 50,
    rating: 4.3,
    reviews: []
  },
  {
    name: "Hair Dryer",
    description: "Professional salon-grade hair dryer with ionic technology",
    price: 149,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500&h=500&fit=crop&crop=center",
    stock: 30,
    rating: 4.6,
    reviews: []
  },
  {
    name: "Perfume Collection",
    description: "Set of 3 premium fragrances in travel-size bottles",
    price: 119,
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=500&fit=crop&crop=center",
    stock: 25,
    rating: 4.4,
    reviews: []
  },

  // Toys (4 products)
  {
    name: "Building Blocks Set",
    description: "Creative building blocks set with 500+ pieces",
    price: 79,
    category: "Toys",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&crop=center",
    stock: 60,
    rating: 4.7,
    reviews: []
  },
  {
    name: "Remote Control Car",
    description: "High-speed remote control car for kids and adults",
    price: 129,
    category: "Toys",
    image: "https://images.unsplash.com/photo-1607734834515-c07d1f50b7df?w=500&h=500&fit=crop&crop=center",
    stock: 45,
    rating: 4.5,
    reviews: []
  },
  {
    name: "Educational Tablet",
    description: "Kid-friendly educational tablet with learning games and parental controls",
    price: 199,
    category: "Toys",
    image: "https://images.unsplash.com/photo-1606791422814-b32c705e3e12?w=500&h=500&fit=crop&crop=center",
    stock: 35,
    rating: 4.6,
    reviews: []
  },
  {
    name: "Board Game Collection",
    description: "Classic family board game collection for all ages",
    price: 59,
    category: "Toys",
    image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=500&h=500&fit=crop&crop=center",
    stock: 70,
    rating: 4.4,
    reviews: []
  },

  // Automotive (4 products)
  {
    name: "Car Phone Mount",
    description: "Magnetic car phone mount with 360-degree rotation",
    price: 29,
    category: "Automotive",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&h=500&fit=crop&crop=center",
    stock: 100,
    rating: 4.3,
    reviews: []
  },
  {
    name: "Dash Camera",
    description: "HD dash camera with night vision and loop recording",
    price: 149,
    category: "Automotive",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=500&h=500&fit=crop&crop=center",
    stock: 40,
    rating: 4.5,
    reviews: []
  },
  {
    name: "Car Air Freshener Set",
    description: "Premium car air freshener set with 6 different scents",
    price: 24,
    category: "Automotive",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop&crop=center",
    stock: 120,
    rating: 4.1,
    reviews: []
  },
  {
    name: "Jump Starter Kit",
    description: "Portable car jump starter with USB charging ports",
    price: 89,
    category: "Automotive",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=500&fit=crop&crop=center",
    stock: 30,
    rating: 4.7,
    reviews: []
  },

  // Other (4 products)
  {
    name: "Gaming Chair",
    description: "Ergonomic gaming chair with lumbar support",
    price: 249,
    category: "Other",
    image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500&h=500&fit=crop&crop=center",
    stock: 20,
    rating: 4.6,
    reviews: []
  },
  {
    name: "Desk Organizer",
    description: "Bamboo desk organizer with multiple compartments",
    price: 39,
    category: "Other",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=500&fit=crop&crop=center",
    stock: 85,
    rating: 4.2,
    reviews: []
  },
  {
    name: "Portable Speaker",
    description: "Waterproof Bluetooth speaker with 12-hour battery life",
    price: 79,
    category: "Other",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop&crop=center",
    stock: 60,
    rating: 4.4,
    reviews: []
  },
  {
    name: "Travel Backpack",
    description: "Durable travel backpack with laptop compartment and USB port",
    price: 89,
    category: "Other",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop&crop=center",
    stock: 55,
    rating: 4.5,
    reviews: []
  }
];

// Category images for the frontend
const categoryImages = {
  "Electronics": "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=300&h=200&fit=crop",
  "Clothing": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop",
  "Books": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop",
  "Home & Garden": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop",
  "Sports": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
  "Beauty": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop",
  "Toys": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
  "Automotive": "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=300&h=200&fit=crop",
  "Other": "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop"
};

const seedProducts = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert sample products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Added ${createdProducts.length} sample products`);
    
    // Show breakdown by category
    const categoryCount = {};
    sampleProducts.forEach(product => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });
    
    console.log('\nProducts by category:');
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`${category}: ${count} products`);
    });
    
    console.log('\nCategory Images Available:');
    Object.entries(categoryImages).forEach(([category, imageUrl]) => {
      console.log(`${category}: ${imageUrl}`);
    });
    
    console.log('\nDatabase seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Export category images for use in frontend
module.exports = { seedProducts, categoryImages };

// Run seeding if this file is executed directly
if (require.main === module) {
  seedProducts();
}