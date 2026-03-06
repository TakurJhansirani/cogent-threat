import { ShieldOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AccessDeniedViewProps {
  onGoBack: () => void;
}

export const AccessDeniedView = ({ onGoBack }: AccessDeniedViewProps) => (
  <div className="flex h-full items-center justify-center">
    <Card className="max-w-md border-destructive/30">
      <CardHeader className="items-center text-center">
        <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
          <ShieldOff className="h-7 w-7 text-destructive" />
        </div>
        <CardTitle className="text-xl text-foreground">Access Denied</CardTitle>
        <CardDescription>
          You don't have permission to access this section. Contact your administrator to request elevated access.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full" onClick={onGoBack}>
          Go to Dashboard
        </Button>
      </CardContent>
    </Card>
  </div>
);
