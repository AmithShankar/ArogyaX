import { InvoiceWithPatient } from "@/types";

export function getInvoiceHtml(invoice: InvoiceWithPatient) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice - ${invoice.id}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
          body { 
            font-family: 'Inter', sans-serif; 
            padding: 40px; 
            color: #1e293b;
            line-height: 1.5;
          }
          .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .brand { color: #2563eb; font-weight: 700; font-size: 24px; }
          .invoice-details { text-align: right; }
          .invoice-id { font-mono; color: #64748b; font-size: 14px; }
          .section { margin-bottom: 30px; }
          .section-title { font-weight: 700; font-size: 12px; text-transform: uppercase; color: #64748b; margin-bottom: 10px; }
          .patient-info { font-size: 16px; font-weight: 600; }
          .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .table th { text-align: left; padding: 12px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 14px; }
          .table td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 15px; }
          .totals { margin-top: 30px; text-align: right; }
          .total-row { display: flex; justify-content: flex-end; gap: 20px; font-size: 18px; font-weight: 700; }
          .status-badge { 
            display: inline-block; 
            padding: 4px 12px; 
            border-radius: 9999px; 
            font-size: 12px; 
            font-weight: 600; 
            text-transform: uppercase;
            background: #f1f5f9;
            color: #475569;
          }
          .status-badge.status-paid { background: #dcfce7; color: #166534; }
          .footer { margin-top: 50px; text-align: center; color: #94a3b8; font-size: 12px; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">ArogyaX</div>
            <div style="font-size: 14px; color: #64748b; margin-top: 4px;">Smart Healthcare Management</div>
          </div>
          <div class="invoice-details">
            <div style="font-weight: 700; font-size: 20px;">INVOICE</div>
            <div class="invoice-id">#${invoice.id}</div>
            <div style="margin-top: 8px;">Date: ${new Date(invoice.date).toLocaleDateString("en-IN")}</div>
          </div>
        </div>

        <div style="display: flex; gap: 60px;">
          <div class="section" style="flex: 1;">
            <div class="section-title">Patient Details</div>
            <div class="patient-info">${invoice.patientName}</div>
            <div style="color: #64748b; font-size: 14px; margin-top: 4px;">Phone: ${invoice.patientPhone || "N/A"}</div>
            <div style="color: #64748b; font-size: 14px;">Patient ID: ${invoice.patientId}</div>
          </div>
          <div class="section" style="flex: 1;">
            <div class="section-title">Payment Status</div>
            <div class="status-badge ${invoice.status === "paid" ? "status-paid" : ""}">
              ${invoice.status === "pending" ? "Awaiting Payment" : invoice.status}
            </div>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-weight: 600;">${invoice.name}</td>
              <td style="text-align: right; font-weight: 600;">₹${Number(
                invoice.amount
              ).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <div class="totals">
          <div class="total-row">
            <span style="color: #64748b;">Total Amount:</span>
            <span>₹${Number(invoice.amount).toLocaleString()}</span>
          </div>
        </div>

        <div class="footer">
          <p>This is a computer generated invoice. No signature required.</p>
          <p>Thank you for choosing ArogyaX Healthcare.</p>
        </div>

        <script>
          window.onload = () => {
            window.print();
            setTimeout(() => window.close(), 100);
          };
        </script>
      </body>
    </html>
  `;
}
