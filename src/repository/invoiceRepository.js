class InvoiceRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createInvoice(invoiceData) {
    return this.prisma.invoice.create({
      data: invoiceData,
    });
  }

  getInvoiceByOrderId(orderId) {
    return this.prisma.invoice.findUnique({
      where: { orderId },
    });
  }

  getAllInvoices() {
    return this.prisma.invoice.findMany();
  }
}

export default InvoiceRepository;
