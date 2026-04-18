export interface ApiEnvelope<T> {
  data?: T;
  errors?: Array<{ message?: string }>;
  detail?: string | Array<{ msg: string; loc: string[] }>;
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | FormData | Record<string, unknown> | null;
  skipAuthRedirect?: boolean;
}

export interface ServerRequestOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | Record<string, unknown> | null;
}
