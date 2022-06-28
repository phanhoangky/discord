import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { API_URL, CHAT_HUB_METHOD } from "../Constant";

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
    await this.client.start();
    console.log("[Client] start listening >>>>", this.client.connectionId);
  }
  async end() {
    this.client.off(`${CHAT_HUB_METHOD.INVITATION_ACCEPTED}`);
    this.client.off(`${CHAT_HUB_METHOD.RECEIVE_GROUP_MESSAGE}`);
    this.client.off(`${CHAT_HUB_METHOD.RECEIVE_INVITATION}`);
    this.client.off(`${CHAT_HUB_METHOD.RECEIVE_MESSAGE}`);
    this.client.off(`${CHAT_HUB_METHOD.SEND_MESSAGE}`);
    this.client.off(`${CHAT_HUB_METHOD.USER_LEAVE_GROUP}`);
    this.client.off(`${CHAT_HUB_METHOD.ON_USER_OFFLINE}`);
    this.client.off(`${CHAT_HUB_METHOD.ON_USER_ONLINE}`);
    await this.client.stop();
  }
}
export const chatHub = new ChatHub();
