import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { API_URL } from "../Constant";
import useMessageStore from "../MessageStore";

export class ChatHub {
  /**
   *
   */
  public client: HubConnection;
  constructor() {
    this.client = new HubConnectionBuilder()
      .withUrl(`${API_URL.BASE_URL}/hubs`)
      .withAutomaticReconnect()
      .build();
  }

  async start() {
    // const messageStore = useMessageStore();
    // this.client.on("ReceiveMessage", (values) => {
    // messageStore.receiveMessage(values);
    // });
    await this.client.start();
    console.log("[Client] start listening >>>>", this.client.connectionId);
  }
}
export const chatHub = new ChatHub();
