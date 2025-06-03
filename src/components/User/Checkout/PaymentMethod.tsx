import { Box, Collapse, Group, Paper, Radio, Stack, Text, Button } from '@mantine/core';
import { FiCreditCard, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useState } from 'react';

// Interface cho phương thức thanh toán
export interface PaymentMethodType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface PaymentMethodProps {
  paymentMethods: PaymentMethodType[];
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (id: string) => void;
}

const PaymentMethod = ({
  paymentMethods,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
}: PaymentMethodProps) => {
  // State để quản lý trạng thái hiển thị của danh sách phương thức thanh toán
  const [expanded, setExpanded] = useState(false);
  
  // Tìm phương thức thanh toán hiện tại được chọn để hiển thị khi thu gọn
  const selectedMethod = paymentMethods.find(method => method.id === selectedPaymentMethod);
  
  return (
    <Paper radius="md" shadow="sm" p="md" className="bg-white">
      <Group justify="space-between" className="mb-2">
        <Text fw={600} size="md" className="text-slate-800 flex items-center">
          <FiCreditCard className="inline-block mr-2" size={18} />
          Phương thức thanh toán
        </Text>
        
        {/* Nút ẩn/hiện */}
        <Button
          variant="subtle"
          color="gray"
          size="xs"
          onClick={() => setExpanded(!expanded)}
          rightSection={expanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        >
          {expanded ? "Thu gọn" : "Xem tất cả"}
        </Button>
      </Group>

      {/* Hiển thị phương thức đã chọn khi đang thu gọn */}
      {!expanded && selectedMethod && (
        <Paper
          shadow="xs"
          p="md"
          radius="md"
          className="border-2 border-transparent  cursor-pointer transition-all hover:!bg-gray-50"
          onClick={() => setExpanded(true)}
        >
          <Group gap={10}>
            <Radio
              checked={true}
              readOnly
              className="!mr-1"
            />
            <Box
              className={`w-10 h-10 flex items-center justify-center rounded-md bg-${
                selectedMethod.id === 'cod'
                  ? 'amber'
                  : selectedMethod.id === 'bank_transfer'
                  ? 'blue'
                  : selectedMethod.id === 'zalopay'
                  ? 'teal'
                  : 'purple'
              }-100`}
            >
              {selectedMethod.icon}
            </Box>
            <Box>
              <Text fw={600} className="text-slate-800">
                {selectedMethod.name}
              </Text>
              <Text size="sm" color="dimmed">
                {selectedMethod.description}
              </Text>
            </Box>
          </Group>
        </Paper>
      )}

      {/* Danh sách đầy đủ các phương thức thanh toán */}
      <Collapse in={expanded}>
        <Stack gap="md" mt={expanded ? 3 : 0}>
          {paymentMethods.map((method) => (
            <Paper
              key={method.id}
              shadow="xs"
              p="md"
              radius="md"
              className={`transition-all cursor-pointer border-2 ${
                selectedPaymentMethod === method.id
                  ? 'border-primary bg-picton-blue-50'
                  : 'border-transparent hover:bg-gray-50'
              }`}
              onClick={() => {setSelectedPaymentMethod(method.id); setExpanded(false);}}
            >
              <Group gap={10}>
                <Radio
                  checked={selectedPaymentMethod === method.id}
                  onChange={() => setSelectedPaymentMethod(method.id)}
                  className="!mr-1"
                />
                <Box
                  className={`w-10 h-10 flex items-center justify-center rounded-md bg-${
                    method.id === 'cod'
                      ? 'amber'
                      : method.id === 'bank_transfer'
                      ? 'blue'
                      : method.id === 'zalopay'
                      ? 'teal'
                      : 'purple'
                  }-100`}
                >
                  {method.icon}
                </Box>
                <Box>
                  <Text fw={600} className="text-slate-800">
                    {method.name}
                  </Text>
                  <Text size="sm" color="dimmed">
                    {method.description}
                  </Text>
                </Box>
              </Group>
            </Paper>
          ))}
        </Stack>
      </Collapse>
    </Paper>
  );
};

export default PaymentMethod;