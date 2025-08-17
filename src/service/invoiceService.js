import BaseService from "./BaseService.js";
import PDFDocument from "pdfkit";
import fs from "fs";

class InvoiceService extends BaseService {
  constructor(invoiceRepository, orderService, fileUploadLib, logger) {
    super(logger);
    this.invoiceRepository = invoiceRepository;
    this.orderService = orderService;
    this.fileUploadLib = fileUploadLib; // your upload library
  }

  async createInvoice(orderId) {
    return this.wrapAsync("createInvoice", async () => {
      // Check if invoice already exists
      const existing = await this.invoiceRepository.getInvoiceByOrderId(
        orderId
      );
      if (existing)
        throw new Error(`Invoice for order ${orderId} already exists`);

      // Fetch order and details
      const order = await this.orderService.getOrderById(orderId);
      if (!order) throw new Error(`Order ${orderId} not found`);

      // Generate PDF as buffer
      const pdfBuffer = await this.generateInvoicePDFBuffer(order);

      // Create a pseudo attachment object to use your FileUploadLib
      const attachment = {
        name: `invoice_order_${order.id}.pdf`,
        mv: (filePath, cb) => {
          fs.writeFile(filePath, pdfBuffer, cb);
        },
      };

      const uploaded = await this.fileUploadLib.upload(attachment);

      // Save invoice in DB
      const invoice = await this.invoiceRepository.createInvoice({
        orderId,
        pdfUrl: `${uploaded.fileName}`, // path for frontend
      });

      this.logInfo("createInvoice", "Invoice created successfully", {
        orderId,
        pdfUrl: uploaded.fileName,
      });

      return invoice;
    });
  }

  generateInvoicePDFBuffer(order) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      // Header
      doc
        .fontSize(18)
        .text(`Invoice for Order #${order.id}`, { align: "center" });
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
          `${item.product.name} - ${item.quantity} x $${item.price.toFixed(
            2
          )} = $${item.totalPrice.toFixed(2)}`
        );
      });

      doc.moveDown();
      doc.text(`Total: $${order.totalPrice.toFixed(2)}`, { bold: true });
      doc.end();
    });
  }

  async getInvoice(orderId) {
    return this.wrapAsync("getInvoice", async () => {
      const invoice = await this.invoiceRepository.getInvoiceByOrderId(orderId);
      if (!invoice) throw new Error(`Invoice for order ${orderId} not found`);
      return invoice;
    });
  }
}

export default InvoiceService;
