import PrismaClientProvider from "@/db/PrismaClientProvider";

export default function setupTests() {
  const context: any = {};

  beforeEach(() => {
    context.prisma = PrismaClientProvider.prisma;
  });
}
