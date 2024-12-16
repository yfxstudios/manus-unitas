"use server";

import Events from "@/lib/schemas/eventSchema";
import Organization from "@/lib/schemas/organizationSchema";
import Roles from "@/lib/schemas/roleSchema";
import Users from "@/lib/schemas/userSchema";
import { getServerSession } from "next-auth";
import Stripe from "stripe";
import { sendBulkMail } from "./mail";
import { format } from "date-fns";

export async function getPrice(id) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-04-10",
    });

    const price = await stripe.prices.retrieve(id);

    const product = await stripe.products.retrieve(price.product);

    price.name = product.name;
    price.description = product.description;

    return price;
  } catch (error) {
    console.error(error);
  }
}

export async function createPaymentIntent(id) {
  try {
    const session = await getServerSession();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-04-10",
    });

    const { unit_amount } = await getPrice(id);

    const customer = await Users.findOne({ email: session.user.email });

    const subscription = await stripe.subscriptions.create({
      customer: customer.customerId,
      items: [
        {
          price: id,
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: {
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
      currency: "usd",
      metadata: {
        organizationId: customer.organizationId.toString(),
      },
    });

    const paymentIntent = subscription.latest_invoice.payment_intent;

    return paymentIntent;
  } catch (error) {
    console.error(error);
  }
}

export async function getCurrentUser() {
  try {
    const session = await getServerSession();

    const user = await Users.findOne({ email: session.user.email }).lean();
    return user;
  } catch (error) {
    console.error(error);
  }
}

export async function updateUser({ notifications }) {
  const session = await getServerSession();
  console.log(notifications);

  try {
    await Users.findOneAndUpdate(
      { email: session.user.email },
      {
        notifications,
      }
    );

    console.log("Updated");
  } catch (error) {
    console.error(error);
  }
}

export async function getEvents() {
  const session = await getServerSession();
  const user = await Users.findOne(
    { email: session.user.email },
    { organizationId: 1 }
  ).lean();
  const events = await Events.find({ organizationId: user.organizationId })
    .populate("volunteers")
    .sort({ date: 1, startTime: 1 })
    .lean();

  return events;
}

export async function getUsers() {
  const session = await getServerSession();
  const user = await Users.findOne(
    { email: session.user.email },
    { organizationId: 1 }
  ).lean();
  const users = await Users.find({
    organizationId: user.organizationId,
  }).lean();

  return users;
}

export async function getEvent(id) {
  let event = await Events.findById(id)
    .populate("volunteers.user")
    .populate("roles.parent")
    .populate("roles.subRoles.child")
    .populate("roles.subRoles.volunteers")
    .lean();

  console.log(event);

  return { event };
}

export async function handleAccept(id) {
  const session = await getServerSession();
  const user = await Users.findOne({ email: session.user.email }).lean();
  const event = await Events.findById(id);

  console.log(id, user._id, event.accepted, event.rejected);

  if (event.rejected.includes(user._id)) {
    event.rejected.pull(user._id);
  }

  if (!event.accepted.includes(user._id)) {
    event.accepted.push(user._id);
  }

  await event.save();
}

export async function handleDecline(id) {
  const session = await getServerSession();
  const user = await Users.findOne({ email: session.user.email }).lean();
  const event = await Events.findById(id);

  if (event.accepted.includes(user._id)) {
    event.accepted.pull(user._id);
  }

  if (!event.rejected.includes(user._id)) {
    event.rejected.push(user._id);
  }

  await event.save();
}

export async function incrementTime(userId, eventId, incrementTime) {
  const event = await Events.findById(eventId);

  console.log(event.endTime, event.startTime)

  const endTime = {
    hours: parseInt(format(event.endTime, "H")),
    minutes: parseInt(format(event.endTime, "m")),
  };


  const startTime = {
    hours: parseInt(format(event.startTime, "H")),
    minutes: parseInt(format(event.startTime, "m")),
  };




  event.endTime = new Date(0).setHours(endTime.hours, endTime.minutes);
  event.startTime = new Date(0).setHours(startTime.hours, startTime.minutes);

  const difference = (event.endTime - event.startTime) / 1000 / 60;

  if (incrementTime) {
    await Users.findByIdAndUpdate(userId, {
      $inc: {
        time: difference,
      },
    });
  } else {
    await Users.findByIdAndUpdate(userId, {
      $inc: {
        time: -difference,
      },
    });
  }
}

export const getRoles = async organizationId => {
  const roles = await Roles.find({ organizationId, parent: { $exists: false } })
    .populate("subRoles")
    .lean();

  return roles;
};

export const updateEvent = async (id, data, volunteers) => {
  const event = await Events.findByIdAndUpdate(id, data).populate("organizationId")

  const newEvent = (data["$set"])
  console.log("NEW EVENT", newEvent)

  // {
  //   title: 'new event',
  //   description: 'event description',
  //   startTime: 2024-07-07T03:33:00.000Z,
  //   endTime: 2024-07-06T05:00:00.000Z,
  //   roles: [
  //     { parent: '66848563b8e35040862eb3c5', subRoles: [Array] },
  //     { parent: '668711eea346df8b31e6080d', subRoles: [Array] }
  //   ],
  //   volunteers: [ '66778b62759cf25fa81e677b', '66778e8b759cf25fa81e6848' ]
  // }



  const users = await Users.find({ _id: { $in: volunteers } });




  const emailList = users.map(user => user.email);


  console.log("ROLES", data)

  sendBulkMail({
    to: emailList,
    from: event.organizationId.displayName + " via Manus Unitas <notifications@manusunitas.com>",
    subject: "Event Updated",
    body: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="x-apple-disable-message-reformatting" />
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta name="color-scheme" content="light dark" />
            <meta name="supported-color-schemes" content="light dark" />
            <title></title>
            <style type="text/css" rel="stylesheet" media="all">
            /* Base ------------------------------ */
            
            @import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap");
            body {
              width: 100% !important;
              height: 100%;
              margin: 0;
              -webkit-text-size-adjust: none;
            }
            
            a {
              color: #3869D4;
            }
            
            a img {
              border: none;
            }
            
            td {
              word-break: break-word;
            }
            
            .preheader {
              display: none !important;
              visibility: hidden;
              mso-hide: all;
              font-size: 1px;
              line-height: 1px;
              max-height: 0;
              max-width: 0;
              opacity: 0;
              overflow: hidden;
            }
            /* Type ------------------------------ */
            
            body,
            td,
            th {
              font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
            }
            
            h1 {
              margin-top: 0;
              color: #333333;
              font-size: 22px;
              font-weight: bold;
              text-align: left;
            }
            
            h2 {
              margin-top: 0;
              color: #333333;
              font-size: 16px;
              font-weight: bold;
              text-align: left;
            }
            
            h3 {
              margin-top: 0;
              color: #333333;
              font-size: 14px;
              font-weight: bold;
              text-align: left;
            }
            
            td,
            th {
              font-size: 16px;
            }
            
            p,
            ul,
            ol,
            blockquote {
              margin: .4em 0 1.1875em;
              font-size: 16px;
              line-height: 1.625;
            }
            
            p.sub {
              font-size: 13px;
            }
            /* Utilities ------------------------------ */
            
            .align-right {
              text-align: right;
            }
            
            .align-left {
              text-align: left;
            }
            
            .align-center {
              text-align: center;
            }
            
            .u-margin-bottom-none {
              margin-bottom: 0;
            }
            /* Buttons ------------------------------ */
            
            .button {
              background-color: #3869D4;
              border-top: 10px solid #3869D4;
              border-right: 18px solid #3869D4;
              border-bottom: 10px solid #3869D4;
              border-left: 18px solid #3869D4;
              display: inline-block;
              color: #FFF;
              text-decoration: none;
              border-radius: 3px;
              box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);
              -webkit-text-size-adjust: none;
              box-sizing: border-box;
            }
            
            .button--green {
              background-color: #22BC66;
              border-top: 10px solid #22BC66;
              border-right: 18px solid #22BC66;
              border-bottom: 10px solid #22BC66;
              border-left: 18px solid #22BC66;
            }
            
            .button--red {
              background-color: #FF6136;
              border-top: 10px solid #FF6136;
              border-right: 18px solid #FF6136;
              border-bottom: 10px solid #FF6136;
              border-left: 18px solid #FF6136;
            }
            
            @media only screen and (max-width: 500px) {
              .button {
                width: 100% !important;
                text-align: center !important;
              }
            }
            /* Attribute list ------------------------------ */
            
            .attributes {
              margin: 0 0 21px;
            }
            
            .attributes_content {
              background-color: #F4F4F7;
              padding: 16px;
            }
            
            .attributes_item {
              padding: 0;
            }
            /* Related Items ------------------------------ */
            
            .related {
              width: 100%;
              margin: 0;
              padding: 25px 0 0 0;
              -premailer-width: 100%;
              -premailer-cellpadding: 0;
              -premailer-cellspacing: 0;
            }
            
            .related_item {
              padding: 10px 0;
              color: #CBCCCF;
              font-size: 15px;
              line-height: 18px;
            }
            
            .related_item-title {
              display: block;
              margin: .5em 0 0;
            }
            
            .related_item-thumb {
              display: block;
              padding-bottom: 10px;
            }
            
            .related_heading {
              border-top: 1px solid #CBCCCF;
              text-align: center;
              padding: 25px 0 10px;
            }
            /* Discount Code ------------------------------ */
            
            .discount {
              width: 100%;
              margin: 0;
              padding: 24px;
              -premailer-width: 100%;
              -premailer-cellpadding: 0;
              -premailer-cellspacing: 0;
              background-color: #F4F4F7;
              border: 2px dashed #CBCCCF;
            }
            
            .discount_heading {
              text-align: center;
            }
            
            .discount_body {
              text-align: center;
              font-size: 15px;
            }
            /* Social Icons ------------------------------ */
            
            .social {
              width: auto;
            }
            
            .social td {
              padding: 0;
              width: auto;
            }
            
            .social_icon {
              height: 20px;
              margin: 0 8px 10px 8px;
              padding: 0;
            }
            /* Data table ------------------------------ */
            
            .purchase {
              width: 100%;
              margin: 0;
              padding: 35px 0;
              -premailer-width: 100%;
              -premailer-cellpadding: 0;
              -premailer-cellspacing: 0;
            }
            
            .purchase_content {
              width: 100%;
              margin: 0;
              padding: 25px 0 0 0;
              -premailer-width: 100%;
              -premailer-cellpadding: 0;
              -premailer-cellspacing: 0;
            }
            
            .purchase_item {
              padding: 10px 0;
              color: #51545E;
              font-size: 15px;
              line-height: 18px;
            }
            
            .purchase_heading {
              padding-bottom: 8px;
              border-bottom: 1px solid #EAEAEC;
            }
            
            .purchase_heading p {
              margin: 0;
              color: #85878E;
              font-size: 12px;
            }
            
            .purchase_footer {
              padding-top: 15px;
              border-top: 1px solid #EAEAEC;
            }
            
            .purchase_total {
              margin: 0;
              text-align: right;
              font-weight: bold;
              color: #333333;
            }
            
            .purchase_total--label {
              padding: 0 15px 0 0;
            }
            
            body {
              background-color: #F2F4F6;
              color: #51545E;
            }
            
            p {
              color: #51545E;
            }
            
            .email-wrapper {
              width: 100%;
              margin: 0;
              padding: 0;
              -premailer-width: 100%;
              -premailer-cellpadding: 0;
              -premailer-cellspacing: 0;
              background-color: #F2F4F6;
            }
            
            .email-content {
              width: 100%;
              margin: 0;
              padding: 0;
              -premailer-width: 100%;
              -premailer-cellpadding: 0;
              -premailer-cellspacing: 0;
            }
            /* Masthead ----------------------- */
            
            .email-masthead {
              padding: 25px 0;
              text-align: center;
            }
            
            .email-masthead_logo {
              width: 94px;
            }
            
            .email-masthead_name {
              font-size: 16px;
              font-weight: bold;
              color: #A8AAAF;
              text-decoration: none;
              text-shadow: 0 1px 0 white;
            }
            /* Body ------------------------------ */
            
            .email-body {
              width: 100%;
              margin: 0;
              padding: 0;
              -premailer-width: 100%;
              -premailer-cellpadding: 0;
              -premailer-cellspacing: 0;
            }
            
            .email-body_inner {
              width: 570px;
              margin: 0 auto;
              padding: 0;
              -premailer-width: 570px;
              -premailer-cellpadding: 0;
              -premailer-cellspacing: 0;
              background-color: #FFFFFF;
            }
            
            .email-footer {
              width: 570px;
              margin: 0 auto;
              padding: 0;
              -premailer-width: 570px;
              -premailer-cellpadding: 0;
              -premailer-cellspacing: 0;
              text-align: center;
            }
            
            .email-footer p {
              color: #A8AAAF;
            }
            
            .body-action {
              width: 100%;
              margin: 30px auto;
              padding: 0;
              -premailer-width: 100%;
              -premailer-cellpadding: 0;
              -premailer-cellspacing: 0;
              text-align: center;
            }
            
            .body-sub {
              margin-top: 25px;
              padding-top: 25px;
              border-top: 1px solid #EAEAEC;
            }
            
            .content-cell {
              padding: 45px;
            }
            /*Media Queries ------------------------------ */
            
            @media only screen and (max-width: 600px) {
              .email-body_inner,
              .email-footer {
                width: 100% !important;
              }
            }
            
            @media (prefers-color-scheme: dark) {
              body,
              .email-body,
              .email-body_inner,
              .email-content,
              .email-wrapper,
              .email-masthead,
              .email-footer {
                background-color: #333333 !important;
                color: #FFF !important;
              }
              p,
              ul,
              ol,
              blockquote,
              h1,
              h2,
              h3,
              span,
              .purchase_item {
                color: #FFF !important;
              }
              .attributes_content,
              .discount {
                background-color: #222 !important;
              }
              .email-masthead_name {
                text-shadow: none !important;
              }
            }
            
            :root {
              color-scheme: light dark;
              supported-color-schemes: light dark;
            }
            </style>
            <!--[if mso]>
            <style type="text/css">
              .f-fallback  {
                font-family: Arial, sans-serif;
              }
            </style>
          <![endif]-->
          </head>
          <body>
            <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td align="center">
                  <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                    <tr>
                      <td class="email-masthead">
                        <a href="https://manusunitas.com" class="f-fallback email-masthead_name">
                        Manus Unitas
                      </a>
                      </td>
                    </tr>
                    <!-- Email Body -->
                    <tr>
                      <td class="email-body" width="570" cellpadding="0" cellspacing="0">
                        <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                          <!-- Body content -->
                          <tr>
                            <td class="content-cell">
                              <div class="f-fallback">
                                There has been an update to an event you are scheduled for.
                                New details are below.
                                <br>
                                <br>
                                <table class="attributes" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                  <tr>
                                    <td class="attributes_content">
                                      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                        <tr>
                                          <td class="attributes_item">
                                            <strong>${newEvent.title}</strong>
                                            <br>
                                          <span>
                                            ${newEvent.description}
                                          </span>
                                          
                                            <br>
                                          <span>
                                            ${format(new Date(newEvent.startTime), "MMMM do")} from ${format(new Date(newEvent.startTime), "h:mm aaa")} to ${format(new Date(newEvent.endTime), "h:mm aaa")}
                                          </span>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>


                                <a href="https://manusunitas.com/dashboard?id=${event._id}" style="color: #FFF" class="button button--green">View Event</a>
                                <p class="sub"><a href="https://manusunitas.com/settings/notifications">Manage notifications</a></p>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                            <td class="content-cell" align="center">
                              <p class="f-fallback sub align-center">
                                &copy; 2024 Manus Unitas
                                <br>All rights reserved.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>`,
  });
}