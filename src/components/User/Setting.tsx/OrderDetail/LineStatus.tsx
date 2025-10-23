import React from 'react';
import { Stepper } from '@mantine/core';
import { FiCheck, FiClock, FiPackage, FiShoppingBag, FiStar, FiTruck } from 'react-icons/fi';

interface LineStatusProps {
    activeStep: number;
}

const LineStatus: React.FC<LineStatusProps> = ({ activeStep }) => {
    return (
        <Stepper active={activeStep} color="blue" classNames={{
            stepLabel: 'flex flex-col items-center mt-4',
            step: '!flex !flex-col !items-center justify-center',
            steps: 'justify-center',
            separator: 'mx-0 -mt-12',
        }}>
            <Stepper.Step
                label="Đặt hàng"
                description="Đơn hàng đã đặt"
                icon={<FiClock size={18} />}
                completedIcon={<FiCheck size={18} />}
            />
            <Stepper.Step
                label="Xác nhận"
                description="Đã thanh toán"
                icon={<FiPackage size={18} />}
                completedIcon={<FiCheck size={18} />}
            />
            <Stepper.Step
                label="Vận chuyển"
                description="Đang giao hàng"
                icon={<FiTruck size={18} />}
                completedIcon={<FiCheck size={18} />}
            />
            <Stepper.Step
                label="Hoàn thành"
                description="Đã nhận hàng"
                icon={<FiShoppingBag size={18} />}
                completedIcon={<FiCheck size={18} />}
            />
            <Stepper.Step
                label="Đánh giá"
                description="Đánh giá sản phẩm"
                icon={<FiStar size={18} />}
                completedIcon={<FiCheck size={18} />}
            />
        </Stepper>
    );
};

export default LineStatus;
