import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle, MapPin } from "lucide-react";

interface ThankYouDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username?: string;
  onThankAndChat: () => void;
  onJustViewMaps: () => void;
}

export const ThankYouDialog = ({ 
  open, 
  onOpenChange, 
  username, 
  onThankAndChat, 
  onJustViewMaps 
}: ThankYouDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            Free Coordinates!
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              {username ? `${username}` : 'This user'} has shared these coordinates for free after 3 hours.
            </p>
            <p>
              Would you like to thank them for sharing this location?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            onClick={onJustViewMaps}
            variant="outline" 
            className="w-full sm:w-auto flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            Just view maps
          </Button>
          <Button
            onClick={onThankAndChat}
            className="w-full sm:w-auto flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Thank and chat
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};