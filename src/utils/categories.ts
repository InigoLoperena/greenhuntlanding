export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'home-furniture',
    name: 'Home & Furniture',
    subcategories: [
      { id: 'furniture', name: 'Furniture' },
      { id: 'decoration', name: 'Decoration' },
      { id: 'kitchenware', name: 'Kitchenware' },
      { id: 'textiles', name: 'Textiles' },
      { id: 'storage-organization', name: 'Storage & Organization' }
    ]
  },
  {
    id: 'fashion-accessories',
    name: 'Fashion & Accessories',
    subcategories: [
      { id: 'clothing', name: 'Clothing' },
      { id: 'shoes', name: 'Shoes' },
      { id: 'bags-backpacks', name: 'Bags & Backpacks' },
      { id: 'jewelry-costume', name: 'Jewelry & Costume Jewelry' },
      { id: 'accessories', name: 'Accessories' }
    ]
  },
  {
    id: 'electronics-technology',
    name: 'Electronics & Technology',
    subcategories: [
      { id: 'phones-accessories', name: 'Phones & Accessories' },
      { id: 'computers-peripherals', name: 'Computers & Peripherals' },
      { id: 'tablets-ereaders', name: 'Tablets & eReaders' },
      { id: 'audio-video', name: 'Audio & Video' },
      { id: 'consoles-videogames', name: 'Consoles & Video Games' },
      { id: 'small-appliances', name: 'Small Appliances' }
    ]
  },
  {
    id: 'sports',
    name: 'Sports',
    subcategories: [
      { id: 'bicycles', name: 'Bicycles' },
      { id: 'accessories', name: 'Accessories' },
      { id: 'parts-spares', name: 'Parts & Spares' },
      { id: 'others', name: 'Others' }
    ]
  },
  {
    id: 'tools-gardening',
    name: 'Tools & Gardening',
    subcategories: [
      { id: 'hand-power-tools', name: 'Hand & Power Tools' },
      { id: 'diy-materials', name: 'DIY Materials' },
      { id: 'garden-outdoor', name: 'Garden & Outdoor' },
      { id: 'plants-seeds', name: 'Plants & Seeds' }
    ]
  }
];

export const getCategoryById = (id: string): Category | undefined => {
  return CATEGORIES.find(category => category.id === id);
};

export const getSubcategoryById = (categoryId: string, subcategoryId: string): Subcategory | undefined => {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find(subcategory => subcategory.id === subcategoryId);
};

export const getCategoryName = (categoryId: string): string => {
  const category = getCategoryById(categoryId);
  return category?.name || 'Unknown Category';
};

export const getSubcategoryName = (categoryId: string, subcategoryId: string): string => {
  const subcategory = getSubcategoryById(categoryId, subcategoryId);
  return subcategory?.name || 'Unknown Subcategory';
};