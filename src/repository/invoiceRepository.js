class InvoiceRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createInvoice(data) {
    try {
      return await this.prisma.invoice.create({ data });
    } catch (error) {
      throw new Error("Failed to create invoice");
    }
  }

  async getInvoiceByOrderId(orderId) {
    try {
      return await this.prisma.invoice.findUnique({
        where: { orderId },
      });
    } catch (error) {
      throw new Error("Failed to fetch invoice by order ID");
    }
  }

  async getAllInvoices() {
    try {
      return await this.prisma.invoice.findMany();
    } catch (error) {
      throw new Error("Failed to fetch all invoices");
    }
  }
}

export default InvoiceRepository;
