import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";
import { AlertCircle } from "lucide-react";
import { z } from "zod";

const storeSchema = z.object({
  storeName: z.string().trim().min(2, "Store name must be at least 2 characters").max(200, "Store name must be less than 200 characters"),
  storeUrl: z.string().trim().url("Must be a valid URL").max(500, "URL must be less than 500 characters"),
  city: z.string().trim().min(2, "City must be at least 2 characters").max(100, "City must be less than 100 characters")
});

interface StoreSubmissionFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function StoreSubmissionForm({ onSuccess, onCancel }: StoreSubmissionFormProps) {
  const [storeName, setStoreName] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validatedData = storeSchema.parse({ storeName, storeUrl, city });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('store_submissions')
        .insert({
          ambassador_id: user.id,
          store_name: validatedData.storeName,
          store_url: validatedData.storeUrl,
          city: validatedData.city,
          status: 'submitted'
        });

      if (error) throw error;

      toast.success(t('ambassador.form.success'));
      setStoreName("");
      setStoreUrl("");
      setCity("");
      onSuccess();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error(error.message || t('ambassador.form.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-black/50 border-primary/20">
      <CardHeader>
        <CardTitle className="text-2xl font-permanent-marker" style={{ color: '#699e4b' }}>
          {t('ambassador.form.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6 border-accent/50 bg-accent/10">
          <AlertCircle className="h-4 w-4 text-accent" />
          <AlertDescription className="text-sm text-subtitle-styled font-sedgwick-ave">
            {t('ambassador.form.warning')}
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="storeName" className="text-subtitle-styled font-sedgwick-ave">
              {t('ambassador.form.storeName')}
            </Label>
            <Input
              id="storeName"
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
              className="mt-1"
              maxLength={200}
            />
          </div>

          <div>
            <Label htmlFor="storeUrl" className="text-subtitle-styled font-sedgwick-ave">
              {t('ambassador.form.storeUrl')}
            </Label>
            <Input
              id="storeUrl"
              type="url"
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
              required
              className="mt-1"
              placeholder="https://..."
              maxLength={500}
            />
          </div>

          <div>
            <Label htmlFor="city" className="text-subtitle-styled font-sedgwick-ave">
              {t('ambassador.form.city')}
            </Label>
            <Input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="mt-1"
              maxLength={100}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-accent hover:bg-accent/90 font-permanent-marker"
              style={{ color: '#611a5a' }}
            >
              {loading ? t('ambassador.loading') : t('ambassador.form.submit')}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1 font-permanent-marker"
            >
              {t('ambassador.form.cancel')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}