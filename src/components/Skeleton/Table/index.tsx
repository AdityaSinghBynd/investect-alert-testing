import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function TableSkeleton() {

    return (
        <div className="w-full mx-auto mt-1 flex flex-col gap-2 items-center">
            <Table className="w-full bg-layer-1 rounded border border-primary">
                <TableHeader className="bg-layer-3 hover:bg-layer-3">
                    <TableRow className="bg-layer-3 hover:bg-layer-3 border-b border-primary">
                        <TableHead className="text-text-primary font-medium border-r border-primary">News</TableHead>
                        <TableHead className="text-text-primary font-medium border-r border-primary">Description</TableHead>
                        <TableHead className="text-text-primary font-medium border-r border-primary">Sources</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 4 }).map((_, rowIndex) => (
                        <TableRow key={`row-${rowIndex}`} className="border-b border-primary last:border-b-0 h-[85px] hover:bg-layer-2">
                            {Array.from({ length: 3 }).map((_, colIndex) => (
                                <TableCell key={`cell-${rowIndex}-${colIndex}`} className="border-r border-primary last:border-r-0">
                                    <div
                                        className="h-4 w-full rounded-[2px] bg-gray-200 animate-pulse mb-2"
                                        style={{
                                            animationDelay: `${rowIndex * 0.1 + colIndex * 0.05}s`,
                                            maxWidth: colIndex === 0 ? "140px" : "140px",
                                        }}
                                    />
                                    <div
                                        className="h-4 w-full rounded-[2px] bg-gray-200 animate-pulse"
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