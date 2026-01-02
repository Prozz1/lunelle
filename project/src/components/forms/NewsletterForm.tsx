import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Mail } from 'lucide-react';
import { useState } from 'react';

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

interface NewsletterFormProps {
  className?: string;
  variant?: 'default' | 'compact';
}

/**
 * Newsletter signup form with email validation
 * 
 * Uses React Hook Form and Zod for validation
 * Shows success/error toast notifications
 */
export function NewsletterForm({ className, variant = 'default' }: NewsletterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true);
    try {
      const { subscribeToNewsletter } = await import('@/lib/supabase');
      const source = variant === 'compact' ? 'footer' : 'homepage';
      
      const { error } = await subscribeToNewsletter(data.email, source);

      if (error) {
        throw error;
      }

      toast.success('Thank you for subscribing!', {
        description: "We'll send you updates about our latest collections and offers.",
      });

      reset();
    } catch (error) {
      toast.error('Something went wrong', {
        description: error instanceof Error ? error.message : 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className={className}>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              className="bg-white"
              aria-label="Email address"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-xs text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-lunelle-pink hover:bg-lunelle-pink/90 text-foreground"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
                Subscribe
              </>
            )}
            <span className="sr-only">Subscribe to newsletter</span>
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="newsletter-email" className="text-base font-medium">
            Stay in the loop
          </Label>
          <p className="mt-1 text-sm text-muted-foreground">
            Subscribe to receive updates on new collections and exclusive offers.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              id="newsletter-email"
              type="email"
              placeholder="Enter your email address"
              {...register('email')}
              className="bg-white"
              aria-label="Email address"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'newsletter-email-error' : undefined}
            />
            {errors.email && (
              <p id="newsletter-email-error" className="mt-1 text-sm text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="bg-lunelle-pink hover:bg-lunelle-pink/90 text-white whitespace-nowrap"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                Subscribing...
              </>
            ) : (
              'Subscribe'
            )}
            <span className="sr-only">Subscribe to newsletter</span>
          </Button>
        </div>
      </div>
    </form>
  );
}

