import PrismaClientProvider from "db/PrismaClientProvider";
export default function setupTests() {
    const context = {};
    beforeEach(()=>{
        context.prisma = PrismaClientProvider.prisma;
    });
}
