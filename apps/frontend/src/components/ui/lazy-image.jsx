/**
 * Lazy Loading Image Component
 * Optimizes performance by loading images only when they enter the viewport
 */

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

const LazyImage = ({
  src,
  alt,
  className,
  placeholder,
  fallback,
  onLoad,
  onError,
  threshold = 0.1,
  rootMargin = '50px',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.unobserve(img);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observerRef.current.observe(img);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    onError?.(e);
  };

  const showPlaceholder = !isInView || (!isLoaded && !hasError);
  const showFallback = hasError && fallback;
  const showImage = isInView && !hasError;

  return (
    <div
      ref={imgRef}
      className={cn(
        'relative overflow-hidden bg-muted',
        className
      )}
      {...props}
    >
      {/* Placeholder */}
      {showPlaceholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
          {placeholder || (
            <div className="w-8 h-8 rounded-full bg-muted-foreground/20 animate-pulse" />
          )}
        </div>
      )}

      {/* Fallback */}
      {showFallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          {typeof fallback === 'string' ? (
            <img
              src={fallback}
              alt={alt}
              className="w-full h-full object-cover"
            />
          ) : (
            fallback
          )}
        </div>
      )}

      {/* Main image */}
      {showImage && (
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
    </div>
  );
};

/**
 * Progressive Image Component
 * Shows a low-quality placeholder while loading the full image
 */
export const ProgressiveImage = ({
  src,
  placeholderSrc,
  alt,
  className,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    onError?.(e);
  };

  return (
    <div className={cn('relative overflow-hidden', className)} {...props}>
      {/* Low-quality placeholder */}
      {placeholderSrc && !hasError && (
        <img
          src={placeholderSrc}
          alt={alt}
          className={cn(
            'absolute inset-0 w-full h-full object-cover filter blur-sm scale-110 transition-opacity duration-300',
            isLoaded ? 'opacity-0' : 'opacity-100'
          )}
        />
      )}

      {/* High-quality image */}
      {!hasError && (
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center text-muted-foreground">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-muted-foreground/20" />
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Avatar Image with fallback
 */
export const LazyAvatar = ({
  src,
  alt,
  fallback,
  className,
  size = 'md',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden bg-muted flex items-center justify-center',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {!hasError && src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={handleError}
          loading="lazy"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground text-sm font-medium">
          {fallback || alt?.charAt(0)?.toUpperCase() || '?'}
        </div>
      )}
    </div>
  );
};

export default LazyImage;