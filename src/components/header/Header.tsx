import {
    Button,
    CloseButton,
    Container,
    Divider,
    Flex,
    Group,
    Input,
    Menu,
    Stack,
    Text,
    UnstyledButton
} from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { BiUser } from 'react-icons/bi';
import { FaSearch } from 'react-icons/fa';
import { FiHome, FiLogIn, FiLogOut, FiMapPin, FiPackage, FiShoppingCart, FiUser } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { fetchCurrentUser, logoutUser } from '../../store/authSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppRedux';
import ModalAddress from '../header/ModalAddress';
import SuggestSearch from '../header/SuggestSearch';
import showErrorNotification from '../Toast/NotificationError';
import showSuccessNotification from '../Toast/NotificationSuccess';
import { APP_ROUTES } from '../../constant';
import type { SimpleAddressDto } from '../../types/AddressType';

// Dữ liệu danh mục
const POPULAR_CATEGORIES = [
    { name: 'Điện thoại', slug: 'dien-thoai' },
    { name: 'Laptop', slug: 'laptop' },
    { name: 'Thời trang nam', slug: 'thoi-trang-nam' },
    { name: 'Thời trang nữ', slug: 'thoi-trang-nu' },
    { name: 'Đồng hồ', slug: 'dong-ho' },
    { name: 'Giày dép', slug: 'giay-dep' },
    { name: 'Sắc đẹp', slug: 'sac-dep' },
    { name: 'Nhà cửa', slug: 'nha-cua' }
];

// Dữ liệu địa chỉ mẫu
const SAVED_ADDRESSES: SimpleAddressDto[] = [
    {
    id: '2',
    receiverOrSenderName: 'Trần Thị Bình',
    phoneNumber: '0912345678',
    detailAddress: '45 Lê Văn Lương, Phường Tân Hưng, Quận 7, TP. Hồ Chí Minh',
    isDefault: false
  },
  {
    id: '3',
    receiverOrSenderName: 'Lê Văn Cường',
    phoneNumber: '0987654321',
    detailAddress: '78 Nguyễn Thị Minh Khai, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    isDefault: false
  }
];


const Header: React.FC = () => {
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const useDispatch = useAppDispatch();

    const location = useLocation();
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [addressModalOpened, setAddressModalOpened] = useState(false);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('1');
    const [currentAddress, setCurrentAddress] = useState(SAVED_ADDRESSES[0]);

    const searchContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isAuthenticated && !user) {
            useDispatch(fetchCurrentUser());
        }
    }, [useDispatch, isAuthenticated]);


    // Xử lý click outside để ẩn gợi ý tìm kiếm
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearchFocus = () => {
        setShowSuggestions(true);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
        setShowSuggestions(true);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchValue.trim()) {
            // Lưu vào local storage nếu cần
            const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
            if (!recentSearches.includes(searchValue.trim())) {
                recentSearches.unshift(searchValue.trim());
                if (recentSearches.length > 5) recentSearches.pop();
                localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
            }

            // Chuyển đến trang kết quả tìm kiếm
            window.location.href = `/search?q=${encodeURIComponent(searchValue)}`;
        }
        setShowSuggestions(false);
    };

    const handleSelectAddress = (id: string) => {
        setSelectedAddressId(id);
    };

    const handleApplyAddress = () => {
        const selectedAddress = SAVED_ADDRESSES.find(addr => addr.id === selectedAddressId);
        if (selectedAddress) {
            setCurrentAddress(selectedAddress);
        }
        setAddressModalOpened(false);
    };

    const handleLogout = async () => {
        await useDispatch(logoutUser()).unwrap()
            .then(() => {
                showSuccessNotification('Đăng xuất thành công!', 'Bạn đã đăng xuất khỏi tài khoản.');
                disconnectWs();
            })
            .catch((error) => {
                showErrorNotification('Đăng xuất thất bại!', error.message);
            });
    };

    const handleOpenCart = () => {
        if (!isAuthenticated)
            showSuccessNotification("Thông báo", "Đăng nhập để thực hiện chức năng nhé")
        else 
            navigate(APP_ROUTES.CART);
    }

    return (
        <header className="bg-white shadow-sm py-3">
            <Container size="xl">


                {/* Main header row */}
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 no-underline mr-4">
                        <div className="text-2xl font-bold">
                            <span className="text-primary">Anreal</span>
                            <span className="text-contentText">Shop</span>
                        </div>
                    </Link>

                    {/* Search bar with search button */}
                    <Stack gap={4} className="flex-grow max-w-[50%]">
                        <div className="relative" ref={searchContainerRef}>
                            <form onSubmit={handleSearchSubmit}>
                                <Input
                                    size="md"
                                    radius="md"
                                    className="w-full flex items-center gap-4 text-sm"
                                    placeholder="Nhập từ khóa tìm kiếm..."
                                    classNames={{
                                        input: "placeholder:text-sm text-sm text-contentText",
                                    }}
                                    value={searchValue}
                                    onChange={handleSearchChange}
                                    onFocus={handleSearchFocus}
                                    rightSectionPointerEvents="all"
                                    leftSection={<FaSearch size={16} className="text-gray-400" />}
                                    rightSectionWidth={144}
                                    rightSection={
                                        <div className="flex gap-1 items-center">
                                            <CloseButton
                                                size="sm"
                                                className={`cursor-pointer ${searchValue ? 'visible' : 'invisible'}`}
                                                aria-label="Clear input"
                                                onClick={() => {
                                                    setSearchValue('');
                                                    setShowSuggestions(false);
                                                }}
                                            />
                                            <Divider size={'2'} orientation='vertical' />
                                            <Button
                                                variant="subtle"
                                                radius="md"
                                                type="submit"
                                            >
                                                Tìm kiếm
                                            </Button>
                                        </div>
                                    }
                                />
                            </form>

                            {/* Gợi ý tìm kiếm */}
                            <SuggestSearch
                                searchTerm={searchValue}
                                visible={showSuggestions}
                                onSelect={() => setShowSuggestions(false)}
                            />
                        </div>

                        {/* Danh mục phổ biến */}
                        <Flex justify="start">
                            <Group className="flex-wrap" gap="xs">
                                {POPULAR_CATEGORIES.map((category, index) => (
                                    <Link
                                        key={index}
                                        to={`/category/${category.slug}`}
                                        className="no-underline"
                                    >
                                        <Text
                                            size="sm"
                                            className="!text-gray-600 hover:!text-primary transition-colors px-1"
                                        >
                                            {category.name}
                                        </Text>
                                    </Link>
                                ))}
                            </Group>
                        </Flex>
                    </Stack>

                    {/* Navigation Buttons */}
                    <Stack gap="xs" className="flex items-center ">

                        <Group gap="lg" className="flex mt-4 !justify-end items-center">
                            {/* Home button */}
                            {location.pathname !== APP_ROUTES.HOME && (
                                <UnstyledButton
                                    className="flex gap-2 hover:text-primary transition-colors"
                                    component={Link}
                                    to={APP_ROUTES.HOME}
                                >
                                    <FiHome size={18} />
                                    <Text size="sm">Trang chủ</Text>
                                </UnstyledButton>
                            )}

                            {/* Account button with dropdown */}
                            <Menu
                                withArrow
                                trigger="hover"
                                openDelay={100}
                                closeDelay={200}
                                position="bottom-end"
                                shadow="md"
                            >
                                <Menu.Target>
                                    <UnstyledButton className="flex items-center gap-2 text-contentText hover:text-primary transition-colors">
                                        <FiUser size={18} />
                                        <Text size="sm">Tài khoản</Text>
                                    </UnstyledButton>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    {isAuthenticated ? (
                                        <>
                                            <Menu.Item
                                                leftSection={<BiUser size={16} />}
                                                component={Link}
                                                to="/account/profile"
                                            >
                                                <Text size="sm">Thông tin tài khoản</Text>
                                            </Menu.Item>
                                            <Menu.Item
                                                leftSection={<FiPackage size={16} />}
                                                component={Link}
                                                to="/settings/orders"
                                            >
                                                <Text size="sm">Đơn hàng của tôi</Text>
                                            </Menu.Item>
                                            <Menu.Divider />
                                            <Menu.Item leftSection={<FiLogOut size={16} />} color="red" onClick={handleLogout}>
                                                <Text size="sm">Đăng xuất</Text>
                                            </Menu.Item>
                                        </>
                                    ) : (
                                        <>
                                            <Menu.Item
                                                leftSection={<FiLogIn size={16} />}
                                                component={Link}
                                                to="/login"
                                            >
                                                <Text size="sm">Đăng nhập</Text>
                                            </Menu.Item>
                                            <Menu.Item
                                                leftSection={<BiUser size={16} />}
                                                component={Link}
                                                to="/register"
                                            >
                                                <Text size="sm">Đăng ký</Text>
                                            </Menu.Item>
                                        </>
                                    )}
                                </Menu.Dropdown>
                            </Menu>
                            <Divider size={'2'} orientation='vertical' />
                            {/* Cart button */}
                            <UnstyledButton
                                className="flex items-center gap-2 mr-4 text-contentText hover:text-primary transition-colors"
                                onClick={handleOpenCart}
                            >
                                <div className="relative">
                                    <FiShoppingCart size={20} />
                                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                        {user?.cartCount || 0}
                                    </span>
                                </div>
                            </UnstyledButton>
                        </Group>
                        {/* Top bar: Empty space + địa chỉ */}
                        <Flex className="mt-1 mb-1 mr-2" justify="flex-end">
                            <Group gap="xs" className="text-gray-600 items-center">
                                {isAuthenticated ? (
                                    <>
                                        <FiMapPin size={14} />
                                        <Text size="sm">Giao đến: <Text component="span" size="sm" fw={600} onClick={() => setAddressModalOpened(true)} className="hover:text-primary cursor-pointer">{user?.address?.districtName + ", " + user?.address?.provinceName || "Nho cap nhat dia chi nhe"}</Text></Text>
                                    </>
                                ) : (
                                    <Text size="sm">Đăng nhập để xem địa chỉ...</Text>
                                )}
                            </Group>
                        </Flex>
                    </Stack>

                </div>
            </Container>
            {/* Modal địa chỉ */}
            {/* <ModalAddress
                opened={addressModalOpened}
                onClose={() => setAddressModalOpened(false)}
                addresses={SAVED_ADDRESSES}
                selectedAddressId={selectedAddressId}
                onSelectAddress={handleSelectAddress}
                onApplyAddress={handleApplyAddress}
            /> */}
        </header>
    );
}

export default Header;