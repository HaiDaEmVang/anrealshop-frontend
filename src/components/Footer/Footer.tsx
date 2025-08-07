import { ActionIcon, Anchor, Container, Grid, Group, Text, TextInput, Title, UnstyledButton } from '@mantine/core';
import { FaCcMastercard, FaCcVisa, FaCreditCard, FaFacebook, FaInstagram, FaPaypal, FaTwitter } from 'react-icons/fa';
import { FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-t-slate-200">
      {/* Main footer content */}
      <Container size="xl" className="py-10">
        <Grid>
          {/* Company info */}
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <div className="mb-6 ">
              <div className="flex items-center gap-2 mb-4">
                <img src="/images/logo.jfif" alt="AnrealShop" className="h-8 w-auto" />
                <div className="text-xl font-bold">
                  <span className="text-primary">Anreal</span>
                  <span className="text-contentText">Shop</span>
                </div>
              </div>
              <Text size="sm" className="!text-gray-500 !mb-2">
                AnrealShop - Điểm đến mua sắm trực tuyến đáng tin cậy của bạn với các sản phẩm chất lượng và giá cả phải chăng.
              </Text>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <FiMapPin className="!text-gray-500 group-hover:text-primary" size={16} />
                  <Text size="sm" className="!text-gray-500">
                    123 Đường Chính, Thành Phố, Quốc Gia
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="!text-gray-500 group-hover:text-primary" size={16} />
                  <Text size="sm" className="!text-gray-500">
                    +84 (234) 567-890
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <FiMail className="!text-gray-500 group-hover:text-primary" size={16} />
                  <Text size="sm" className="!text-gray-500">
                    lienhe@anrealshop.com
                  </Text>
                </div>
              </div>
            </div>
          </Grid.Col>

          {/* Quick links */}
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }} >
            <Title order={4} className="!mb-4 text-gray-700">Liên Kết Nhanh</Title>
            <div className="flex flex-col gap-2">
              {[
                'Trang Chủ', 
                'Cửa Hàng', 
                'Về Chúng Tôi', 
                'Liên Hệ', 
                'Câu Hỏi Thường Gặp'
              ].map((link) => (
                <Anchor 
                  key={link}
                  component="a" 
                  href="#" 
                  underline="never"
                  className="!text-gray-500 hover:!text-primary hover:!ml-1 transition-all duration-200 !text-sm"
                >
                  {link}
                </Anchor>
              ))}
            </div>
          </Grid.Col>

          {/* Customer service */}
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Title order={4} className="!mb-4 text-gray-700">Dịch Vụ Khách Hàng</Title>
            <div className="flex flex-col gap-2">
              {[
                'Tài Khoản Của Tôi', 
                'Theo Dõi Đơn Hàng', 
                'Danh Sách Yêu Thích', 
                'Chính Sách Đổi Trả', 
                'Điều Khoản & Điều Kiện'
              ].map((link) => (
                <Anchor 
                  key={link}
                  component="a" 
                  href="#" 
                  underline="never"
                className="!text-gray-500 hover:!text-primary hover:!ml-1 transition-all duration-200 !text-sm"
                >
                  {link}
                </Anchor>
              ))}
            </div>
          </Grid.Col>

          {/* Newsletter */}
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Title order={4} className="!mb-4 text-gray-700">Bản Tin</Title>
            <Text size="sm" className="!text-gray-500 mb-4">
              Đăng ký nhận bản tin của chúng tôi để cập nhật những ưu đãi mới nhất!
            </Text>
            <div className="flex mb-6">
              <TextInput
                placeholder="Nhập email của bạn"
                size="sm"
                rightSection={
                  <ActionIcon 
                    variant="filled" 
                    color="primary" 
                    size="md" 
                    radius="sm" 
                    className="!bg-primary hover:!bg-primary/80"
                  >
                    <FiSend size={16} />
                  </ActionIcon>
                }
                // styles={{
                //   input: {
                //     '&:focus-within': {
                //       borderColor: 'var(--mantine-color-primary-6)',
                //     },
                //   }
                // }}
              />
            </div>
            
            {/* Payment methods */}
            <Title order={5} className="mb-2 text-gray-700">Phương Thức Thanh Toán</Title>
            <div className="flex gap-2">
              <FaCreditCard size={24} className="!text-gray-500 hover:text-primary transition-colors" />
              <FaPaypal size={24} className="!text-gray-500 hover:text-primary transition-colors" />
              <FaCcVisa size={24} className="!text-gray-500 hover:text-primary transition-colors" />
              <FaCcMastercard size={24} className="!text-gray-500 hover:text-primary transition-colors" />
            </div>
          </Grid.Col>
        </Grid>
      </Container>
      
      {/* Bottom bar */}
      <div className="bg-slate-100 py-4 border-t border-t-slate-200">
        <Container size="xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Text size="sm" className="!text-gray-500 ">
              © {currentYear} AnrealShop. Tất cả các quyền được bảo lưu.
            </Text>
            
            {/* Social links */}
            <Group gap="md">
              <UnstyledButton className="!text-gray-500 hover:text-primary transition-colors">
                <FaFacebook size={18} />
              </UnstyledButton>
              <UnstyledButton className="!text-gray-500 hover:text-primary transition-colors">
                <FaTwitter size={18} />
              </UnstyledButton>
              <UnstyledButton className="!text-gray-500 hover:text-primary transition-colors">
                <FaInstagram size={18} />
              </UnstyledButton>
            </Group>
          </div>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;