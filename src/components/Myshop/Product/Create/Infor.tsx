import {
  ActionIcon,
  Group,
  Paper,
  Stack,
  TextInput,
  Title
} from '@mantine/core';
import { type UseFormReturnType } from '@mantine/form';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image'; // Add this import
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'; // Add this import
import BasicInfor from './BasicInfor';
import MediaUpload from './MediaUpdate';
import Shipping from './Shipping';
import SkuDetails from './SkuDetails';
import SkuInfor from './SkuInfor';

interface ProductImage {
  file?: File;
  url: string;
  id?: string;
  type: 'image' | 'video';
}

interface CategoryItem {
  value: string;
  label: string;
  parent?: string;
}

const categories: CategoryItem[] = [
  { value: 'thoi-trang-nam', label: 'Thời trang nam' },
  { value: 'thoi-trang-nu', label: 'Thời trang nữ' },
  { value: 'giay-dep', label: 'Giày dép' },
  { value: 'phu-kien', label: 'Phụ kiện' },
  { value: 'dien-tu', label: 'Điện tử' },
];

const tags = [
  { value: 'hot', label: 'Hot' },
  { value: 'bestseller', label: 'Bán chạy' },
  { value: 'new', label: 'Mới' },
  { value: 'sale', label: 'Giảm giá' },
  { value: 'premium', label: 'Cao cấp' },
];

interface InforProps {
  form: UseFormReturnType<any>;
  media: ProductImage[];
  setMedia: React.Dispatch<React.SetStateAction<ProductImage[]>>; 
  isEditMode?: boolean;// Sửa đây nè
}
const Infor = ({ form, media, setMedia, isEditMode = false }: InforProps) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    description: true,
    seo: true,
  });
  
  // Initialize tagsData state
  const [tagsData, setTagsData] = useState(tags);

  // Configure editor with image support and sync with form
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image,
    ],
    content: form.values.description || '',
    onUpdate: ({ editor }) => {
      form.setFieldValue('description', editor.getHTML());
    },
  });

  // Update editor content when form values change
  useEffect(() => {
    if (editor && form.values.description !== editor.getHTML()) {
      editor.commands.setContent(form.values.description || '');
    }
  }, [form.values.description, editor]);

  const toggleSection = (section: string) => {
    setCollapsed(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div>
      {/* Media Upload Component */}
      <MediaUpload
        media={media}
        setMedia={setMedia}
      />

      {/* Basic Information Component */}
      <BasicInfor
        form={form}
        categories={categories}
        tagsData={tagsData}
      />


      {/* Pricing & Inventory Component */}
      <SkuInfor form={form} />

      {/* SKU Details */}
      <SkuDetails form={form} />

      {/* Shipping information */}
      <Shipping form={form} />

      {/* SEO Fields */}
      <Paper shadow="xs" p="md" mb="md" className="bg-white">
        <Group justify="space-between" mb="md">
          <Title order={5}>Thông tin SEO</Title>
          <ActionIcon variant="subtle" onClick={() => toggleSection('seo')}>
            {collapsed.seo ? <FiChevronDown size={16} /> : <FiChevronUp size={16} />}
          </ActionIcon>
        </Group>
        
        {!collapsed.seo && (
          <Stack>
            <TextInput 
              label="Tiêu đề SEO" 
              placeholder="Nhập tiêu đề SEO (tối đa 70 ký tự)"
              {...form.getInputProps('seoTitle')} 
            />
            <TextInput 
              label="Mô tả SEO" 
              placeholder="Nhập mô tả SEO (tối đa 160 ký tự)"
              {...form.getInputProps('seoDescription')} 
            />
            <TextInput 
              label="Từ khóa SEO" 
              placeholder="Nhập từ khóa SEO, phân cách bởi dấu phẩy"
              {...form.getInputProps('seoKeywords')} 
            />
          </Stack>
        )}
      </Paper>

      {/* Remove action buttons as they're now moved to the CreateProduct component */}
    </div>
  );
};

export default Infor;