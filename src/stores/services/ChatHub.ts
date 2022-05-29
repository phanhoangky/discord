import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { API_URL } from "../Constant";

export class ChatHub {
  /**
   *
   */
  public client: HubConnection;
  constructor() {
    this.client = new HubConnectionBuilder()
      .withUrl(`${API_URL.BASE_URL}/hubs`)
      .build();
  }

  async start() {
    await this.client.start();
    console.log("[Client] start listening >>>>", this.client.connectionId);
  }
}
export const chatHub = new ChatHub();
