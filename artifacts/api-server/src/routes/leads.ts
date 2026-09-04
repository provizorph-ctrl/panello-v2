import { Router, type IRouter } from "express";
import { db, leadsTable } from "@workspace/db";
import {
  CreateLeadBody,
  CreateLeadResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/leads", async (req, res): Promise<void> => {
  const parsed = CreateLeadBody.safeParse(req.body);

  if (!parsed.success || !Number.isInteger(parsed.data?.area)) {
    req.log.warn(
      { errors: parsed.success ? "area must be an integer" : parsed.error.message },
      "Invalid quote request",
    );
    res.status(400).json({
      error: parsed.success
        ? "Area must be a whole number"
        : parsed.error.message,
    });
    return;
  }

  const [lead] = await db
    .insert(leadsTable)
    .values({
      name: parsed.data.name.trim(),
      phone: parsed.data.phone.trim(),
      area: parsed.data.area,
    })
    .returning();

  req.log.info({ leadId: lead.id }, "Quote request created");
  res.status(201).json(CreateLeadResponse.parse(lead));
});

export default router;