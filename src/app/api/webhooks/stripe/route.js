import Stripe from "stripe";
import { headers } from "next/headers";

import { buffer } from "node:stream/consumers";

import mongoose from "mongoose";
import Subscription from "@/lib/schemas/subscriptionSchema";
import { format } from "date-fns";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10",
});

export async function POST(req) {
  const body = await buffer(req.body);
  const signature = headers().get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(`⚠️ Error message: ${error.message}`);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  await mongoose.connect(process.env.MONGODB_URI + "manus-unitas");

  // Handle the event
  switch (event.type) {
    case "customer.subscription.deleted":
      const deletedSession = event.data.object;
      const deletedSubscription = await Subscription.findOne({
        subscriptionId: deletedSession.items.data[0].subscription,
      });

      console.log(deletedSession, deletedSubscription);

      // update subscription status to canceled

      //    {
      //      id: 'sub_1PVQ11RpYIAAAWYMgEfJC3JD',
      //      object: 'subscription',
      //      application: null,
      //      application_fee_percent: null,
      //      automatic_tax: { enabled: false, liability: null },
      //      billing_cycle_anchor: 1719285954,
      //      billing_cycle_anchor_config: null,
      //      billing_thresholds: null,
      //      cancel_at: null,
      //      cancel_at_period_end: false,
      //      canceled_at: 1719286014,
      //      cancellation_details: { comment: null, feedback: null, reason: 'cancellation_requested' },
      //      collection_method: 'charge_automatically',
      //      created: 1719285954,
      //      currency: 'usd',
      //      current_period_end: 1721877954,
      //      current_period_start: 1719285954,
      //      customer: 'cus_QLN7EMIgQ2xqY0',
      //      days_until_due: null,
      //      default_payment_method: 'pm_1PVQ1IRpYIAAAWYMgfk91OXY',
      //      default_source: null,
      //      default_tax_rates: [],
      //      description: null,
      //      discount: null,
      //      discounts: [],
      //      ended_at: 1719286014,
      //      invoice_settings: { account_tax_ids: null, issuer: { type: 'self' } },
      //      items: {
      //        object: 'list',
      //        data: [ [Object] ],
      //        has_more: false,
      //        total_count: 1,
      //        url: '/v1/subscription_items?subscription=sub_1PVQ11RpYIAAAWYMgEfJC3JD'
      //      },
      //      latest_invoice: 'in_1PVQ11RpYIAAAWYMSmBp1E4c',
      //      livemode: false,
      //      metadata: { organizationId: '66778bf1759cf25fa81e6780' },
      //      next_pending_invoice_item_invoice: null,
      //      on_behalf_of: null,
      //      pause_collection: null,
      //      payment_settings: {
      //        payment_method_options: null,
      //        payment_method_types: null,
      //        save_default_payment_method: 'on_subscription'
      //      },
      //      pending_invoice_item_interval: null,
      //      pending_setup_intent: null,
      //      pending_update: null,
      //      plan: {
      //        id: 'price_1PJMm8RpYIAAAWYMtssSHc8q',
      //        object: 'plan',
      //        active: true,
      //        aggregate_usage: null,
      //        amount: 1500,
      //        amount_decimal: '1500',
      //        billing_scheme: 'per_unit',
      //        created: 1716413564,
      //        currency: 'usd',
      //        interval: 'month',
      //        interval_count: 1,
      //        livemode: false,
      //        metadata: {},
      //        meter: null,
      //        nickname: null,
      //        product: 'prod_Q9g8eIZdb0VqCA',
      //        tiers_mode: null,
      //        transform_usage: null,
      //        trial_period_days: null,
      //        usage_type: 'licensed'
      //      },
      //      quantity: 1,
      //      schedule: null,
      //      start_date: 1719285954,
      //      status: 'canceled',
      //      test_clock: null,
      //      transfer_data: null,
      //      trial_end: null,
      //      trial_settings: { end_behavior: { missing_payment_method: 'create_invoice' } },
      //      trial_start: null
      //    }  {
      //      _id: new ObjectId('667a38c7a8ace14a22196ba2'),
      //      subscriptionId: 'sub_1PVQ11RpYIAAAWYMgEfJC3JD',
      //      productId: 'prod_Q9g8eIZdb0VqCA',
      //      customerId: 'cus_QLN7EMIgQ2xqY0',
      //      organizationId: '66778bf1759cf25fa81e6780',
      //      priceId: 'price_1PJMm8RpYIAAAWYMtssSHc8q',
      //      status: 'active',
      //      startDate: 2024-06-25T03:25:54.000Z,
      //      endDate: 2024-07-25T03:25:54.000Z,
      //      trialStartDate: 1970-01-01T00:00:00.000Z,
      //      trialEndDate: 1970-01-01T00:00:00.000Z,
      //      createdAt: 2024-06-25T03:25:54.000Z,
      //      updatedAt: 2024-06-25T03:25:54.000Z,
      //      __v: 0
      // }
      deletedSubscription.status = deletedSession.status;
      deletedSubscription.endDate = new Date(
        deletedSession.current_period_end * 1000
      );
      deletedSubscription.updatedAt = new Date(
        deletedSession.canceled_at * 1000
      );

      await deletedSubscription
        .save()
        .then(() => {
          console.log("Subscription updated");
        })
        .catch((err) => {
          console.error(err);
        });

      break;
    case "customer.subscription.created":
      const session = event.data.object;

      const subscription = await Subscription.findOne({
        customerId: session.customer,
      });

      if (!subscription) {
        const newSubscription = new Subscription({
          subscriptionId: session.items.data[0].subscription,
          productId: session.items.data[0].price.product,
          customerId: session.customer,
          organizationId: session.metadata.organizationId,
          priceId: session.items.data[0].price.id,
          status: session.status,
          startDate: new Date(session.current_period_start * 1000),
          endDate: new Date(session.current_period_end * 1000),
          trialStartDate: new Date(session.trial_start * 1000),
          trialEndDate: new Date(session.trial_end * 1000),
          createdAt: new Date(session.created * 1000),
          updatedAt: new Date(session.created * 1000),
        });

        await newSubscription
          .save()
          .then(() => {
            console.log("Subscription saved");
          })
          .catch((err) => {
            console.error(err);
          });
      } else if (subscription.status === "canceled") {
        Subscription.updateOne(
          { customerId: session.customer },
          {
            subscriptionId: session.items.data[0].subscription,
            productId: session.items.data[0].price.product,
            customerId: session.customer,
            organizationId: session.metadata.organizationId,
            priceId: session.items.data[0].price.id,
            status: session.status,
            startDate: new Date(session.current_period_start * 1000),
            endDate: new Date(session.current_period_end * 1000),
            trialStartDate: new Date(session.trial_start * 1000),
            trialEndDate: new Date(session.trial_end * 1000),
            createdAt: new Date(session.created * 1000),
            updatedAt: new Date(session.created * 1000),
          }
        )
          .then(() => {
            console.log("Subscription updated");
          })
          .catch((err) => {
            console.error(err);
          });

        break;
      } else if (
        (await Subscription.findOne({
          subscriptionId: session.items.data[0].subscription,
        }).updatedAt) > session.created
      ) {
        console.log("newer subscription already exists");
        break;
      } else {
        const newSubscription = new Subscription({
          subscriptionId: session.items.data[0].subscription,
          productId: session.items.data[0].price.product,
          customerId: session.customer,
          organizationId: session.metadata.organizationId,
          priceId: session.items.data[0].price.id,
          status: session.status,
          startDate: new Date(session.current_period_start * 1000),
          endDate: new Date(session.current_period_end * 1000),
          trialStartDate: new Date(session.trial_start * 1000),
          trialEndDate: new Date(session.trial_end * 1000),
          createdAt: new Date(session.created * 1000),
          updatedAt: new Date(session.created * 1000),
        });

        await newSubscription
          .save()
          .then(() => {
            console.log("Subscription saved");
          })
          .catch((err) => {
            console.error(err);
          });
        break;
      }
    case "customer.subscription.updated":
      const updatedSession = event.data.object;
      let updatedSubscription = await Subscription.findOne({
        subscriptionId: updatedSession.items.data[0].subscription,
      });

      if (!updatedSubscription) {
        // refresh subscription data
        mongoose.connection.close();
        mongoose.connect(process.env.MONGODB_URI + "manus-unitas");
        updatedSubscription = await Subscription.findOne({
          subscriptionId: updatedSession.items.data[0].subscription,
        });
      }

      updatedSubscription.status = updatedSession.status;
      updatedSubscription.startDate = new Date(
        updatedSession.current_period_start * 1000
      );
      updatedSubscription.endDate = new Date(
        updatedSession.current_period_end * 1000
      );
      updatedSubscription.trialStartDate = new Date(
        updatedSession.trial_start * 1000
      );
      updatedSubscription.trialEndDate = new Date(
        updatedSession.trial_end * 1000
      );
      updatedSubscription.updatedAt = new Date(updatedSession.created * 1000);

      await updatedSubscription
        .save()
        .then(() => {
          console.log("Subscription updated");
        })
        .catch((err) => {
          console.error(err);
        });
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  // res.send();

  return new Response(null, { status: 200 });
}
