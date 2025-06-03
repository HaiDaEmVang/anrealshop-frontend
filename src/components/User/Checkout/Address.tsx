import {
  Badge,
  Box,
  Button,
  Collapse,
  Divider,
  Group,
  Paper,
  Radio,
  Stack,
  Text
} from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import { FiCheck, FiChevronDown, FiEdit, FiMapPin, FiX } from 'react-icons/fi';
import ModalFormAddress from './ModalFormAddress';

// Interface cho địa chỉ giao hàng
export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  ward: string;
  streetAddress: string;
  isDefault: boolean;
}

interface AddressProps {
  savedAddresses: ShippingAddress[];
  selectedAddress: ShippingAddress | null;
  setSelectedAddress: (address: ShippingAddress) => void;
  onAddNewAddress: (address: ShippingAddress) => void;
  onUpdateAddress: (oldAddress: ShippingAddress, newAddress: ShippingAddress) => void;
  dummyVietnamProvinces: { value: string; label: string }[];
  dummyVietnamDistricts: Record<string, { value: string; label: string }[]>;
  dummyVietnamWards: Record<string, { value: string; label: string }[]>;
}

const Address: React.FC<AddressProps> = ({
  savedAddresses,
  selectedAddress,
  setSelectedAddress,
  onAddNewAddress,
  onUpdateAddress,
  dummyVietnamProvinces,
  dummyVietnamDistricts,
  dummyVietnamWards,
}) => {
  const [newAddressModalOpened, setNewAddressModalOpened] = useState(false);
  const [editAddressModalOpened, setEditAddressModalOpened] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<ShippingAddress | null>(null);
  const [showAddressSelection, setShowAddressSelection] = useState(false);
  // State lưu trữ địa chỉ đang được chọn tạm thời (chưa xác nhận)
  const [tempSelectedAddress, setTempSelectedAddress] = useState<ShippingAddress | null>(null);

  // Tham chiếu đến component để có thể scroll đến
  const addressComponentRef = useRef<HTMLDivElement>(null);

  // Đảm bảo luôn có một địa chỉ được chọn, mặc định là địa chỉ default
  useEffect(() => {
    if (!selectedAddress && savedAddresses.length > 0) {
      const defaultAddress = savedAddresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddress(defaultAddress);
      } else {
        // Nếu không có địa chỉ mặc định, chọn địa chỉ đầu tiên
        setSelectedAddress(savedAddresses[0]);
      }
    }
  }, [savedAddresses, selectedAddress, setSelectedAddress]);

  // Khi mở chọn địa chỉ, khởi tạo địa chỉ tạm là địa chỉ hiện tại
  useEffect(() => {
    if (showAddressSelection) {
      setTempSelectedAddress(selectedAddress);
    }
  }, [showAddressSelection, selectedAddress]);


  // Xác nhận lựa chọn địa chỉ
  const confirmAddressSelection = () => {
    if (tempSelectedAddress) {
      setSelectedAddress(tempSelectedAddress);
    }
    setShowAddressSelection(false);

    setTimeout(() => {
      if (addressComponentRef.current) {
        const topPosition = addressComponentRef.current.getBoundingClientRect().top;
        const offsetPosition = topPosition + window.pageYOffset - 50;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 500);
  };

  // Hủy việc chọn địa chỉ
  const cancelAddressSelection = () => {
    setTempSelectedAddress(selectedAddress);
    setShowAddressSelection(false);
  };

  // Mở modal chỉnh sửa địa chỉ
  const handleEditAddress = (event: React.MouseEvent, address: ShippingAddress) => {
    event.stopPropagation(); // Ngăn không cho sự kiện click lan ra ngoài (không chọn địa chỉ)
    setAddressToEdit(address);
    setEditAddressModalOpened(true);
  };

  // Hiển thị một địa chỉ
  const renderAddress = (address: ShippingAddress, isInSelectionMode = false) => {
    // Xác định địa chỉ được chọn dựa trên chế độ hiển thị
    const isSelected = isInSelectionMode
      ? tempSelectedAddress === address
      : selectedAddress === address;

    return (
      <Paper
        key={`${address.fullName}-${address.phone}`}
        shadow="xs"
        p="md"
        radius="md"
        className={`transition-all cursor-pointer ${isInSelectionMode
            ? (isSelected
              ? 'border-2 border-primary bg-picton-blue-50'
              : 'border-2 border-transparent hover:bg-gray-50'
            )
            : 'hover:bg-gray-50 border-gray-200'
          }`}
        onClick={() => {
          // Trong chế độ chọn, chỉ cập nhật địa chỉ tạm
          if (isInSelectionMode) {
            setTempSelectedAddress(address);
          } else {
            setSelectedAddress(address);
          }
        }}
      >
        <Group justify="space-between" align="start">
          <Radio
            checked={isSelected}
            onChange={() => {
              if (isInSelectionMode) {
                setTempSelectedAddress(address);
              } else {
                setSelectedAddress(address);
              }
            }}
            label={
              <Group wrap="nowrap" align="center">
                <Text fw={600} size="md" className="text-slate-800">
                  {address.fullName}
                </Text>
                {address.isDefault && (
                  <Badge variant="outline" color="blue" size="sm">
                    Mặc định
                  </Badge>
                )}
              </Group>
            }
            classNames={{
              root: "flex items-center",
              body: "flex items-center",
            }}
          />

          {/* Nút chỉnh sửa địa chỉ */}
          <Button
            variant="subtle"
            color="blue"
            size="xs"
            onClick={(e) => handleEditAddress(e, address)}
            leftSection={<FiEdit size={14} />}
          >
            Chỉnh sửa
          </Button>
        </Group>

        <Box ml={30} className="text-contentText">
          <Group gap="xs">
            <Text size="sm">{address.phone}</Text>
            <Box className="w-1 h-1 bg-gray-400 rounded-full"></Box>
            <Text size="sm">{address.email}</Text>
          </Group>
          <Text size="sm" className="mt-2">
            {address.streetAddress}, {address.ward}, {address.district}, {address.province}
          </Text>
        </Box>
      </Paper>
    );
  };

  return (
    <>
      <Paper
        radius="md"
        shadow="sm"
        p="md"
        className="bg-white mb-6"
        ref={addressComponentRef} // Thêm tham chiếu vào paper
        id="address-component" // Thêm ID để có thể tham chiếu bên ngoài nếu cần
      >
        <Group justify="space-between" className="mb-3">
          <Text fw={600} size="md" className="text-slate-800 flex items-center">
            <FiMapPin className="inline-block mr-2" size={16} />
            Địa chỉ giao hàng
          </Text>

          <Group gap="xs">
            {/* Nút hiển thị/ẩn danh sách địa chỉ */}
            {!showAddressSelection && savedAddresses.length > 1 && (
              <Button
                variant="subtle"
                color="gray"
                size="sm"
                onClick={() => setShowAddressSelection(true)}
                rightSection={<FiChevronDown size={14} />}
              >
                Thay đổi địa chỉ
              </Button>
            )}

            {/* Nút thêm địa chỉ mới */}
            <Button
              variant="outline"
              color="blue"
              size="sm"
              onClick={() => setNewAddressModalOpened(true)}
              className="hover:bg-picton-blue-50"
            >
              + Thêm địa chỉ mới
            </Button>
          </Group>
        </Group>

        {/* Địa chỉ đã chọn - chỉ hiển thị khi không ở chế độ chọn địa chỉ */}
        {!showAddressSelection && (
          <Stack gap="md" className="mb-1">
            {selectedAddress && renderAddress(selectedAddress)}
          </Stack>
        )}

        {/* Khu vực chọn địa chỉ - hiển thị khi ở chế độ chọn địa chỉ */}
        <Collapse in={showAddressSelection}>
          <Box className="p-0 rounded-lg">
            <Stack gap="md" className="mb-4">
              {savedAddresses.map(address => renderAddress(address, true))}
            </Stack>

            <Divider my="md" />

            <Group justify="right" mt="md">
              <Button
                variant="subtle"
                color="gray"
                onClick={cancelAddressSelection}
                leftSection={<FiX size={16} />}
              >
                Hủy
              </Button>
              <Button
                color="blue"
                onClick={confirmAddressSelection}
                leftSection={<FiCheck size={16} />}
                className="bg-primary hover:bg-picton-blue-600"
              >
                Xác nhận
              </Button>
            </Group>
          </Box>
        </Collapse>
      </Paper>

      {/* Modal thêm địa chỉ mới */}
      <ModalFormAddress
        opened={newAddressModalOpened}
        onClose={() => setNewAddressModalOpened(false)}
        onAddAddress={(address) => {
          onAddNewAddress(address);
          setShowAddressSelection(false);

          // Cũng scroll đến component này sau khi thêm địa chỉ mới
          setTimeout(() => {
            if (addressComponentRef.current) {
              const topPosition = addressComponentRef.current.getBoundingClientRect().top;
              const offsetPosition = topPosition + window.pageYOffset - 50;

              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            }
          }, 500);
        }}
        dummyVietnamProvinces={dummyVietnamProvinces}
        dummyVietnamDistricts={dummyVietnamDistricts}
        dummyVietnamWards={dummyVietnamWards}
      />

      {/* Modal chỉnh sửa địa chỉ */}
      <ModalFormAddress
        opened={editAddressModalOpened}
        onClose={() => setEditAddressModalOpened(false)}
        onAddAddress={(newAddress) => {
          if (addressToEdit) {
            onUpdateAddress(addressToEdit, newAddress);

            // Nếu địa chỉ đang được chỉnh sửa là địa chỉ đang được chọn, cập nhật lựa chọn
            if (selectedAddress === addressToEdit) {
              setSelectedAddress(newAddress);
            }

            // Nếu đang ở chế độ chọn và địa chỉ tạm là địa chỉ đang chỉnh sửa, cập nhật
            if (tempSelectedAddress === addressToEdit) {
              setTempSelectedAddress(newAddress);
            }
          }
          setEditAddressModalOpened(false);
        }}
        dummyVietnamProvinces={dummyVietnamProvinces}
        dummyVietnamDistricts={dummyVietnamDistricts}
        dummyVietnamWards={dummyVietnamWards}
        addressToEdit={addressToEdit}
      />
    </>
  );
};

export default Address;