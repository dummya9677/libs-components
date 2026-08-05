/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_PARTNER_LOGO_URL: string;
  readonly VITE_SIDEBAR_PROMO_IMAGE_URL: string;
  readonly VITE_MULTI_AGENT_PROMO_IMAGE_URL: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_MOCK_AUTH: string;
  readonly VITE_MOCK_API: string;
  readonly VITE_API_AGENT_CHAT_PATH: string;
  readonly VITE_API_AGENTS_PATH: string;
  readonly VITE_API_CONVERSATION_MESSAGES_PATH: string;
  readonly VITE_OIDC_PROVIDER: 'entra' | 'okta' | 'keycloak' | 'auth0';
  readonly VITE_OIDC_AUTHORITY: string;
  readonly VITE_OIDC_CLIENT_ID: string;
  readonly VITE_OIDC_REDIRECT_URI: string;
  readonly VITE_OIDC_POST_LOGOUT_REDIRECT_URI: string;
  readonly VITE_OIDC_SCOPE: string;
  readonly VITE_ENTRA_TENANT_ID: string;
  readonly VITE_ENTRA_CLIENT_ID: string;
  readonly VITE_ENTRA_AUTHORITY: string;
  readonly VITE_OKTA_DOMAIN: string;
  readonly VITE_OKTA_CLIENT_ID: string;
  readonly VITE_OKTA_AUTHORITY: string;
  readonly VITE_KEYCLOAK_URL: string;
  readonly VITE_KEYCLOAK_REALM: string;
  readonly VITE_KEYCLOAK_CLIENT_ID: string;
  readonly VITE_AUTH0_DOMAIN: string;
  readonly VITE_AUTH0_CLIENT_ID: string;
  readonly VITE_AUTH0_AUDIENCE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error:
    | 'no-speech'
    | 'aborted'
    | 'audio-capture'
    | 'network'
    | 'not-allowed'
    | 'service-not-available'
    | 'bad-grammar'
    | 'language-not-supported';
  readonly message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  abort(): void;
  start(): void;
  stop(): void;
}

interface Window {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
}
