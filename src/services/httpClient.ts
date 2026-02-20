// Mock HTTP client — will be replaced with real implementation later
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const httpClient = {
  async get<T>(url: string, data?: T): Promise<T> {
    await delay(400 + Math.random() * 300);
    console.log(`[MOCK GET] ${url}`, data);
    return data as T;
  },
  async post<T>(url: string, data?: T): Promise<T> {
    await delay(500 + Math.random() * 300);
    console.log(`[MOCK POST] ${url}`, data);
    return data as T;
  },
  async put<T>(url: string, data?: T): Promise<T> {
    await delay(400 + Math.random() * 200);
    console.log(`[MOCK PUT] ${url}`, data);
    return data as T;
  },
  async delete(url: string): Promise<void> {
    await delay(300 + Math.random() * 200);
    console.log(`[MOCK DELETE] ${url}`);
  },
};
