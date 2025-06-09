import { ActionIcon, Box, Group, Image, LoadingOverlay, ScrollArea, Stack } from '@mantine/core';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

interface ProductMedia {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
}

interface ImageProductProps {
  media: ProductMedia[];
  thumbnailUrl: string;
  productName: string;
}

const ImageProduct = ({ media, thumbnailUrl, productName }: ImageProductProps) => {
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [preloadedImages, setPreloadedImages] = useState<string[]>([]);
  const [zoomedView, setZoomedView] = useState(false);
  
  // Preload images to improve user experience
  useEffect(() => {
    // Start loading spinner
    setLoading(true);
    
    // Immediately load and display the first image
    const img = new window.Image();
    img.src = media[0]?.url || thumbnailUrl;
    img.onload = () => {
      setLoading(false);
      setPreloadedImages(prev => [...prev, img.src]);
    };
    
    // Preload remaining images in the background
    media.slice(1).forEach((item) => {
      const preloadImg = new window.Image();
      preloadImg.src = item.url;
      preloadImg.onload = () => {
        setPreloadedImages(prev => [...prev, item.url]);
      };
    });
  }, [media, thumbnailUrl]);

  const handlePrevImage = () => {
    // Only show loading if image hasn't been preloaded
    const prevIndex = activeImage === 0 ? media.length - 1 : activeImage - 1;
    const prevImageUrl = media[prevIndex]?.url;
    
    if (!preloadedImages.includes(prevImageUrl)) {
      setLoading(true);
    }
    
    setActiveImage(prevIndex);
  };

  const handleNextImage = () => {
    // Only show loading if image hasn't been preloaded
    const nextIndex = activeImage === media.length - 1 ? 0 : activeImage + 1;
    const nextImageUrl = media[nextIndex]?.url;
    
    if (!preloadedImages.includes(nextImageUrl)) {
      setLoading(true);
    }
    
    setActiveImage(nextIndex);
  };

  const handleImageLoad = () => {
    setLoading(false);
    // Add to preloaded images if not already there
    const currentUrl = media[activeImage]?.url;
    if (currentUrl && !preloadedImages.includes(currentUrl)) {
      setPreloadedImages(prev => [...prev, currentUrl]);
    }
  };

  return (
    <>
      <Box className="relative flex flex-col md:flex-row" style={{ minHeight: '500px' }}>
        {/* Thumbnails - Vertical List on left side */}
        <Stack className="flex-shrink-0 mr-4 hidden md:flex" gap="xs" style={{ width: '80px' }}>
          {media.map((img, idx) => (
            <Box
              key={idx}
              className={`cursor-pointer overflow-hidden border-2 rounded-md transition-all ${
                activeImage === idx ? 'border-primary' : 'border-transparent hover:border-gray-300'
              }`}
              onClick={() => setActiveImage(idx)}
              style={{ 
                height: '80px',
                position: 'relative'
              }}
            >
              <Image
                src={img.url}
                height={80}
                width={80}
                fit="cover"
                className="object-cover w-[80px] h-[80px] rounded"
                alt={`${productName} - ảnh ${idx + 1}`}
                loading="lazy"
              />
              
            </Box>
          ))}
        </Stack>

        {/* Main Hero Image */}
        <Box 
          className="relative flex-1 overflow-hidden rounded-md bg-white"
          style={{ minHeight: '400px' }}
        >
          <Box 
            className="relative w-full h-full" 
            style={{ minHeight: '400px', cursor: 'zoom-in' }}
            onClick={() => setZoomedView(true)}
          >
            <LoadingOverlay visible={loading} />
            <Image
              src={media[activeImage]?.url || thumbnailUrl}
              height={500}
              className="w-full h-full object-contain bg-white transition-opacity duration-300"
              alt={productName}
              onLoad={handleImageLoad}
            />
            
            
            
            {/* Image counter */}
            {media.length > 1 && (
              <Box className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                {activeImage + 1}/{media.length}
              </Box>
            )}
          </Box>

          {/* Mobile Thumbnails - Horizontal Row at bottom */}
          <ScrollArea className="mt-2 md:hidden">
            <Group className="gap-2 justify-center" >
              {media.map((img, idx) => (
                <Box
                  key={idx}
                  className={`cursor-pointer overflow-hidden border-2 rounded-md flex-shrink-0 ${
                    activeImage === idx ? 'border-primary' : 'border-transparent hover:border-gray-200'
                  }`}
                  onClick={() => setActiveImage(idx)}
                  style={{ width: '60px', height: '60px' }}
                >
                  <Image
                    src={img.url}
                    height={60}
                    width={60}
                    fit="cover"
                    alt={`${productName} - ảnh ${idx + 1}`}
                    loading="lazy"
                  />
                </Box>
              ))}
            </Group>
          </ScrollArea>

          {/* Navigation Arrows */}
          {media.length > 1 && (
            <div className="absolute top-1/2 w-full flex justify-between px-2" style={{ transform: 'translateY(-50%)' }}>
              <ActionIcon 
                variant="filled" 
                radius="xl" 
                size="lg" 
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  color: '#333',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
                className="hover:bg-white"
              >
                <FiChevronLeft size={20} />
              </ActionIcon>
              <ActionIcon 
                variant="filled" 
                radius="xl" 
                size="lg" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  color: '#333',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}
                className="hover:bg-white"
              >
                <FiChevronRight size={20} />
              </ActionIcon>
            </div>
          )}
        </Box>
      </Box>

      {/* Zoomed View Modal */}
      {zoomedView && createPortal(
        <div
          className="!fixed !top-0 !left-0 !right-0 bottom-0 bg-black/90 !z-[999] flex items-center justify-center"
          onClick={() => setZoomedView(false)}
          style={{ backdropFilter: 'blur(2px)' }}
        >
          {/* Close button */}
          <ActionIcon
            style={{ 
              position: 'absolute',
              top: '16px',
              right: '16px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white'
            }}
            className="hover:bg-black/70"
            variant="filled"
            radius="xl"
            size="lg"
            onClick={() => setZoomedView(false)}
          >
            <FiX size={24} />
          </ActionIcon>
          
          {/* Zoomed image container */}
          <div 
            className="relative"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '80vh'
            }}
          >
            <Image
              src={media[activeImage]?.url || thumbnailUrl}
              className="max-h-[80vh] max-w-[90vw] object-contain"
              alt={`${productName} - zoomed view`}
            />
          </div>
          
          {/* Navigation in zoomed view */}
          {media.length > 1 && (
            <div className="absolute top-1/2 w-full flex justify-between px-6" style={{ transform: 'translateY(-50%)' }}>
              <ActionIcon
                variant="filled"
                radius="xl"
                size="xl"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  color: 'white'
                }}
                className="hover:bg-black/50"
              >
                <FiChevronLeft size={24} />
              </ActionIcon>
              <ActionIcon
                variant="filled"
                radius="xl"
                size="xl"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  color: 'white'
                }}
                className="hover:bg-black/50"
              >
                <FiChevronRight size={24} />
              </ActionIcon>
            </div>
          )}
          
          {/* Thumbnails in zoomed view */}
          {media.length > 1 && (
            <div 
              className="absolute left-1/2 transform -translate-x-1/2"
              style={{ bottom: '24px' }}
            >
              <ScrollArea className="w-auto">
                <Group className="bg-black/20 p-2 rounded-lg" gap="xs">
                  {media.map((img, idx) => (
                    <Box
                      key={`zoom-${idx}`}
                      className={`cursor-pointer overflow-hidden border-2 rounded-md transition-all ${
                        activeImage === idx ? 'border-white' : 'border-transparent hover:border-gray-400'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImage(idx);
                      }}
                      style={{ 
                        width: '50px', 
                        height: '50px', 
                        opacity: activeImage === idx ? 1 : 0.7 
                      }}
                    >
                      <Image
                        src={img.url}
                        height={50}
                        width={50}
                        fit="cover"
                        className="object-cover w-[50px] h-[50px] rounded"
                        alt={`${productName} - thumbnail ${idx + 1}`}
                      />
                    </Box>
                  ))}
                </Group>
              </ScrollArea>
            </div>
          )}
        </div>, document.body
      )}
    </>
  );
};

export default ImageProduct;