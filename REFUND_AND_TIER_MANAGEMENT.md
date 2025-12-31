# Refund & Tier Management Guide

## Overview

This guide covers how to handle refunds and manually adjust user tiers if needed.

---

## Refund Process

### 30-Day Money-Back Guarantee

Cloud Designs offers a 30-day money-back guarantee for Professional ($39) and Premium ($129) tier purchases.

### Processing Refunds

#### Step 1: Verify Eligibility
- Check if purchase was within last 30 days
- Confirm customer request is genuine
- Review payment records in Stripe dashboard

#### Step 2: Issue Refund via Stripe

1. **Log in to Stripe Dashboard**: https://dashboard.stripe.com

2. **Find the Payment**:
   - Go to Payments section
   - Search by customer email or PaymentIntent ID
   - Verify the amount and date

3. **Create Refund**:
   - Click the payment
   - Click "Refund" button
   - Select "Full refund" (for complete money-back)
   - Add reason: "Customer requested refund"
   - Confirm

4. **Refund Confirmation**:
   - Refund processes immediately to customer's card
   - May take 3-5 business days to appear
   - Customer receives email confirmation from Stripe

#### Step 3: Downgrade User Tier (Manual)

After issuing refund, manually downgrade the user's tier in the database.

**Option A: Using Prisma Studio** (Easiest)

```bash
# 1. Open Prisma Studio
npx prisma studio

# 2. Go to "User" table
# 3. Find user by email
# 4. Change "tier" field from "PROFESSIONAL" or "PREMIUM" to "FREE"
# 5. Click save
```

**Option B: Using Database CLI**

If you have direct database access (Supabase, PostgreSQL):

```sql
-- Downgrade user to FREE tier
UPDATE "User"
SET tier = 'FREE'
WHERE email = 'customer@example.com';

-- Verify the change
SELECT email, tier FROM "User" WHERE email = 'customer@example.com';
```

**Option C: Using Vercel Console** (Production Database)

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to "Storage" → "Postgres"
4. Click "Query" or "Browse"
5. Run UPDATE query above

---

## Manual Tier Adjustment

### Upgrade User (Promotional/Admin Override)

If you need to upgrade a user manually without payment:

```sql
-- Upgrade to PROFESSIONAL
UPDATE "User"
SET tier = 'PROFESSIONAL'
WHERE email = 'user@example.com';

-- Upgrade to PREMIUM
UPDATE "User"
SET tier = 'PREMIUM'
WHERE email = 'user@example.com';
```

### Downgrade User (Account Deactivation)

If a user requests tier downgrade:

```sql
UPDATE "User"
SET tier = 'FREE'
WHERE email = 'user@example.com';
```

### Verify Current Tier

```sql
SELECT email, tier, createdAt FROM "User" WHERE email = 'user@example.com';
```

---

## Tracking Refunds

### Create Refund Record

To keep track of refunds, you may want to add to your database:

```sql
-- Example: View payment history for user
SELECT * FROM "Payment" WHERE userId = 'user-id-here';

-- Mark payment as refunded (if you add refund_status column)
UPDATE "Payment"
SET status = 'REFUNDED'
WHERE id = 'payment-id-here';
```

### Payment Status Values

Current Payment status options:
- `PENDING` - Awaiting webhook confirmation
- `SUCCEEDED` - Successfully charged
- `FAILED` - Payment declined

Consider adding: `REFUNDED` status if not already present.

---

## Email Communication

### Refund Confirmation Email (Template)

Send to customer after processing refund:

```
Subject: Your Refund Has Been Processed

Hello [Customer Name],

We've processed your refund request for Cloud Designs.

Refund Details:
- Amount: $[Amount]
- Payment Method: Credit card ending in [xxxx]
- Processing Time: 3-5 business days
- Reference: [Stripe ID]

Your account has been downgraded to our Free tier. You can still:
✓ Generate career roadmaps (basic version)
✓ Access all your saved roadmaps
✓ Export as PDF

If you have any questions, reply to this email or contact support@clouddesigns.ai.

Best regards,
Cloud Designs Team
```

### Upgrade Confirmation Email (For Admin Overrides)

Send to customer after manual tier upgrade:

```
Subject: Your Account Has Been Upgraded

Hello [Customer Name],

Good news! Your account has been upgraded to [PROFESSIONAL/PREMIUM] tier.

You now have access to:
✓ [Premium features list]

Log in to your dashboard to see your new features.

Questions? Contact us at support@clouddesigns.ai.

Best regards,
Cloud Designs Team
```

---

## Emergency Procedures

### Bulk Downgrade (System Issue)

If there's a system issue causing false premium tier assignments:

```sql
-- Downgrade all users to FREE (USE WITH CAUTION!)
UPDATE "User"
SET tier = 'FREE'
WHERE tier != 'FREE';

-- Verify count
SELECT COUNT(*) FROM "User" WHERE tier != 'FREE';
```

### Check Payment Discrepancies

Find users with PREMIUM tier but no successful payment:

```sql
SELECT u.email, u.tier, COUNT(p.id) as payment_count
FROM "User" u
LEFT JOIN "Payment" p ON u.id = p.userId AND p.status = 'SUCCEEDED'
WHERE u.tier = 'PREMIUM' AND payment_count = 0
GROUP BY u.id;
```

---

## Webhook Verification

If a user claims they paid but don't have the tier:

1. **Check Stripe for payment**:
   - Email in Stripe dashboard
   - Look for succeeded payment intent
   - Verify webhook was sent

2. **Check database for payment record**:
   ```sql
   SELECT * FROM "Payment" WHERE userId = 'user-id' ORDER BY createdAt DESC;
   ```

3. **Check app logs** for webhook errors:
   - Look in Vercel console for `/api/webhooks/stripe` errors
   - Check `confirmPayment` function logs

4. **Manually trigger tier update**:
   ```sql
   UPDATE "User"
   SET tier = 'PROFESSIONAL'
   WHERE email = 'user@example.com';
   ```

---

## Support Contact

For issues beyond this guide:
- Stripe Support: https://support.stripe.com
- Database Support: [Your DB Provider Support]
- Email: [support@clouddesigns.ai]

---

## Checklist for Refund Processing

- [ ] Verify purchase date (within 30 days)
- [ ] Verify customer email matches payment record
- [ ] Create refund in Stripe Dashboard
- [ ] Record refund details (date, amount, reason)
- [ ] Downgrade user tier to FREE
- [ ] Send confirmation email to customer
- [ ] Update any internal records/CRM
- [ ] File for bookkeeping/accounting

---

## Database Schema Reference

### User Table
```
id: String (UUID)
email: String
name: String
tier: Enum (FREE, PROFESSIONAL, PREMIUM)
createdAt: DateTime
updatedAt: DateTime
```

### Payment Table
```
id: String (UUID)
userId: String
stripePaymentIntentId: String
amount: Int (in cents)
currency: String
status: Enum (PENDING, SUCCEEDED, FAILED)
tier: Enum (PROFESSIONAL, PREMIUM)
createdAt: DateTime
updatedAt: DateTime
```

---

**Last Updated**: December 31, 2024
**Version**: 1.0
