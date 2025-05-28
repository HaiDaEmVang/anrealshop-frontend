import {
    Button,
    CloseButton,
    Container,
    Divider,
    Group,
    Input,
    Text,
    UnstyledButton,
    Menu
} from '@mantine/core';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FiHome, FiShoppingCart, FiUser, FiPackage, FiLogOut, FiLogIn } from 'react-icons/fi';
import { BiUser } from 'react-icons/bi';

export function Header() {
    const [searchValue, setSearchValue] = useState('');
    const isLoggedIn = false;

    return (
        <header className="bg-white shadow-sm py-4">
            <Container size="xl">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        {/* <img src="images/logo.jfif" alt="AnrealShop Logo" className="h-1 w-auto" /> */}
                        <div className="text-2xl font-bold">
                            <span className="text-primary">Anreal</span>
                            <span className="text-contentText">Shop</span>
                        </div>
                    </div>

                    {/* Search bar with search button */}
                    <div className="w-full max-w-xl">
                        <Input
                            size="md"
                            radius="md"
                            className="w-full flex items-center gap-4 text-sm"
                            placeholder="Nhập từ khóa tìm kiếm..."
                            classNames={{
                                input: "placeholder:text-sm text-sm text-contentText", 
                            }}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            rightSectionPointerEvents="all"
                            leftSection={<FaSearch size={16} className="text-gray-400" />}
                            rightSectionWidth={144}
                            rightSection={
                                <div className="flex gap-1 items-center">
                                    <CloseButton
                                        className={`cursor-pointer ${searchValue ? 'visible' : 'invisible'}`}
                                        aria-label="Clear input"
                                        onClick={() => setSearchValue('')}
                                    />
                                    <Divider size={'2'} orientation='vertical' />
                                    <Button variant="subtle" radius="md">Tìm kiếm</Button>
                                </div>
                            }
                        />
                    </div>

                    {/* Navigation Buttons */}
                    <Group gap="lg" className="flex">
                        {/* Home button */}
                        <UnstyledButton className="flex gap-2 hover:text-primary transition-colors">
                            <FiHome size={18} />
                            <Text size="sm">Trang chủ</Text>
                        </UnstyledButton>

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
                                {isLoggedIn ? (
                                    <>
                                        <Menu.Item leftSection={<BiUser size={16} />}>
                                            <Text size="sm">Thông tin tài khoản</Text>
                                        </Menu.Item>
                                        <Menu.Item leftSection={<FiPackage size={16} />}>
                                            <Text size="sm">Đơn hàng của tôi</Text>
                                        </Menu.Item>
                                        <Menu.Divider />
                                        <Menu.Item leftSection={<FiLogOut size={16} />} color="red">
                                            <Text size="sm">Đăng xuất</Text>
                                        </Menu.Item>
                                    </>
                                ) : (
                                    <>
                                        <Menu.Item leftSection={<FiLogIn size={16} />}>
                                            <Text size="sm">Đăng nhập</Text>
                                        </Menu.Item>
                                        <Menu.Item leftSection={<BiUser size={16} />}>
                                            <Text size="sm">Đăng ký</Text>
                                        </Menu.Item>
                                    </>
                                )}
                            </Menu.Dropdown>
                        </Menu>
                        <Divider size={'2'} orientation='vertical' />
                        {/* Cart button */}
                        <UnstyledButton className="flex items-center gap-2 text-contentText hover:text-primary transition-colors">
                            <div className="relative">
                                <FiShoppingCart size={20} />
                                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                    0
                                </span>
                            </div>
                            <Text size="sm">Giỏ hàng</Text>
                        </UnstyledButton>
                    </Group>
                </div>
            </Container>
        </header>
    );
}