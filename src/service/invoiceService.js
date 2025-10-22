import PDFDocument from "pdfkit";
import fs from "fs";

class InvoiceService {
  constructor(invoiceRepository, orderService, fileUploadLib, logger) {
    this.invoiceRepository = invoiceRepository;
    this.orderService = orderService;
    this.fileUploadLib = fileUploadLib;
    this.logger = logger;
  }

  // Create a new invoice for an order
  async createInvoice(orderId) {
    try {
      // Check if invoice already exists
      const existing = await this.invoiceRepository.getInvoiceByOrderId(orderId);
      if (existing) throw new Error(`Invoice for order ${orderId} already exists`);

      // Fetch order and details
      const order = await this.orderService.getOrderById(orderId);
      if (!order) throw new Error(`Order ${orderId} not found`);

      // Generate PDF buffer
      const pdfBuffer = await this.generateInvoicePDFBuffer(order);

      // Create pseudo file for upload
      const attachment = {
        name: `invoice_order_${order.id}.pdf`,
        mv: (filePath, cb) => fs.writeFile(filePath, pdfBuffer, cb),
      };

      const uploaded = await this.fileUploadLib.upload(attachment);

      // Save invoice in DB
      const invoice = await this.invoiceRepository.createInvoice({
        orderId: parseInt(orderId),
        pdfUrl: uploaded.fileName, // URL/path for frontend
      });

      this.logger.info({
        module: "InvoiceService",
        fn: "createInvoice",
        message: "Invoice created successfully",
        orderId,
        pdfUrl: uploaded.fileName,
      });

      return invoice;
    } catch (error) {
      this.logger.error({
        module: "InvoiceService",
        fn: "createInvoice",
        message: error.message,
        orderId,
      });
      throw error;
    }
  }

  async generateInvoicePDFBuffer(order) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      // Header
      doc.fontSize(18).text(`Invoice for Order #${order.id}`, { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Name: ${order.name} ${order.surname}`);
      doc.text(`Email: ${order.email}`);
      doc.text(`Address: ${order.address}, ${order.city}, ${order.country}`);
      doc.text(`Postal Code: ${order.postalCode}`);
      doc.moveDown();

      // Items
      doc.text("Items:", { underline: true });
      order.orderDetails.forEach((item) => {
        doc.text(
          `${item.product.name} - ${item.quantity} x $${item.price.toFixed(2)} = $${item.totalPrice.toFixed(2)}`
        );
      });

      doc.moveDown();
      doc.text(`Total: $${order.totalPrice.toFixed(2)}`, { bold: true });
      doc.end();
    });
  }

  async getInvoice(orderId) {
    try {
      const invoice = await this.invoiceRepository.getInvoiceByOrderId(parseInt(orderId));
      if (!invoice) throw new Error(`Invoice for order ${orderId} not found`);
      return invoice;
    } catch (error) {
      this.logger.error({
        module: "InvoiceService",
        fn: "getInvoice",
        message: error.message,
        orderId,
      });
      throw error;
    }
  }
}

export default InvoiceService;
