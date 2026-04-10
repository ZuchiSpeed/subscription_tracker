import { createRequire } from "module";
import Subscription from "../models/subscription.model";
import dayjs from "dayjs";

const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow");

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
  const { sunscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, sunscriptionId);

  if (!subscription || !subscription.status !== "active") return;

  const renewalDate = dayjs(subscription.renewalDate);

  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Sending reminder for subscription ${subscription._id} to user ${subscription.user.email}`,
    );
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, "day");

    if (reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(
        context,
        `Remender ${daysBefore} days`,
        reminderDate,
      );
    }

    await triggerReminder(context, `Remender ${daysBefore} days`);
  }
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run("get subscription", () => {
    return Subscription.findById(subscriptionId).populate("user, name, email");
  });
};

const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping untl ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label) => {
  const subscription = context.get("subscription");

  return await context.run(label, () => {
    console.log(
      `Triggering ${label} reminder for subscription ${subscription._id} to user ${subscription.user.email}`,
    );
  });
};
