import React, { useState } from 'react';
import { Button, Paper, Text, Timeline, Title } from '@mantine/core';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface HistoryItem {
    date: string;
    time: string;
    status: string;
    description: string;
    title?: string;
    hasImage?: boolean;
}

interface HistoryStatusProps {
    historyItems: HistoryItem[];
    title?: string;
    collapsible?: boolean;
    initialCollapsed?: boolean;
    itemsToShowWhenCollapsed?: number;
}

const HistoryStatus: React.FC<HistoryStatusProps> = ({
    historyItems,
    title = "Lịch sử đơn hàng",
    collapsible = true,
    initialCollapsed = false,
    itemsToShowWhenCollapsed = 4
}) => {
    const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);

    // Determine which items to show based on collapsed state
    const displayedItems = isCollapsed && collapsible
        ? historyItems.slice(0, itemsToShowWhenCollapsed)
        : historyItems;

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <Paper withBorder p="md" radius="md">
            <Title order={4} mb="md">{title}</Title>

            <Timeline active={displayedItems.length} bulletSize={20} lineWidth={2}>
                {displayedItems.map((item, index) => (
                    <Timeline.Item
                        key={index}
                        title={item.title ? <Text size="sm" fw={500}>{item.title}</Text> : undefined}
                        lineVariant={historyItems.length >= index ? 'solid' : 'dashed'}
                    >
                        <Text size="xs" color="dimmed">{item.time} {item.date}</Text>
                        <Text size="xs">{item.description}</Text>
                    </Timeline.Item>
                ))}
            </Timeline>

            {collapsible && historyItems.length > itemsToShowWhenCollapsed && (
                <Button
                    variant="subtle"
                    fullWidth
                    mt="md"
                    size="xs"
                    onClick={toggleCollapse}
                    rightSection={isCollapsed ? <FiChevronDown size={14} /> : <FiChevronUp size={14} />}
                >
                    {isCollapsed ? `Xem thêm (${historyItems.length - itemsToShowWhenCollapsed})` : 'Rút gọn'}
                </Button>
            )}
        </Paper>
    );
};

export default HistoryStatus;
