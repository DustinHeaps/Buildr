import { getFunnels } from '@/actions/funnel';
import { getMedia } from "@/actions/media";
import { getPipelineDetails } from "@/actions/pipeline";
import { getTicketsWithTags, _getTicketsWithAllRelations } from '@/actions/ticket';
import { getAuthUserDetails, getUserPermissions } from "@/actions/user";
import { db } from "@/lib/prisma";
import {
  Contact,
  Column,
  Notification,
  Prisma,
  Role,
  Tag,
  Ticket,
  User,
} from "@prisma/client";

  import Stripe from 'stripe'

export type TicketDetails = Prisma.PromiseReturnType<
  typeof _getTicketsWithAllRelations
>;
export type PricesList = Stripe.ApiList<Stripe.Price>;


export type NotificationWithUser =
  | ({
      User: {
        id: string;
        name: string;
        avatarUrl: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        role: Role;
        agencyId: string | null;
      };
    } & Notification)[]
  | undefined;

export type AuthUserWithAgencySigebarOptionsSubAccounts =
  Prisma.PromiseReturnType<typeof getAuthUserDetails>;

export type UserWithPermissionsAndSubAccounts = Prisma.PromiseReturnType<
  typeof getUserPermissions
>;

const __getUsersWithAgencySubAccountPermissionsSidebarOptions = async (
  agencyId: string
) => {
  return await db.user.findFirst({
    where: { Agency: { id: agencyId } },
    include: {
      Agency: { include: { SubAccount: true } },
      Permissions: { include: { SubAccount: true } },
    },
  });
};

export type UsersWithAgencySubAccountPermissionsSidebarOptions =
  Prisma.PromiseReturnType<
    typeof __getUsersWithAgencySubAccountPermissionsSidebarOptions
  >;

export type GetMediaFiles = Prisma.PromiseReturnType<typeof getMedia>;

export type CreateMediaType = Prisma.MediaCreateWithoutSubaccountInput;

export type TicketWithTags = Prisma.PromiseReturnType<
  typeof getTicketsWithTags
>;

export type TicketAndTags = Ticket & {
  Tags: Tag[];
  Assigned: User | null;
  Customer: Contact | null;
};

export type ColumnDetail = Column & {
  Tickets: TicketAndTags[];
};

export type PipelineDetailsWithColumnsCardsTagsTickets =
  Prisma.PromiseReturnType<typeof getPipelineDetails>;
export type Address = {
  city: string;
  country: string;
  line1: string;
  postal_code: string;
  state: string;
};

export type ShippingInfo = {
  address: Address;
  name: string;
};
export type StripeCustomerType = {
  email: string;
  name: string;
  shipping: ShippingInfo;
  address: Address;
};


export type FunnelsForSubAccount = Prisma.PromiseReturnType<
  typeof getFunnels
>[0]

export type CreateFunnelPage = Prisma.FunnelPageCreateWithoutFunnelInput