import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function TableSkeleton() {

    return (
        <div className="w-full max-w-[1200px] mx-auto mt-1 flex flex-col gap-2 items-center">
            <Table className="w-full bg-layer-1 rounded border border-[#eaf0f6]">
                <TableHeader className="bg-[#f7f9fe] hover:bg-[#f7f9fe]">
                    <TableRow className="border-b border-[#eaf0fc]">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <TableHead key={`header-${i}`} className="border-r border-[#eaf0fc] last:border-r-0 p-2">
                                <div className="h-4 w-full max-w-[120px] rounded-[2px] bg-blue-100 animate-pulse" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 4 }).map((_, rowIndex) => (
                        <TableRow key={`row-${rowIndex}`} className="border-b border-[#eaf0fc] last:border-b-0 h-[85px] hover:bg-[#ffffff]">
                            {Array.from({ length: 3 }).map((_, colIndex) => (
                                <TableCell key={`cell-${rowIndex}-${colIndex}`} className="border-r border-[#eaf0fc] last:border-r-0">
                                    <div
                                        className="h-4 w-full rounded-[2px] bg-blue-50 animate-pulse mb-2"
                                        style={{
                                            animationDelay: `${rowIndex * 0.1 + colIndex * 0.05}s`,
                                            maxWidth: colIndex === 0 ? "140px" : "140px",
                                        }}
                                    />
                                    <div
                                        className="h-4 w-full rounded-[2px] bg-blue-50 animate-pulse"
                                        style={{
                                            animationDelay: `${rowIndex * 0.1 + colIndex * 0.05}s`,
                                            maxWidth: colIndex === 0 ? "240px" : "240px",
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