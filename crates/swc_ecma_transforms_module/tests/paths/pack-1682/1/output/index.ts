import PrismaClientProvider from "../db/PrismaClientProvider.js";
export default function setupTests() {
    const context = {};
    beforeEach(()=>{
        context.prisma = PrismaClientProvider.prisma;
    });
}
