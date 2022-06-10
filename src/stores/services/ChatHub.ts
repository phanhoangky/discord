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
      .withUrl(`${API_URL.BASE_URL}/hubs`, {
        accessTokenFactory: () => {
          const jwtToken = document.cookie;
          const jwt = jwtToken.split(";");
          // console.log("[ChatHub >>>>]", jwt[jwt.length - 1], jwt);

          return `${jwt[jwt.length - 1].trim()}`;
        },
      })
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
  async end() {
    await this.client.stop();
  }
}
export const chatHub = new ChatHub();
