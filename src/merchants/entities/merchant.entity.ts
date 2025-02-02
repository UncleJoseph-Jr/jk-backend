import { MerchantStatus } from '@prisma/client';

export class Merchant {
  id: number;
  name: string;
  categoryId: string;
  description?: string;
  contactNumber?: string;
  email?: string;
  address?: string;
  storeLogo?: string;
  status: MerchantStatus;
  createdAt: Date;
  updatedAt: Date;
}
