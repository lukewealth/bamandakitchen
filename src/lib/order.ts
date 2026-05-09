/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CartItem, Order } from '../types';

export const generateOrderId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `BAM-${timestamp}-${random}`;
};

export const formatWhatsAppMessage = (order: Order) => {
  const itemDetails = order.items.map(item => 
    `• ${item.name} (${item.portion || 'Full'}) x ${item.quantity} - ₦${(item.price * item.quantity).toLocaleString()}` +
    (item.whatsappLink ? `\n  🔗 View: ${item.whatsappLink}` : '')
  ).join('\n');

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = order.total - subtotal;

  const message = 
    `🍱 *NEW ORDER - BAMANDA KITCHEN*\n` +
    `🆔 *Order ID:* ${order.id}\n` +
    `📅 *Date:* ${new Date(order.createdAt).toLocaleString()}\n\n` +
    `*Patron Details:*\n` +
    `👤 Name: ${order.customer.name}\n` +
    `📞 Phone: ${order.customer.phone}\n` +
    `📍 Address: ${order.customer.address}\n` +
    (order.notes ? `📝 Notes: ${order.notes}\n` : '') +
    `\n*Order Inventory:*\n${itemDetails}\n\n` +
    `*Financial Summary:*\n` +
    `💰 Subtotal: ₦${subtotal.toLocaleString()}\n` +
    `🚚 Delivery: ₦${deliveryFee.toLocaleString()}\n` +
    `⭐ *Total: ₦${order.total.toLocaleString()}*\n\n` +
    `_Metadata: ${order.metadata?.platform} v${order.metadata?.version}_\n` +
    `_Please confirm my curation for immediate dispatch._`;

  return encodeURIComponent(message);
};

export const formatStatusUpdateMessage = (order: Order) => {
  const statusEmoji = order.status === 'delivered' ? '✅' : order.status === 'on-the-way' ? '🚚' : '🔥';
  const statusText = order.status.toUpperCase().replace('-', ' ');

  const message = 
    `🔔 *ORDER UPDATE - BAMANDA KITCHEN*\n` +
    `🆔 *Order ID:* ${order.id}\n` +
    `📍 *Status:* ${statusEmoji} ${statusText}\n\n` +
    `Hello ${order.customer.name}, your heritage curation is currently in the *${statusText}* phase.\n\n` +
    `Estimated delivery time: ${order.estimatedDeliveryTime} minutes.\n\n` +
    `_Thank you for your patience and trust in our sanctuary._`;

  return encodeURIComponent(message);
};

export const formatQuickWhatsAppMessage = (items: CartItem[], totalPrice: number) => {
  const itemDetails = items.map(item => 
    `- ${item.name} (${item.quantity}x) - ₦${(item.price * item.quantity).toLocaleString()}`
  ).join('\n');

  const message = 
    `🍱 *QUICK INQUIRY - BAMANDA KITCHEN*\n\n` +
    `I would like to place an order for the following:\n\n` +
    `${itemDetails}\n\n` +
    `⭐ *Total Estimated: ₦${totalPrice.toLocaleString()}*\n\n` +
    `_Please let me know if this is available for dispatch. Thank you!_`;

  return encodeURIComponent(message);
};

export const getWhatsAppUrl = (message: string, phone: string = '2349024084911') => {
  let cleanPhone = phone.replace(/\D/g, '');
  
  // Handle Nigerian number formatting
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '234' + cleanPhone.substring(1);
  } else if (!cleanPhone.startsWith('234') && cleanPhone.length === 10) {
    // Case where they enter 902... without 0
    cleanPhone = '234' + cleanPhone;
  }
  
  return `https://wa.me/${cleanPhone}?text=${message}`;
};
