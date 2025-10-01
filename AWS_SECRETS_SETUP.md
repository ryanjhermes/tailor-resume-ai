# AWS Secrets Manager Setup Guide

This guide walks you through setting up AWS Secrets Manager for your Tailor Resume AI app deployed on AWS Amplify.

## Step 1: Create the Secret in AWS Secrets Manager

1. Go to the [AWS Secrets Manager Console](https://console.aws.amazon.com/secretsmanager/)
2. Click **"Store a new secret"**
3. Select **"Other type of secret"**
4. In the key/value pairs section:
   - Key: Leave it as plaintext
   - Value: Paste your OpenAI API key directly (e.g., `sk-proj-...`)
5. Click **Next**
6. For **Secret name**, enter: `tailor-resume-ai-OPENAI_API_KEY`
7. Keep the description optional
8. Click **Next**
9. For rotation, select **"Disable automatic rotation"** (you can enable this later)
10. Click **Next**
11. Review and click **Store**
12. **Note the ARN** of your secret (looks like: `arn:aws:secretsmanager:us-east-1:123456789:secret:tailor-resume-ai-OPENAI_API_KEY-xxxxx`)

   ✅ **You've already completed this step!** Your secret ARN is:
   ```
   arn:aws:secretsmanager:us-east-1:050752607136:secret:tailor-resume-ai-OPENAI_API_KEY-Zj3NwR
   ```

## Step 2: Configure IAM Permissions for Amplify

Your Amplify app needs permission to read from Secrets Manager.

### Option A: Via AWS Console (Recommended)

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Open your app
3. Go to **App settings** → **Environment variables**
4. Add this variable:
   - Variable: `AWS_REGION`
   - Value: `us-east-1` (or your actual region if different)
5. Go to **App settings** → **General** → **Service role**
6. Click on the service role name (it will open IAM console)
7. Click **"Add permissions"** → **"Attach policies"**
8. Search for `SecretsManagerReadWrite` and attach it
   - Or create a custom policy for least privilege (see Option B)

### Option B: Create Custom IAM Policy (More Secure)

1. In the IAM console, go to **Policies** → **Create policy**
2. Use JSON editor and paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:us-east-1:050752607136:secret:tailor-resume-ai-OPENAI_API_KEY-*"
    }
  ]
}
```

3. The policy above already has your account ID and secret name filled in
4. Name it something like `AmplifySecretsManagerRead`
5. Attach this policy to your Amplify service role

## Step 3: Deploy Your App

1. Commit and push your code:
   ```bash
   git add .
   git commit -m "Add AWS Secrets Manager integration"
   git push
   ```

2. AWS Amplify will automatically redeploy
3. The app will now fetch the OpenAI API key from Secrets Manager

## Testing Locally

For local development, the code automatically falls back to environment variables:

1. Create a `.env.local` file (if not already exists):
   ```
   OPENAI_API_KEY=sk-proj-your-key-here
   ```

2. Run your dev server:
   ```bash
   npm run dev
   ```

The app will use your local `.env.local` file in development and AWS Secrets Manager in production.

## Troubleshooting

### Error: "Failed to fetch secret"

**Cause:** IAM permissions not set correctly

**Fix:** Make sure your Amplify service role has `secretsmanager:GetSecretValue` permission for your secret

### Error: "Secret tailor-resume-ai-OPENAI_API_KEY not found"

**Cause:** Secret name mismatch or wrong region

**Fix:** 
- Verify the secret name is exactly `tailor-resume-ai-OPENAI_API_KEY`
- Check that your app is in the `us-east-1` region (where the secret was created)

### Build succeeds but API fails

**Cause:** Secret exists but permissions not applied

**Fix:** Redeploy after adding IAM permissions (sometimes requires triggering a new build)

## Cost

AWS Secrets Manager costs approximately:
- **$0.40/month** per secret
- **$0.05** per 10,000 API calls

For a typical resume tailoring app, expect ~$0.50-$1.00/month.

## Security Benefits

✅ API keys never stored in code or Git history  
✅ Centralized secret management  
✅ Audit trail of secret access  
✅ Can rotate keys without code changes  
✅ IAM-based access control

