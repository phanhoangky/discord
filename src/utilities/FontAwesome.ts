/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import specific icons */
import {
  faUserSecret,
  faLock,
  faUser,
  faRectangleXmark,
  faCircleXmark,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faUserSecret, faLock, faUser);
library.add(faRectangleXmark);
library.add(faCircleCheck);
library.add(faCircleXmark);

export default FontAwesomeIcon;
