import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

let cachedKey: string | null = null;

/**
 * Get OpenAI API key from AWS Secrets Manager (production) or env var (local dev)
 */
export async function getOpenAIKey(): Promise<string> {
  // Local development: use environment variable
  if (process.env.OPENAI_API_KEY) {
    return process.env.OPENAI_API_KEY;
  }

  // Production: use cached key if available
  if (cachedKey) {
    return cachedKey;
  }

  // Production: fetch from AWS Secrets Manager
  const client = new SecretsManagerClient({ region: 'us-east-1' });
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: 'tailor-resume-ai-OPENAI_API_KEY' })
  );

  if (!response.SecretString) {
    throw new Error('OpenAI API key not found in Secrets Manager');
  }

  cachedKey = response.SecretString;
  return cachedKey;
}

