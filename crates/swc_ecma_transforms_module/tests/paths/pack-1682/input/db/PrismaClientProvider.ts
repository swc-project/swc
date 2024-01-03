import { PrismaClient } from "@/db/client";

class PrismaClientProvider {
  readonly prisma: PrismaClient;

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
