import { type UseFormReturnType } from '@mantine/form';
import '@mantine/tiptap/styles.css';
import type { ProductCreateRequest } from '../../../../types/ProductType';
import BasicInfor from './BasicInfo/BasicInfor';
import MediaUpload from './uploadImage/MediaUpload';
import SkuInfor from './AttributeInfo/AttributeInfor';

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
  form: UseFormReturnType<ProductCreateRequest>;
  isEditMode?: boolean;
}
const Infor = ({ form, isEditMode = false }: InforProps) => {
  // const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
  //   description: true
  // });
  
  // const [tagsData, setTagsData] = useState(tags);

  // const editor = useEditor({
  //   extensions: [
  //     StarterKit,
  //     Underline,
  //     Highlight,
  //     TextAlign.configure({ types: ['heading', 'paragraph'] }),
  //     Image,
  //   ],
  //   content: form.values.description || '',
  //   onUpdate: ({ editor }) => {
  //     form.setFieldValue('description', editor.getHTML());
  //   },
  // });

  // // Update editor content when form values change
  // useEffect(() => {
  //   if (editor && form.values.description !== editor.getHTML()) {
  //     editor.commands.setContent(form.values.description || '');
  //   }
  // }, [form.values.description, editor]);

  // const toggleSection = (section: string) => {
  //   setCollapsed(prev => ({
  //     ...prev,
  //     [section]: !prev[section]
  //   }));
  // };

  return (
    <div>
      {/* <MediaUpload form={form}/> */}

      {/* <BasicInfor form={form}/> */}

      <SkuInfor form={form} />

      {/* SKU Details */}
      {/* <SkuDetails form={form} /> */}

      {/* Shipping information */}
      {/* <Shipping form={form} /> */}

    </div>
  );
};

export default Infor;