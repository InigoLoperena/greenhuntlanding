import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Camera, Upload, X, Image, ImagePlus, Tag } from 'lucide-react';
import { useCamera, PhotoWithLocation } from '@/hooks/useCamera';
import { toast } from 'sonner';
import { CATEGORIES, getCategoryById } from '@/utils/categories';

export interface Product {
  id?: string;
  title: string;
  description?: string;
  type: 'product' | 'donation';
  price_credits?: number;
  image_url: string;
  latitude: number;
  longitude: number;
  market_id?: string;
  user_id: string;
  is_sold?: boolean;
  category?: string;
  subcategory?: string;
}

interface ProductFormProps {
  product?: Product;
  marketId: string;
  onSubmit: (productData: Omit<Product, 'id' | 'user_id'>) => Promise<void>;
  onCancel: () => void;
}

export const ProductForm = ({ product, marketId, onSubmit, onCancel }: ProductFormProps) => {
  const [title, setTitle] = useState(product?.title || '');
  const [description, setDescription] = useState(product?.description || '');
  const [type, setType] = useState<'product' | 'donation'>(product?.type || 'product');
  const [priceCredits, setPriceCredits] = useState(product?.price_credits?.toString() || '');
  const [category, setCategory] = useState(product?.category || '');
  const [subcategory, setSubcategory] = useState(product?.subcategory || '');
  const [photo, setPhoto] = useState<PhotoWithLocation | null>(
    product ? {
      image: product.image_url,
      latitude: product.latitude,
      longitude: product.longitude
    } : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  
  const cameraHook = useCamera();
  const capturePhotoWithLocation = cameraHook.capturePhotoWithLocation;
  const selectFromGallery = (cameraHook as any).selectFromGallery;
  const isCameraLoading = cameraHook.isLoading;

  const handleCapturePhoto = async () => {
    const photoData = await capturePhotoWithLocation();
    if (photoData) {
      setPhoto(photoData);
      setShowImageOptions(false);
      toast.success('Foto capturada!');
    }
  };

  const handleSelectFromGallery = async () => {
    const photoData = await selectFromGallery();
    if (photoData) {
      setPhoto(photoData);
      setShowImageOptions(false);
      toast.success('Imagen seleccionada!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced input validation
    const sanitizedTitle = title.trim();
    const sanitizedDescription = description.trim();
    
    // Title is optional; basic validation applies only if provided
    if (sanitizedTitle.length > 100) {
      toast.error('El título no puede exceder 100 caracteres');
      return;
    }
    
    // Enhanced character filtering - allow letters, numbers, spaces, basic punctuation, and accented characters
    if (!/^[a-zA-Z0-9\s\-_,.!?\u00C0-\u017F\u1E00-\u1EFF]+$/.test(sanitizedTitle)) {
      toast.error('El título contiene caracteres no válidos');
      return;
    }

    // Check for potentially dangerous patterns
    if (/(<script|javascript:|data:|vbscript:|on\w+\s*=)/i.test(sanitizedTitle)) {
      toast.error('El título contiene contenido no permitido');
      return;
    }

    // Description validation
    if (sanitizedDescription.length > 500) {
      toast.error('La descripción no puede exceder 500 caracteres');
      return;
    }

    // Check for dangerous content in description
    if (sanitizedDescription && /(<script|javascript:|data:|vbscript:|on\w+\s*=)/i.test(sanitizedDescription)) {
      toast.error('La descripción contiene contenido no permitido');
      return;
    }

    if (!photo) {
      toast.error('Por favor agrega una imagen');
      return;
    }


    // Price validation (required for all listings)
    const price = parseInt(priceCredits);
    if (!priceCredits || isNaN(price) || price <= 0 || price > 10000) {
      toast.error('Por favor ingresa un precio válido entre 1 y 10,000 créditos');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: sanitizedTitle,
        description: sanitizedDescription,
        type,
        price_credits: parseInt(priceCredits),
        image_url: photo.image,
        latitude: photo.latitude,
        longitude: photo.longitude,
        market_id: marketId || undefined, // Si no hay marketId, será undefined para productos personales
        category,
        subcategory,
      });
      
      // Reset form if it's a new product
      if (!product) {
        setTitle('');
        setDescription('');
        setType('product');
        setPriceCredits('');
        setPhoto(null);
        setCategory('');
        setSubcategory('');
      }
      
      toast.success(product ? 'Producto actualizado!' : 'Producto creado!');
    } catch (error) {
      toast.error('Error al guardar el producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasValidPrice = priceCredits && !isNaN(parseInt(priceCredits)) && parseInt(priceCredits) > 0 && parseInt(priceCredits) <= 10000;
  const isButtonDisabled = isSubmitting || !photo || !hasValidPrice;
  
  console.log('Button validation debug:', {
    isSubmitting,
    hasPhoto: !!photo,
    priceCredits,
    priceAsNumber: parseInt(priceCredits),
    hasValidPrice,
    isButtonDisabled
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {product ? 'Edit' : 'New'} {type === 'product' ? 'Product' : 'Donation'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo */}
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={(value: 'product' | 'donation') => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="donation">Donation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Imagen */}
          <div className="space-y-2">
            <Label>Image *</Label>
            
            {!showImageOptions ? (
              <Button
                type="button"
                onClick={() => setShowImageOptions(true)}
                disabled={isCameraLoading}
                className="w-full"
                variant="outline"
              >
                <ImagePlus className="w-4 h-4 mr-2" />
                {photo ? 'Change image' : 'Add image'}
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    onClick={handleSelectFromGallery}
                    disabled={isCameraLoading}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Image className="w-4 h-4" />
                    Gallery
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCapturePhoto}
                    disabled={isCameraLoading}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Camera
                  </Button>
                </div>
                <Button
                  type="button"
                  onClick={() => setShowImageOptions(false)}
                  variant="ghost"
                  size="sm"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            )}
            
            {photo && (
              <div className="space-y-2">
                <div className="relative">
                  <img 
                    src={photo.image} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => setPhoto(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">
              <Tag className="w-4 h-4 inline mr-2" />
              Category (optional)
            </Label>
            <Select 
              value={category} 
              onValueChange={(value) => {
                setCategory(value);
                setSubcategory(''); // Reset subcategory when category changes
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategory Selection */}
          {category && (
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory (optional)</Label>
              <Select value={subcategory} onValueChange={setSubcategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {getCategoryById(category)?.subcategories.map((subcat) => (
                    <SelectItem key={subcat.id} value={subcat.id}>
                      {subcat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Vintage chair, Baby clothes..."
              
            />
          </div>

          {/* Precio */}
          <div className="space-y-2">
            <Label htmlFor="price">Price *</Label>
            <Input
              id="price"
              type="number"
              min="1"
              value={priceCredits}
              onChange={(e) => setPriceCredits(e.target.value)}
              placeholder="Ex: 5"
              required
            />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe condition, features, etc..."
              rows={3}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={isButtonDisabled}
            >
              {isSubmitting ? (
                'Saving...'
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {product ? 'Update' : 'Create'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};