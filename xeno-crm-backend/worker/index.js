import { startCustomerConsumer } from './customerConsumer.js';
import { startDeliveryConsumer } from './deliveryConsumer.js';

export const startConsumers = () => {
  console.log('Starting Redis consumers...');
  startCustomerConsumer();
  startDeliveryConsumer();
};