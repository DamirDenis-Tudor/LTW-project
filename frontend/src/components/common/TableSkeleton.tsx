import React from 'react';
import { Skeleton, TableRow, TableCell } from '@mui/material';

interface TableSkeletonProps {
    rows?: number;
    columns?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, columns = 4 }) => {
    return (
        <>
            {Array.from(new Array(rows)).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                    {Array.from(new Array(columns)).map((_, colIndex) => (
                        <TableCell key={colIndex}>
                            <Skeleton variant="text" animation="wave" />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
};

export default TableSkeleton;
