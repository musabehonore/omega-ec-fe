export interface BestDealsInterface {
  title: string;
  description: string;
  image: string;
  category: string;
  url: string;
}

export interface FeaturedInterface {
  title: string;
  description: string;
  image: string;
  category: string;
  url: string;
}

export const FeaturedProducts: FeaturedInterface[] = [
  {
    title: 'Drive in Style',
    description:
      'Explore our diverse selection of high-quality cars, from luxurious sedans to powerful SUVs, designed to meet every lifestyle and budget. Discover the perfect ride with advanced features and exceptional performance.',
    image:
      'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1719906770/trim-2024-crown-platinum_uqcbta.png',
    category: 'cars',
    url: '/products'
  },
  {
    title: 'Unleash the Thrill',
    description: `Rev up your ride with our range of motorcycles, featuring top brands and models for every type of rider. Whether you're a cruiser, sportbike enthusiast, or off-road adventurer, we have the perfect bike for you.`,
    image:
      'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1720165013/Motor-Bike-No-Background_faorma.png',
    category: 'motorcycles',
    url: '/products'
  },
  {
    title: 'Power Up Your Life',
    description:
      'Upgrade your tech with our collection of cutting-edge computers. From high-performance desktops to sleek laptops, find the perfect device to boost your productivity, gaming experience, and creative projects.',
    image:
      'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1720165332/os_x_mountain_lion_macs_16x9_2-removebg-preview_f7qtoe.png',
    category: 'computers',
    url: '/products'
  },
  {
    title: 'Stay Connected in Style',
    description:
      'Stay connected with our latest smartphones, featuring the newest technology and sleek designs. Whether you need a phone for business, photography, or everyday use, we have the ideal model for you.',
    image:
      'https://res.cloudinary.com/dn8vyfgnl/image/upload/v1720165511/lovepik-smartphone-model-png-image_401660433_wh1200-removebg-preview_ae1db4.png',
    category: 'phones',
    url: '/products'
  }
];
