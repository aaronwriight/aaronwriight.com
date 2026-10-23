import { jsonMessage } from "@/lib/api-response";

// Old forms must not silently add a booking inquiry to a newsletter audience.
export async function POST() {
  return jsonMessage("Photography inquiries have moved to the booking page. Visit /frame-it-wright-photography/booking to get in touch.", 410);
}
