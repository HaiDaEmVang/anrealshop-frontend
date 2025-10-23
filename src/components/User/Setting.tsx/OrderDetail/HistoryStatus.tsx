import { Button, Paper, Text, Timeline, Title } from '@mantine/core';
import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useShipping } from '../../../../hooks/useShipping';
import type { HistoryShipping } from '../../../../types/ShipmentType';
import { formatDate } from '../../../../untils/Untils';


interface HistoryStatusProps {
    historyItems: HistoryShipping[];
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
    const { getShippingStatusLabel } = useShipping();

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
                        key={item.id || index}
                        title={<Text size="sm" fw={500}>{getShippingStatusLabel(item.status)}</Text>}
                        lineVariant={historyItems.length >= index ? 'solid' : 'dashed'}
                    >
                        {item.notes && item.notes.map((note, noteIdx) => {
                            return (
                                <div key={noteIdx} style={{ marginBottom: noteIdx < item.notes.length - 1 ? 8 : 0 }}>
                                    <Text size="xs" color="dimmed">{formatDate(note.timestamp.toString())}</Text>
                                    <Text size="xs">{note.content}</Text>
                                </div>
                            );
                        })}
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
