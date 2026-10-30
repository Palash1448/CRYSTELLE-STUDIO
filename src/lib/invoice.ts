import { type Order, type UserProfile } from '@/lib/auth';
import { money } from '@/lib/store-data';

export function generateInvoiceHtml(order: Order, user?: Partial<UserProfile> | null): string {
  const customerName = user?.fullName || 'Valued Customer';
  const customerEmail = user?.email || 'customer@crystellestudio.com';
  const customerPhone = user?.phone || '+91 98201 44520';
  const address = order.shippingAddress || user?.address || {
    street: 'Flat 402, Lotus Heights, Orchid Avenue',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400050',
    country: 'India',
  };

  const invoiceNumber = `INV-2026-${order.id.replace('#', '').replace('CS-', '').replace('ORD-', '')}`;
  const invoiceDate = order.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const paymentMethod = order.paymentMethod || 'Prepaid (Razorpay UPI / Cards)';
  const paymentStatus = order.paymentStatus || (order.status === 'Delivered' ? 'Paid & Verified' : 'Confirmed');
  const trackingNumber = order.trackingNumber || 'IND-CRYST-88419';

  const subtotal = order.subtotal ?? order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = order.shippingFee ?? (order.total > subtotal ? order.total - subtotal : 0);
  const discountAmount = order.discountAmount || 0;
  const grandTotal = order.total;

  const itemsRows = order.items
    .map((item, idx) => {
      const lineTotal = item.price * item.quantity;
      const sizeText = item.size > 1 ? `${item.size}g Wax` : '1 Set';
      return `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #EAE4DC; font-size: 11px; text-align: center; color: #78716C;">
            ${idx + 1}
          </td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #EAE4DC; font-size: 12px;">
            <strong style="color: #1C1917; display: block;">${item.name}</strong>
            <span style="font-size: 10px; color: #A67C2E; font-weight: 500;">Size: ${sizeText} • Handcrafted Botanical Soy Wax</span>
          </td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #EAE4DC; font-size: 11px; font-family: monospace; text-align: center; color: #57534E;">
            3406 00 10
          </td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #EAE4DC; font-size: 12px; font-weight: 600; text-align: center; color: #1C1917;">
            ${item.quantity}
          </td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #EAE4DC; font-size: 12px; font-family: monospace; text-align: right; color: #1C1917;">
            ${money(item.price)}
          </td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #EAE4DC; font-size: 12px; font-family: monospace; font-weight: 700; text-align: right; color: #1C1917;">
            ${money(lineTotal)}
          </td>
        </tr>
      `;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - ${order.id} - Crystelle Studio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #FAF8F5;
      color: #1C1917;
      padding: 30px 20px;
      -webkit-font-smoothing: antialiased;
    }
    .invoice-wrapper {
      max-width: 800px;
      margin: 0 auto;
      background: #FFFFFF;
      border: 1px solid #EAE4DC;
      border-radius: 20px;
      padding: 40px 48px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
    }
    .no-print-bar {
      max-width: 800px;
      margin: 0 auto 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: #FFFFFF;
      padding: 14px 24px;
      border: 1px solid #EAE4DC;
      border-radius: 14px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all .2s ease;
      text-decoration: none;
    }
    .btn-primary {
      background: #1C1917;
      color: #FFFFFF;
    }
    .btn-primary:hover {
      background: #A67C2E;
    }
    .btn-outline {
      background: #FAF8F5;
      color: #1C1917;
      border: 1px solid #EAE4DC;
    }
    .btn-outline:hover {
      background: #F2EDE4;
    }
    .brand-title {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 26px;
      font-weight: 700;
      color: #1C1917;
      line-height: 1.1;
    }
    .badge {
      display: inline-block;
      padding: 3px 9px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-paid {
      background: #ECFDF5;
      color: #065F46;
      border: 1px solid #A7F3D0;
    }
    .badge-cod {
      background: #FFFBEB;
      color: #92400E;
      border: 1px solid #FDE68A;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    @media print {
      body {
        background: #FFFFFF;
        padding: 0;
      }
      .no-print-bar {
        display: none !important;
      }
      .invoice-wrapper {
        border: none;
        box-shadow: none;
        padding: 20px 0;
        max-width: 100%;
      }
      @page {
        size: A4 portrait;
        margin: 15mm 15mm 15mm 15mm;
      }
    }
  </style>
</head>
<body>

  <!-- Top Action Bar for interactive browser preview -->
  <div class="no-print-bar">
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 13px; font-weight: 600; color: #1C1917;">Crystelle Studio Tax Invoice</span>
      <span style="font-size: 11px; color: #78716C; font-family: monospace;">(${order.id})</span>
    </div>
    <div style="display: flex; gap: 8px;">
      <button class="btn btn-primary" onclick="window.print()">
        🖨️ Print / Save as PDF
      </button>
      <button class="btn btn-outline" onclick="window.close()">
        ✕ Close
      </button>
    </div>
  </div>

  <!-- Official Tax Invoice Document -->
  <div class="invoice-wrapper" id="invoice-doc">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 24px; border-bottom: 2px solid #1C1917; gap: 20px;">
      <div>
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
          <img src="/crystelle-gold-logo.png" alt="Crystelle Studio" style="width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid #D4A359; object-fit: cover;" onerror="this.style.display='none'">
          <div>
            <h1 class="brand-title">Crystelle Studio</h1>
            <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; color: #A67C2E;">Handcrafted Candles & Fragrances</span>
          </div>
        </div>
        <p style="font-size: 11px; color: #78716C; line-height: 1.6; max-width: 380px;">
          Ward No 13, Shastri Nagar, Nachangaon Road, Pulgaon<br>
          Dist. Wardha, Maharashtra – 442302, India<br>
          Phone: +91 7058398041 • Email: crystellestudio.art@gmail.com
        </p>
        <p style="font-size: 11px; font-family: monospace; font-weight: 600; color: #44403C; margin-top: 6px;">
          GSTIN: 27AABCC1234F1Z8 • State Code: 27 (Maharashtra)
        </p>
      </div>

      <div style="text-align: right; background: #FAF8F5; padding: 14px 18px; border-radius: 14px; border: 1px solid #EAE4DC; min-width: 220px;">
        <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; color: #A67C2E; display: block; margin-bottom: 4px;">
          TAX INVOICE / BILL OF SUPPLY
        </span>
        <div style="font-size: 16px; font-family: monospace; font-weight: 700; color: #1C1917; margin-bottom: 4px;">
          ${invoiceNumber}
        </div>
        <div style="font-size: 11px; color: #78716C; margin-bottom: 2px;">
          Date: <strong style="color: #1C1917;">${invoiceDate}</strong>
        </div>
        <div style="font-size: 11px; color: #78716C; margin-bottom: 6px;">
          Order ID: <strong style="color: #1C1917;">${order.id}</strong>
        </div>
        <div>
          <span class="badge ${paymentStatus.includes('Paid') ? 'badge-paid' : 'badge-cod'}">
            ${paymentStatus}
          </span>
        </div>
      </div>
    </div>

    <!-- Customer & Shipping Section -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 20px 0; border-bottom: 1px solid #EAE4DC;">
      <div style="background: #FAF8F5; padding: 14px 16px; border-radius: 12px; border: 1px solid #EAE4DC;">
        <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; color: #A67C2E; display: block; margin-bottom: 6px;">
          Billed To & Shipped To (Customer)
        </span>
        <strong style="font-size: 13px; color: #1C1917; display: block; margin-bottom: 4px;">${customerName}</strong>
        <p style="font-size: 11px; color: #57534E; line-height: 1.6;">
          ${address.street || 'Address on record'}<br>
          ${address.city}, ${address.state} — ${address.postalCode}<br>
          ${address.country || 'India'}<br>
          Phone: ${customerPhone} • Email: ${customerEmail}
        </p>
      </div>

      <div style="background: #FAF8F5; padding: 14px 16px; border-radius: 12px; border: 1px solid #EAE4DC;">
        <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; color: #A67C2E; display: block; margin-bottom: 6px;">
          Logistics & Payment Details
        </span>
        <div style="font-size: 11px; color: #57534E; line-height: 1.8;">
          <div>Payment Mode: <strong style="color: #1C1917;">${paymentMethod}</strong></div>
          <div>Courier Partner: <strong style="color: #1C1917;">Delhivery / Bluedart Express</strong></div>
          <div>Tracking AWB: <strong style="color: #1C1917; font-family: monospace;">${trackingNumber}</strong></div>
          <div>Place of Supply: <strong style="color: #1C1917;">${address.state || 'Maharashtra'} (Code: 27)</strong></div>
        </div>
      </div>
    </div>

    <!-- Items Table -->
    <div style="padding: 20px 0;">
      <table>
        <thead>
          <tr style="background: #FAF8F5; border-bottom: 1.5px solid #EAE4DC;">
            <th style="padding: 10px 12px; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #78716C; text-align: center; width: 40px;">#</th>
            <th style="padding: 10px 12px; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #78716C; text-align: left;">Description of Fragrance Goods</th>
            <th style="padding: 10px 12px; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #78716C; text-align: center; width: 90px;">HSN/SAC</th>
            <th style="padding: 10px 12px; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #78716C; text-align: center; width: 60px;">Qty</th>
            <th style="padding: 10px 12px; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #78716C; text-align: right; width: 90px;">Rate</th>
            <th style="padding: 10px 12px; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #78716C; text-align: right; width: 100px;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
        </tbody>
      </table>
    </div>

    <!-- Summary & Totals -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-top: 10px; border-top: 1px solid #EAE4DC; gap: 30px;">
      <div style="max-width: 420px; font-size: 11px; color: #78716C; line-height: 1.6;">
        <p style="margin-bottom: 6px;">
          <strong style="color: #1C1917;">Tax Inclusive Bill:</strong> Goods & Services Tax (GST 18%) is already included in all product prices according to Central GST & State GST guidelines.
        </p>
        <p style="font-size: 10px; color: #A8A29E;">
          Declaration: We declare that this invoice shows the actual price of the artisan goods described and that all particulars are authentic, true and correct.
        </p>
      </div>

      <div style="min-width: 250px; background: #FAF8F5; padding: 14px 18px; border-radius: 12px; border: 1px solid #EAE4DC; font-size: 12px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #57534E;">
          <span>Items Subtotal:</span>
          <span style="font-family: monospace; font-weight: 600; color: #1C1917;">${money(subtotal)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #57534E;">
          <span>Courier Shipping:</span>
          <span style="font-family: monospace; font-weight: 600; color: #1C1917;">
            ${shippingFee === 0 ? '<span style="color: #065F46; font-size: 11px; font-weight: 700;">FREE</span>' : money(shippingFee)}
          </span>
        </div>
        ${
          discountAmount > 0
            ? `<div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #065F46; font-weight: 600;">
                <span>Discount Applied:</span>
                <span style="font-family: monospace;">-${money(discountAmount)}</span>
              </div>`
            : ''
        }
        <div style="display: flex; justify-content: space-between; padding-top: 8px; margin-top: 6px; border-top: 1.5px solid #EAE4DC; font-size: 14px; font-weight: 700; color: #1C1917;">
          <span>Total (INR):</span>
          <span style="font-family: monospace; font-size: 16px; color: #A67C2E;">${money(grandTotal)}</span>
        </div>
      </div>
    </div>

    <!-- Sign-off & Stamp -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 36px; margin-top: 20px; border-top: 1px dashed #EAE4DC;">
      <div style="font-size: 10px; color: #A8A29E; line-height: 1.5;">
        <span>Artisan Botanical Candles & Scent Studio</span><br>
        <span>This is a computer-generated tax invoice verified by Crystelle Studio.</span>
      </div>

      <div style="text-align: right;">
        <div style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 20px; font-style: italic; color: #A67C2E; font-weight: 600; margin-bottom: 4px;">
          Kartiki Chaudhari
        </div>
        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; color: #1C1917;">
          For Crystelle Studio
        </div>
        <span style="font-size: 9px; color: #78716C;">Authorized Signatory</span>
      </div>
    </div>
  </div>

  <script>
    // Automatically trigger print dialog when opened in new window
    window.addEventListener('load', () => {
      setTimeout(() => {
        window.print();
      }, 350);
    });
  </script>
</body>
</html>`;
}

export function downloadInvoice(order: Order, user?: Partial<UserProfile> | null): void {
  const html = generateInvoiceHtml(order, user);

  // Attempt 1: Open printable window (best browser experience for Save as PDF)
  let invoiceWindow: Window | null = null;
  try {
    invoiceWindow = window.open('', '_blank');
  } catch (e) {
    console.warn('Popup blocked, fallback to direct download', e);
  }

  if (invoiceWindow) {
    invoiceWindow.document.open();
    invoiceWindow.document.write(html);
    invoiceWindow.document.close();
  } else {
    // Attempt 2: Fallback to direct HTML file download if popups are completely disabled
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${order.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
}
