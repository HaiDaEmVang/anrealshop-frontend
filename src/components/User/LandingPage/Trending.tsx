import { Container } from '@mantine/core';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';


interface FashionCategory {
    id: number;
    name: string;
    image: string;
    itemCount: number;
    slug: string;
}


interface TrendingProps {
    id?: string;
}

interface CategoryBoxProps {
    category: FashionCategory;
    positionClasses: string; 
}

const CategoryBox = ({ category, positionClasses }: CategoryBoxProps) => (
    <div
        className={`group absolute w-36 h-36 -rotate-45 overflow-hidden shadow-lg z-10 rounded-md ${positionClasses}`}
    >
        <Link to={`/category/${category.slug}`} className="block h-full w-full">
            <div className="absolute inset-0 rotate-45 scale-[1.5] overflow-hidden">
                <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30"></div>
            </div>
            <div className="absolute inset-0 rotate-45 flex items-center justify-center p-2">
                <div className="text-center">
                    <h3 className="text-white font-bold text-lg">{category.name}</h3>
                    <p className="text-white text-xs">{category.itemCount} sản phẩm</p>
                </div>
            </div>
        </Link>
    </div>
);

const Trending = ({ id }: TrendingProps) => {
    const fashionCategories: FashionCategory[] = [
        { id: 1, name: 'Áo Thun', image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/a5bea8a5-718d-43fc-bccc-984a3eecd18b/AS+LJ+M+NK+TEE+M90+UC.png', itemCount: 120, slug: 'ao-thun' },
        { id: 2, name: 'Giày Thể Thao', image: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/41c65780c65043a8a0a3aad600c7eec1_9366/Ultraboost_Light_Shoes_Black_GX6270_01_standard.jpg', itemCount: 85, slug: 'giay-the-thao' },
        { id: 3, name: 'Quần Jeans', image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/a5bea8a5-718d-43fc-bccc-984a3eecd18b/AS+LJ+M+NK+TEE+M90+UC.png', itemCount: 64, slug: 'quan-jeans' },
        { id: 4, name: 'Áo Khoác', image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/a5bea8a5-718d-43fc-bccc-984a3eecd18b/AS+LJ+M+NK+TEE+M90+UC.png', itemCount: 42, slug: 'ao-khoac' },
        { id: 5, name: 'Váy Đầm', image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/a5bea8a5-718d-43fc-bccc-984a3eecd18b/AS+LJ+M+NK+TEE+M90+UC.png', itemCount: 76, slug: 'vay-dam' },
        { id: 6, name: 'Phụ Kiện', image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/13710f61-bb03-4274-87f0-69968a194a8c/AS+W+NSW+OS+FLC+CROP+PO+HDY.png', itemCount: 93, slug: 'phu-kien' },
        { id: 7, name: 'Đồ Thể Thao', image: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/e104df9c-225a-4a8e-9e6f-5c89c8f48871/sportswear-club-fleece-pullover-hoodie-dQps5k.png', itemCount: 58, slug: 'do-the-thao' }
    ];


    const boxLayouts = [
        { categoryId: 5, positionClasses: 'bottom-[29%] left-[21%] transform -translate-x-1/2 translate-y-1/2' },
        { categoryId: 3, positionClasses: 'top-[34%] left-[35%] transform -translate-x-1/2 -translate-y-1/2' }, 
        { categoryId: 4, positionClasses: 'top-[34%] right-[37%] transform translate-x-1/2 -translate-y-1/2' },
        { categoryId: 6, positionClasses: 'bottom-[29%] left-[49%] transform -translate-x-1/2 translate-y-1/2' }, 
        { categoryId: 7, positionClasses: 'bottom-[29%] right-[23%] transform translate-x-1/2 translate-y-1/2' }, 
    ];

    const mainCategory = fashionCategories[0];

    return (
        <section id={id} className="py-16 bg-gray-50">
            <Container size="xl">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold">Danh Mục Thời Trang Nổi Bật</h2>
                    <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                        Khám phá các danh mục thời trang được yêu thích nhất và tìm kiếm phong cách phù hợp với cá tính của bạn
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Main Card */}
                    <motion.div
                        className="w-full md:w-1/3 relative rounded-xl overflow-hidden shadow-md group"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -5 }}
                    >
                        <div className="absolute inset-0">
                            <img
                                src={mainCategory.image}
                                alt={mainCategory.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <h3 className="text-2xl font-bold mb-2">{mainCategory.name}</h3>
                            <p className="text-sm text-gray-200 mb-4">{mainCategory.itemCount} sản phẩm</p>
                            <Link
                                to={`/category/${mainCategory.slug}`}
                                className="inline-block py-2 px-4 bg-white text-gray-900 rounded-full font-medium text-sm transition-all duration-300 hover:bg-gray-100"
                            >
                                Khám phá ngay
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right Section */}
                    <div className="w-full md:w-2/3 flex flex-col gap-6">
                        {/* Top Section with Rotated Boxes */}
                        <div className="w-full h-2/3 relative">
                            {boxLayouts.map((layout) => {
                                const category = fashionCategories.find(cat => cat.id === layout.categoryId);
                                if (!category) return null;
                                return (
                                    <CategoryBox
                                        key={category.id}
                                        category={category}
                                        positionClasses={layout.positionClasses}
                                    />
                                );
                            })}
                        </div>

                        {/* Bottom Section with Video */}
                        <motion.div
                            className="w-full h-1/3 relative rounded-xl overflow-hidden shadow-md"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                                <source src="https://image.uniqlo.com/UQ/ST3/jp/imagesother/000_PLP/Casual-Outer/25FW/MEN/KV-m-Video-pc.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                                <div className="p-6 text-white">
                                    <h3 className="text-2xl font-bold mb-1">Thời trang nam</h3>
                                    <p className="text-sm text-gray-200 mb-3">Phong cách mới nhất cho nam giới</p>
                                    <Link
                                        to="/category/thoi-trang-nam"
                                        className="inline-block py-1.5 px-3 bg-white text-gray-900 rounded-full font-medium text-xs transition-all duration-300 hover:bg-gray-100"
                                    >
                                        Xem ngay
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default Trending;