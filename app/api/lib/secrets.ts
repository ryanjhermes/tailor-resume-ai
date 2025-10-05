import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

let key: string | null = null;

export async function getOpenAIKey(): Promise<string> {
  if (key) {return key;}

  console.log('Fetching OpenAI key from AWS Secrets Manager...');
  try {
    const client = new SecretsManagerClient({ region: 'us-east-1' });
    const response = await client.send(new GetSecretValueCommand({ SecretId: 'tailor-resume-ai-OPENAI_API_KEY' }));

    if (!response.SecretString) {throw new Error('OpenAI API key not found in Secrets Manager');}
    console.log('Successfully retrieved OpenAI key from Secrets Manager');
    
    key = response.SecretString;
    return key;

  } catch (error) {
    console.error('Failed to fetch secret from Secrets Manager:', error);
    throw error;
  }
}

