import { PrismaClient } from "@/db/client";

class PrismaClientProvider {
  prisma;

  constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: "",
        },
      },
    });
  }
}

export default new PrismaClientProvider();
