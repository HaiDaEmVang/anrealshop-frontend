import { type UseFormReturnType } from '@mantine/form';
import '@mantine/tiptap/styles.css';
import type { ProductCreateRequest } from '../../../../types/ProductType';
import BasicInfor from './BasicInfo/BasicInfor';
import MediaUpload from './uploadImage/MediaUpload';
import SkuInfor from './AttributeInfo/AttributeInfor';
import SkuDetails from './SkuDetail/SkuDetails';
import Shipping from './Shipping/Shipping';

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

      {/* <SkuInfor form={form} /> */}

      {/* <SkuDetails form={form} /> */}

      <Shipping form={form} />

    </div>
  );
};

export default Infor;