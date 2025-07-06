// used in -  alert/[slug]/page.tsx

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function TableSkeleton() {

    return (
        <div className="rounded-xl border border-[#eaf0fc] overflow-hidden my-4">
            <Table className="border-[#eaf0fc]">
                <TableHeader className="h-[65px]">
                    <TableRow className="border-b bg-[#f7f9fe] border-[#eaf0fc]">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <TableHead key={`header-${i}`} className="h-12 font-semibold text-[#2D3648] px-6 py-4 text-xs tracking-wider bg-gradient-to-b from-[#f7f9fe] to-[#f3f6fc]">
                                <div className="h-6 w-full max-w-[120px] rounded-[2px] bg-gray-200 animate-pulse" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 5 }).map((_, rowIndex) => (
                        <TableRow key={`row-${rowIndex}`} className="h-[80px] border-b border-[#eaf0fc] hover:bg-[#f7f9fe] transition-colors duration-200">
                            {Array.from({ length: 4 }).map((_, colIndex) => (
                                <TableCell key={`cell-${rowIndex}-${colIndex}`} className="border-r last:border-r-0">
                                    <div
                                        className="h-6 w-full rounded-[2px] bg-gray-200 animate-pulse"
                                        style={{
                                            animationDelay: `${rowIndex * 0.1 + colIndex * 0.05}s`,
                                            maxWidth: colIndex === 0 ? "180px" : "180px",
                                        }}
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}