import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

import { revalidatePath } from "next/cache";
import Dashboard from "./dashboard";

import { getUsers } from "@/app/actions";
import { sendBulkMail } from "@/app/mail";
import { Button } from "@/components/ui/button";
import Events from "@/lib/schemas/eventSchema";
import Organization from "@/lib/schemas/organizationSchema";
import Subscription from "@/lib/schemas/subscriptionSchema";
import Users from "@/lib/schemas/userSchema";
import { format } from "date-fns";
import Stripe from "stripe";
import Roles from "@/lib/schemas/roleSchema";

export const metadata = {
  title: "Dashboard | Manus Unitas",
};

export default async function page() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-04-10",
  });

  const session = await getServerSession(options);

  const user = await Users.findOne(
    { email: session.user.email },
    { _id: 1, organizationId: 1, admin: 1 }
  ).lean();

  const userOrg = await Organization.findById(user.organizationId);

  // if (user.admin) {
  //   const subscription = await Subscription.findOne({
  //     organizationId: user.organizationId,
  //   }).lean();

  //   if (subscription.status !== "active") {
  //     return (
  //       <div className="flex flex-col items-center justify-center h-screen">
  //         <h1 className="text-3xl font-bold">Subscription Required</h1>
  //         <p className="text-lg">Please subscribe to access this page</p>
  //         <Button className="mt-4" asChild>
  //           <a href="/subscribe">Subscribe</a>
  //         </Button>
  //       </div>
  //     );
  //   }
  // }

  const update = async () => {
    "use server";
    revalidatePath("/dashboard");
  };

  // console.log(events);

  const handleAccept = async (id) => {
    "use server";
    const event = await Events.findById(id);

    if (event.rejected.includes(user._id)) {
      event.rejected.pull(user._id);
    }

    if (!event.accepted.includes(user._id)) {
      event.accepted.push(user._id);
    }

    await event.save();
  };

  const handleDecline = async (id) => {
    "use server";
    const event = await Events.findById(id);

    if (event.accepted.includes(user._id)) {
      event.accepted.pull(user._id);
    }

    if (!event.rejected.includes(user._id)) {
      event.rejected.push(user._id);
    }

    await event.save();
  };

  const handleLogout = async () => {
    "use server";
    console.log("Logging out");
  };

  const createEvent = async (e, roles, volunteers) => {
    "use server";
    console.log("Create event handler");

    console.log(e.date.end);

    const event = new Events({
      title: e.title,
      description: e.description,
      startTime: new Date(e.date.start),
      endTime: new Date(e.date.end),
      organizationId: user.organizationId,
      volunteers: volunteers,
      accepted: [],
      rejected: [],
    });

    await event.save();

    const Users = await getUsers();

    // sort users by notification preference
    const users = Users.filter((user) => user.notifications.newEvents);

    await sendBulkMail({
      to: users.map((user) => user.email),
      from:
        userOrg.displayName +
        " via Manus Unitas <notifications@manusunitas.com>",
      replyTo: userOrg.email,
      subject: "New Event Created",
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
                                A new event has been created in your organization. Here are the details:
                                <br>
                                <br>
                                <table class="attributes" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                  <tr>
                                    <td class="attributes_content">
                                      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                        <tr>
                                          <td class="attributes_item">
                                            <strong>${event.title}</strong>
                                            <br>
                                          <span>
                                            ${event.description}
                                          </span>
                                          
                                            <br>
                                          <span>
                                            ${format(
                                              new Date(event.endTime),
                                              "MMMM do"
                                            )} from ${format(
        new Date(event.startTime),
        "h:mm aaa"
      )} to ${format(new Date(event.endTime), "h:mm aaa")}
                                          </span>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                                <a href="https://manusunitas.com/dashboard?id=${
                                  event._id
                                }" style="color: #FFF" class="button button--green">View Event</a>
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

    update();
    return;
  };

  const deleteEventHandler = async (id) => {
    "use server";
    await Events.findByIdAndDelete(id);
    update();
  };

  const users = await Users.find({
    organizationId: user.organizationId,
  }).lean();

  let roles = await Roles.find({
    organizationId: user.organizationId,
    parent: { $exists: false },
  })
    .populate("parent")
    .populate("subRoles")
    .lean();

  console.log("ROLES", roles);

  return (
    <Dashboard
      handleAccept={handleAccept}
      handleDecline={handleDecline}
      logoutHandler={handleLogout}
      createEvent={createEvent}
      deleteEvent={deleteEventHandler}
      user={user}
      users={users}
      update={update}
      roles={roles}
    />
  );
}
