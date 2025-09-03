// Minimal fetch API type declarations to avoid DOM lib conflicts
declare global {
  interface RequestInit {
    method?: string;
    headers?: { [key: string]: string };
    body?: string;
  }
  interface Response {
    readonly status: number;
    readonly headers: {
      get(name: string): string | null;
    };
    json(): Promise<any>;
    text(): Promise<string>;
  }
  function fetch(input: string, init?: RequestInit): Promise<Response>;
}
export { };