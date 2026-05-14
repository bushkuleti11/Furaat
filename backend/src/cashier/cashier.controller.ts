import { Controller, Get, Post, Body, Headers, UseGuards } from '@nestjs/common';
import { CashierService } from './cashier.service';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('api')
@UseGuards(RolesGuard)
export class CashierController {
  constructor(private readonly cashierService: CashierService) {}

  // Anyone can view products
  @Get('products')
  @Roles('cashier', 'supervisor', 'admin')
  getProducts() {
    return this.cashierService.getProducts();
  }

  // Cashier can checkout
  @Post('checkout')
  @Roles('cashier')
  checkout(@Body() body: { items: Array<{ productId: number; quantity: number }>; paid: number }) {
    return this.cashierService.checkout(body.items, body.paid);
  }

  // Supervisor and Admin can view sales summary
  @Get('sales-summary')
  @Roles('supervisor', 'admin')
  getSalesSummary() {
    return this.cashierService.getSalesSummary();
  }

  // Only Admin can add products
  @Post('add-product')
  @Roles('admin')
  addProduct(@Body() body: { name: string; price: number; quantity: number }) {
    return this.cashierService.addProduct(body.name, body.price, body.quantity);
  }
}
