import {
  ActionIcon,
  Badge,
  Box,
  Button,
  FileInput,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  Title
} from '@mantine/core';
import { 
  FiChevronDown, 
  FiChevronLeft, 
  FiChevronRight, 
  FiChevronUp, 
  FiImage, 
  FiPlus, 
  FiTrash2, 
  FiVideo 
} from 'react-icons/fi';
import { useRef, useState } from 'react';

interface ProductImage {
  file?: File;
  url: string;
  id?: string;
  type: 'image' | 'video';
}

interface MediaUploadProps {
  media: ProductImage[];
  setMedia: React.Dispatch<React.SetStateAction<ProductImage[]>>;
}

const MediaUpload = ({ media, setMedia }: MediaUploadProps) => {
  const [collapsed, setCollapsed] = useState(false);
  
  // Fix: Use a proper ref for the FileInput
  const videoInputRef = useRef<HTMLButtonElement>(null);

  const toggleSection = () => {
    setCollapsed(prev => !prev);
  };

  const handleImageUpload = (files: File[] | null) => {
    if (!files) return;
    
    const newMedia = Array.from(files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
      type: 'image' as const
    }));
    
    setMedia(prev => [...prev, ...newMedia]);
  };

  const handleVideoUpload = (file: File | null) => {
    if (!file) return;
    
    // Check if we already have a video
    const existingVideoIndex = media.findIndex(item => item.type === 'video');
    
    // If we have a video, replace it
    if (existingVideoIndex !== -1) {
      const newMedia = [...media];
      if (newMedia[existingVideoIndex].url.startsWith('blob:')) {
        URL.revokeObjectURL(newMedia[existingVideoIndex].url);
      }
      newMedia[existingVideoIndex] = {
        file,
        url: URL.createObjectURL(file),
        type: 'video'
      };
      setMedia(newMedia);
    } else {
      // Add new video
      setMedia(prev => [...prev, {
        file,
        url: URL.createObjectURL(file),
        type: 'video'
      }]);
    }
  };


  const removeMedia = (index: number) => {
    const newMedia = [...media];
    if (newMedia[index].url.startsWith('blob:')) {
      URL.revokeObjectURL(newMedia[index].url);
    }
    newMedia.splice(index, 1);
    setMedia(newMedia);
  };

  const reorderMedia = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === media.length - 1)) {
      return;
    }

    const newMedia = [...media];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newMedia[index];
    newMedia[index] = newMedia[newIndex];
    newMedia[newIndex] = temp;
    setMedia(newMedia);
  };

  const hasVideo = media.some(item => item.type === 'video');

  return (
    <Paper shadow="xs" p="md" mb="md" className="bg-white">
      <Group justify="space-between" mb={collapsed ? 0 : "md"}>
        <Title order={5}>Hình ảnh và video</Title>
        <ActionIcon variant="subtle" onClick={toggleSection}>
          {collapsed ? <FiChevronDown size={16} /> : <FiChevronUp size={16} />}
        </ActionIcon>
      </Group>
      
      {!collapsed && (
        <Stack>
          <Text size="sm" c="dimmed">
            Thêm tối đa 10 hình ảnh và 1 video. Hình đầu tiên sẽ là hình ảnh chính của sản phẩm.
          </Text>
          
          <Group>
            <FileInput
              placeholder="Chọn hình ảnh"
              accept="image/png,image/jpeg,image/webp,image/gif"
              leftSection={<FiImage size={16} />}
              multiple
              onChange={handleImageUpload}
              disabled={media.filter(m => m.type === 'image').length >= 10}
              style={{ flex: 1 }}
            />
            
            <FileInput
              placeholder="Chọn video"
              accept="video/mp4,video/webm"
              leftSection={<FiVideo size={16} />}
              onChange={handleVideoUpload}
              disabled={hasVideo}
              ref={videoInputRef}
              style={{ flex: 1 }}
            />
          </Group>
          
          {/* Media preview in a horizontal scrollable row */}
          <div className="border rounded-md p-3 bg-gray-50 mb-2">
            <Text size="sm" fw={500} mb="xs">Xem trước</Text>
            
            <div className="flex overflow-x-auto pb-2 gap-2" style={{ scrollbarWidth: 'thin' }}>
              {media.map((item, index) => (
                <Box 
                  key={index} 
                  pos="relative" 
                  className="border border-gray-200 rounded-md overflow-hidden flex-shrink-0 bg-white"
                  w={80}
                  h={80}
                >
                  {index === 0 && item.type === 'image' && (
                    <Badge 
                      className="absolute top-1 left-1 z-10" 
                      color="blue"
                      size="xs"
                    >
                      Chính
                    </Badge>
                  )}
                  
                  {item.type === 'video' && (
                    <Badge 
                      className="absolute top-1 left-1 z-10" 
                      color="red"
                      size="xs"
                    >
                      Video
                    </Badge>
                  )}
                  
                  {item.type === 'image' ? (
                    <Image
                      src={item.url}
                      alt={`Sản phẩm ${index + 1}`}
                      height={80}
                      width={80}
                      fit="cover"
                    />
                  ) : (
                    <div className="relative h-[80px] w-[80px] bg-gray-100 flex items-center justify-center">
                      <FiVideo size={20} className="text-gray-500" />
                    </div>
                  )}
                  
                  <div className="absolute top-0 right-0 p-1">
                    <Group gap={4}>
                      {item.type === 'image' && (
                        <>
                          <ActionIcon 
                            size="xs" 
                            variant="filled" 
                            color="gray" 
                            onClick={() => reorderMedia(index, 'up')}
                            disabled={index === 0}
                            className="bg-black bg-opacity-50 hover:bg-opacity-70"
                          >
                            <FiChevronLeft size={12} />
                          </ActionIcon>
                          
                          <ActionIcon 
                            size="xs" 
                            variant="filled" 
                            color="gray" 
                            onClick={() => reorderMedia(index, 'down')}
                            disabled={index === media.length - 1}
                            className="bg-black bg-opacity-50 hover:bg-opacity-70"
                          >
                            <FiChevronRight size={12} />
                          </ActionIcon>
                        </>
                      )}
                      
                      <ActionIcon 
                        size="xs" 
                        variant="filled" 
                        color="red" 
                        onClick={() => removeMedia(index)}
                        className="bg-black bg-opacity-50 hover:bg-opacity-70"
                      >
                        <FiTrash2 size={12} />
                      </ActionIcon>
                    </Group>
                  </div>
                </Box>
              ))}
              
              {/* Add more buttons in the same row */}
              {media.filter(m => m.type === 'image').length < 10 && (
                <Box 
                  className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 flex-shrink-0"
                  w={80}
                  h={80}
                  onClick={() => document.querySelector<HTMLInputElement>('input[type="file"][accept*="image"]')?.click()}
                >
                  <FiPlus size={20} className="text-gray-400" />
                  <Text size="xs" c="dimmed" ta="center">
                    Thêm ảnh
                  </Text>
                </Box>
              )}
              
              {!hasVideo && (
                <Box 
                  className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 flex-shrink-0"
                  w={80}
                  h={80}
                  onClick={() => videoInputRef.current?.click()}
                >
                  <FiVideo size={20} className="text-gray-400" />
                  <Text size="xs" c="dimmed" ta="center">
                    Thêm video
                  </Text>
                </Box>
              )}
            </div>
          </div>
          
          {/* Media guidelines */}
          <Text size="xs" c="dimmed" mt="xs">
            <b>Lưu ý:</b> Hình ảnh nên có tỉ lệ 1:1, kích thước tối thiểu 500x500 pixels và không quá 5MB. 
            Video nên có độ dài dưới 30 giây và không quá 50MB.
          </Text>
        </Stack>
      )}
    </Paper>
  );
};

export default MediaUpload;